import React, { useState, useRef } from 'react';
import {
  Copy,
  Check,
  Send,
  Trash2,
  Download,
  Clipboard,
  FileText,
  Code,
  Sparkles,
  Info
} from 'lucide-react';

export function SharedTextNotes({
  sharedTexts = [],
  onSendText,
  onDeleteText,
  currentSocketId,
  isConnected
}) {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [fontMode, setFontMode] = useState('sans'); // 'sans' | 'mono'
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendText(inputText);
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputText((prev) => (prev ? `${prev}\n\n${text}` : text));
      }
    } catch (err) {
      console.warn('Clipboard read error or not permitted:', err);
      // Focus textarea so user can Ctrl+V easily
      textareaRef.current?.focus();
    }
  };

  const copyToClipboard = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 2000);
  };

  const downloadAsTxt = (item) => {
    try {
      const blob = new Blob([item.text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const cleanDate = new Date().toISOString().slice(0, 10);
      a.download = `PeerSmash-Note-${cleanDate}-${item.id.slice(-4)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download text note:', err);
    }
  };

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', width: '100%' }}>
      {/* Composer Card */}
      <div
        className="glass-card mobile-card-padding"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '1.6rem 1.8rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.9rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} color="var(--brand-mint)" />
              <span>Shared Text & Question Clipboard</span>
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
              Paste questions, WhatsApp messages, code, or notes to read & copy with peers
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setFontMode((prev) => (prev === 'sans' ? 'mono' : 'sans'))}
              title={`Switch font to ${fontMode === 'sans' ? 'Monospace' : 'Sans-Serif'}`}
              style={{
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                color: fontMode === 'mono' ? 'var(--brand-mint)' : 'var(--text-muted)',
                borderRadius: '8px',
                padding: '0.4rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              <Code size={14} />
              <span>{fontMode === 'mono' ? 'Mono' : 'Sans'}</span>
            </button>

            <button
              type="button"
              onClick={handlePasteFromClipboard}
              title="Paste directly from your device clipboard"
              style={{
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                borderRadius: '8px',
                padding: '0.45rem 0.85rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
              onMouseOver={(e) => (e.currentTarget.style.borderColor = 'var(--brand-mint)')}
              onMouseOut={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
            >
              <Clipboard size={14} color="var(--brand-mint)" />
              <span>Paste Clipboard</span>
            </button>
          </div>
        </div>

        {/* Text Area */}
        <div style={{ position: 'relative' }}>
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              // Auto grow height up to 300px
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 280)}px`;
            }}
            onKeyDown={handleKeyDown}
            placeholder="Paste your professor's questions, WhatsApp text, assignment notes, or code here... (Ctrl + Enter to send)"
            style={{
              width: '100%',
              minHeight: '120px',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1rem 1.1rem',
              color: 'var(--text-main)',
              fontSize: fontMode === 'mono' ? '0.88rem' : '0.95rem',
              fontFamily: fontMode === 'mono' ? 'var(--font-mono)' : 'var(--font-sans)',
              lineHeight: 1.6,
              resize: 'vertical',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--brand-mint)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
          />
        </div>

        {/* Footer of Composer: Word count & Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            <span>
              {wordCount} {wordCount === 1 ? 'word' : 'words'} • {charCount} chars
            </span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              Press <kbd style={{ padding: '0.1rem 0.35rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '4px', fontSize: '0.72rem' }}>Ctrl</kbd> + <kbd style={{ padding: '0.1rem 0.35rem', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '4px', fontSize: '0.72rem' }}>Enter</kbd> to send
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {inputText.trim().length > 0 && (
              <button
                type="button"
                onClick={() => setInputText('')}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.82rem',
                  padding: '0.5rem 0.8rem',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = '#EF4444')}
                onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                Clear
              </button>
            )}

            <button
              type="button"
              onClick={handleSend}
              disabled={!inputText.trim()}
              style={{
                backgroundColor: inputText.trim() ? 'var(--brand-mint)' : 'var(--bg-input)',
                color: inputText.trim() ? '#0B0C0E' : 'var(--text-dim)',
                fontWeight: 700,
                fontSize: '0.92rem',
                padding: '0.65rem 1.3rem',
                borderRadius: '10px',
                border: 'none',
                cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'var(--transition-fast)'
              }}
            >
              <Send size={15} />
              <span>Send to Peers</span>
            </button>
          </div>
        </div>
      </div>

      {/* Shared Items Stream / Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.4rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-dim)' }}>
            Shared Items ({sharedTexts.length})
          </span>
          {sharedTexts.length > 0 && (
            <span style={{ fontSize: '0.78rem', color: 'var(--brand-mint)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Sparkles size={13} />
              <span>Real-Time P2P Synced</span>
            </span>
          )}
        </div>

        {sharedTexts.length === 0 ? (
          <div
            className="glass-card"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px dashed var(--border-subtle)',
              borderRadius: '16px',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.6rem'
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-input)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)'
              }}
            >
              <FileText size={22} />
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', margin: '0.2rem 0 0 0' }}>
              No shared questions or notes yet
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '440px', lineHeight: 1.5, margin: 0 }}>
              Paste questions or notes in the box above. Joined peers will immediately see the text, can copy it in 1-click, and can reply with answers.
            </p>
          </div>
        ) : (
          sharedTexts.map((item) => {
            const isMe = item.senderId === currentSocketId || item.senderId === 'me';
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                className="glass-card"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  padding: '1.2rem 1.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.8rem',
                  transition: 'border-color 0.2s ease'
                }}
              >
                {/* Item Top Bar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.22rem 0.65rem',
                        borderRadius: '6px',
                        backgroundColor: isMe ? 'rgba(80, 227, 194, 0.15)' : 'var(--bg-input)',
                        color: isMe ? 'var(--brand-mint)' : 'var(--text-muted)',
                        border: isMe ? '1px solid rgba(80, 227, 194, 0.3)' : '1px solid var(--border-subtle)'
                      }}
                    >
                      {isMe ? 'You' : `Peer · ${item.senderId ? item.senderId.slice(-4) : 'User'}`}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {item.timestamp || 'Just now'}
                    </span>
                  </div>

                  {/* Actions: Copy, Download, Delete */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item.id, item.text)}
                      title="Copy text to clipboard"
                      style={{
                        backgroundColor: isCopied ? 'rgba(80, 227, 194, 0.15)' : 'var(--bg-input)',
                        border: isCopied ? '1px solid var(--brand-mint)' : '1px solid var(--border-subtle)',
                        color: isCopied ? 'var(--brand-mint)' : 'var(--text-main)',
                        borderRadius: '8px',
                        padding: '0.4rem 0.75rem',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)'
                      }}
                    >
                      {isCopied ? <Check size={14} color="var(--brand-mint)" /> : <Copy size={14} />}
                      <span>{isCopied ? 'Copied!' : 'Copy Text'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => downloadAsTxt(item)}
                      title="Save note as .txt file"
                      style={{
                        backgroundColor: 'var(--bg-input)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-muted)',
                        borderRadius: '8px',
                        padding: '0.4rem 0.6rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)'
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.color = 'var(--text-main)')}
                      onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                      <Download size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteText(item.id)}
                      title="Delete this note"
                      style={{
                        backgroundColor: 'var(--bg-input)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-dim)',
                        borderRadius: '8px',
                        padding: '0.4rem 0.6rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)'
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.color = '#EF4444')}
                      onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Text Content */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    padding: '1rem 1.2rem',
                    color: 'var(--text-main)',
                    fontSize: fontMode === 'mono' ? '0.88rem' : '0.94rem',
                    fontFamily: fontMode === 'mono' ? 'var(--font-mono)' : 'var(--font-sans)',
                    lineHeight: 1.65,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    userSelect: 'text',
                    maxHeight: '400px',
                    overflowY: 'auto'
                  }}
                >
                  {item.text}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
