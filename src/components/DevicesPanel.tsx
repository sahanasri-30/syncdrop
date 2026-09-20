import { Laptop, Smartphone } from 'lucide-react';
import type { DeviceInfo } from '@/types';

interface DevicesPanelProps {
  devices: DeviceInfo[];
}

export function DevicesPanel({ devices }: DevicesPanelProps) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-center font-hand text-xl font-700 text-navy-800">Connected Devices</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {devices.map((d) => {
          const Icon = d.id === 'd1' ? Laptop : Smartphone;
          const online = d.status === 'online';
          return (
            <div
              key={d.id}
              className={`group relative overflow-hidden rounded-3xl border border-white/60 p-4 text-center shadow-cloud transition-all duration-300 hover:scale-[1.03] ${
                online ? 'bg-white/85' : 'bg-cream-50/80'
              }`}
            >
              <div className="mb-2 flex justify-center">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition-transform duration-300 group-hover:scale-110 ${
                    online ? 'bg-gradient-to-br from-sky-200 to-lavender-200' : 'bg-cream-200'
                  }`}
                >
                  {d.emoji}
                </div>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <Icon className="h-4 w-4 text-lavender-400" />
                <span className="font-hand text-lg font-700 text-navy-800">{d.name}</span>
              </div>
              <p className="font-rounded text-xs font-600 text-navy-700/70">{d.role}</p>
              <span
                className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-rounded text-[10px] font-700 ${
                  online ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${online ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
                {online ? 'Online' : 'Waiting to connect'}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
