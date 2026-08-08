import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

export function RoomJoin({ onCreateRoom, onJoinRoom, error }) {
  const [inputCode, setInputCode] = useState('');

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
      alignItems: 'center',
      paddingTop: '2rem'
    }}>
      {/* Title Header */}
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
        <p style={{ fontSize: '1.05rem', color: '#9CA3AF', margin: 0 }}>
          Direct peer-to-peer file transfer
        </p>
      </header>

      {/* Error Alert Box */}
      {error && (
        <div style={{
          width: '100%',
          maxWidth: '440px',
          marginBottom: '1.5rem',
          padding: '0.9rem 1.2rem',
          borderRadius: '12px',
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

      {/* Main Interactive Controls */}
      <section style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        {/* Create New Room Button */}
        <button
          onClick={onCreateRoom}
          style={{
            width: '100%',
            backgroundColor: '#50E3C2',
            color: '#0B0C0E',
            fontWeight: 700,
            padding: '0.9rem 1.5rem',
            borderRadius: '10px',
            fontSize: '1rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 15px rgba(80, 227, 194, 0.2)'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#42D4B3'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#50E3C2'}
        >
          Create New Room
        </button>

        {/* OR Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: '0.2rem 0'
        }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#5A5E6B'
          }}>
            OR
          </span>
        </div>

        {/* Join Room Input & Button Form */}
        <form onSubmit={handleJoinSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input
            type="text"
            maxLength={6}
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            placeholder="ROOM ID E.G. ABC123"
            className="room-code-input"
            style={{
              width: '100%',
              backgroundColor: '#16181D',
              border: '1px solid #282A30',
              borderRadius: '10px',
              padding: '0.9rem 1.5rem',
              textAlign: 'center',
              fontSize: '1rem',
              color: '#FFFFFF',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#50E3C2'}
            onBlur={(e) => e.target.style.borderColor = '#282A30'}
          />

          <button
            type="submit"
            disabled={inputCode.trim().length < 4}
            style={{
              width: '100%',
              backgroundColor: '#16181D',
              border: '1px solid #282A30',
              color: inputCode.trim().length >= 4 ? '#FFFFFF' : '#6B7280',
              fontWeight: 600,
              padding: '0.9rem 1.5rem',
              borderRadius: '10px',
              fontSize: '1rem',
              cursor: inputCode.trim().length >= 4 ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              if (inputCode.trim().length >= 4) {
                e.currentTarget.style.borderColor = 'rgba(80, 227, 194, 0.5)';
                e.currentTarget.style.backgroundColor = '#1F222A';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#282A30';
              e.currentTarget.style.backgroundColor = '#16181D';
            }}
          >
            Join Room
          </button>
        </form>
      </section>

      {/* Getting Started Section Card */}
      <section style={{
        width: '100%',
        backgroundColor: '#121419',
        border: '1px solid #22252E',
        borderRadius: '16px',
        padding: '2.2rem 2.5rem',
        marginTop: '3.5rem',
        textAlign: 'left'
      }}>
        <h2 style={{
          color: '#50E3C2',
          fontWeight: 800,
          fontSize: '0.85rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '1.5rem',
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
          gap: '1.1rem',
          color: '#9CA3AF',
          fontSize: '0.95rem',
          lineHeight: 1.5
        }}>
          <li style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ color: '#50E3C2', marginRight: '0.85rem', fontSize: '1.3rem', lineHeight: 1, marginTop: '-0.1rem' }}>•</span>
            <p style={{ margin: 0 }}>
              <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>To share files:</strong> Click "Create New Room", then copy and share the Room ID or invite link with the other devices.
            </p>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ color: '#50E3C2', marginRight: '0.85rem', fontSize: '1.3rem', lineHeight: 1, marginTop: '-0.1rem' }}>•</span>
            <p style={{ margin: 0 }}>
              <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>To receive files:</strong> Paste the 6-character Room ID sent to you into the box above and click 'Join Room'.
            </p>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ color: '#50E3C2', marginRight: '0.85rem', fontSize: '1.3rem', lineHeight: 1, marginTop: '-0.1rem' }}>•</span>
            <p style={{ margin: 0 }}>
              <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>Verify connection:</strong> The dashed security code inside the room is optional—it simply lets you double-check that your devices connected to each other safely.
            </p>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ color: '#50E3C2', marginRight: '0.85rem', fontSize: '1.3rem', lineHeight: 1, marginTop: '-0.1rem' }}>•</span>
            <p style={{ margin: 0 }}>
              <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>Room Limits:</strong> Up to 8 devices can join a single room at once. You can transfer files up to 100 MB in size.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );
}
