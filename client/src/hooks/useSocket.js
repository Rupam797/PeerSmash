import { useEffect, useRef, useState, useCallback } from 'react';
import { createSocketConnection } from '../services/signaling';

export function useSocket() {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [peerId, setPeerId] = useState(null);
  const [isInitiator, setIsInitiator] = useState(false);
  const [hasPeer, setHasPeer] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ activeRooms: 0, connectedPeers: 0, totalConnections: 0 });

  useEffect(() => {
    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[Socket] Connected to signaling server:', socket.id);
      setIsConnected(true);
      setError(null);
    });

    socket.on('stats-update', (data) => {
      if (data) {
        setStats(data);
      }
    });

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected from signaling server');
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err);
      setIsConnected(false);
      setError('Cannot connect to signaling server. Please ensure backend is running.');
    });

    socket.on('room-created', ({ roomId, peerId, isInitiator }) => {
      setRoomId(roomId);
      setPeerId(peerId);
      setIsInitiator(isInitiator);
      setHasPeer(false);
      setError(null);
    });

    socket.on('room-joined', ({ roomId, peerId, isInitiator }) => {
      setRoomId(roomId);
      setPeerId(peerId);
      setIsInitiator(isInitiator);
      setHasPeer(true); // Joiner sees peer immediately
      setError(null);
    });

    socket.on('peer-joined', () => {
      console.log('[Socket] Peer joined room!');
      setHasPeer(true);
    });

    socket.on('peer-left', () => {
      console.log('[Socket] Peer left room');
      setHasPeer(false);
    });

    socket.on('join-error', ({ message }) => {
      console.warn('[Socket] Join error:', message);
      setError(message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const createRoom = useCallback(() => {
    if (socketRef.current) {
      setError(null);
      socketRef.current.emit('create-room');
    }
  }, []);

  const joinRoom = useCallback((code) => {
    if (socketRef.current && code) {
      setError(null);
      socketRef.current.emit('join-room', { roomId: code.trim().toUpperCase() });
    }
  }, []);

  const leaveRoom = useCallback(() => {
    if (socketRef.current && roomId) {
      socketRef.current.emit('leave-room');
      setRoomId(null);
      setPeerId(null);
      setIsInitiator(false);
      setHasPeer(false);
      setError(null);
    }
  }, [roomId]);

  return {
    socket: socketRef.current,
    isConnected,
    roomId,
    peerId,
    isInitiator,
    hasPeer,
    error,
    stats,
    createRoom,
    joinRoom,
    leaveRoom,
    setError
  };
}

