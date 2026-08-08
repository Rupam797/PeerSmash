import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, Smartphone } from 'lucide-react';

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
      background: 'rgba(5, 8, 15, 0.85)',
      backdropFilter: 'blur(10px)',
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
          padding: '2rem',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.4rem',
          position: 'relative'
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
            color: '#94A3B8',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Title Header */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.3rem 0.8rem',
            borderRadius: '20px',
            background: 'rgba(0, 229, 255, 0.12)',
            color: '#00E5FF',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '0.6rem'
          }}>
            <Smartphone size={14} /> Instant Mobile Pairing
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F8FAFC' }}>
            Scan to Join Room
          </h3>
        </div>

        {/* QR Code Container */}
        <div style={{
          padding: '1.2rem',
          background: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 0 30px rgba(0, 229, 255, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <QRCodeSVG
            value={roomUrl}
            size={200}
            level="H"
            includeMargin={true}
            bgColor="#FFFFFF"
            fgColor="#090D16"
          />
        </div>

        {/* Room Code & Link Box */}
        <div style={{
          width: '100%',
          padding: '0.8rem 1rem',
          borderRadius: '12px',
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.8rem'
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: '#94A3B8',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {roomUrl}
          </span>
          <button
            onClick={copyUrl}
            className="btn-secondary"
            style={{ padding: '0.4rem 0.7rem', fontSize: '0.8rem', flexShrink: 0 }}
          >
            {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
