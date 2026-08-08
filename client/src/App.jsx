import React, { useState, useEffect } from 'react';
import { useSocket } from './hooks/useSocket';
import { useWebRTC } from './hooks/useWebRTC';
import { Header } from './components/Header';
import { RoomJoin } from './components/RoomJoin';
import { ConnectionStatus } from './components/ConnectionStatus';
import { FileTransfer } from './components/FileTransfer';
import { QRCodeModal } from './components/QRCodeModal';
import { Shield, Zap, Lock, Heart } from 'lucide-react';

export default function App() {
  const {
    socket,
    isConnected,
    roomId,
    peerId,
    isInitiator,
    hasPeer,
    error,
    stats,
    createRoom,
    joinRoom,
    leaveRoom
  } = useSocket();

  const {
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
  } = useWebRTC({
    socket,
    roomId,
    isInitiator,
    hasPeer
  });

  const [showQR, setShowQR] = useState(false);

  // Check URL query parameters for auto room join (e.g. ?room=BEAM88)
  useEffect(() => {
    if (!isConnected || roomId) return;
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam && roomParam.trim().length >= 4) {
      joinRoom(roomParam.trim());
    }
  }, [isConnected, roomId, joinRoom]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div>
        <Header
          isConnected={isConnected}
          roomId={roomId}
          stats={stats}
          onOpenQR={() => setShowQR(true)}
        />

        <main style={{ padding: '2rem 1.5rem', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
          {!roomId ? (
            <RoomJoin
              onCreateRoom={createRoom}
              onJoinRoom={joinRoom}
              error={error}
              stats={stats}
            />

          ) : (
            <div>
              <ConnectionStatus
                roomId={roomId}
                connectionStatus={connectionStatus}
                hasPeer={hasPeer}
                isInitiator={isInitiator}
                natError={natError}
                onLeaveRoom={leaveRoom}
              />

              <FileTransfer
                dataChannelStatus={dataChannelStatus}
                connectionStatus={connectionStatus}
                queue={queue}
                currentSendingFile={currentSendingFile}
                receivingFile={receivingFile}
                completedFiles={completedFiles}
                onAddFiles={addFilesToQueue}
                onCancelFile={cancelFile}
                onClearQueue={clearQueue}
              />
            </div>
          )}
        </main>
      </div>

      {/* QR Code Popup Modal */}
      {showQR && roomId && (
        <QRCodeModal
          roomId={roomId}
          onClose={() => setShowQR(false)}
        />
      )}

      {/* Footer */}
      <footer style={{
        padding: '1.5rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        color: '#64748B',
        fontSize: '0.85rem',
        marginTop: '3rem',
        background: 'rgba(9, 13, 22, 0.9)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginBottom: '0.5rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Zap size={14} color="#2A7FFF" /> WebRTC DataChannels
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Lock size={14} color="#00E5FF" /> End-to-End P2P
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Shield size={14} color="#10B981" /> Zero Server Storage
          </span>
        </div>
        <p style={{ margin: 0 }}>
          DropBeam — High-Performance Peer-to-Peer Browser File Sharing.
        </p>
      </footer>
    </div>
  );
}
