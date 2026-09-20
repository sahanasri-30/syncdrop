import { useState } from 'react';
import { QrCode, Copy, Check, Sparkles, PartyPopper } from 'lucide-react';
import { generateRoomCode } from '@/types';

interface RoomSectionProps {
  roomCode: string | null;
  onCreate: (code: string) => void;
}

export function RoomSection({ roomCode, onCreate }: RoomSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCreate = () => {
    onCreate(generateRoomCode());
  };

  const handleCopy = () => {
    if (!roomCode) return;
    navigator.clipboard?.writeText(roomCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  if (!roomCode) {
    return (
      <section className="flex flex-col items-center gap-4 py-2">
        <button
          onClick={handleCreate}
          className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-br from-sky-400 to-lavender-400 px-8 py-4 font-hand text-xl font-700 text-white shadow-pop transition-all duration-300 hover:scale-105 hover:shadow-glow active:scale-95"
        >
          <Sparkles className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
          Create Room
        </button>
        <p className="font-rounded text-sm text-navy-700/70">Tap to spin up a private bridge ✨</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center gap-4 py-2 animate-pop-in">
      <div className="flex items-center gap-2 font-hand text-2xl font-700 text-navy-800">
        <PartyPopper className="h-7 w-7 text-blush-400" />
        Your Room is Ready! 🎉
      </div>

      {/* room code pill */}
      <button
        onClick={handleCopy}
        className="group relative flex items-center gap-3 rounded-3xl border-2 border-dashed border-lavender-300 bg-white/80 px-6 py-3 shadow-soft transition-all duration-300 hover:scale-105"
      >
        <span className="font-hand text-4xl font-700 tracking-[0.2em] text-navy-800 sm:text-5xl">
          {roomCode}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-lavender-100 px-2 py-1 font-rounded text-[10px] font-700 text-lavender-400">
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? 'Copied' : 'Copy'}
        </span>
      </button>

      {/* QR placeholder */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative rounded-3xl bg-white/90 p-3 shadow-cloud">
          <div className="qr-grid relative h-28 w-28 overflow-hidden rounded-2xl text-navy-800/80 sm:h-32 sm:w-32">
            {/* corner markers */}
            <span className="absolute left-1 top-1 h-6 w-6 rounded-md border-4 border-navy-800" />
            <span className="absolute right-1 top-1 h-6 w-6 rounded-md border-4 border-navy-800" />
            <span className="absolute left-1 bottom-1 h-6 w-6 rounded-md border-4 border-navy-800" />
            <span className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg bg-white">
              <QrCode className="h-5 w-5 text-lavender-400" />
            </span>
          </div>
        </div>
        <p className="font-rounded text-sm font-600 text-navy-700/80">Scan to connect another device.</p>
      </div>
    </section>
  );
}
