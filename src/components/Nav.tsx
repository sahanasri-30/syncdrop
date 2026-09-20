import { Home, Send, Download, MonitorSmartphone, Settings } from 'lucide-react';

export type TabId = 'home' | 'send' | 'received' | 'devices' | 'settings';

const TABS: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'send', label: 'Send', icon: Send },
  { id: 'received', label: 'Received', icon: Download },
  { id: 'devices', label: 'Devices', icon: MonitorSmartphone },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface NavProps {
  active: TabId;
  onChange: (id: TabId) => void;
}

export function Nav({ active, onChange }: NavProps) {
  return (
    <>
      {/* desktop side nav */}
      <nav className="fixed left-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2 lg:flex">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 font-rounded text-sm font-700 transition-all duration-300 ${
                isActive
                  ? 'bg-white/90 text-navy-800 shadow-soft'
                  : 'text-navy-700/70 hover:bg-white/50 hover:text-navy-800'
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 ${
                  isActive ? 'bg-gradient-to-br from-sky-300 to-lavender-300 text-white' : 'bg-white/60 text-lavender-400 group-hover:scale-110'
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={2.5} />
              </span>
              {isActive && <span>{t.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* mobile bottom nav */}
      <nav className="fixed bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-3xl border border-white/60 bg-white/80 p-1.5 shadow-soft backdrop-blur-md lg:hidden">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={`flex flex-col items-center gap-0.5 rounded-2xl px-3 py-1.5 font-rounded text-[10px] font-700 transition-all duration-300 ${
                isActive ? 'bg-gradient-to-br from-sky-300 to-lavender-300 text-white shadow-cloud' : 'text-navy-700/70'
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={2.5} />
              {t.label}
            </button>
          );
        })}
      </nav>
    </>
  );
}
