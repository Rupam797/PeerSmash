import React from 'react';
import { X, ShieldCheck, Zap, Lock, Globe, Server, Cpu, CheckCircle } from 'lucide-react';
import { PeerSmashAppIcon } from './PeerSmashIcon';

export function InfoModal({ activeTab, onClose }) {
  if (!activeTab || activeTab === 'home') return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem'
    }} onClick={onClose}>
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '560px',
          padding: '2.2rem 2rem',
          borderRadius: '20px',
          position: 'relative',
          maxHeight: '85vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.4rem',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '8px'
          }}
        >
          <X size={20} />
        </button>

        {activeTab === 'how-it-works' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(80, 227, 194, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-mint)'
              }}>
                <Zap size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  How PeerSmash Works
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Browser-to-browser P2P file streaming protocol
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand-mint)',
                  color: '#0B0C0E',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>1</div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                    Create a Signaling Room
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    Click "Create New Room" to generate a temporary 6-character room code. The signaling server exchanges WebRTC connection metadata (SDP & ICE candidates).
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand-mint)',
                  color: '#0B0C0E',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>2</div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                    Direct Peer Handshake
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    The recipient enters the room code or scans the mobile QR code. Both browsers establish a direct WebRTC DataChannel link.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--brand-mint)',
                  color: '#0B0C0E',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>3</div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                    Encrypted File Streaming
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    Files are sliced into binary chunks and sent directly between device RAMs. Zero server storage, maximum privacy and speed!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.2rem' }}>
              <PeerSmashAppIcon size={48} borderRadius={14} />
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  About PeerSmash
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Zero-Server High-Speed Peer-to-Peer Transfer
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              PeerSmash is built to empower peers to connect, collaborate, and achieve more together. It uses WebRTC DataChannels to transfer files directly between devices without passing through any cloud database or third-party servers.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{
                padding: '1rem',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)'
              }}>
                <Lock size={20} color="var(--brand-mint)" style={{ marginBottom: '0.4rem' }} />
                <h5 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 0.2rem 0' }}>
                  End-to-End Encrypted
                </h5>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Data channels encrypted via DTLS/SCTP protocols.
                </span>
              </div>

              <div style={{
                padding: '1rem',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)'
              }}>
                <Server size={20} color="var(--brand-mint)" style={{ marginBottom: '0.4rem' }} />
                <h5 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 0.2rem 0' }}>
                  Zero Cloud Storage
                </h5>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Files are never uploaded or stored on any server.
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                Built with React, WebRTC DataChannels, Socket.io, & Node.js
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
