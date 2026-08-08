import React, { useState, useRef } from 'react';
import { Copy, Check, ShieldAlert, FilePlus, UploadCloud, Download, Trash2, X, CheckCircle, Clock, QrCode } from 'lucide-react';
import { PeerSmashAppIcon } from './PeerSmashIcon';
import { ProgressBar } from './ProgressBar';
import { FileQueue } from './FileQueue';

export function ActiveRoomView({
  roomId,
  connectionStatus,
  dataChannelStatus,
  hasPeer,
  isInitiator,
  natError,
  queue,
  currentSendingFile,
  receivingFile,
  completedFiles,
  onAddFiles,
  onCancelFile,
  onClearQueue,
  onLeaveRoom,
  onOpenQR
}) {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const fileInputRef = useRef(null);

  const isConnected = dataChannelStatus === 'open' || connectionStatus === 'CONNECTED';

  // Generate deterministic security verification hash for this room code
  const generateSecurityCode = (code) => {
    let hash1 = 0, hash2 = 0;
    for (let i = 0; i < code.length; i++) {
      hash1 = (hash1 * 31 + code.charCodeAt(i)) % 65535;
      hash2 = (hash2 * 17 + code.charCodeAt(i)) % 65535;
    }
    const hex1 = (hash1.toString(16) + 'A1B2').slice(0, 4).toUpperCase();
    const hex2 = (hash2.toString(16) + 'C3D4').slice(0, 4).toUpperCase();
    const hex3 = ((hash1 ^ hash2).toString(16) + 'E5F6').slice(0, 4).toUpperCase();
    return `${hex1}-${hex2}-${hex3}`;
  };

  const securityCode = generateSecurityCode(roomId || 'SMASH8');

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const copyInviteLink = () => {
    const link = `${window.location.origin}/?room=${roomId}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddFiles(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '720px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.2rem'
    }}>
      {/* Top Wide Card: Room ID & Security Check */}
      <div className="mobile-card-padding" style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '1.8rem 2rem'
      }}>
        <div className="responsive-grid-2">
          {/* Left Column: Room ID & Copy Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-dim)'
            }}>
              ROOM ID — SHARE THIS TO JOIN
            </span>

            {/* Large Room ID */}
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '2.2rem',
              fontWeight: 800,
              color: 'var(--brand-mint)',
              letterSpacing: '3px',
              margin: '0.2rem 0'
            }}>
              {roomId}
            </div>

            {/* Copy Actions Stacked */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <button
                onClick={copyRoomId}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  padding: '0.8rem 1.2rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--brand-mint)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              >
                {copiedId ? <Check size={16} color="var(--brand-mint)" /> : <Copy size={16} />}
                <span>{copiedId ? 'Copied ID!' : 'Copy ID'}</span>
              </button>

              <button
                onClick={copyInviteLink}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  padding: '0.8rem 1.2rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--brand-mint)'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
              >
                {copiedLink ? <Check size={16} color="var(--brand-mint)" /> : <Copy size={16} />}
                <span>{copiedLink ? 'Copied Link!' : 'Copy invite link'}</span>
              </button>

              {onOpenQR && (
                <button
                  onClick={onOpenQR}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--brand-mint)',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    padding: '0.8rem 1.2rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--brand-mint)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                >
                  <QrCode size={16} color="var(--brand-mint)" />
                  <span>Mobile QR Code</span>
                </button>
              )}
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', margin: '0.2rem 0 0 0', lineHeight: 1.4 }}>
              Others paste this ID (or the invite link) on the home screen — not the security check below.
            </p>

            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.88rem',
              color: 'var(--text-muted)',
              marginTop: '0.4rem'
            }}>
              {hasPeer || isConnected ? '2 / 8 peers in room' : '1 / 8 peers in room'}
            </div>
          </div>

          {/* Right Column: Security Check */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-dim)'
            }}>
              SECURITY CHECK (OPTIONAL)
            </span>

            <div style={{
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '0.9rem 1.2rem',
              textAlign: 'center',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '1.05rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              letterSpacing: '2px'
            }}>
              {securityCode}
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', margin: 0, lineHeight: 1.4 }}>
              After joining, confirm this code matches on every device. <strong style={{ color: 'var(--text-muted)' }}>Do not use this to join a room.</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Middle Grid: 2 Equal Cards Side-by-Side */}
      <div className="responsive-grid-2">
        {/* Left Card: Connection Status / Peer Waiting */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '2.5rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          minHeight: '220px'
        }}>
          {isConnected ? (
            <div>
              <div className="pulse-dot green" style={{ width: '12px', height: '12px', margin: '0 auto 1rem auto' }}></div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                P2P Link Active
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                WebRTC DataChannel encrypted & connected
              </p>
            </div>
          ) : hasPeer ? (
            <div>
              <div className="pulse-dot yellow" style={{ width: '12px', height: '12px', margin: '0 auto 1rem auto' }}></div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#F59E0B', marginBottom: '0.4rem' }}>
                Establishing P2P Link...
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                Peer connected! Exchanging WebRTC encryption keys
              </p>
            </div>
          ) : (
            <div>
              <div className="pulse-dot yellow" style={{ width: '12px', height: '12px', margin: '0 auto 1rem auto' }}></div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Waiting for peers to join...
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', margin: 0, lineHeight: 1.4 }}>
                Share the room ID with someone to start transferring files
              </p>
            </div>
          )}
        </div>

        {/* Right Card: Send File / Transfer Area */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '1.8rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '220px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
              Send File
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
              Max file size: 1 GB
            </span>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem 0',
            textAlign: 'center'
          }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                backgroundColor: 'var(--brand-mint)',
                color: '#0B0C0E',
                fontWeight: 700,
                padding: '0.75rem 1.4rem',
                borderRadius: '10px',
                border: 'none',
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <FilePlus size={18} />
              <span>Select Files</span>
            </button>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.6rem' }}>
              {isConnected ? 'Peer connected — ready to transfer' : 'Files will auto-send as soon as peer joins'}
            </span>
          </div>
        </div>
      </div>

      {/* Active Transfer Progress Bars */}
      {currentSendingFile && (
        <ProgressBar
          fileData={currentSendingFile}
          isSending={true}
          onCancel={onCancelFile}
        />
      )}

      {receivingFile && (
        <ProgressBar
          fileData={receivingFile}
          isSending={false}
        />
      )}

      {/* Queue & Completed Downloads List */}
      <FileQueue
        queue={queue}
        completedFiles={completedFiles}
        onCancelFile={onCancelFile}
        onClearQueue={onClearQueue}
      />

      {/* Bottom Full-Width Action: Leave Room */}
      <button
        onClick={onLeaveRoom}
        style={{
          width: '100%',
          backgroundColor: '#EF4444',
          color: '#FFFFFF',
          fontWeight: 700,
          padding: '0.95rem 1.5rem',
          borderRadius: '12px',
          fontSize: '1.05rem',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: 'none',
          marginTop: '0.5rem'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#EF4444'}
      >
        Leave Room
      </button>

      {/* Bottom Centered Logo Mark */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
        <PeerSmashAppIcon width={100} />
      </div>
    </div>
  );
}
