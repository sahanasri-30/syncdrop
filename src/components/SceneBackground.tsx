// Decorative background scene: dreamy gradient sky with clouds, stars, sparkles, and flowers.
export function SceneBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* gradient sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-lavender-100 to-blush-100" />
      {/* aurora blobs */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-lavender-200/50 blur-3xl" />
      <div className="absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-sky-200/50 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-blush-200/40 blur-3xl" />

      {/* clouds */}
      <Cloud className="absolute left-[6%] top-[12%] h-16 w-24 animate-float-slow opacity-90" />
      <Cloud className="absolute right-[10%] top-[8%] h-20 w-32 animate-float opacity-90" />
      <Cloud className="absolute left-[30%] top-[4%] h-12 w-20 animate-float-slow opacity-80" />
      <Cloud className="absolute right-[28%] top-[40%] h-14 w-24 animate-float opacity-70" />
      <Cloud className="absolute left-[8%] bottom-[14%] h-16 w-28 animate-float-slow opacity-70" />
      <Cloud className="absolute right-[6%] bottom-[22%] h-14 w-24 animate-float opacity-80" />

      {/* stars */}
      <Star className="absolute left-[20%] top-[6%] h-3 w-3 text-cream-200" />
      <Star className="absolute left-[55%] top-[10%] h-2.5 w-2.5 text-blush-300" />
      <Star className="absolute left-[80%] top-[18%] h-3 w-3 text-lavender-300" />
      <Star className="absolute left-[40%] top-[22%] h-2 w-2 text-sky-300" />
      <Star className="absolute right-[18%] top-[30%] h-2.5 w-2.5 text-cream-200" />
      <Star className="absolute left-[5%] top-[35%] h-2 w-2 text-blush-300" />
      <Star className="absolute right-[40%] bottom-[18%] h-3 w-3 text-lavender-300" />

      {/* sparkles */}
      <Sparkle className="absolute left-[15%] top-[25%] h-4 w-4 text-blush-300" />
      <Sparkle className="absolute right-[22%] top-[16%] h-5 w-5 text-lavender-300" />
      <Sparkle className="absolute left-[62%] bottom-[12%] h-4 w-4 text-sky-300" />

      {/* flowers along the bottom */}
      <Flower className="absolute left-[3%] bottom-[2%] h-10 w-10" color="#fbcfe8" />
      <Flower className="absolute left-[18%] bottom-[1%] h-8 w-8" color="#fef9c3" />
      <Flower className="absolute right-[12%] bottom-[2%] h-10 w-10" color="#c4b5fd" />
      <Flower className="absolute right-[30%] bottom-[1%] h-7 w-7" color="#fbcfe8" />
    </div>
  );
}

function Cloud({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="30" cy="40" rx="24" ry="18" fill="#fffdf7" />
      <ellipse cx="60" cy="34" rx="28" ry="22" fill="#fffdf7" />
      <ellipse cx="90" cy="40" rx="24" ry="18" fill="#fffdf7" />
      <ellipse cx="60" cy="44" rx="40" ry="14" fill="#fffdf7" />
      <ellipse cx="30" cy="40" rx="24" ry="18" fill="#e0f2fe" opacity="0.4" />
    </svg>
  );
}

function Star({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`animate-twinkle ${className}`} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2 L14 9 L21 12 L14 15 L12 22 L10 15 L3 12 L10 9 Z" />
    </svg>
  );
}

function Sparkle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`animate-twinkle ${className}`} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 1 L13.5 9 L21 12 L13.5 15 L12 23 L10.5 15 L3 12 L10.5 9 Z" />
      <circle cx="19" cy="5" r="1.5" />
      <circle cx="5" cy="19" r="1.5" />
    </svg>
  );
}

function Flower({ className = '', color = '#fbcfe8' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(20 20)">
        <circle cx="0" cy="-10" r="7" fill={color} />
        <circle cx="9" cy="-5" r="7" fill={color} />
        <circle cx="6" cy="7" r="7" fill={color} />
        <circle cx="-6" cy="7" r="7" fill={color} />
        <circle cx="-9" cy="-5" r="7" fill={color} />
        <circle cx="0" cy="0" r="5" fill="#fef9c3" />
      </g>
      <path d="M 20 20 L 20 38" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
