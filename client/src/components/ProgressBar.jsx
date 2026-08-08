import React from 'react';
import { X, Zap, Clock, HardDrive } from 'lucide-react';
import { formatBytes, formatSpeed, formatTimeRemaining } from '../utils/formatters';

export function ProgressBar({ fileData, isSending, onCancel }) {
  if (!fileData) return null;

  const {
    name,
    totalBytes = 0,
    sentBytes = 0,
    receivedBytes = 0,
    progress = 0,
    speed = 0,
    eta = 0,
    id
  } = fileData;

  const currentBytes = isSending ? sentBytes : receivedBytes;
  const roundedProgress = Math.min(100, Math.max(0, progress)).toFixed(1);

  return (
    <div className="glass-card glow-border" style={{
      padding: '1.6rem',
      borderRadius: '20px',
      marginBottom: '1.8rem',
      width: '100%'
    }}>
      {/* Header Info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', overflow: 'hidden' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'rgba(42, 127, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Zap size={20} color="#2A7FFF" />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <h4 style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#F8FAFC',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {isSending ? `Sending: ${name}` : `Receiving: ${name}`}
            </h4>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 500 }}>
              {formatBytes(currentBytes)} of {formatBytes(totalBytes)}
            </span>
          </div>
        </div>

        {onCancel && (
          <button
            onClick={() => onCancel(id)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94A3B8',
              borderRadius: '8px',
              padding: '0.4rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Cancel Transfer"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Progress Bar Container */}
      <div style={{
        width: '100%',
        height: '14px',
        background: 'rgba(15, 23, 42, 0.9)',
        borderRadius: '10px',
        overflow: 'hidden',
        position: 'relative',
        marginBottom: '1rem',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{
          width: `${roundedProgress}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #2A7FFF 0%, #00E5FF 100%)',
          borderRadius: '10px',
          boxShadow: '0 0 15px rgba(0, 229, 255, 0.6)',
          transition: 'width 0.15s ease-out'
        }} />
      </div>

      {/* Transfer Metrics Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.85rem',
        color: '#94A3B8',
        fontWeight: 600
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#00E5FF' }}>
            <Zap size={15} />
            <span>{formatSpeed(speed)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={15} />
            <span>{formatTimeRemaining(eta)}</span>
          </div>
        </div>

        <div style={{
          fontFamily: 'var(--font-mono)',
          color: '#F8FAFC',
          fontSize: '1rem',
          fontWeight: 700
        }}>
          {roundedProgress}%
        </div>
      </div>
    </div>
  );
}
