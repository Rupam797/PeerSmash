import React from 'react';

/**
 * PeerSmash Official Logo Icon Component
 * Rendered from the official 4-peer vector mark.
 */
export function PeerSmashIcon({ 
  size = 32, 
  variant = 'gradient', // 'gradient' | 'white' | 'dark' | 'monochrome'
  className = '',
  style = {}
}) {
  const gradientId = React.useId();

  let figureFill = `url(#${gradientId})`;

  if (variant === 'white') {
    figureFill = '#FFFFFF';
  } else if (variant === 'dark') {
    figureFill = '#061219';
  } else if (variant === 'monochrome') {
    figureFill = '#00C896';
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block', flexShrink: 0, ...style }}
    >
      {variant === 'gradient' && (
        <defs>
          <linearGradient id={gradientId} x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2DD4BF" />
            <stop offset="50%" stopColor="#00C896" />
            <stop offset="100%" stopColor="#00897B" />
          </linearGradient>
        </defs>
      )}

      {/* 4 Interconnected Peer Figures (Rotated 4-way around center 50,50) */}
      {[0, 90, 180, 270].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 50 50)`}>
          {/* Head Node */}
          <circle cx="26" cy="26" r="9.5" fill={figureFill} />
          
          {/* L-Shaped Peer Body */}
          <path
            d="M 40.5 35.5 C 44 35.5 48.5 35.5 48.5 35.5 C 48.5 35.5 48.5 44 48.5 46.5 C 48.5 48.2 47.1 49.5 45.4 49.5 L 43.5 49.5 C 38.5 49.5 35.5 46.5 35.5 41.5 L 35.5 39.5 C 35.5 37.3 37.8 35.5 40.5 35.5 Z"
            fill={figureFill}
          />
        </g>
      ))}
    </svg>
  );
}

/**
 * App Icon Card / Badge wrapper (Teal background with white PeerSmash icon as seen in phone app icon)
 */
export function PeerSmashAppIcon({ size = 44, borderRadius = 14, badgeNumber = null }) {
  return (
    <div style={{
      position: 'relative',
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: `${borderRadius}px`,
      background: 'linear-gradient(135deg, #00E6A5 0%, #00C896 50%, #00897B 100%)',
      boxShadow: '0 6px 20px rgba(0, 200, 150, 0.35)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }}>
      <PeerSmashIcon size={size * 0.62} variant="white" />
      
      {badgeNumber !== null && (
        <div style={{
          position: 'absolute',
          top: '-5px',
          right: '-5px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: '#FFFFFF',
          color: '#061219',
          fontSize: '0.75rem',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
        }}>
          {badgeNumber}
        </div>
      )}
    </div>
  );
}
