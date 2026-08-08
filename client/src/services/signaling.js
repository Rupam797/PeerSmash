import { io } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_SIGNALING_SERVER_URL || 
  (typeof window !== 'undefined' && window.location.origin.includes('localhost') ? 'http://localhost:4000' : window.location.origin);

function getOrCreateVisitorId() {
  if (typeof window === 'undefined') return 'server_render';
  let id = localStorage.getItem('peersmash_visitor_id');
  if (!id) {
    id = 'v_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    localStorage.setItem('peersmash_visitor_id', id);
  }
  return id;
}

export function createSocketConnection() {
  const visitorId = getOrCreateVisitorId();
  return io(SERVER_URL, {
    auth: { visitorId },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    transports: ['websocket', 'polling']
  });
}
