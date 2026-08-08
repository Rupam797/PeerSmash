import React, { useState, useEffect } from 'react';
import { useSocket } from './hooks/useSocket';
import { useWebRTC } from './hooks/useWebRTC';
import { Header } from './components/Header';
import { RoomJoin } from './components/RoomJoin';
import { ActiveRoomView } from './components/ActiveRoomView';
import { QRCodeModal } from './components/QRCodeModal';
import { InfoModal } from './components/InfoModal';
import { Shield, Lock, Github } from 'lucide-react';
import { PeerSmashIcon } from './components/PeerSmashIcon';

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
  const [activeTab, setActiveTab] = useState('home');

  // Light / Dark Mode state management
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('peersmash_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('peersmash_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

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
      justifyContent: 'space-between',
      backgroundColor: 'var(--bg-dark)'
    }}>
      <div>
        <Header
          activeTab={activeTab}
          onNavigate={(tab) => setActiveTab(tab)}
          theme={theme}
          onToggleTheme={toggleTheme}
          stats={stats}
        />

        <main style={{ padding: '1.5rem 1rem', maxWidth: '920px', margin: '0 auto', width: '100%' }}>
          {!roomId ? (
            <RoomJoin
              onCreateRoom={createRoom}
              onJoinRoom={joinRoom}
              error={error}
              stats={stats}
            />

          ) : (
            <ActiveRoomView
              roomId={roomId}
              connectionStatus={connectionStatus}
              dataChannelStatus={dataChannelStatus}
              hasPeer={hasPeer}
              isInitiator={isInitiator}
              natError={natError}
              queue={queue}
              currentSendingFile={currentSendingFile}
              receivingFile={receivingFile}
              completedFiles={completedFiles}
              onAddFiles={addFilesToQueue}
              onCancelFile={cancelFile}
              onClearQueue={clearQueue}
              onLeaveRoom={leaveRoom}
              onOpenQR={() => setShowQR(true)}
            />
          )}
        </main>
      </div>

      {/* Info Modals for "How it works" and "About" */}
      {activeTab !== 'home' && (
        <InfoModal
          activeTab={activeTab}
          onClose={() => setActiveTab('home')}
        />
      )}

      {/* QR Code Popup Modal */}
      {showQR && roomId && (
        <QRCodeModal
          roomId={roomId}
          onClose={() => setShowQR(false)}
        />
      )}

      {/* Footer */}
      <footer style={{
        padding: '1.6rem 1.5rem',
        textAlign: 'center',
        borderTop: '1px solid var(--border-subtle)',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        marginTop: '3rem',
        background: 'var(--bg-card)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.8rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)', fontWeight: 600 }}>
            <PeerSmashIcon size={16} /> WebRTC DataChannels
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)', fontWeight: 600 }}>
            <Lock size={15} color="var(--brand-mint)" /> End-to-End P2P
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)', fontWeight: 600 }}>
            <Shield size={15} color="var(--brand-mint)" /> Zero Server Storage
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.6rem',
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
          marginTop: '0.6rem',
          flexWrap: 'wrap'
        }}>
          <span>© {new Date().getFullYear()} PeerSmash. All rights reserved.</span>
          <span style={{ opacity: 0.4 }}>•</span>
          <span>Crafted by <strong style={{ color: 'var(--text-main)' }}>Rupam Giri</strong></span>
          <span style={{ opacity: 0.4 }}>•</span>
          <a
            href="https://github.com/Rupam797"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: 'var(--brand-mint)',
              textDecoration: 'none',
              fontWeight: 600,
              transition: 'var(--transition-fast)'
            }}
            title="Rupam Giri on GitHub"
          >
            <Github size={15} />
            <span>@Rupam797</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
