import React from 'react';

interface AlertModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  isError?: boolean;
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, title, message, isError = false, onClose }) => {
  if (!isOpen) return null; // If it's not open, show absolutely nothing

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(15, 23, 42, 0.85)', // Darkens and blurs the background screen
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999 // Makes sure it sits on top of everything else
    }}>
      <div style={{
        backgroundColor: '#1e293b',
        width: '400px',
        padding: '30px',
        borderRadius: '12px',
        border: `2px solid ${isError ? '#ef4444' : '#10b981'}`, // Red border for errors, Green for success
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        textAlign: 'center'
      }}>
        {/* Big visual Checkmark or X Circle */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: isError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          {isError ? (
            <span style={{ color: '#ef4444', fontSize: '28px', fontWeight: 'bold' }}>✕</span>
          ) : (
            <span style={{ color: '#10b981', fontSize: '28px', fontWeight: 'bold' }}>✓</span>
          )}
        </div>
        
        <h3 style={{ color: 'white', fontSize: '20px', margin: '0 0 10px', fontWeight: 'bold' }}>{title}</h3>
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 24px', lineHeight: '1.5' }}>{message}</p>
        
        <button 
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: isError ? '#ef4444' : '#10b981',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '15px',
            cursor: 'pointer'
          }}
        >
          Acknowledge & Dismiss
        </button>
      </div>
    </div>
  );
};

export default AlertModal;