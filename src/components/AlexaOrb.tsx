'use client';
import { OrbState } from '@/types';

const STATE_LABEL: Record<OrbState, string> = {
  idle: 'Say something or type below',
  listening: 'Listening...',
  thinking: 'Thinking...',
  speaking: 'Speaking...',
};

const RING_COUNT: Record<OrbState, number> = {
  idle: 1,
  listening: 3,
  thinking: 2,
  speaking: 2,
};

export default function AlexaOrb({ state }: { state: OrbState }) {
  const rings = RING_COUNT[state];

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative flex items-center justify-center w-44 h-44">
        {Array.from({ length: rings }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-cyan-400/25 animate-ping"
            style={{
              width: `${120 + i * 44}px`,
              height: `${120 + i * 44}px`,
              animationDelay: `${i * 0.35}s`,
              animationDuration: state === 'listening' ? '0.9s' : '1.6s',
            }}
          />
        ))}

        <div
          className={[
            'relative w-36 h-36 rounded-full flex items-center justify-center',
            'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600',
            'shadow-[0_0_70px_rgba(34,211,238,0.45)]',
            'transition-all duration-500',
            state === 'thinking' ? 'animate-spin' : '',
            state === 'speaking' ? 'scale-110' : '',
          ].join(' ')}
        >
          <div className="w-28 h-28 rounded-full bg-white/10 flex items-center justify-center">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="16" y="6" width="12" height="20" rx="6" fill="white" fillOpacity="0.9" />
              <path d="M9 22c0 7.18 5.82 13 13 13s13-5.82 13-13" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="22" y1="35" x2="22" y2="40" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="17" y1="40" x2="27" y2="40" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      <p className="text-cyan-300/60 text-sm font-medium tracking-wide">{STATE_LABEL[state]}</p>
    </div>
  );
}
