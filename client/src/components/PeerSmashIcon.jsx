import React from 'react';

/**
 * PeerSmash Logo Component - Renders /peersmash.png in its actual natural proportions
 */
export function PeerSmashIcon({ 
  size = 40,
  width,
  height,
  className = '',
  style = {}
}) {
  return (
    <img
      src="/peersmash.png"
      alt="PeerSmash Logo"
      style={{
        width: width ? (typeof width === 'number' ? `${width}px` : width) : (size ? `${size}px` : 'auto'),
        height: height ? (typeof height === 'number' ? `${height}px` : height) : (size ? `${size}px` : 'auto'),
        objectFit: 'contain',
        display: 'block',
        flexShrink: 0,
        ...style
      }}
      className={className}
    />
  );
}

/**
 * Main App Icon / Logo Component - Displaying actual size / uncropped brand image
 */
export function PeerSmashAppIcon({ 
  size,
  width = 52,
  height,
  borderRadius,
  className = '',
  style = {}
}) {
  const iconSize = size || width;

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      ...style
    }} className={className}>
      <img
        src="/peersmash.png"
        alt="PeerSmash Icon"
        style={{
          width: typeof iconSize === 'number' ? `${iconSize}px` : iconSize,
          height: height ? (typeof height === 'number' ? `${height}px` : height) : 'auto',
          objectFit: 'contain',
          display: 'block',
          borderRadius: borderRadius ? `${borderRadius}px` : 'undefined'
        }}
      />
    </div>
  );
}
