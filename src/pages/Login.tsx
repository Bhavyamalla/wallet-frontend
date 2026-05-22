import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AlertModal from '../components/AlertModal';

const Login = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', isError: false });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        email: credentials.email,
        password: credentials.password,
        role: isAdmin ? 'ROLE_ADMIN' : 'ROLE_USER',
      };
      const response = await api.post('/api/auth/login', payload);

      const userPayload = {
        email: response.data.email,
        role: response.data.role,
        name: response.data.name,
      };

      localStorage.removeItem('user');
      sessionStorage.removeItem('user');

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(userPayload));

      setModalConfig({
        title: 'Welcome Back!',
        message: `Authenticated as ${response.data.name}. Click Acknowledge to enter your dashboard.`,
        isError: false,
      });
      setModalOpen(true);
    } catch (error: any) {
      setModalConfig({
        title: 'Authentication Failed',
        message: error.response?.data || 'Invalid email or password.',
        isError: true,
      });
      setModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    if (!modalConfig.isError) navigate('/dashboard');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '13px 16px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    color: 'white',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: "'Segoe UI', sans-serif",
  };

  const labelStyle: React.CSSProperties = {
    color: '#64748b',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '8px',
  };

  return (
    <div style={{
      backgroundColor: '#020817',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Background grid */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      {/* Ambient glow */}
      <div style={{
        position: 'fixed', top: '-20%', left: '-20%',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '-20%', right: '-20%',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <AlertModal
        isOpen={modalOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        isError={modalConfig.isError}
        onClose={handleModalClose}
      />

      <div style={{
        position: 'relative', zIndex: 1,
        width: '420px',
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        padding: '40px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        opacity: modalOpen ? 0.2 : 1,
        transition: 'opacity 0.2s ease',
      }}>

        {/* Logo + Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(6,182,212,0.2))',
            border: '1px solid rgba(59,130,246,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 24px rgba(59,130,246,0.15)',
          }}>
            <svg width="28" height="28" viewBox="0 0 30 30" fill="none">
              <path d="M15 2L3 8v8c0 6 4.8 11.6 12 13 7.2-1.4 12-7 12-13V8L15 2z"
                fill="url(#lg)" />
              <path d="M10 15l4 4 7-7" stroke="white" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="lg" x1="3" y1="2" x2="27" y2="28">
                  <stop stopColor="#3b82f6" />
                  <stop offset="1" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h2 style={{ color: 'white', margin: '0 0 6px', fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            BioShield Portal
          </h2>
          <p style={{ color: '#475569', fontSize: '13px', margin: 0 }}>
            Secure access to your wallet
          </p>
        </div>

        {/* User / Admin Toggle */}
        <div style={{
          display: 'flex',
          backgroundColor: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
          padding: '4px', borderRadius: '12px',
          marginBottom: '28px',
        }}>
          <button type="button" onClick={() => setIsAdmin(false)} style={{
            flex: 1, padding: '10px', border: 'none', borderRadius: '9px',
            fontWeight: '700', fontSize: '13px', cursor: 'pointer',
            transition: 'all 0.2s',
            backgroundColor: !isAdmin ? '#3b82f6' : 'transparent',
            color: !isAdmin ? 'white' : '#475569',
            boxShadow: !isAdmin ? '0 0 16px rgba(59,130,246,0.4)' : 'none',
          }}>
            User
          </button>
          <button type="button" onClick={() => setIsAdmin(true)} style={{
            flex: 1, padding: '10px', border: 'none', borderRadius: '9px',
            fontWeight: '700', fontSize: '13px', cursor: 'pointer',
            transition: 'all 0.2s',
            backgroundColor: isAdmin ? '#ef4444' : 'transparent',
            color: isAdmin ? 'white' : '#475569',
            boxShadow: isAdmin ? '0 0 16px rgba(239,68,68,0.4)' : 'none',
          }}>
            Admin
          </button>
        </div>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email" required
              placeholder="name@domain.com"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'rgba(59,130,246,0.5)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              onChange={e => setCredentials({ ...credentials, email: e.target.value })}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                style={{ ...inputStyle, paddingRight: '48px' }}
                onFocus={e => (e.target.style.borderColor = 'rgba(59,130,246,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                onChange={e => setCredentials({ ...credentials, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '14px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  color: '#475569', cursor: 'pointer',
                  padding: 0, fontSize: '16px', lineHeight: 1,
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
            <div
              onClick={() => setRememberMe(!rememberMe)}
              style={{
                width: '18px', height: '18px', borderRadius: '5px',
                border: `2px solid ${rememberMe ? '#3b82f6' : 'rgba(255,255,255,0.15)'}`,
                backgroundColor: rememberMe ? '#3b82f6' : 'transparent',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s', flexShrink: 0,
              }}
            >
              {rememberMe && <span style={{ color: 'white', fontSize: '11px', fontWeight: 'bold' }}>✓</span>}
            </div>
            <span
              onClick={() => setRememberMe(!rememberMe)}
              style={{ color: '#64748b', fontSize: '13px', cursor: 'pointer', userSelect: 'none' }}
            >
              Remember me on this device
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={modalOpen}
            style={{
              width: '100%', padding: '14px',
              borderRadius: '12px', border: 'none',
              background: isAdmin
                ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                : 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: modalOpen ? 'not-allowed' : 'pointer',
              boxShadow: isAdmin
                ? '0 0 24px rgba(239,68,68,0.3)'
                : '0 0 24px rgba(59,130,246,0.3)',
              transition: 'box-shadow 0.2s, transform 0.2s',
              marginBottom: '20px',
            }}
            onMouseOver={e => {
              if (!modalOpen) {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = isAdmin
                  ? '0 0 40px rgba(239,68,68,0.5)'
                  : '0 0 40px rgba(59,130,246,0.5)';
              }
            }}
            onMouseOut={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = isAdmin
                ? '0 0 24px rgba(239,68,68,0.3)'
                : '0 0 24px rgba(59,130,246,0.3)';
            }}
          >
            {isAdmin ? '🔴 Admin Login' : '🔵 Secure Login'}
          </button>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px',
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }} />
            <span style={{ color: '#334155', fontSize: '12px' }}>or</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }} />
          </div>

          <p style={{ textAlign: 'center', color: '#475569', fontSize: '13px', margin: 0 }}>
            Don't have an account?{' '}
            <span
              onClick={() => !modalOpen && navigate('/register')}
              style={{
                color: '#3b82f6', cursor: 'pointer',
                fontWeight: '600', textDecoration: 'none',
                borderBottom: '1px solid rgba(59,130,246,0.4)',
                paddingBottom: '1px',
              }}
            >
              Register Here
            </span>
          </p>
        </form>
      </div>

      <style>{`
        input::placeholder { color: #334155; }
        input:focus { outline: none; }
      `}</style>
    </div>
  );
};

export default Login;