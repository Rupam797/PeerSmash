import React, { useState, useRef } from 'react';
import { UploadCloud, FilePlus, ShieldCheck, Zap, Lock } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { FileQueue } from './FileQueue';

export function FileTransfer({
  dataChannelStatus,
  connectionStatus,
  queue,
  currentSendingFile,
  receivingFile,
  completedFiles,
  onAddFiles,
  onCancelFile,
  onClearQueue
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const isConnected = dataChannelStatus === 'open';

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isConnected) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!isConnected) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onAddFiles(e.dataTransfer.files);
    }
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
      maxWidth: '750px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.5rem'
    }}>
      {/* File Drop Zone Card */}
      <div
        className={`glass-card ${isDragging ? 'glow-border' : ''}`}
        style={{
          width: '100%',
          padding: '3rem 2rem',
          borderRadius: '24px',
          border: isDragging
            ? '2px dashed #2A7FFF'
            : isConnected
            ? '2px dashed rgba(42, 127, 255, 0.35)'
            : '2px dashed rgba(255, 255, 255, 0.1)',
          background: isDragging
            ? 'rgba(42, 127, 255, 0.12)'
            : 'rgba(17, 24, 39, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.2rem',
          textAlign: 'center',
          cursor: isConnected ? 'pointer' : 'not-allowed',
          transition: 'all 0.25s ease'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => isConnected && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          multiple
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={!isConnected}
        />

        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          background: isConnected
            ? 'linear-gradient(135deg, rgba(42, 127, 255, 0.2) 0%, rgba(0, 229, 255, 0.2) 100%)'
            : 'rgba(255, 255, 255, 0.05)',
          border: `1px solid ${isConnected ? 'rgba(42, 127, 255, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isConnected ? '0 0 25px rgba(42, 127, 255, 0.25)' : 'none',
          transform: isDragging ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.2s ease'
        }}>
          <UploadCloud size={32} color={isConnected ? '#00E5FF' : '#64748B'} />
        </div>

        <div>
          <h3 style={{
            fontSize: '1.3rem',
            fontWeight: 700,
            color: isConnected ? '#F8FAFC' : '#94A3B8',
            marginBottom: '0.4rem'
          }}>
            {isConnected ? 'Drag & Drop Files Here' : 'Waiting for WebRTC DataChannel...'}
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#64748B' }}>
            {isConnected
              ? 'or click to browse from your device (Multiple files supported)'
              : 'Files will transfer directly to recipient once peer connects'}
          </p>
        </div>

        {isConnected && (
          <button
            type="button"
            className="btn-primary"
            style={{ padding: '0.7rem 1.4rem', fontSize: '0.9rem' }}
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            <FilePlus size={18} />
            <span>Select Files</span>
          </button>
        )}
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
    </div>
  );
}
