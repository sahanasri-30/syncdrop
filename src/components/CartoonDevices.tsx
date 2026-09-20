interface DeviceProps {
  className?: string;
  label?: string;
}

// Cute cartoon laptop with a little SyncDrop cloud on screen
export function CartoonLaptop({ className = '' }: DeviceProps) {
  return (
    <svg viewBox="0 0 160 130" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* shadow */}
      <ellipse cx="80" cy="122" rx="56" ry="6" fill="#a78bfa" opacity="0.18" />
      {/* screen */}
      <rect x="32" y="12" width="96" height="72" rx="8" fill="#1e1b4b" />
      <rect x="38" y="18" width="84" height="60" rx="4" fill="url(#laptopScreen)" />
      {/* little cloud on screen */}
      <ellipse cx="62" cy="46" rx="12" ry="9" fill="#fffdf7" opacity="0.95" />
      <ellipse cx="82" cy="44" rx="10" ry="8" fill="#fffdf7" opacity="0.95" />
      <ellipse cx="72" cy="40" rx="14" ry="9" fill="#fffdf7" opacity="0.95" />
      <path d="M 56 50 Q 80 58 104 50" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" fill="none" />
      {/* base */}
      <path d="M 20 96 L 140 96 L 130 112 L 30 112 Z" fill="url(#laptopBase)" stroke="#c4b5fd" strokeWidth="1.5" />
      <rect x="70" y="96" width="20" height="4" rx="2" fill="#a78bfa" opacity="0.5" />
      {/* sparkle */}
      <path d="M 120 24 l 2 5 l 5 2 l -5 2 l -2 5 l -2 -5 l -5 -2 l 5 -2 z" fill="#fef9c3" className="animate-twinkle" />
      <defs>
        <linearGradient id="laptopScreen" x1="38" y1="18" x2="122" y2="78" gradientUnits="userSpaceOnUse">
          <stop stopColor="#bae6fd" />
          <stop offset="1" stopColor="#ddd6fe" />
        </linearGradient>
        <linearGradient id="laptopBase" x1="20" y1="96" x2="140" y2="112" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f0f9ff" />
          <stop offset="1" stopColor="#ddd6fe" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Cute cartoon smartphone
export function CartoonPhone({ className = '' }: DeviceProps) {
  return (
    <svg viewBox="0 0 80 130" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* shadow */}
      <ellipse cx="40" cy="124" rx="24" ry="4" fill="#a78bfa" opacity="0.18" />
      {/* body */}
      <rect x="14" y="10" width="52" height="108" rx="14" fill="#1e1b4b" />
      <rect x="18" y="18" width="44" height="92" rx="8" fill="url(#phoneScreen)" />
      {/* notch */}
      <rect x="30" y="14" width="20" height="4" rx="2" fill="#a78bfa" />
      {/* little cloud on screen */}
      <ellipse cx="32" cy="52" rx="8" ry="6" fill="#fffdf7" opacity="0.95" />
      <ellipse cx="46" cy="50" rx="7" ry="5.5" fill="#fffdf7" opacity="0.95" />
      <ellipse cx="39" cy="47" rx="10" ry="6" fill="#fffdf7" opacity="0.95" />
      {/* home dot */}
      <circle cx="40" cy="114" r="3" fill="#a78bfa" opacity="0.6" />
      {/* sparkle */}
      <path d="M 56 30 l 1.5 4 l 4 1.5 l -4 1.5 l -1.5 4 l -1.5 -4 l -4 -1.5 l 4 -1.5 z" fill="#fef9c3" className="animate-twinkle" />
      <defs>
        <linearGradient id="phoneScreen" x1="18" y1="18" x2="62" y2="110" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fbcfe8" />
          <stop offset="1" stopColor="#bae6fd" />
        </linearGradient>
      </defs>
    </svg>
  );
}
