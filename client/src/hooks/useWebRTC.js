import { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { sendFileOverDataChannel, FileReceiver } from '../utils/fileChunker';

// High-reliability, low-latency multi-region STUN servers
const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478' },
    { urls: 'stun:stun.services.mozilla.com' },
    ...(import.meta.env.VITE_TURN_SERVER_URL ? [{
      urls: import.meta.env.VITE_TURN_SERVER_URL,
      username: import.meta.env.VITE_TURN_USERNAME || '',
      credential: import.meta.env.VITE_TURN_PASSWORD || ''
    }] : [])
  ],
  iceCandidatePoolSize: 10
};

export function useWebRTC({ socket, roomId, isInitiator, peers = [], hasPeer }) {
  const peerConnectionsRef = useRef(new Map()); // targetId -> RTCPeerConnection
  const dataChannelsRef = useRef(new Map()); // targetId -> RTCDataChannel
  const iceCandidatesQueueRef = useRef(new Map()); // targetId -> candidate[]
  const fileReceiverRef = useRef(null);
  const isCancelledRef = useRef(false);

  const [connectionStatus, setConnectionStatus] = useState('IDLE'); // IDLE, CONNECTING, CONNECTED, FAILED, DISCONNECTED
  const [openChannelCount, setOpenChannelCount] = useState(0);
  const [natError, setNatError] = useState(false);

  // File Transfer States
  const [queue, setQueue] = useState([]);
  const [currentSendingFile, setCurrentSendingFile] = useState(null);
  const [receivingFile, setReceivingFile] = useState(null);
  const [completedFiles, setCompletedFiles] = useState([]);

  // Shared Text & Notes States
  const [sharedTexts, setSharedTexts] = useState([]);
  const sharedTextsRef = useRef([]);
  useEffect(() => {
    sharedTextsRef.current = sharedTexts;
  }, [sharedTexts]);

  const dataChannelStatus = openChannelCount > 0 ? 'open' : 'closed';

  // Initialize File Receiver
  useEffect(() => {
    fileReceiverRef.current = new FileReceiver(
      (progressData) => {
        setReceivingFile({ ...progressData, status: 'receiving' });
      },
      (completedFile) => {
        setReceivingFile(null);
        setCompletedFiles((prev) => [completedFile, ...prev]);

        try {
          const a = document.createElement('a');
          a.href = completedFile.url;
          a.download = completedFile.name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } catch (e) {
          console.error('Auto download error:', e);
        }

        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      },
      (err) => {
        console.error('File receive error:', err);
        setReceivingFile(null);
      }
    );
  }, []);

  const updateChannelState = useCallback(() => {
    let count = 0;
    dataChannelsRef.current.forEach((dc) => {
      if (dc && dc.readyState === 'open') count++;
    });
    setOpenChannelCount(count);
    if (count > 0) {
      setConnectionStatus('CONNECTED');
      setNatError(false);
    } else if (peerConnectionsRef.current.size > 0) {
      setConnectionStatus('CONNECTING');
    } else {
      setConnectionStatus('IDLE');
    }
  }, []);

  // Cleanup all WebRTC connections
  const cleanupAll = useCallback(() => {
    dataChannelsRef.current.forEach((dc) => dc?.close());
    dataChannelsRef.current.clear();

    peerConnectionsRef.current.forEach((pc) => pc?.close());
    peerConnectionsRef.current.clear();

    iceCandidatesQueueRef.current.clear();

    setOpenChannelCount(0);
    setConnectionStatus('DISCONNECTED');
    setReceivingFile(null);
    setCurrentSendingFile(null);
    setSharedTexts([]);
  }, []);

  // Remove single peer connection
  const removePeer = useCallback((targetId) => {
    console.log('[WebRTC Mesh] Removing peer:', targetId);
    if (dataChannelsRef.current.has(targetId)) {
      dataChannelsRef.current.get(targetId)?.close();
      dataChannelsRef.current.delete(targetId);
    }
    if (peerConnectionsRef.current.has(targetId)) {
      peerConnectionsRef.current.get(targetId)?.close();
      peerConnectionsRef.current.delete(targetId);
    }
    iceCandidatesQueueRef.current.delete(targetId);
    updateChannelState();
  }, [updateChannelState]);

  // Bind DataChannel events per peer
  const bindDataChannelEvents = useCallback((dc, targetId) => {
    dc.binaryType = 'arraybuffer';
    dataChannelsRef.current.set(targetId, dc);

    dc.onopen = () => {
      console.log(`[WebRTC Mesh] DataChannel OPEN with ${targetId}!`);
      updateChannelState();
      // Auto-sync existing shared text notes to newly connected peer
      if (sharedTextsRef.current.length > 0) {
        try {
          dc.send(JSON.stringify({
            type: 'text-history-sync',
            payload: sharedTextsRef.current
          }));
        } catch (err) {
          console.error('[WebRTC] Error syncing shared texts:', err);
        }
      }
    };

    dc.onclose = () => {
      console.log(`[WebRTC Mesh] DataChannel CLOSED with ${targetId}`);
      dataChannelsRef.current.delete(targetId);
      updateChannelState();
    };

    dc.onerror = (err) => {
      console.error(`[WebRTC Mesh] DataChannel ERROR (${targetId}):`, err);
    };

    dc.onmessage = async (event) => {
      if (typeof event.data === 'string') {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'file-meta') {
            fileReceiverRef.current?.handleMetadata(msg);
          } else if (msg.type === 'file-complete') {
            fileReceiverRef.current?.handleComplete();
          } else if (msg.type === 'file-cancel') {
            setReceivingFile(null);
          } else if (msg.type === 'text-message') {
            const item = msg.payload;
            if (item && item.id) {
              setSharedTexts((prev) => {
                if (prev.some((t) => t.id === item.id)) return prev;
                return [item, ...prev];
              });
            }
          } else if (msg.type === 'text-history-sync') {
            const items = msg.payload;
            if (Array.isArray(items)) {
              setSharedTexts((prev) => {
                const existingIds = new Set(prev.map((t) => t.id));
                const newItems = items.filter((t) => !existingIds.has(t.id));
                return [...newItems, ...prev];
              });
            }
          } else if (msg.type === 'text-delete') {
            const { id } = msg.payload || {};
            if (id) {
              setSharedTexts((prev) => prev.filter((t) => t.id !== id));
            }
          }
        } catch (e) {
          console.error('[WebRTC] Error parsing JSON message:', e);
        }
      } else if (event.data instanceof ArrayBuffer) {
        fileReceiverRef.current?.handleChunk(event.data);
      } else if (event.data instanceof Blob) {
        try {
          const buffer = await event.data.arrayBuffer();
          fileReceiverRef.current?.handleChunk(buffer);
        } catch (e) {
          console.error('[WebRTC] Error converting Blob chunk to ArrayBuffer:', e);
        }
      }
    };
  }, [updateChannelState]);

  // Create & Manage RTCPeerConnection for a specific target peer
  const createPeerConnection = useCallback((targetId, isOfferInitiator) => {
    if (peerConnectionsRef.current.has(targetId)) {
      return peerConnectionsRef.current.get(targetId);
    }

    console.log(`[WebRTC Mesh] Creating RTCPeerConnection for ${targetId} (Initiator: ${isOfferInitiator})`);
    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionsRef.current.set(targetId, pc);
    iceCandidatesQueueRef.current.set(targetId, []);

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('ice-candidate', { roomId, targetId, candidate: event.candidate });
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log(`[WebRTC Mesh] ICE State (${targetId}):`, pc.iceConnectionState);
      if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
        updateChannelState();
      } else if (pc.iceConnectionState === 'failed') {
        console.warn(`[WebRTC Mesh] ICE failed with ${targetId}`);
        setNatError(true);
      } else if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'closed') {
        removePeer(targetId);
      }
    };

    if (isOfferInitiator) {
      const dc = pc.createDataChannel('file-transfer', { ordered: true });
      bindDataChannelEvents(dc, targetId);

      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .then(() => {
          if (socket) {
            socket.emit('offer', { roomId, targetId, offer: pc.localDescription });
          }
        })
        .catch((err) => console.error(`[WebRTC Mesh] Create Offer Error (${targetId}):`, err));
    } else {
      pc.ondatachannel = (event) => {
        console.log(`[WebRTC Mesh] Received DataChannel from ${targetId}`);
        bindDataChannelEvents(event.channel, targetId);
      };
    }

    return pc;
  }, [socket, roomId, bindDataChannelEvents, removePeer, updateChannelState]);

  // Process buffered ICE candidates once remote description is set
  const processBufferedCandidates = async (targetId, pc) => {
    const queue = iceCandidatesQueueRef.current.get(targetId) || [];
    while (queue.length > 0) {
      const candidate = queue.shift();
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error(`[WebRTC Mesh] Error adding candidate for ${targetId}:`, e);
      }
    }
  };

  // Mesh signaling setup
  useEffect(() => {
    if (!socket || !roomId) return;

    // Handle incoming offer from target peer
    const handleOffer = async ({ offer, senderId }) => {
      if (!senderId) return;
      try {
        console.log(`[WebRTC Mesh] Handling offer from ${senderId}...`);
        let pc = peerConnectionsRef.current.get(senderId);

        if (!pc) {
          pc = createPeerConnection(senderId, false);
        } else if (pc.signalingState !== 'stable') {
          console.warn(`[WebRTC Mesh] Offer glare detected with ${senderId}, state: ${pc.signalingState}`);
          const isPolite = socket.id ? socket.id > senderId : true;
          if (isPolite) {
            console.log(`[WebRTC Mesh] Polite peer rolling back offer for ${senderId}`);
            await pc.setLocalDescription({ type: 'rollback' });
          } else {
            console.log(`[WebRTC Mesh] Impolite peer ignoring offer glare from ${senderId}`);
            return;
          }
        }

        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        await processBufferedCandidates(senderId, pc);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('answer', { roomId, targetId: senderId, answer: pc.localDescription });
      } catch (err) {
        console.error(`[WebRTC Mesh] Handle Offer Error from ${senderId}:`, err);
      }
    };

    // Handle incoming answer from target peer
    const handleAnswer = async ({ answer, senderId }) => {
      if (!senderId) return;
      try {
        console.log(`[WebRTC Mesh] Handling answer from ${senderId}...`);
        const pc = peerConnectionsRef.current.get(senderId);
        if (pc) {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
          await processBufferedCandidates(senderId, pc);
        }
      } catch (err) {
        console.error(`[WebRTC Mesh] Handle Answer Error from ${senderId}:`, err);
      }
    };

    // Handle ICE candidate from target peer
    const handleIceCandidate = async ({ candidate, senderId }) => {
      if (!senderId || !candidate) return;
      try {
        const pc = peerConnectionsRef.current.get(senderId);
        if (pc && pc.remoteDescription && pc.remoteDescription.type) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } else {
          const queue = iceCandidatesQueueRef.current.get(senderId) || [];
          queue.push(candidate);
          iceCandidatesQueueRef.current.set(senderId, queue);
        }
      } catch (err) {
        console.error(`[WebRTC Mesh] Add ICE Candidate Error from ${senderId}:`, err);
      }
    };

    const handlePeerLeft = ({ peerId }) => {
      if (peerId) {
        removePeer(peerId);
      }
    };

    const handleSocketTextMessage = (message) => {
      if (!message || message.senderId === socket.id) return;
      setSharedTexts((prev) => {
        if (prev.some((t) => t.id === message.id)) return prev;
        return [message, ...prev];
      });
    };

    const handleSocketTextSync = (texts) => {
      if (!Array.isArray(texts)) return;
      setSharedTexts((prev) => {
        const existingIds = new Set(prev.map((t) => t.id));
        const newItems = texts.filter((t) => !existingIds.has(t.id));
        return [...newItems, ...prev];
      });
    };

    const handleSocketTextDelete = ({ id }) => {
      if (id) {
        setSharedTexts((prev) => prev.filter((item) => item.id !== id));
      }
    };

    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleIceCandidate);
    socket.on('peer-left', handlePeerLeft);
    socket.on('room-text-message', handleSocketTextMessage);
    socket.on('room-text-sync', handleSocketTextSync);
    socket.on('room-text-delete', handleSocketTextDelete);

    return () => {
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice-candidate', handleIceCandidate);
      socket.off('peer-left', handlePeerLeft);
      socket.off('room-text-message', handleSocketTextMessage);
      socket.off('room-text-sync', handleSocketTextSync);
      socket.off('room-text-delete', handleSocketTextDelete);
    };
  }, [socket, roomId, createPeerConnection, removePeer]);

  // Initiate peer connections to all existing peers in room (Deterministic Initiator)
  useEffect(() => {
    if (!socket || !socket.id || !roomId || peers.length === 0) return;

    peers.forEach((peerId) => {
      if (!peerConnectionsRef.current.has(peerId)) {
        // Deterministic offer initiator check:
        // Only peer with smaller socket.id creates the SDP offer to prevent offer glare
        const shouldInitiate = socket.id < peerId;
        if (shouldInitiate) {
          console.log(`[WebRTC Mesh] Deterministic initiator for peer ${peerId} (our id: ${socket.id})`);
          createPeerConnection(peerId, true);
        } else {
          console.log(`[WebRTC Mesh] Waiting for peer ${peerId} to initiate offer (our id: ${socket.id})`);
        }
      }
    });
  }, [socket, socket?.id, roomId, peers, createPeerConnection]);

  // Send Queue Processing Loop (Broadcasting to all open channels in mesh)
  useEffect(() => {
    const activeChannels = Array.from(dataChannelsRef.current.values()).filter(
      (dc) => dc && dc.readyState === 'open'
    );

    const pendingItem = queue.find((item) => item.status === 'pending');
    if (!pendingItem || currentSendingFile || activeChannels.length === 0) return;

    const sendCurrentFile = async () => {
      const fileId = pendingItem.id;
      setCurrentSendingFile({ ...pendingItem, status: 'sending' });
      setQueue((prev) =>
        prev.map((item) => (item.id === fileId ? { ...item, status: 'sending' } : item))
      );

      try {
        isCancelledRef.current = false;
        await sendFileOverDataChannel({
          file: pendingItem.file,
          dataChannel: activeChannels, // Array of open channels for broadcast
          fileId,
          onProgress: (progressData) => {
            setCurrentSendingFile((prev) => (prev ? { ...prev, ...progressData } : null));
            setQueue((prev) =>
              prev.map((item) =>
                item.id === fileId ? { ...item, ...progressData } : item
              )
            );
          },
          isCancelledRef
        });

        // Completed sending
        setQueue((prev) =>
          prev.map((item) => (item.id === fileId ? { ...item, status: 'completed', progress: 100 } : item))
        );
        setCurrentSendingFile(null);
      } catch (err) {
        console.error('[WebRTC Mesh] Send file error:', err);
        setQueue((prev) =>
          prev.map((item) => (item.id === fileId ? { ...item, status: 'failed' } : item))
        );
        setCurrentSendingFile(null);
      }
    };

    sendCurrentFile();
  }, [queue, currentSendingFile, openChannelCount]);

  const addFilesToQueue = useCallback((files) => {
    const newItems = Array.from(files).map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      file,
      name: file.name,
      size: file.size,
      mimeType: file.type,
      status: 'pending',
      progress: 0,
      speed: 0,
      eta: 0
    }));

    setQueue((prev) => [...prev, ...newItems]);
  }, []);

  const cancelFile = useCallback((fileId) => {
    if (currentSendingFile && currentSendingFile.id === fileId) {
      isCancelledRef.current = true;
    }
    setQueue((prev) => prev.filter((item) => item.id !== fileId));
  }, [currentSendingFile]);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  // Send Text Message to peers
  const sendTextMessage = useCallback((text) => {
    if (!text || !text.trim()) return null;
    const newItem = {
      id: `text-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      text: text.trim(),
      senderId: socket?.id || 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setSharedTexts((prev) => [newItem, ...prev]);

    const messagePayload = JSON.stringify({
      type: 'text-message',
      payload: newItem
    });

    // 1. Send over all open WebRTC DataChannels
    dataChannelsRef.current.forEach((dc) => {
      if (dc && dc.readyState === 'open') {
        try {
          dc.send(messagePayload);
        } catch (err) {
          console.error('[WebRTC] Send text over dc error:', err);
        }
      }
    });

    // 2. Also emit over socket for guaranteed instant delivery
    if (socket && roomId) {
      socket.emit('room-text-message', { roomId, message: newItem });
    }

    return newItem;
  }, [socket, roomId]);

  // Delete a specific shared text note
  const deleteTextMessage = useCallback((id) => {
    setSharedTexts((prev) => prev.filter((item) => item.id !== id));
    const messagePayload = JSON.stringify({
      type: 'text-delete',
      payload: { id }
    });
    dataChannelsRef.current.forEach((dc) => {
      if (dc && dc.readyState === 'open') {
        try {
          dc.send(messagePayload);
        } catch (e) {}
      }
    });
    if (socket && roomId) {
      socket.emit('room-text-delete', { roomId, id });
    }
  }, [socket, roomId]);

  const clearAllTexts = useCallback(() => {
    setSharedTexts([]);
  }, []);

  return {
    connectionStatus,
    dataChannelStatus,
    openChannelCount,
    natError,
    queue,
    currentSendingFile,
    receivingFile,
    completedFiles,
    addFilesToQueue,
    cancelFile,
    clearQueue,
    sharedTexts,
    sendTextMessage,
    deleteTextMessage,
    clearAllTexts
  };
}
