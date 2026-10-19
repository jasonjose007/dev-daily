'use client';
import { useState } from 'react';

export interface SetupData {
  githubUsername: string;
  githubToken: string;
}

export default function SetupModal({ onComplete }: { onComplete: (d: SetupData) => void }) {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    onComplete({ githubUsername: username.trim(), githubToken: token.trim() });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            <svg width="20" height="20" viewBox="0 0 44 44" fill="none">
              <rect x="16" y="6" width="12" height="20" rx="6" fill="white" />
              <path d="M9 22c0 7.18 5.82 13 13 13s13-5.82 13-13" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="22" y1="35" x2="22" y2="40" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="17" y1="40" x2="27" y2="40" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h1 className="text-white font-semibold text-xl">Dev Daily</h1>
            <p className="text-slate-400 text-sm">Your Alexa+ Developer Assistant</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              GitHub Username <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="e.g. jasonjose007"
              autoFocus
              className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              GitHub Token{' '}
              <span className="text-slate-500 font-normal">(optional — higher rate limit &amp; private repos)</span>
            </label>
            <input
              type="password"
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="ghp_..."
              className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <p className="text-slate-500 text-xs mt-1.5">
              Stored in your browser session only — never sent to any external server.
            </p>
          </div>

          <button
            type="submit"
            disabled={!username.trim()}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
          >
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
}
