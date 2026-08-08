import React from 'react';
import { QrCode, Wifi, WifiOff, Users } from 'lucide-react';
import { PeerSmashAppIcon } from './PeerSmashIcon';

export function Header({ isConnected, roomId, stats, onOpenQR }) {
  const connectedPeers = stats?.connectedPeers ?? 0;
  const activeRooms = stats?.activeRooms ?? 0;

  return (
    <header style={{
      width: '100%',
      padding: '1.1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(0, 200, 150, 0.12)',
      background: 'rgba(6, 18, 25, 0.88)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand Logo & Tagline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
        <PeerSmashAppIcon size={40} borderRadius={12} />
        <div>
          <h1 style={{
            fontSize: '1.45rem',
            fontWeight: '800',
            color: '#FFFFFF',
            letterSpacing: '-0.025em',
            margin: 0,
            lineHeight: 1.1
          }}>
            PeerSmash
          </h1>
          <span style={{ fontSize: '0.75rem', color: '#9DB2C6', fontWeight: 600 }}>
            Connect. Collaborate. Smash Goals.
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
            background: 'rgba(0, 200, 150, 0.1)',
            border: '1px solid rgba(0, 200, 150, 0.28)',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#FFFFFF'
          }} title={`${connectedPeers} user(s) live across ${activeRooms} room(s)`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#00C896' }}>
              <div className="pulse-dot green" style={{ width: '6px', height: '6px' }}></div>
              <Users size={14} />
              <span>{connectedPeers} {connectedPeers === 1 ? 'User' : 'Users'} Live</span>
            </div>
            {activeRooms > 0 && (
              <span style={{ color: '#9DB2C6', borderLeft: '1px solid rgba(255, 255, 255, 0.15)', paddingLeft: '0.6rem' }}>
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
            <QrCode size={16} color="#00C896" />
            <span>Mobile QR</span>
          </button>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 0.8rem',
          borderRadius: '20px',
          background: isConnected ? 'rgba(0, 200, 150, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          border: `1px solid ${isConnected ? 'rgba(0, 200, 150, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
          fontSize: '0.8rem',
          fontWeight: 600,
          color: isConnected ? '#00C896' : '#EF4444'
        }}>
          {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
          <span>{isConnected ? 'Signaling Online' : 'Signaling Offline'}</span>
        </div>
      </div>
    </header>
  );
}
