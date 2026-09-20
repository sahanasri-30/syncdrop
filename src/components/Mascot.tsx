interface MascotProps {
  className?: string;
  mood?: 'happy' | 'waiting' | 'excited';
}

// "Droplet" — the SyncDrop mascot: a round sky-blue drop with a fluffy cloud puff,
// rosy cheeks, sparkly eyes, and a tiny flower. Original artwork (SVG).
export function Mascot({ className = '', mood = 'happy' }: MascotProps) {
  const eyeY = mood === 'waiting' ? 52 : 50;
  const mouth =
    mood === 'waiting'
      ? 'M 58 66 Q 64 62 70 66'
      : mood === 'excited'
        ? 'M 54 62 Q 64 78 74 62'
        : 'M 56 64 Q 64 72 72 64';

  return (
    <svg viewBox="0 0 128 128" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* shadow */}
      <ellipse cx="64" cy="118" rx="34" ry="6" fill="#a78bfa" opacity="0.18" />
      {/* body — rounded droplet */}
      <path
        d="M 64 18 C 40 18 24 36 24 58 C 24 82 42 104 64 104 C 86 104 104 82 104 58 C 104 36 88 18 64 18 Z"
        fill="url(#mascotBody)"
        stroke="#7dd3fc"
        strokeWidth="2"
      />
      {/* cloud puff on top */}
      <ellipse cx="52" cy="28" rx="14" ry="10" fill="#fffdf7" opacity="0.9" />
      <ellipse cx="76" cy="26" rx="12" ry="9" fill="#fffdf7" opacity="0.9" />
      <ellipse cx="64" cy="22" rx="16" ry="10" fill="#fffdf7" opacity="0.9" />
      {/* cheeks */}
      <circle cx="40" cy="64" r="7" fill="#f9a8d4" opacity="0.7" />
      <circle cx="88" cy="64" r="7" fill="#f9a8d4" opacity="0.7" />
      {/* eyes */}
      <ellipse cx="50" cy={eyeY} rx="5" ry={mood === 'waiting' ? 3 : 5.5} fill="#1e1b4b" />
      <ellipse cx="78" cy={eyeY} rx="5" ry={mood === 'waiting' ? 3 : 5.5} fill="#1e1b4b" />
      {/* eye sparkles */}
      <circle cx="52" cy={eyeY - 2} r="1.6" fill="#fff" />
      <circle cx="80" cy={eyeY - 2} r="1.6" fill="#fff" />
      {/* mouth */}
      <path d={mouth} stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* tiny flower */}
      <g transform="translate(94 40)">
        <circle cx="0" cy="-5" r="3.5" fill="#fbcfe8" />
        <circle cx="4" cy="-2" r="3.5" fill="#fbcfe8" />
        <circle cx="3" cy="3" r="3.5" fill="#fbcfe8" />
        <circle cx="-3" cy="3" r="3.5" fill="#fbcfe8" />
        <circle cx="-4" cy="-2" r="3.5" fill="#fbcfe8" />
        <circle cx="0" cy="0" r="2.5" fill="#fef9c3" />
      </g>
      <defs>
        <linearGradient id="mascotBody" x1="24" y1="18" x2="104" y2="104" gradientUnits="userSpaceOnUse">
          <stop stopColor="#bae6fd" />
          <stop offset="0.5" stopColor="#7dd3fc" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
    </svg>
  );
}
