import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, RefreshCw } from 'lucide-react';

const Logout = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // SECURE MATRIX WIPE: Clear all session/local credentials cleanly
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');

    // Chrono ticking redirect gate
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Segoe UI, sans-serif', color: 'white' }}>
      <div style={{
        backgroundColor: '#1e293b',
        width: '420px',
        padding: '40px',
        borderRadius: '16px',
        border: '1px solid #334155',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        textAlign: 'center'
      }}>
        
        {/* Terminated Security Icon wrapper */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          border: '2px solid rgba(239, 68, 68, 0.2)'
        }}>
          <ShieldAlert size={36} style={{ color: '#ef4444' }} />
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 10px', color: '#f8fafc' }}>
          Terminal Closed Securely
        </h2>
        
        <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', margin: '0 0 30px' }}>
          Your active session token credentials have been completely wiped from the local browser storage buffer. All secure data channels are disconnected.
        </p>

        {/* Dynamic countdown indicator */}
        <div style={{
          backgroundColor: '#0f172a',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #1e293b',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          color: '#3b82f6',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          <RefreshCw size={16} className="animate-spin" />
          <span>Routing to Login Gateway in {countdown}s...</span>
        </div>

        <button
          onClick={() => navigate('/login')}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#3b82f6',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '15px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#3b82f6')}
        >
          Return to Portal Instantly
        </button>
      </div>
    </div>
  );
};

export default Logout;
