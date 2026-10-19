'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import AlexaOrb from './AlexaOrb';
import ChatBubble from './ChatBubble';
import GitHubStatsCard from './GitHubStatsCard';
import { ChatMessage, GitHubData, OrbState } from '@/types';

const QUICK_PROMPTS = [
  'Good morning briefing',
  'Any open PRs?',
  'How was my week?',
  'Any new issues?',
];

function uid() {
  return Math.random().toString(36).slice(2);
}

export default function AlexaUI({
  githubUsername,
  githubToken,
  onLogout,
}: {
  githubUsername: string;
  githubToken: string;
  onLogout: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uid(),
      role: 'alexa',
      content: `Hey ${githubUsername}! I'm Dev Daily, your Alexa+ developer assistant. Ask me for a morning briefing, check your open PRs, or ask anything about your GitHub activity.`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [orbState, setOrbState] = useState<OrbState>('idle');
  const [githubData, setGithubData] = useState<GitHubData | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const conversationRef = useRef<{ role: string; content: string }[]>([]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    setOrbState('speaking');
    utterance.onend = () => setOrbState('idle');
    window.speechSynthesis.speak(utterance);
  }, []);

  const addMessage = (role: ChatMessage['role'], content: string) => {
    const msg: ChatMessage = { id: uid(), role, content, timestamp: new Date() };
    setMessages(prev => [...prev, msg]);
    return msg;
  };

  const fetchGitHubData = useCallback(async () => {
    const headers: Record<string, string> = {};
    if (githubToken) headers['x-github-token'] = githubToken;
    const res = await fetch(`/api/github?username=${githubUsername}`, { headers });
    if (!res.ok) throw new Error('GitHub fetch failed');
    return res.json() as Promise<GitHubData>;
  }, [githubUsername, githubToken]);

  const sendQuery = useCallback(
    async (query: string) => {
      if (!query.trim()) return;
      setInput('');
      addMessage('user', query);
      setOrbState('thinking');

      let data = githubData;

      const needsGitHub =
        /pr|pull request|issue|commit|week|repo|open|morning|briefing|status/i.test(query);

      if (needsGitHub && !data) {
        try {
          data = await fetchGitHubData();
          setGithubData(data);
        } catch {
          // non-fatal — briefing will still work without data
        }
      }

      try {
        const res = await fetch('/api/briefing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            githubData: data,
            query,
            conversationHistory: conversationRef.current,
          }),
        });

        const json = await res.json();

        if (!res.ok) {
          addMessage('alexa', `Sorry, I hit an issue: ${json.error}`);
          setOrbState('idle');
          return;
        }

        const reply = json.response as string;
        addMessage('alexa', reply);

        conversationRef.current = [
          ...conversationRef.current,
          { role: 'user', content: query },
          { role: 'assistant', content: reply },
        ].slice(-10); // keep last 5 turns

        speak(reply);
      } catch {
        addMessage('alexa', "I couldn't reach the briefing service. Check your AWS credentials in .env.local.");
        setOrbState('idle');
      }
    },
    [githubData, fetchGitHubData, speak]
  );

  const toggleMic = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Try Chrome.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setOrbState('idle');
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    recognitionRef.current = rec;

    rec.onstart = () => {
      setIsListening(true);
      setOrbState('listening');
    };

    rec.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      sendQuery(transcript);
    };

    rec.onerror = () => {
      setIsListening(false);
      setOrbState('idle');
    };

    rec.onend = () => {
      setIsListening(false);
      if (orbState === 'listening') setOrbState('idle');
    };

    rec.start();
  }, [isListening, orbState, sendQuery]);

  const handleRefreshStats = useCallback(async () => {
    setOrbState('thinking');
    try {
      const data = await fetchGitHubData();
      setGithubData(data);
      setShowStats(true);
    } catch {
      addMessage('alexa', "Couldn't fetch your GitHub stats. Check your username or token.");
    } finally {
      setOrbState('idle');
    }
  }, [fetchGitHubData]);

  return (
    <div className="min-h-screen bg-[#080c18] text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_12px_rgba(34,211,238,0.4)]">
            <span className="text-white text-xs font-bold">D</span>
          </div>
          <span className="font-semibold text-slate-200">Dev Daily</span>
          <span className="text-slate-600 text-xs">· Alexa+ Simulated Experience</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefreshStats}
            className="text-slate-400 hover:text-cyan-400 text-xs transition-colors"
          >
            Refresh Stats
          </button>
          <button
            onClick={() => setShowStats(s => !s)}
            className="text-slate-400 hover:text-cyan-400 text-xs transition-colors"
          >
            {showStats ? 'Hide' : 'Show'} Stats
          </button>
          <button
            onClick={onLogout}
            className="text-slate-600 hover:text-slate-400 text-xs transition-colors"
          >
            Switch User
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat area */}
        <main className="flex-1 flex flex-col">
          {/* Orb */}
          <div className="flex justify-center pt-10 pb-6">
            <AlexaOrb state={orbState} />
          </div>

          {/* Chat history */}
          <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-4 max-w-2xl mx-auto w-full">
            {messages.map(m => (
              <ChatBubble key={m.id} message={m} />
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick prompts */}
          <div className="flex gap-2 px-6 pb-3 flex-wrap max-w-2xl mx-auto w-full">
            {QUICK_PROMPTS.map(p => (
              <button
                key={p}
                onClick={() => sendQuery(p)}
                disabled={orbState === 'thinking'}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full border border-slate-700 transition-colors disabled:opacity-40"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input bar */}
          <div className="px-6 pb-6 max-w-2xl mx-auto w-full">
            <div className="flex gap-3 bg-slate-900 border border-slate-700 rounded-2xl p-2">
              <button
                onClick={toggleMic}
                className={[
                  'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all',
                  isListening
                    ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                    : 'bg-slate-700 hover:bg-slate-600',
                ].join(' ')}
                title={isListening ? 'Stop listening' : 'Start voice input'}
              >
                <svg width="18" height="18" viewBox="0 0 44 44" fill="none">
                  <rect x="16" y="6" width="12" height="20" rx="6" fill="white" />
                  <path d="M9 22c0 7.18 5.82 13 13 13s13-5.82 13-13" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="22" y1="35" x2="22" y2="40" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="17" y1="40" x2="27" y2="40" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </button>

              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendQuery(input)}
                placeholder="Ask Dev Daily anything..."
                disabled={orbState === 'thinking'}
                className="flex-1 bg-transparent text-white placeholder-slate-600 focus:outline-none text-sm disabled:opacity-50"
              />

              <button
                onClick={() => sendQuery(input)}
                disabled={!input.trim() || orbState === 'thinking'}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-40"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </main>

        {/* Stats sidebar */}
        {showStats && githubData && (
          <aside className="w-80 border-l border-slate-800 p-5 overflow-y-auto">
            <GitHubStatsCard data={githubData} />
          </aside>
        )}
      </div>
    </div>
  );
}
