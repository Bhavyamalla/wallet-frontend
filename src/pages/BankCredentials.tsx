import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import AlertModal from '../components/AlertModal';

const BankCredentials = () => {
  const [bankData, setBankData] = useState({ bankName: '', accountNumber: '', ifscCode: '' });
  const navigate = useNavigate();
  const location = useLocation();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', isError: false });

  const userEmail = location.state?.email || '';

  // If someone navigates here directly without going through Register, send them back
  useEffect(() => {
    if (!userEmail) {
      navigate('/register');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic IFSC format check — must be 11 characters
    if (bankData.ifscCode.length !== 11) {
      setModalConfig({
        title: 'Invalid IFSC',
        message: 'IFSC code must be exactly 11 characters. Example: SBIN0001234',
        isError: true,
      });
      setModalOpen(true);
      return;
    }

    // Basic account number check — must be at least 9 digits
    if (bankData.accountNumber.length < 9) {
      setModalConfig({
        title: 'Invalid Account Number',
        message: 'Account number must be at least 9 digits.',
        isError: true,
      });
      setModalOpen(true);
      return;
    }

    try {
      const response = await api.post('/api/auth/link-bank', {
        email: userEmail,
        bankName: bankData.bankName,
        accountNumber: bankData.accountNumber,
        ifscCode: bankData.ifscCode.toUpperCase(),
        accountHolderName: 'Standard Account Node',
      });
      setModalConfig({
        title: 'Bank Account Linked!',
        message: response.data.message || 'Bank linked successfully! Click dismiss to go to your dashboard.',
        isError: false,
      });
      setModalOpen(true);
    } catch (error: any) {
      setModalConfig({
        title: 'Link Failed',
        message: error.response?.data?.error || error.response?.data || 'Failed to link bank. Try again.',
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
        backgroundSize: '60px 60px', pointerEvents: 'none',
      }} />

      {/* Ambient glow */}
      <div style={{
        position: 'fixed', top: '-20%', left: '-20%',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
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

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.2))',
            border: '1px solid rgba(16,185,129,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 24px rgba(16,185,129,0.15)',
            fontSize: '26px',
          }}>
            🏦
          </div>
          <h2 style={{ color: 'white', margin: '0 0 6px', fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Link Bank Account
          </h2>
          <p style={{ color: '#475569', fontSize: '13px', margin: 0 }}>
            Connect your bank to activate your wallet
          </p>
        </div>

        {/* Email badge */}
        {userEmail && (
          <div style={{
            backgroundColor: 'rgba(59,130,246,0.08)',
            border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: '10px',
            padding: '10px 14px',
            marginBottom: '24px',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <span style={{ color: '#60a5fa', fontSize: '14px' }}>📧</span>
            <span style={{ color: '#60a5fa', fontSize: '13px' }}>
              Linking for: <strong>{userEmail}</strong>
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Bank Name */}
          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Bank Name</label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              placeholder="e.g. HDFC, SBI, ICICI"
              required
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'rgba(16,185,129,0.5)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              onChange={e => setBankData({ ...bankData, bankName: e.target.value })}
            />
          </div>

          {/* Account Number */}
          <div style={{ marginBottom: '18px' }}>
            <label style={labelStyle}>Account Number</label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              placeholder="Enter your bank account number"
              required
              inputMode="numeric"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'rgba(16,185,129,0.5)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              onChange={e => setBankData({ ...bankData, accountNumber: e.target.value })}
            />
          </div>

          {/* IFSC Code */}
          <div style={{ marginBottom: '28px' }}>
            <label style={labelStyle}>IFSC Code</label>
            <input
              type="text"
              id="ifscCode"
              name="ifscCode"
              placeholder="e.g. SBIN0001234"
              maxLength={11}
              required
              style={{ ...inputStyle, textTransform: 'uppercase' }}
              onFocus={e => (e.target.style.borderColor = 'rgba(16,185,129,0.5)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              onChange={e => setBankData({ ...bankData, ifscCode: e.target.value.toUpperCase() })}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={modalOpen}
            style={{
              width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: modalOpen ? 'not-allowed' : 'pointer',
              boxShadow: '0 0 24px rgba(16,185,129,0.3)',
              transition: 'box-shadow 0.2s, transform 0.2s',
            }}
            onMouseOver={e => {
              if (!modalOpen) {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 40px rgba(16,185,129,0.5)';
              }
            }}
            onMouseOut={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 24px rgba(16,185,129,0.3)';
            }}
          >
            Verify & Link Account
          </button>

        </form>
      </div>

      <style>{`
        input::placeholder { color: #334155; }
        input:focus { outline: none; }
      `}</style>
    </div>
  );
};

export default BankCredentials;