import { useState } from 'react';
import { CartoonLaptop, CartoonPhone } from './CartoonDevices';

interface ConnectionSceneProps {
  /** when a message is in flight, a sparkle travels laptop -> phone */
  travelling: boolean;
  phoneConnected: boolean;
}

// The hero illustration: laptop + phone linked through a glowing cloud with an animated path.
// A sparkle travels along the path when a message is sent.
export function ConnectionScene({ travelling, phoneConnected }: ConnectionSceneProps) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="relative flex items-end justify-center gap-2 sm:gap-4"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* laptop */}
      <div className="relative z-10 animate-float-slow">
        <CartoonLaptop className="h-28 w-32 sm:h-36 sm:w-44 md:h-44 md:w-52" />
        <DeviceTag tone="laptop" label="This device" status="Online" />
      </div>

      {/* connection arc + cloud */}
      <div className="relative z-0 -mb-6 h-28 w-32 sm:-mb-8 sm:h-36 sm:w-48 md:-mb-10 md:h-44 md:w-72">
        <svg viewBox="0 0 300 140" className="absolute inset-0 h-full w-full" fill="none">
          {/* glowing path */}
          <path
            d="M 20 60 Q 150 -20 280 60"
            stroke="#a78bfa"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.3"
          />
          <path
            d="M 20 60 Q 150 -20 280 60"
            stroke="#7dd3fc"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="6 10"
            className="animate-path-dash"
          />
          {/* central cloud */}
          <g transform="translate(150 18)">
            <ellipse cx="-26" cy="6" rx="22" ry="16" fill="#fffdf7" />
            <ellipse cx="0" cy="0" rx="28" ry="22" fill="#fffdf7" />
            <ellipse cx="26" cy="6" rx="22" ry="16" fill="#fffdf7" />
            <ellipse cx="0" cy="12" rx="42" ry="12" fill="#fffdf7" />
            {/* SD mark */}
            <text x="0" y="6" textAnchor="middle" className="font-hand" fontSize="16" fontWeight="700" fill="#7dd3fc">
              SD
            </text>
          </g>
        </svg>
        {/* travelling sparkle (uses offset-path) */}
        {travelling && (
          <div className="pointer-events-none absolute inset-0">
            <span
              className="sparkle-path absolute left-0 top-0 block h-4 w-4 animate-sparkle"
              style={{ animation: 'sparkle 1.1s linear forwards' }}
            >
              <svg viewBox="0 0 24 24" fill="#fef9c3" className="h-full w-full drop-shadow-[0_0_6px_rgba(254,249,195,0.9)]">
                <path d="M12 1 L13.5 9 L21 12 L13.5 15 L12 23 L10.5 15 L3 12 L10.5 9 Z" />
              </svg>
            </span>
          </div>
        )}
      </div>

      {/* phone */}
      <div className={`relative z-10 ${phoneConnected ? 'animate-float' : 'animate-float-slow'}`}>
        <CartoonPhone className="h-24 w-16 sm:h-28 sm:w-20 md:h-36 md:w-24" />
        <DeviceTag
          tone="phone"
          label="Phone"
          status={phoneConnected ? 'Online' : 'Waiting'}
        />
      </div>

      {/* little sparkles around when hovering */}
      {hover && (
        <>
          <span className="absolute left-[20%] top-2 h-2 w-2 animate-twinkle text-blush-300">✦</span>
          <span className="absolute right-[22%] top-6 h-3 w-3 animate-twinkle text-lavender-300">✦</span>
        </>
      )}
    </div>
  );
}

function DeviceTag({
  tone,
  label,
  status,
}: {
  tone: 'laptop' | 'phone';
  label: string;
  status: 'Online' | 'Waiting';
}) {
  const online = status === 'Online';
  return (
    <div
      className={`mt-2 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold font-rounded ${
        online ? 'bg-emerald-100 text-emerald-700' : 'bg-cream-100 text-amber-700'
      } shadow-sm`}
    >
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${online ? 'bg-emerald-500' : 'bg-amber-400'}`} />
      {tone === 'laptop' ? '💻' : '📱'} {label} · {status}
    </div>
  );
}
