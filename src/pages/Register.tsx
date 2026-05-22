import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import AlertModal from '../components/AlertModal';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phoneNumber: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', isError: false });

  const handleRegister = async (event: any) => {
    event.preventDefault();

    if (formData.password.length < 6) {
      setModalConfig({ title: 'Validation Error', message: 'Password must be at least 6 characters.', isError: true });
      setModalOpen(true);
      return;
    }
    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      setModalConfig({ title: 'Validation Error', message: 'Phone number must be exactly 10 digits.', isError: true });
      setModalOpen(true);
      return;
    }

    try {
      const response = await api.post('/api/auth/register', formData);
      setModalConfig({
        title: 'Account Created!',
        message: response.data.message || 'Account created successfully! Click dismiss to link your bank details.',
        isError: false,
      });
      setModalOpen(true);
    } catch (error: any) {
      setModalConfig({
        title: 'Registration Failed',
        message: error.response?.data || 'Registration failed. Try again.',
        isError: true,
      });
      setModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    if (!modalConfig.isError) navigate('/bank-credentials', { state: { email: formData.email } });
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

      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', top: '-20%', right: '-20%',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '-20%', left: '-20%',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
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
                fill="url(#rg)" />
              <path d="M10 15l4 4 7-7" stroke="white" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="rg" x1="3" y1="2" x2="27" y2="28">
                  <stop stopColor="#3b82f6" />
                  <stop offset="1" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h2 style={{ color: 'white', margin: '0 0 6px', fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Create Account
          </h2>
          <p style={{ color: '#475569', fontSize: '13px', margin: 0 }}>
            Join BioShield — your secure wallet
          </p>
        </div>

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Full Name</label>
            <input type="text" required placeholder="Your full name" style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'rgba(59,130,246,0.5)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Email</label>
            <input type="email" required placeholder="name@gmail.com" style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'rgba(59,130,246,0.5)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Phone Number</label>
            <input type="text" required placeholder="10 digit mobile number" maxLength={10} style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'rgba(59,130,246,0.5)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required placeholder="Min 6 characters"
                style={{ ...inputStyle, paddingRight: '48px' }}
                onFocus={e => (e.target.style.borderColor = 'rgba(59,130,246,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                position: 'absolute', right: '14px', top: '50%',
                transform: 'translateY(-50%)',
                background: 'none', border: 'none',
                color: '#475569', cursor: 'pointer', padding: 0, fontSize: '16px',
              }}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={modalOpen} style={{
            width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            color: 'white', fontWeight: '700', fontSize: '15px',
            cursor: modalOpen ? 'not-allowed' : 'pointer',
            boxShadow: '0 0 24px rgba(59,130,246,0.3)',
            transition: 'box-shadow 0.2s, transform 0.2s',
            marginBottom: '20px',
          }}
            onMouseOver={e => {
              if (!modalOpen) {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 40px rgba(59,130,246,0.5)';
              }
            }}
            onMouseOut={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 24px rgba(59,130,246,0.3)';
            }}
          >
            Create Secure Account
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }} />
            <span style={{ color: '#334155', fontSize: '12px' }}>or</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }} />
          </div>

          <p style={{ textAlign: 'center', color: '#475569', fontSize: '13px', margin: 0 }}>
            Already have an account?{' '}
            <span onClick={() => !modalOpen && navigate('/login')} style={{
              color: '#3b82f6', cursor: 'pointer', fontWeight: '600',
              borderBottom: '1px solid rgba(59,130,246,0.4)', paddingBottom: '1px',
            }}>
              Login Here
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

export default Register;