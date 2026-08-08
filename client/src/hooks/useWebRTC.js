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
    { urls: 'stun:global.stun.twilio.com:3478' }
  ],
  iceCandidatePoolSize: 10
};

export function useWebRTC({ socket, roomId, isInitiator, hasPeer }) {
  const peerConnectionRef = useRef(null);
  const dataChannelRef = useRef(null);
  const fileReceiverRef = useRef(null);
  const isCancelledRef = useRef(false);
  const iceCandidatesQueueRef = useRef([]);

  const [connectionStatus, setConnectionStatus] = useState('IDLE'); // IDLE, CONNECTING, CONNECTED, FAILED, DISCONNECTED
  const [dataChannelStatus, setDataChannelStatus] = useState('closed'); // open, closing, closed
  const [natError, setNatError] = useState(false);

  // File Transfer States
  const [queue, setQueue] = useState([]);
  const [currentSendingFile, setCurrentSendingFile] = useState(null);
  const [receivingFile, setReceivingFile] = useState(null);
  const [completedFiles, setCompletedFiles] = useState([]);

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

  // Cleanup WebRTC connection
  const cleanup = useCallback(() => {
    iceCandidatesQueueRef.current = [];
    if (dataChannelRef.current) {
      dataChannelRef.current.close();
      dataChannelRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setConnectionStatus('DISCONNECTED');
    setDataChannelStatus('closed');
    setReceivingFile(null);
    setCurrentSendingFile(null);
  }, []);

  // Setup DataChannel listeners
  const bindDataChannelEvents = useCallback((dc) => {
    dataChannelRef.current = dc;

    dc.onopen = () => {
      console.log('[WebRTC] DataChannel OPEN!');
      setDataChannelStatus('open');
      setConnectionStatus('CONNECTED');
      setNatError(false);
    };

    dc.onclose = () => {
      console.log('[WebRTC] DataChannel CLOSED');
      setDataChannelStatus('closed');
      setConnectionStatus('DISCONNECTED');
    };

    dc.onerror = (err) => {
      console.error('[WebRTC] DataChannel ERROR:', err);
    };

    dc.onmessage = (event) => {
      if (typeof event.data === 'string') {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'file-meta') {
            fileReceiverRef.current?.handleMetadata(msg);
          } else if (msg.type === 'file-complete') {
            fileReceiverRef.current?.handleComplete();
          } else if (msg.type === 'file-cancel') {
            setReceivingFile(null);
          }
        } catch (e) {
          console.error('[WebRTC] Error parsing JSON message:', e);
        }
      } else if (event.data instanceof ArrayBuffer) {
        fileReceiverRef.current?.handleChunk(event.data);
      }
    };
  }, []);

  // Establish WebRTC Connection
  useEffect(() => {
    if (!socket || !roomId || !hasPeer) return;

    setConnectionStatus('CONNECTING');
    setNatError(false);
    iceCandidatesQueueRef.current = [];

    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionRef.current = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', { roomId, candidate: event.candidate });
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log('[WebRTC] ICE Connection State:', pc.iceConnectionState);
      if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
        setConnectionStatus('CONNECTED');
        setNatError(false);
      } else if (pc.iceConnectionState === 'failed') {
        console.warn('[WebRTC] ICE failed. Attempting ICE restart...');
        setConnectionStatus('FAILED');
        setNatError(true);
      } else if (pc.iceConnectionState === 'disconnected') {
        setConnectionStatus('DISCONNECTED');
      }
    };

    // Helper to process buffered ICE candidates once remote description is set
    const processBufferedCandidates = async () => {
      if (!pc.remoteDescription) return;
      while (iceCandidatesQueueRef.current.length > 0) {
        const candidate = iceCandidatesQueueRef.current.shift();
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error('[WebRTC] Error adding buffered candidate:', e);
        }
      }
    };

    // If initiator: create DataChannel and create Offer
    if (isInitiator) {
      console.log('[WebRTC] Initiator creating DataChannel...');
      const dc = pc.createDataChannel('file-transfer', { ordered: true });
      bindDataChannelEvents(dc);

      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .then(() => {
          socket.emit('offer', { roomId, offer: pc.localDescription });
        })
        .catch((err) => console.error('[WebRTC] Create Offer Error:', err));
    } else {
      // If joiner: listen for incoming DataChannel
      pc.ondatachannel = (event) => {
        console.log('[WebRTC] Joiner received DataChannel');
        bindDataChannelEvents(event.channel);
      };
    }

    // Socket signaling handlers
    const handleOffer = async ({ offer }) => {
      if (isInitiator) return;
      try {
        console.log('[WebRTC] Handling offer...');
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        await processBufferedCandidates();
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('answer', { roomId, answer: pc.localDescription });
      } catch (err) {
        console.error('[WebRTC] Handle Offer Error:', err);
      }
    };

    const handleAnswer = async ({ answer }) => {
      if (!isInitiator) return;
      try {
        console.log('[WebRTC] Handling answer...');
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        await processBufferedCandidates();
      } catch (err) {
        console.error('[WebRTC] Handle Answer Error:', err);
      }
    };

    const handleIceCandidate = async ({ candidate }) => {
      try {
        if (!candidate) return;
        if (pc.remoteDescription && pc.remoteDescription.type) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } else {
          // Buffer candidate until remote description is ready
          iceCandidatesQueueRef.current.push(candidate);
        }
      } catch (err) {
        console.error('[WebRTC] Add ICE Candidate Error:', err);
      }
    };

    const handlePeerLeft = () => {
      console.log('[WebRTC] Remote peer disconnected');
      cleanup();
    };

    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleIceCandidate);
    socket.on('peer-left', handlePeerLeft);

    return () => {
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice-candidate', handleIceCandidate);
      socket.off('peer-left', handlePeerLeft);
      cleanup();
    };
  }, [socket, roomId, isInitiator, hasPeer, bindDataChannelEvents, cleanup]);

  // Send Queue Processing Loop
  useEffect(() => {
    const pendingItem = queue.find((item) => item.status === 'pending');
    if (!pendingItem || currentSendingFile || dataChannelStatus !== 'open') return;

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
          dataChannel: dataChannelRef.current,
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
        console.error('[WebRTC] Send file error:', err);
        setQueue((prev) =>
          prev.map((item) => (item.id === fileId ? { ...item, status: 'failed' } : item))
        );
        setCurrentSendingFile(null);
      }
    };

    sendCurrentFile();
  }, [queue, currentSendingFile, dataChannelStatus]);

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

  return {
    connectionStatus,
    dataChannelStatus,
    natError,
    queue,
    currentSendingFile,
    receivingFile,
    completedFiles,
    addFilesToQueue,
    cancelFile,
    clearQueue
  };
}
