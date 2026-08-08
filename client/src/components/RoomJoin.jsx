import React, { useState } from 'react';
import { PlusCircle, LogIn, AlertCircle, Users, Radio, Activity, Shield } from 'lucide-react';

export function RoomJoin({ onCreateRoom, onJoinRoom, error, stats }) {
  const [inputCode, setInputCode] = useState('');

  const connectedPeers = stats?.connectedPeers ?? 0;
  const activeRooms = stats?.activeRooms ?? 0;
  const totalConnections = stats?.totalConnections ?? 0;

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (inputCode.trim().length >= 4) {
      onJoinRoom(inputCode.trim());
    }
  };

  return (
    <div style={{
      maxWidth: '680px',
      margin: '2rem auto',
      padding: '0 1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Main Single Centered Card matching User Screenshot */}
      <div className="glass-card glow-border" style={{
        width: '100%',
        padding: '2.5rem 2rem',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.8rem',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Title Header */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            marginBottom: '0.4rem',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #CBD5E1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            P2P File Share
          </h2>
          <p style={{
            fontSize: '1rem',
            color: '#94A3B8',
            fontWeight: 500
          }}>
            Direct peer-to-peer file transfer
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div style={{
            width: '100%',
            padding: '0.9rem 1.2rem',
            borderRadius: '14px',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#F87171',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            fontSize: '0.9rem',
            fontWeight: 600
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Action 1: Create New Room Button */}
        <button
          onClick={onCreateRoom}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '1.1rem',
            fontSize: '1.1rem',
            fontWeight: 700,
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #2A7FFF 0%, #00E5FF 100%)',
            boxShadow: '0 0 25px rgba(42, 127, 255, 0.35)'
          }}
        >
          <PlusCircle size={22} />
          <span>Create New Room</span>
        </button>

        {/* OR Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          width: '100%',
          color: '#64748B',
          fontSize: '0.85rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
          <span>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
        </div>

        {/* Action 2: Join Form */}
        <form onSubmit={handleJoinSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            maxLength={6}
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            placeholder="ROOM ID E.G. SMASH8"
            className="room-code-input"
            style={{
              width: '100%',
              padding: '1.1rem',
              fontSize: '1.25rem',
              textAlign: 'center',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '14px',
              color: '#FFFFFF',
              outline: 'none',
              transition: 'all 0.2s ease',
              letterSpacing: '4px'
            }}
            onFocus={(e) => e.target.style.borderColor = '#2A7FFF'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
          />

          <button
            type="submit"
            disabled={inputCode.trim().length < 4}
            className="btn-secondary"
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: '14px',
              background: inputCode.trim().length >= 4 ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              borderColor: inputCode.trim().length >= 4 ? 'rgba(0, 229, 255, 0.4)' : 'rgba(255, 255, 255, 0.1)'
            }}
          >
            <LogIn size={20} color={inputCode.trim().length >= 4 ? '#00E5FF' : '#94A3B8'} />
            <span>Join Room</span>
          </button>
        </form>

        {/* Getting Started Instructions Box (Exact layout from Screenshot) */}
        <div style={{
          width: '100%',
          padding: '1.6rem',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          textAlign: 'left'
        }}>
          <h4 style={{
            color: '#00E5FF',
            fontSize: '0.85rem',
            fontWeight: 800,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            margin: 0
          }}>
            GETTING STARTED
          </h4>

          <ul style={{
            listStyleType: 'disc',
            paddingLeft: '1.2rem',
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem',
            color: '#94A3B8',
            fontSize: '0.9rem',
            lineHeight: 1.55
          }}>
            <li>
              <strong style={{ color: '#F8FAFC' }}>To share files:</strong> Click "Create New Room", then copy and share the Room ID or invite link with the other devices.
            </li>
            <li>
              <strong style={{ color: '#F8FAFC' }}>To receive files:</strong> Paste the 6-character Room ID sent to you into the box above and click "Join Room".
            </li>
            <li>
              <strong style={{ color: '#F8FAFC' }}>Verify connection:</strong> The security code inside the room confirms that your devices connected to each other safely.
            </li>
            <li>
              <strong style={{ color: '#F8FAFC' }}>Room Limits:</strong> Direct P2P stream between 2 devices per room with zero server file storage.
            </li>
          </ul>
        </div>

        {/* Live Visitor Stats Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.8rem',
          paddingTop: '0.5rem',
          color: '#64748B',
          fontSize: '0.85rem',
          fontWeight: 600
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10B981' }}>
            <div className="pulse-dot green" style={{ width: '6px', height: '6px' }}></div>
            <Users size={14} />
            <span>{connectedPeers} Users Live</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#00E5FF' }}>
            <Radio size={14} />
            <span>{activeRooms} Active Rooms</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#2A7FFF' }}>
            <Activity size={14} />
            <span>{totalConnections} Sessions</span>
          </div>
        </div>
      </div>
    </div>
  );
}
