import React, { useState } from 'react';
import { AlertCircle, Users, Radio, Globe } from 'lucide-react';
import { PeerSmashAppIcon } from './PeerSmashIcon';
import { AnimatedNumber } from './AnimatedNumber';

export function RoomJoin({ onCreateRoom, onJoinRoom, error, stats }) {
  const [inputCode, setInputCode] = useState('');

  const connectedPeers = stats?.connectedPeers ?? 1;
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
      maxWidth: '560px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '1rem'
    }}>
      {/* Title Header & Main Brand Icon */}
      <header style={{ textAlign: 'center', marginBottom: '2rem', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginBottom: '1rem' }}>
          <PeerSmashAppIcon width={120} />
        </div>
        <h1 style={{
          fontFamily: "'Space Grotesk', -apple-system, sans-serif",
          fontSize: '2.4rem',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: 'var(--text-main)',
          marginBottom: '0.4rem'
        }}>
          P2P File Share
        </h1>
        <p style={{ fontSize: '0.98rem', color: 'var(--text-muted)', margin: 0 }}>
          Direct peer-to-peer file transfer
        </p>
      </header>

      {/* Error Alert Box */}
      {error && (
        <div style={{
          width: '100%',
          maxWidth: '380px',
          marginBottom: '1.2rem',
          padding: '0.8rem 1.1rem',
          borderRadius: '10px',
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#F87171',
          display: 'flex',
          alignItems: 'center',
          gap: '0.7rem',
          fontSize: '0.9rem',
          fontWeight: 600
        }}>
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Interactive Controls */}
      <section style={{ width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Create New Room Button */}
        <button
          onClick={onCreateRoom}
          style={{
            width: '100%',
            backgroundColor: 'var(--brand-mint)',
            color: '#0B0C0E',
            fontWeight: 700,
            padding: '0.85rem 1.4rem',
            borderRadius: '10px',
            fontSize: '0.98rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: 'none'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--brand-mint-hover)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--brand-mint)'}
        >
          Create New Room
        </button>

        {/* OR Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: '0.1rem 0'
        }}>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--text-dim)'
          }}>
            OR
          </span>
        </div>

        {/* Join Room Input & Button Form */}
        <form onSubmit={handleJoinSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <input
            type="text"
            maxLength={6}
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            placeholder="ROOM ID E.G. ABC123"
            className="room-code-input"
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '0.85rem 1.4rem',
              textAlign: 'center',
              fontSize: '0.98rem',
              color: 'var(--text-main)',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--brand-mint)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
          />

          <button
            type="submit"
            disabled={inputCode.trim().length < 4}
            style={{
              width: '100%',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              color: inputCode.trim().length >= 4 ? 'var(--text-main)' : 'var(--text-dim)',
              fontWeight: 600,
              padding: '0.85rem 1.4rem',
              borderRadius: '10px',
              fontSize: '0.98rem',
              cursor: inputCode.trim().length >= 4 ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              if (inputCode.trim().length >= 4) {
                e.currentTarget.style.borderColor = 'var(--brand-mint)';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            Join Room
          </button>
        </form>
      </section>

      {/* Getting Started Section Card */}
      <section style={{
        width: '100%',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '14px',
        padding: '1.8rem 2rem',
        marginTop: '2.8rem',
        textAlign: 'left'
      }}>
        <h2 style={{
          color: 'var(--brand-mint)',
          fontWeight: 800,
          fontSize: '0.82rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '1.2rem',
          marginTop: 0
        }}>
          GETTING STARTED
        </h2>

        <ul style={{
          listStyleType: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.95rem',
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          lineHeight: 1.5
        }}>
          <li style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--brand-mint)', marginRight: '0.75rem', fontSize: '1.2rem', lineHeight: 1, marginTop: '-0.1rem' }}>•</span>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--text-main)', fontWeight: 600 }}>To share files:</strong> Click "Create New Room", then copy and share the Room ID or invite link with the other devices.
            </p>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--brand-mint)', marginRight: '0.75rem', fontSize: '1.2rem', lineHeight: 1, marginTop: '-0.1rem' }}>•</span>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--text-main)', fontWeight: 600 }}>To receive files:</strong> Paste the 6-character Room ID sent to you into the box above and click 'Join Room'.
            </p>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--brand-mint)', marginRight: '0.75rem', fontSize: '1.2rem', lineHeight: 1, marginTop: '-0.1rem' }}>•</span>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--text-main)', fontWeight: 600 }}>Verify connection:</strong> The dashed security code inside the room is optional—it simply lets you double-check that your devices connected to each other safely.
            </p>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--brand-mint)', marginRight: '0.75rem', fontSize: '1.2rem', lineHeight: 1, marginTop: '-0.1rem' }}>•</span>
            <p style={{ margin: 0 }}>
              <strong style={{ color: 'var(--text-main)', fontWeight: 600 }}>Room Limits:</strong> Up to 8 devices can join a single room at once. You can transfer files up to 1 GB in size.
            </p>
          </li>
        </ul>
      </section>

      {/* Live Online Users & Total Sessions Stats Footer Bar */}
      <footer style={{
        marginTop: '1.8rem',
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0.8rem',
        fontSize: '0.78rem',
        fontWeight: 600,
        color: 'var(--text-muted)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          padding: '0.35rem 0.85rem',
          borderRadius: '9999px'
        }}>
          <span className="pulse-dot green" style={{ width: '7px', height: '7px' }}></span>
          <span style={{ color: 'var(--text-main)' }}>
            <strong><AnimatedNumber value={connectedPeers} /></strong> {connectedPeers === 1 ? 'User' : 'Users'} Online
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          padding: '0.35rem 0.85rem',
          borderRadius: '9999px'
        }}>
          <Radio size={13} color="var(--brand-mint)" />
          <span style={{ color: 'var(--text-main)' }}>
            <strong><AnimatedNumber value={activeRooms} /></strong> Active Rooms
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          padding: '0.35rem 0.85rem',
          borderRadius: '9999px'
        }}>
          <Globe size={13} color="var(--brand-mint)" />
          <span style={{ color: 'var(--text-main)' }}>
            <strong><AnimatedNumber value={totalConnections} /></strong> Total Sessions
          </span>
        </div>
      </footer>
    </div>
  );
}
