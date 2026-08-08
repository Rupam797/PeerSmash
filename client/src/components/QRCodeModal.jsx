import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, Check, Smartphone, ExternalLink } from 'lucide-react';

export function QRCodeModal({ roomId, onClose }) {
  const [copied, setCopied] = useState(false);

  // Production-grade URL builder
  const getRoomUrl = () => {
    if (import.meta.env.VITE_APP_URL) {
      const baseUrl = import.meta.env.VITE_APP_URL.replace(/\/$/, '');
      return `${baseUrl}/?room=${roomId}`;
    }
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/?room=${roomId}`;
  };

  const roomUrl = getRoomUrl();

  const copyUrl = () => {
    navigator.clipboard.writeText(roomUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(11, 12, 14, 0.88)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }} onClick={onClose}>
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '2.2rem 2rem',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.4rem',
          position: 'relative',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)'
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
            justifyContent: 'center'
          }}
          title="Close QR Code Modal"
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
            backgroundColor: 'rgba(80, 227, 194, 0.12)',
            color: 'var(--brand-mint)',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '0.7rem'
          }}>
            <Smartphone size={14} /> Instant Mobile Pairing
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Scan to Join Room
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.4rem 0 0 0' }}>
            Point your mobile camera to scan and join instantly
          </p>
        </div>

        {/* High-Contrast Production Level QR Code Component */}
        <div style={{
          padding: '1.2rem',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'none'
        }}>
          <QRCodeSVG
            value={roomUrl}
            size={200}
            level="H"
            includeMargin={true}
            bgColor="#FFFFFF"
            fgColor="#0B0C0E"
          />
        </div>

        {/* Production Room Code & Link Box */}
        <div style={{
          width: '100%',
          padding: '0.8rem 1rem',
          borderRadius: '12px',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.8rem'
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
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
            {copied ? <Check size={14} color="var(--brand-mint)" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
