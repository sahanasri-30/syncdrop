import { useState } from 'react';
import { Send, Link as LinkIcon, Type, Code2, Smile } from 'lucide-react';
import type { MessageKind } from '@/types';
import { EMOJI_SET } from '@/types';

interface SendPanelProps {
  onSend: (kind: MessageKind, text: string) => void;
}

const TABS: { kind: MessageKind; label: string; icon: typeof Type }[] = [
  { kind: 'text', label: 'Text', icon: Type },
  { kind: 'link', label: 'Link', icon: LinkIcon },
  { kind: 'code', label: 'Code', icon: Code2 },
  { kind: 'emoji', label: 'Emoji', icon: Smile },
];

export function SendPanel({ onSend }: SendPanelProps) {
  const [kind, setKind] = useState<MessageKind>('text');
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(kind, text.trim());
    setText('');
    setShowEmoji(false);
  };

  const handleKindChange = (k: MessageKind) => {
    setKind(k);
    if (k === 'emoji') {
      setShowEmoji((v) => !v);
    } else {
      setShowEmoji(false);
    }
  };

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-center font-hand text-xl font-700 text-navy-800">Send a little something</h3>

      {/* kind tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = kind === t.kind;
          return (
            <button
              key={t.kind}
              onClick={() => handleKindChange(t.kind)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-rounded text-xs font-700 transition-all duration-300 ${
                active
                  ? 'bg-gradient-to-br from-sky-300 to-lavender-300 text-white shadow-cloud scale-105'
                  : 'bg-white/70 text-navy-700/70 hover:bg-white/90 hover:scale-105'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* emoji picker */}
      {showEmoji && (
        <div className="mx-auto flex max-w-md flex-wrap justify-center gap-1.5 rounded-3xl bg-white/80 p-3 shadow-cloud animate-pop-in">
          {EMOJI_SET.map((e) => (
            <button
              key={e}
              onClick={() => {
                onSend('emoji', e);
                setShowEmoji(false);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-lavender-100/60 text-xl transition-all duration-200 hover:scale-125 hover:bg-blush-100"
            >
              {e}
            </button>
          ))}
        </div>
      )}

      {/* message box */}
      <div className="relative rounded-3xl border-2 border-lavender-200 bg-white/85 p-3 shadow-soft">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSend();
          }}
          placeholder="Type a message, paste a link, or share code..."
          rows={3}
          className={`w-full resize-none rounded-2xl bg-cream-50/60 px-3 py-2.5 font-rounded text-sm font-600 text-navy-800 placeholder:text-lavender-300/70 focus:outline-none ${
            kind === 'code' ? 'font-mono text-xs' : ''
          }`}
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="font-rounded text-[10px] font-600 text-navy-700/50">
            {kind === 'code' ? 'code mode' : kind === 'link' ? 'link mode' : kind === 'emoji' ? 'tap an emoji above' : 'text mode'}
            {text.length > 0 && ` · ${text.length} chars`}
          </span>
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="flex items-center gap-2 rounded-full bg-gradient-to-br from-sky-400 to-lavender-400 px-6 py-2.5 font-hand text-base font-700 text-white shadow-pop transition-all duration-300 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            Send
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
