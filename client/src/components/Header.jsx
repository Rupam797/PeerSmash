import React from 'react';
import { Zap, QrCode, ShieldCheck, Wifi, WifiOff, Users, Radio } from 'lucide-react';

export function Header({ isConnected, roomId, stats, onOpenQR }) {
  const connectedPeers = stats?.connectedPeers ?? 0;
  const activeRooms = stats?.activeRooms ?? 0;

  return (
    <header style={{
      width: '100%',
      padding: '1.2rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      background: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #2A7FFF 0%, #00E5FF 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(42, 127, 255, 0.4)'
        }}>
          <Zap size={24} color="#FFFFFF" />
        </div>
        <div>
          <h1 style={{
            fontSize: '1.4rem',
            fontWeight: '800',
            background: 'linear-gradient(90deg, #FFFFFF 0%, #94A3B8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
            margin: 0
          }}>
            PeerSmash

          </h1>
          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
            Zero-Server P2P Streaming
          </span>
        </div>
      </div>

      {/* Header Actions & Live Users Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Live Users Counter Pill */}
        {isConnected && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.7rem',
            padding: '0.4rem 0.9rem',
            borderRadius: '20px',
            background: 'rgba(42, 127, 255, 0.1)',
            border: '1px solid rgba(42, 127, 255, 0.25)',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#F8FAFC'
          }} title={`${connectedPeers} user(s) live across ${activeRooms} room(s)`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#00E5FF' }}>
              <div className="pulse-dot green" style={{ width: '6px', height: '6px' }}></div>
              <Users size={14} />
              <span>{connectedPeers} {connectedPeers === 1 ? 'User' : 'Users'} Live</span>
            </div>
            {activeRooms > 0 && (
              <span style={{ color: '#64748B', borderLeft: '1px solid rgba(255, 255, 255, 0.15)', paddingLeft: '0.6rem' }}>
                {activeRooms} {activeRooms === 1 ? 'Room' : 'Rooms'}
              </span>
            )}
          </div>
        )}

        {roomId && (
          <button
            onClick={onOpenQR}
            className="btn-secondary"
            style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
            title="Scan QR to join on mobile"
          >
            <QrCode size={16} color="#00E5FF" />
            <span>Mobile QR</span>
          </button>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 0.8rem',
          borderRadius: '20px',
          background: isConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${isConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          fontSize: '0.8rem',
          fontWeight: 600,
          color: isConnected ? '#10B981' : '#EF4444'
        }}>
          {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
          <span>{isConnected ? 'Signaling Online' : 'Signaling Offline'}</span>
        </div>
      </div>
    </header>
  );
}

