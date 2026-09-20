import { Mascot } from './Mascot';

interface EmptyStateProps {
  variant: 'waiting' | 'received';
}

export function EmptyState({ variant }: EmptyStateProps) {
  if (variant === 'received') {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="animate-float-slow">
          <Mascot className="h-24 w-24" mood="waiting" />
        </div>
        <h3 className="font-hand text-2xl font-700 text-navy-800">Nothing received yet</h3>
        <p className="max-w-xs font-rounded text-sm font-600 text-navy-700/70">
          When another device sends you a message, it will sparkle in here. 💫
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <div className="animate-float-slow">
        <Mascot className="h-28 w-28" mood="waiting" />
      </div>
      <h3 className="font-hand text-2xl font-700 text-navy-800">Waiting for another device...</h3>
      <p className="max-w-xs font-rounded text-sm font-600 text-navy-700/70">
        Create a room and connect your phone 💙
      </p>
    </div>
  );
}
