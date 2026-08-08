import React, { useState, useRef } from 'react';
import { UploadCloud, FilePlus } from 'lucide-react';
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
          padding: '3.2rem 2rem',
          borderRadius: '24px',
          border: isDragging
            ? '2px dashed #00C896'
            : isConnected
            ? '2px dashed rgba(0, 200, 150, 0.4)'
            : '2px dashed rgba(255, 255, 255, 0.1)',
          background: isDragging
            ? 'rgba(0, 200, 150, 0.14)'
            : 'rgba(11, 25, 34, 0.75)',
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
          width: '68px',
          height: '68px',
          borderRadius: '22px',
          background: isConnected
            ? 'linear-gradient(135deg, rgba(0, 230, 165, 0.25) 0%, rgba(0, 200, 150, 0.15) 100%)'
            : 'rgba(255, 255, 255, 0.05)',
          border: `1px solid ${isConnected ? 'rgba(0, 200, 150, 0.45)' : 'rgba(255, 255, 255, 0.1)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isConnected ? '0 0 30px rgba(0, 200, 150, 0.3)' : 'none',
          transform: isDragging ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.2s ease'
        }}>
          <UploadCloud size={34} color={isConnected ? '#00C896' : '#63788D'} />
        </div>

        <div>
          <h3 style={{
            fontSize: '1.35rem',
            fontWeight: 800,
            color: isConnected ? '#FFFFFF' : '#9DB2C6',
            marginBottom: '0.4rem'
          }}>
            {isConnected ? 'Drag & Drop Files Here' : 'Waiting for WebRTC Link...'}
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#9DB2C6' }}>
            {isConnected
              ? 'or click to select files from your device (Multiple files supported)'
              : 'Files will stream directly to recipient once peer joins room'}
          </p>
        </div>

        {isConnected && (
          <button
            type="button"
            className="btn-primary"
            style={{ padding: '0.75rem 1.6rem', fontSize: '0.92rem' }}
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
