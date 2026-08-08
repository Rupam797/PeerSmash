import React, { useState } from 'react';
import { Copy, Check, Users, ArrowLeft, ShieldAlert } from 'lucide-react';

export function ConnectionStatus({
  roomId,
  connectionStatus,
  hasPeer,
  isInitiator,
  natError,
  onLeaveRoom
}) {
  const [copied, setCopied] = useState(false);

  const copyRoomLink = () => {
    const link = `${window.location.origin}/?room=${roomId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getStatusDisplay = () => {
    if (natError || connectionStatus === 'FAILED') {
      return {
        label: 'Direct Connection Failed',
        subtext: 'Both devices may be behind restrictive symmetric NATs.',
        badgeClass: 'badge-failed',
        dotClass: 'pulse-dot red'
      };
    }

    if (connectionStatus === 'CONNECTED') {
      return {
        label: 'P2P Link Active',
        subtext: 'WebRTC DataChannel encrypted & streaming.',
        badgeClass: 'badge-connected',
        dotClass: 'pulse-dot green'
      };
    }

    if (hasPeer || connectionStatus === 'CONNECTING') {
      return {
        label: 'Establishing P2P Link...',
        subtext: 'Exchanging STUN candidates & WebRTC offers.',
        badgeClass: 'badge-connecting',
        dotClass: 'pulse-dot yellow'
      };
    }

    return {
      label: 'Waiting for Peer to Join',
      subtext: `Share code ${roomId} with recipient.`,
      badgeClass: 'badge-connecting',
      dotClass: 'pulse-dot yellow'
    };
  };

  const statusInfo = getStatusDisplay();

  return (
    <div className="glass-card" style={{
      padding: '1.4rem 1.8rem',
      borderRadius: '20px',
      width: '100%',
      marginBottom: '1.8rem'
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.2rem'
      }}>
        {/* Left: Leave button + Room Code Display */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={onLeaveRoom}
            className="btn-secondary"
            style={{ padding: '0.6rem 0.9rem', fontSize: '0.85rem' }}
            title="Leave current room"
          >
            <ArrowLeft size={16} />
            <span>Leave</span>
          </button>

          <div>
            <span style={{ fontSize: '0.75rem', color: '#9DB2C6', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Room Code
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.4rem',
                fontWeight: 800,
                color: '#00C896',
                letterSpacing: '2px'
              }}>
                {roomId}
              </span>
              <button
                onClick={copyRoomLink}
                style={{
                  background: 'none',
                  border: 'none',
                  color: copied ? '#00C896' : '#9DB2C6',
                  cursor: 'pointer',
                  padding: '0.3rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Copy Room Link"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Center: Live Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div className={statusInfo.badgeClass}>
            <div className={statusInfo.dotClass}></div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{statusInfo.label}</span>
          </div>
        </div>

        {/* Right: Peer Role Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#9DB2C6', fontSize: '0.85rem' }}>
          <Users size={16} color="#00C896" />
          <span>Role: <strong>{isInitiator ? 'Sender (Host)' : 'Receiver (Joiner)'}</strong></span>
        </div>
      </div>

      {/* NAT Failure Warning Box */}
      {natError && (
        <div style={{
          marginTop: '1.2rem',
          padding: '0.9rem 1.2rem',
          borderRadius: '12px',
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#F87171',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.8rem'
        }}>
          <ShieldAlert size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Direct WebRTC Connection Failed</strong>
            <p style={{ margin: '0.2rem 0 0 0', color: '#FCA5A5' }}>
              STUN candidate exchange was unable to traverse the NAT routers between both devices.
              Try connecting both devices to Wi-Fi or mobile hotspots, or disable strict VPNs.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
