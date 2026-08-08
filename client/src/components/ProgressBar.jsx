import React from 'react';
import { X, Zap, Clock } from 'lucide-react';
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
    <div className="glass-card" style={{
      padding: '1.6rem',
      borderRadius: '16px',
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
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: 'rgba(80, 227, 194, 0.15)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Zap size={20} color="var(--brand-mint)" />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <h4 style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: 'var(--text-main)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {isSending ? `Sending: ${name}` : `Receiving: ${name}`}
            </h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {formatBytes(currentBytes)} of {formatBytes(totalBytes)}
            </span>
          </div>
        </div>

        {onCancel && (
          <button
            onClick={() => onCancel(id)}
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
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

      {/* Progress Bar Track */}
      <div style={{
        width: '100%',
        height: '14px',
        backgroundColor: 'var(--bg-input)',
        borderRadius: '10px',
        overflow: 'hidden',
        position: 'relative',
        marginBottom: '1rem',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{
          width: `${roundedProgress}%`,
          height: '100%',
          backgroundColor: 'var(--brand-mint)',
          borderRadius: '10px',
          boxShadow: 'none',
          transition: 'width 0.15s ease-out'
        }} />
      </div>

      {/* Transfer Metrics Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        fontWeight: 600
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-mint)' }}>
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
          color: 'var(--text-main)',
          fontSize: '1rem',
          fontWeight: 700
        }}>
          {roundedProgress}%
        </div>
      </div>
    </div>
  );
}
