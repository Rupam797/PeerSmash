import { io } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_SIGNALING_SERVER_URL || 
  (typeof window !== 'undefined' && window.location.origin.includes('localhost') ? 'http://localhost:4000' : window.location.origin);


export function createSocketConnection() {
  return io(SERVER_URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    transports: ['websocket', 'polling']
  });
}
