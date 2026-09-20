import { Link as LinkIcon, Code2, Smile, Type } from 'lucide-react';
import type { ChatMessage } from '@/types';

interface ActivityFeedProps {
  messages: ChatMessage[];
}

const KIND_ICON = {
  text: Type,
  link: LinkIcon,
  code: Code2,
  emoji: Smile,
};

export function ActivityFeed({ messages }: ActivityFeedProps) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center gap-1 py-6 text-center">
        <p className="font-rounded text-sm font-600 text-navy-700/60">No messages yet — send the first sparkle ✨</p>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-center font-hand text-xl font-700 text-navy-800">Activity</h3>
      <div className="flex flex-col gap-2.5">
        {messages.map((m, i) => {
          const sent = m.direction === 'sent';
          const Icon = KIND_ICON[m.kind];
          return (
            <div
              key={m.id}
              className={`flex items-end gap-2 animate-pop-in ${sent ? 'justify-end' : 'justify-start'}`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {!sent && <span className="text-lg">{m.device === 'phone' ? '📱' : '💻'}</span>}
              <div className={`max-w-[78%] ${sent ? 'items-end' : 'items-start'}`}>
                <div className="mb-0.5 flex items-center gap-1.5">
                  <Icon className="h-3 w-3 text-lavender-400" />
                  <span className="font-rounded text-[10px] font-700 text-navy-700/60">
                    {sent ? 'You' : m.device === 'phone' ? 'Phone' : 'Laptop'} · {m.time}
                  </span>
                </div>
                <div
                  className={`rounded-3xl px-4 py-2.5 shadow-cloud ${
                    sent
                      ? 'rounded-br-md bg-gradient-to-br from-sky-300 to-lavender-300 text-white'
                      : 'rounded-bl-md bg-white/90 text-navy-800'
                  }`}
                >
                  {m.kind === 'code' ? (
                    <pre className={`font-mono text-xs whitespace-pre-wrap ${sent ? 'text-white/90' : 'text-navy-800'}`}>{m.text}</pre>
                  ) : m.kind === 'link' ? (
                    <a
                      href={m.text.startsWith('http') ? m.text : `https://${m.text}`}
                      target="_blank"
                      rel="noreferrer"
                      className={`break-all font-rounded text-sm font-700 underline underline-offset-2 ${sent ? 'text-white' : 'text-sky-500'}`}
                    >
                      {m.text}
                    </a>
                  ) : (
                    <p className={`font-rounded text-sm font-600 ${m.kind === 'emoji' ? 'text-2xl' : ''} ${sent ? 'text-white' : 'text-navy-800'}`}>
                      {m.text}
                    </p>
                  )}
                </div>
              </div>
              {sent && <span className="text-lg">💻</span>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
