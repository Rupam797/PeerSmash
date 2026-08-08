import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, Smartphone } from 'lucide-react';
import { PeerSmashIcon } from './PeerSmashIcon';

export function QRCodeModal({ roomId, onClose }) {
  const [copied, setCopied] = useState(false);
  const roomUrl = `${window.location.origin}/?room=${roomId}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(roomUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(6, 18, 25, 0.88)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }} onClick={onClose}>
      <div
        className="glass-card glow-border"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '2.2rem 2rem',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.4rem',
          position: 'relative',
          backgroundColor: '#0B1922'
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
            color: '#9DB2C6',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Title Header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.9rem',
            borderRadius: '20px',
            background: 'rgba(0, 200, 150, 0.12)',
            color: '#00C896',
            fontSize: '0.8rem',
            fontWeight: 800,
            marginBottom: '0.7rem'
          }}>
            <Smartphone size={14} /> Instant Mobile Pairing
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>
            Scan to Join Room
          </h3>
        </div>

        {/* QR Code Container with PeerSmash Logo in Center */}
        <div style={{
          padding: '1.2rem',
          background: '#FFFFFF',
          borderRadius: '20px',
          boxShadow: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <QRCodeSVG
            value={roomUrl}
            size={200}
            level="H"
            includeMargin={true}
            bgColor="#FFFFFF"
            fgColor="#061219"
          />
        </div>

        {/* Room Code & Link Box */}
        <div style={{
          width: '100%',
          padding: '0.8rem 1rem',
          borderRadius: '12px',
          background: '#061219',
          border: '1px solid rgba(0, 200, 150, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.8rem'
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: '#9DB2C6',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {roomUrl}
          </span>
          <button
            onClick={copyUrl}
            className="btn-secondary"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', flexShrink: 0 }}
          >
            {copied ? <Check size={14} color="#00C896" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
