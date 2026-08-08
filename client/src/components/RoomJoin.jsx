import React, { useState } from 'react';
import { PlusCircle, LogIn, Shield, Cpu, Lock, AlertCircle, Users, Radio, Activity } from 'lucide-react';

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
      maxWidth: '900px',
      margin: '2.5rem auto',
      padding: '0 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2.5rem'
    }}>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', maxWidth: '650px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 1rem',
          borderRadius: '30px',
          background: 'rgba(42, 127, 255, 0.1)',
          border: '1px solid rgba(42, 127, 255, 0.25)',
          color: '#2A7FFF',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '1.2rem'
        }}>
          <Shield size={15} /> Encrypted P2P DataChannels
        </div>
        <h2 style={{
          fontSize: '2.8rem',
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          marginBottom: '1rem',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #CBD5E1 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Direct Peer-to-Peer File Transfer.
        </h2>
        <p style={{
          fontSize: '1.1rem',
          color: '#94A3B8',
          lineHeight: 1.6,
          fontWeight: 500
        }}>
          Send files directly between browsers. No cloud storage, no file size limits, and zero server uploads.
        </p>
      </div>

      {/* Live Visitor & Activity Banner */}
      <div className="glass-card glow-border" style={{
        width: '100%',
        padding: '1.2rem 2rem',
        borderRadius: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-around',
        gap: '1.5rem',
        background: 'rgba(15, 23, 42, 0.7)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users size={20} color="#10B981" />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {connectedPeers}
              <div className="pulse-dot green" style={{ width: '8px', height: '8px' }}></div>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
              People Online Now
            </div>
          </div>
        </div>

        <div style={{ width: '1px', height: '35px', background: 'rgba(255, 255, 255, 0.1)' }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(0, 229, 255, 0.15)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Radio size={20} color="#00E5FF" />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F8FAFC' }}>
              {activeRooms}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
              Active Transfer Rooms
            </div>
          </div>
        </div>

        <div style={{ width: '1px', height: '35px', background: 'rgba(255, 255, 255, 0.1)' }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(42, 127, 255, 0.15)',
            border: '1px solid rgba(42, 127, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Activity size={20} color="#2A7FFF" />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F8FAFC' }}>
              {totalConnections}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>
              Total Peer Sessions
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert Box */}
      {error && (
        <div style={{
          width: '100%',
          maxWidth: '550px',
          padding: '1rem 1.2rem',
          borderRadius: '14px',
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#F87171',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          fontSize: '0.95rem',
          fontWeight: 600
        }}>
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Room Action Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.8rem',
        width: '100%'
      }}>
        {/* Create Room Card */}
        <div className="glass-card glow-border" style={{
          padding: '2.2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '1.5rem',
          borderRadius: '24px'
        }}>
          <div>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              background: 'rgba(42, 127, 255, 0.15)',
              border: '1px solid rgba(42, 127, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.2rem'
            }}>
              <PlusCircle size={26} color="#2A7FFF" />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem', color: '#F8FAFC' }}>
              Create a Transfer Room
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#94A3B8', lineHeight: 1.5 }}>
              Generate a unique 6-character room code to start sending files securely to another peer.
            </p>
          </div>

          <button
            onClick={onCreateRoom}
            className="btn-primary"
            style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
          >
            <PlusCircle size={20} />
            <span>Create New Room</span>
          </button>
        </div>

        {/* Join Room Card */}
        <div className="glass-card" style={{
          padding: '2.2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '1.5rem',
          borderRadius: '24px'
        }}>
          <div>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              background: 'rgba(0, 229, 255, 0.15)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.2rem'
            }}>
              <LogIn size={26} color="#00E5FF" />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem', color: '#F8FAFC' }}>
              Join Existing Room
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#94A3B8', lineHeight: 1.5 }}>
              Enter the 6-character room code shared by your peer to connect instantly.
            </p>
          </div>

          <form onSubmit={handleJoinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <input
              type="text"
              maxLength={6}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="e.g. BEAM88"
              className="room-code-input"
              style={{
                width: '100%',
                padding: '0.9rem 1.2rem',
                fontSize: '1.2rem',
                textAlign: 'center',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '14px',
                color: '#FFFFFF',
                outline: 'none',
                transition: 'border 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2A7FFF'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
            />

            <button
              type="submit"
              disabled={inputCode.trim().length < 4}
              className="btn-secondary"
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', background: inputCode.trim().length >= 4 ? 'rgba(0, 229, 255, 0.15)' : undefined }}
            >
              <LogIn size={18} color="#00E5FF" />
              <span>Join Room</span>
            </button>
          </form>
        </div>
      </div>

      {/* Feature Badges */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '2rem',
        marginTop: '1rem',
        color: '#64748B',
        fontSize: '0.9rem',
        fontWeight: 600
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Cpu size={18} color="#2A7FFF" />
          <span>WebRTC DataChannels</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Lock size={18} color="#00E5FF" />
          <span>100% Client-Side Privacy</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={18} color="#10B981" />
          <span>STUN Peer Discovery</span>
        </div>
      </div>
    </div>
  );
}

