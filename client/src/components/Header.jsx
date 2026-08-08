import React from 'react';
import { Sun, Moon, Github, Star, Users } from 'lucide-react';
import { PeerSmashAppIcon } from './PeerSmashIcon';
import { AnimatedNumber } from './AnimatedNumber';

export function Header({
  activeTab = 'home',
  onNavigate,
  theme = 'dark',
  onToggleTheme,
  stats
}) {
  const isDark = theme === 'dark';
  const connectedPeers = stats?.connectedPeers ?? 1;

  return (
    <div style={{
      width: '100%',
      maxWidth: '840px',
      margin: '0.75rem auto 0 auto',
      padding: '0 0.75rem',
      position: 'sticky',
      top: '0.75rem',
      zIndex: 100
    }}>
      <header style={{
        width: '100%',
        padding: '0.45rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-nav)',
        borderRadius: '11px',
        boxShadow: isDark ? '0 5px 18px rgba(0,0,0,0.32)' : '0 2px 10px rgba(0,0,0,0.05)',
        backdropFilter: 'blur(12px)',
        transition: 'var(--transition-fast)'
      }}>
        {/* Far Left: Logo & App Name */}
        <div 
          onClick={() => onNavigate('home')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0,
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <PeerSmashAppIcon width={56} style={{ marginRight: '-14px' }} />
          <span style={{
            fontFamily: "'Space Grotesk', -apple-system, sans-serif",
            fontSize: '1.12rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            letterSpacing: '-0.02em'
          }}>
            Peer<span style={{ color: 'var(--brand-mint)' }}>Smash</span>
          </span>
        </div>

        {/* Center: Nav Links (Home, How it works, About) */}
        <nav className="header-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
          <button
            onClick={() => onNavigate('home')}
            className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
            style={{ fontSize: '0.85rem', padding: '0.3rem 0.65rem' }}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('how-it-works')}
            className={`nav-link ${activeTab === 'how-it-works' ? 'active' : ''}`}
            style={{ fontSize: '0.85rem', padding: '0.35rem 0.65rem' }}
          >
            How it works
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
            style={{ fontSize: '0.85rem', padding: '0.3rem 0.65rem' }}
          >
            About
          </button>
        </nav>

        {/* Right Side: Online Status Pill + GitHub Star + Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          {/* Live Online Users Badge Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.3rem 0.65rem',
            borderRadius: '8px',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-main)',
            fontSize: '0.78rem',
            fontWeight: 600
          }} title={`${connectedPeers} user(s) currently online`}>
            <div className="pulse-dot green" style={{ width: '6px', height: '6px' }}></div>
            <span><AnimatedNumber value={connectedPeers} /> Online</span>
          </div>

          {/* Total Users Served Pill */}
          <div className="mobile-hide-badge" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.3rem 0.65rem',
            borderRadius: '8px',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-main)',
            fontSize: '0.78rem',
            fontWeight: 600
          }} title={`${stats?.totalConnections ?? 0} total user sessions served`}>
            <Users size={12} color="var(--brand-mint)" />
            <span><AnimatedNumber value={stats?.totalConnections ?? 0} /> Total Users</span>
          </div>

          {/* GitHub Star Badge Link */}
          <a
            href="https://github.com/Rupam797/Beam-Drop"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.65rem',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'var(--transition-fast)'
            }}
            title="Star PeerSmash on GitHub"
          >
            <Github size={14} />
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <Star size={12} color="#F59E0B" fill="#F59E0B" /> Star
            </span>
          </a>

          {/* Light/Dark Mode Toggle Button */}
          <button
            onClick={onToggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              cursor: 'pointer',
              transition: 'var(--transition-fast)'
            }}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun size={14} color="#50E3C2" /> : <Moon size={14} color="#00C896" />}
          </button>
        </div>
      </header>
    </div>
  );
}
