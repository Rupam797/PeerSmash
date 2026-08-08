import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

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
      width: '100%',
      maxWidth: '680px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Main Stitch Container Card */}
      <main style={{
        width: '100%',
        backgroundColor: '#0B101C',
        borderRadius: '1.25rem',
        padding: '2.5rem 2rem',
        boxShadow: '0 0 20px rgba(0, 229, 255, 0.05), inset 0 0 0 1px rgba(0, 229, 255, 0.1)',
        border: '1px solid #1E293B',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Header Section */}
        <header style={{ textAlign: 'center', marginBottom: '2.5rem', width: '100%' }}>
          <h1 style={{
            fontSize: '2.8rem',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: '#FFFFFF',
            marginBottom: '0.6rem'
          }}>
            P2P File Share
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#94A3B8', margin: 0 }}>
            Direct peer-to-peer file transfer
          </p>
        </header>

        {/* Error Alert Box */}
        {error && (
          <div style={{
            width: '100%',
            maxWidth: '28rem',
            marginBottom: '1.5rem',
            padding: '0.9rem 1.2rem',
            borderRadius: '0.75rem',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#F87171',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            fontSize: '0.95rem',
            fontWeight: 600
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Action Section */}
        <section style={{ width: '100%', maxWidth: '28rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Create Room Button */}
          <button
            onClick={onCreateRoom}
            style={{
              width: '100%',
              background: 'linear-gradient(to right, #2A7FFF, #00E5FF)',
              color: '#FFFFFF',
              fontWeight: 700,
              padding: '1rem 1.5rem',
              borderRadius: '0.75rem',
              fontSize: '1.125rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(42, 127, 255, 0.3)',
              transition: 'transform 0.2s ease, filter 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.filter = 'brightness(1)'}
          >
            Create New Room
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', width: '100%', padding: '0.5rem 0' }}>
            <div style={{ height: '1px', backgroundColor: '#1E293B', flexGrow: 1 }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748B' }}>
              OR
            </span>
            <div style={{ height: '1px', backgroundColor: '#1E293B', flexGrow: 1 }} />
          </div>

          {/* Join Room Form */}
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
                backgroundColor: '#0F172A',
                border: '1px solid #1E293B',
                borderRadius: '0.75rem',
                padding: '1rem 1.5rem',
                textAlign: 'center',
                fontSize: '1.125rem',
                color: '#FFFFFF',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#00E5FF'}
              onBlur={(e) => e.target.style.borderColor = '#1E293B'}
            />

            <button
              type="submit"
              disabled={inputCode.trim().length < 4}
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                border: '2px solid #1E293B',
                color: inputCode.trim().length >= 4 ? '#FFFFFF' : '#CBD5E1',
                fontWeight: 600,
                padding: '0.875rem 1.5rem',
                borderRadius: '0.75rem',
                fontSize: '1.125rem',
                cursor: inputCode.trim().length >= 4 ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                if (inputCode.trim().length >= 4) {
                  e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.5)';
                  e.currentTarget.style.backgroundColor = 'rgba(0, 229, 255, 0.05)';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#1E293B';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Join Room
            </button>
          </form>
        </section>

        {/* Getting Started Section */}
        <section style={{
          width: '100%',
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          border: '1px solid #1E293B',
          borderRadius: '0.75rem',
          padding: '1.5rem 2rem',
          marginTop: '3rem',
          textAlign: 'left'
        }}>
          <h2 style={{
            color: '#00E5FF',
            fontWeight: 800,
            fontSize: '0.875rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '1.25rem',
            marginTop: 0
          }}>
            Getting Started
          </h2>

          <ul style={{
            listStyleType: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            color: '#CBD5E1',
            fontSize: '0.95rem',
            lineHeight: 1.6
          }}>
            <li style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#00E5FF', marginRight: '0.75rem', marginTop: '0.1rem', fontSize: '1.2rem', lineHeight: 1 }}>•</span>
              <p style={{ margin: 0 }}>
                <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>To share files:</strong> Click 'Create New Room', then copy and share the Room ID or invite link with the other devices.
              </p>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#00E5FF', marginRight: '0.75rem', marginTop: '0.1rem', fontSize: '1.2rem', lineHeight: 1 }}>•</span>
              <p style={{ margin: 0 }}>
                <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>To receive files:</strong> Paste the 6-character Room ID sent to you into the box above and click 'Join Room'.
              </p>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#00E5FF', marginRight: '0.75rem', marginTop: '0.1rem', fontSize: '1.2rem', lineHeight: 1 }}>•</span>
              <p style={{ margin: 0 }}>
                <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>Verify connection:</strong> The security code inside the room confirms that your devices connected to each other safely.
              </p>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#00E5FF', marginRight: '0.75rem', marginTop: '0.1rem', fontSize: '1.2rem', lineHeight: 1 }}>•</span>
              <p style={{ margin: 0 }}>
                <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>Room Limits:</strong> Direct P2P stream between 2 devices per room with zero server file storage.
              </p>
            </li>
          </ul>
        </section>
      </main>

      {/* Footer Stats Pills */}
      <footer style={{
        marginTop: '2rem',
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '1rem',
        fontSize: '0.75rem',
        fontWeight: 600,
        color: '#94A3B8'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: '#0B101C',
          border: '1px solid #1E293B',
          padding: '0.375rem 0.875rem',
          borderRadius: '9999px'
        }}>
          <span className="pulse-dot green" style={{ width: '8px', height: '8px', backgroundColor: '#10B981', borderRadius: '50%' }}></span>
          <span>{connectedPeers} Users Live</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: '#0B101C',
          border: '1px solid #1E293B',
          padding: '0.375rem 0.875rem',
          borderRadius: '9999px'
        }}>
          <span className="pulse-dot" style={{ width: '8px', height: '8px', backgroundColor: '#2A7FFF', borderRadius: '50%', animationDelay: '0.5s' }}></span>
          <span>{activeRooms} Active Rooms</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: '#0B101C',
          border: '1px solid #1E293B',
          padding: '0.375rem 0.875rem',
          borderRadius: '9999px'
        }}>
          <span className="pulse-dot" style={{ width: '8px', height: '8px', backgroundColor: '#00E5FF', borderRadius: '50%', animationDelay: '1s' }}></span>
          <span>{totalConnections} Peer Sessions</span>
        </div>
      </footer>
    </div>
  );
}
