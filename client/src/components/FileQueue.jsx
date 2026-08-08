import React from 'react';
import { File, Download, CheckCircle, Clock, X, Trash2, FileText, Image, Video, Music, Archive } from 'lucide-react';
import { formatBytes } from '../utils/formatters';

function getFileIcon(mimeType = '') {
  if (mimeType.startsWith('image/')) return <Image size={18} color="#2DD4BF" />;
  if (mimeType.startsWith('video/')) return <Video size={18} color="#00C896" />;
  if (mimeType.startsWith('audio/')) return <Music size={18} color="#F59E0B" />;
  if (mimeType.includes('zip') || mimeType.includes('tar') || mimeType.includes('compressed')) return <Archive size={18} color="#EC4899" />;
  if (mimeType.includes('pdf') || mimeType.includes('text') || mimeType.includes('document')) return <FileText size={18} color="#00C896" />;
  return <File size={18} color="#9DB2C6" />;
}

export function FileQueue({ queue = [], completedFiles = [], onCancelFile, onClearQueue }) {
  const hasQueue = queue.length > 0;
  const hasCompleted = completedFiles.length > 0;

  if (!hasQueue && !hasCompleted) return null;

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
      {/* Pending / Active Queue Section */}
      {hasQueue && (
        <div className="glass-card" style={{ padding: '1.4rem', borderRadius: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>
              Transfer Queue ({queue.length})
            </h4>
            <button
              onClick={onClearQueue}
              className="btn-secondary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              <Trash2 size={14} /> Clear Queue
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {queue.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.8rem 1rem',
                  borderRadius: '12px',
                  background: 'rgba(6, 18, 25, 0.6)',
                  border: '1px solid rgba(0, 200, 150, 0.12)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', overflow: 'hidden' }}>
                  {getFileIcon(item.mimeType)}
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: '#FFFFFF',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9DB2C6' }}>
                      {formatBytes(item.size)}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  {item.status === 'completed' && (
                    <span style={{ color: '#00C896', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <CheckCircle size={15} /> Sent
                    </span>
                  )}
                  {item.status === 'pending' && (
                    <span style={{ color: '#F59E0B', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={14} /> Queued
                    </span>
                  )}
                  {item.status === 'sending' && (
                    <span style={{ color: '#00C896', fontSize: '0.8rem', fontWeight: 700 }}>
                      {item.progress ? item.progress.toFixed(0) : 0}%
                    </span>
                  )}

                  {onCancelFile && item.status !== 'completed' && (
                    <button
                      onClick={() => onCancelFile(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#9DB2C6',
                        cursor: 'pointer',
                        padding: '0.2rem'
                      }}
                      title="Remove file"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Received Downloads History Section */}
      {hasCompleted && (
        <div className="glass-card glow-border" style={{ padding: '1.4rem', borderRadius: '20px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1rem' }}>
            Received Files ({completedFiles.length})
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {completedFiles.map((file) => (
              <div
                key={file.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.8rem 1rem',
                  borderRadius: '12px',
                  background: 'rgba(0, 200, 150, 0.08)',
                  border: '1px solid rgba(0, 200, 150, 0.25)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', overflow: 'hidden' }}>
                  {getFileIcon(file.mimeType)}
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: '#FFFFFF',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {file.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#00C896', fontWeight: 600 }}>
                      {formatBytes(file.size)} • Download Ready
                    </div>
                  </div>
                </div>

                <a
                  href={file.url}
                  download={file.name}
                  className="btn-primary"
                  style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem' }}
                >
                  <Download size={14} /> Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
