import { Mascot } from './Mascot';

interface HeaderProps {
  status: string;
}

export function Header({ status }: HeaderProps) {
  return (
    <header className="relative z-10 px-4 pt-6 sm:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="animate-float-slow">
            <Mascot className="h-12 w-12 sm:h-14 sm:w-14" mood="happy" />
          </div>
          <div>
            <h1 className="font-hand text-2xl font-700 leading-none text-navy-800 sm:text-3xl">
              SyncDrop
            </h1>
            <p className="font-rounded text-xs font-600 text-lavender-400 sm:text-sm">
              Your private device bridge
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3 py-1.5 shadow-cloud backdrop-blur-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          <span className="font-rounded text-xs font-700 text-navy-700 sm:text-sm">{status}</span>
        </div>
      </div>
    </header>
  );
}
