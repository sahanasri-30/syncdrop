import { useState } from 'react';
import { ArrowRight, DoorOpen } from 'lucide-react';

interface JoinSectionProps {
  onJoin: (code: string) => void;
}

export function JoinSection({ onJoin }: JoinSectionProps) {
  const [code, setCode] = useState('');
  const [shake, setShake] = useState(false);

  const handleJoin = () => {
    if (code.trim().length < 6) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    onJoin(code.trim().toUpperCase());
  };

  return (
    <section className={`flex flex-col items-center gap-3 ${shake ? 'animate-wiggle' : ''}`}>
      <div className="flex items-center gap-2 font-hand text-xl font-700 text-navy-800">
        <DoorOpen className="h-5 w-5 text-sky-400" />
        Join a room
      </div>
      <div className="flex w-full max-w-xs items-center gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
          onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
          placeholder="ABC123"
          className="w-full rounded-2xl border-2 border-lavender-200 bg-white/80 px-4 py-3 text-center font-hand text-2xl font-700 tracking-[0.3em] text-navy-800 placeholder:text-lavender-300/60 focus:border-lavender-400 focus:outline-none focus:ring-4 focus:ring-lavender-200/50"
        />
        <button
          onClick={handleJoin}
          className="flex shrink-0 items-center gap-1.5 rounded-2xl bg-gradient-to-br from-blush-300 to-lavender-300 px-4 py-3 font-rounded text-sm font-700 text-white shadow-pop transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Join
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <p className="font-rounded text-xs text-navy-700/60">Enter a 6-character room code</p>
    </section>
  );
}
