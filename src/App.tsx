import { useState, useCallback } from 'react';
import { SceneBackground } from '@/components/SceneBackground';
import { Header } from '@/components/Header';
import { Nav, type TabId } from '@/components/Nav';
import { ConnectionScene } from '@/components/ConnectionScene';
import { RoomSection } from '@/components/RoomSection';
import { JoinSection } from '@/components/JoinSection';
import { DevicesPanel } from '@/components/DevicesPanel';
import { SendPanel } from '@/components/SendPanel';
import { ActivityFeed } from '@/components/ActivityFeed';
import { EmptyState } from '@/components/EmptyState';
import { Mascot } from '@/components/Mascot';
import { SEED_MESSAGES, SEED_DEVICES, type ChatMessage, type MessageKind, type DeviceInfo } from '@/types';
import { Settings as SettingsIcon, Bell, Palette, Shield, Wifi } from 'lucide-react';

function App() {
  const [tab, setTab] = useState<TabId>('home');
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [phoneConnected, setPhoneConnected] = useState(false);
  const [travelling, setTravelling] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(SEED_MESSAGES);
  const [devices, setDevices] = useState<DeviceInfo[]>(SEED_DEVICES);

  const status = phoneConnected ? 'Phone connected' : 'Ready to connect';

  const handleCreateRoom = useCallback((code: string) => {
    setRoomCode(code);
  }, []);

  const handleJoin = useCallback((code: string) => {
    setRoomCode(code);
    setPhoneConnected(true);
    setDevices((prev) =>
      prev.map((d) => (d.id === 'd2' ? { ...d, status: 'online', role: 'Connected' } : d)),
    );
  }, []);

  const handleSend = useCallback(
    (kind: MessageKind, text: string) => {
      const msg: ChatMessage = {
        id: `m${Date.now()}`,
        kind,
        direction: 'sent',
        text,
        device: 'laptop',
        time: 'just now',
      };
      setMessages((prev) => [...prev, msg]);
      // animate sparkle travelling
      setTravelling(true);
      setTimeout(() => setTravelling(false), 1100);

      // mock echo reply from phone if connected
      if (phoneConnected) {
        setTimeout(() => {
          const reply: ChatMessage = {
            id: `m${Date.now() + 1}`,
            kind: 'emoji',
            direction: 'received',
            text: 'Got it! 💙',
            device: 'phone',
            time: 'just now',
          };
          setMessages((prev) => [...prev, reply]);
        }, 1400);
      }
    },
    [phoneConnected],
  );

  const received = messages.filter((m) => m.direction === 'received');

  return (
    <div className="relative min-h-screen font-rounded text-navy-800">
      <SceneBackground />
      <Header status={status} />
      <Nav active={tab} onChange={setTab} />

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-8 lg:pl-24 lg:pr-8 lg:pb-10">
        {tab === 'home' && (
          <div className="flex flex-col gap-8">
            {/* Hero */}
            <section className="flex flex-col items-center gap-5 text-center">
              <ConnectionScene travelling={travelling} phoneConnected={phoneConnected} />
              <div className="max-w-xl">
                <h2 className="font-hand text-3xl font-700 leading-tight text-navy-800 sm:text-4xl md:text-5xl">
                  Bridge your devices with a little magic ✨
                </h2>
                <p className="mt-3 font-rounded text-base font-600 text-navy-700/80 sm:text-lg">
                  Create a room, connect another device, and share anything instantly.
                </p>
              </div>
            </section>

            {/* Room + Join side by side on desktop */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Panel className="flex flex-col items-center justify-center gap-4">
                <RoomSection roomCode={roomCode} onCreate={handleCreateRoom} />
              </Panel>
              <Panel className="flex flex-col items-center justify-center gap-4">
                <JoinSection onJoin={handleJoin} />
              </Panel>
            </div>

            {/* Devices */}
            <Panel>
              <DevicesPanel devices={devices} />
            </Panel>

            {/* Send */}
            <Panel>
              <SendPanel onSend={handleSend} />
            </Panel>

            {/* Activity */}
            <Panel>
              {messages.length > 0 ? (
                <ActivityFeed messages={messages} />
              ) : (
                <EmptyState variant="waiting" />
              )}
            </Panel>
          </div>
        )}

        {tab === 'send' && (
          <div className="mx-auto flex max-w-2xl flex-col gap-6">
            <Panel>
              <SendPanel onSend={handleSend} />
            </Panel>
            <Panel>
              {messages.length > 0 ? (
                <ActivityFeed messages={messages} />
              ) : (
                <EmptyState variant="waiting" />
              )}
            </Panel>
          </div>
        )}

        {tab === 'received' && (
          <div className="mx-auto max-w-2xl">
            <Panel>
              {received.length > 0 ? (
                <ActivityFeed messages={received} />
              ) : (
                <EmptyState variant="received" />
              )}
            </Panel>
          </div>
        )}

        {tab === 'devices' && (
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            <Panel>
              <DevicesPanel devices={devices} />
            </Panel>
            <Panel className="flex flex-col items-center gap-3 py-6">
              <ConnectionScene travelling={travelling} phoneConnected={phoneConnected} />
              <p className="font-rounded text-sm font-600 text-navy-700/70">
                {phoneConnected
                  ? 'Your devices are happily chatting 💙'
                  : 'Connect a second device to start sharing'}
              </p>
            </Panel>
          </div>
        )}

        {tab === 'settings' && <SettingsPanel />}
      </main>
    </div>
  );
}

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[2rem] border border-white/60 bg-white/70 p-5 shadow-soft backdrop-blur-md sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

function SettingsPanel() {
  const items = [
    { icon: Bell, label: 'Notifications', desc: 'Ping me when a message arrives', on: true },
    { icon: Wifi, label: 'Auto-reconnect', desc: 'Rejoin rooms automatically', on: true },
    { icon: Palette, label: 'Kawaii theme', desc: 'Keep the dreamy sky look', on: true },
    { icon: Shield, label: 'Private mode', desc: 'Rooms expire after 1 hour', on: false },
  ];
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="animate-float-slow">
          <Mascot className="h-20 w-20" mood="happy" />
        </div>
        <h2 className="font-hand text-3xl font-700 text-navy-800">Settings</h2>
        <p className="font-rounded text-sm font-600 text-navy-700/70">Tune your little bridge 🌸</p>
      </div>
      <Panel className="flex flex-col gap-3">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div
              key={it.label}
              className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-200 to-lavender-200 text-lavender-400">
                  <Icon className="h-5 w-5" strokeWidth={2.5} />
                </span>
                <div>
                  <p className="font-hand text-base font-700 text-navy-800">{it.label}</p>
                  <p className="font-rounded text-xs font-600 text-navy-700/60">{it.desc}</p>
                </div>
              </div>
              <Toggle defaultOn={it.on} />
            </div>
          );
        })}
      </Panel>
      <div className="flex items-center justify-center gap-2 font-rounded text-xs font-600 text-navy-700/50">
        <SettingsIcon className="h-3.5 w-3.5" />
        SyncDrop v1.0 · frontend preview
      </div>
    </div>
  );
}

function Toggle({ defaultOn }: { defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className={`relative h-7 w-12 rounded-full transition-colors duration-300 ${
        on ? 'bg-gradient-to-r from-sky-400 to-lavender-400' : 'bg-navy-700/20'
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-300 ${
          on ? 'left-6' : 'left-1'
        }`}
      />
    </button>
  );
}

export default App;
