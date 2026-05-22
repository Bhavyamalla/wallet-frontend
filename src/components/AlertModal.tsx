import React from 'react';

interface AlertModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  isError?: boolean;
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, title, message, isError = false, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw', height: '100vh',
      backgroundColor: 'rgba(2,8,23,0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      animation: 'fadeIn 0.15s ease',
    }}>
      <div style={{
        width: '400px',
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: `1px solid ${isError ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
        borderRadius: '20px',
        padding: '36px',
        backdropFilter: 'blur(24px)',
        boxShadow: `0 24px 80px rgba(0,0,0,0.6), 0 0 60px ${isError ? 'rgba(239,68,68,0.06)' : 'rgba(16,185,129,0.06)'}`,
        textAlign: 'center',
        animation: 'slideUp 0.2s ease',
        fontFamily: "'Segoe UI', sans-serif",
      }}>

        {/* Icon circle */}
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          backgroundColor: isError ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
          border: `1px solid ${isError ? 'rgba(239,68,68,0.25)' : 'rgba(16,185,129,0.25)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: isError ? '0 0 24px rgba(239,68,68,0.1)' : '0 0 24px rgba(16,185,129,0.1)',
        }}>
          <span style={{ fontSize: '28px', fontWeight: 'bold', color: isError ? '#ef4444' : '#10b981' }}>
            {isError ? '✕' : '✓'}
          </span>
        </div>

        <h3 style={{
          color: 'white', fontSize: '20px', fontWeight: '800',
          margin: '0 0 10px', letterSpacing: '-0.3px',
        }}>
          {title}
        </h3>

        <p style={{
          color: '#64748b', fontSize: '14px',
          margin: '0 0 28px', lineHeight: '1.6',
        }}>
          {message}
        </p>

        <button onClick={onClose} style={{
          width: '100%', padding: '13px',
          borderRadius: '12px', border: 'none',
          background: isError
            ? 'linear-gradient(135deg, #ef4444, #dc2626)'
            : 'linear-gradient(135deg, #10b981, #06b6d4)',
          color: 'white', fontWeight: '700', fontSize: '14px',
          cursor: 'pointer',
          boxShadow: isError
            ? '0 0 24px rgba(239,68,68,0.3)'
            : '0 0 24px rgba(16,185,129,0.3)',
          transition: 'box-shadow 0.2s, transform 0.2s',
          letterSpacing: '0.3px',
        }}
          onMouseOver={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)';
          }}
          onMouseOut={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
          }}
        >
          Acknowledge & Dismiss
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default AlertModal;