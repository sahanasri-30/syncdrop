export type MessageKind = 'text' | 'link' | 'code' | 'emoji';
export type MessageDirection = 'sent' | 'received';

export interface ChatMessage {
  id: string;
  kind: MessageKind;
  direction: MessageDirection;
  text: string;
  device: 'laptop' | 'phone';
  time: string;
}

export interface DeviceInfo {
  id: string;
  emoji: string;
  name: string;
  role: string;
  status: 'online' | 'waiting';
}

export const SEED_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    kind: 'text',
    direction: 'sent',
    text: 'Check this out! ✨',
    device: 'laptop',
    time: 'just now',
  },
  {
    id: 'm2',
    kind: 'emoji',
    direction: 'received',
    text: 'Got it! 💙',
    device: 'phone',
    time: 'just now',
  },
];

export const SEED_DEVICES: DeviceInfo[] = [
  { id: 'd1', emoji: '💻', name: 'Laptop', role: 'This device', status: 'online' },
  { id: 'd2', emoji: '📱', name: 'Phone', role: 'Waiting to connect', status: 'waiting' },
];

export const EMOJI_SET = ['💙', '✨', '🎉', '🌸', '☁️', '💫', '🌟', '🧁', '🎀', '🪄', '⭐', '💖'];

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}
