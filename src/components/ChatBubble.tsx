import { ChatMessage } from '@/types';

export default function ChatBubble({ message }: { message: ChatMessage }) {
  const isAlexa = message.role === 'alexa';

  return (
    <div className={`flex gap-3 ${isAlexa ? '' : 'flex-row-reverse'}`}>
      <div
        className={[
          'w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white',
          isAlexa
            ? 'bg-gradient-to-br from-cyan-400 to-blue-600'
            : 'bg-indigo-600',
        ].join(' ')}
      >
        {isAlexa ? 'A' : 'Y'}
      </div>

      <div
        className={[
          'max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed',
          isAlexa
            ? 'bg-slate-800 text-slate-100 rounded-tl-sm border border-cyan-500/20'
            : 'bg-indigo-600 text-white rounded-tr-sm',
        ].join(' ')}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <p className={`text-xs mt-1.5 ${isAlexa ? 'text-slate-500' : 'text-indigo-300'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
