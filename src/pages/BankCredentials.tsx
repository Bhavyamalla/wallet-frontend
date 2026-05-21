import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import AlertModal from '../components/AlertModal'; // Imports our custom centered overlay component

const BankCredentials = () => {
  // FIX 1: Map your variables to match what your Spring Boot BankDetail entity expects
  const [bankData, setBankData] = useState({ bankName: '', accountNumber: '', ifscCode: '' });
  const navigate = useNavigate();
  const location = useLocation();

  // --- MODAL STATE CONTROL ---
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', isError: false });

  // Safely grab the user's email passed over from Register page background state
  const userEmail = location.state?.email || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Connect to your Spring Boot Backend AuthController endpoint
      // FIX 2: Send the exact JSON key names that matches your backend payload keys
      const response = await api.post('/api/auth/link-bank', {
        email: userEmail,
        bankName: bankData.bankName,
        accountNumber: bankData.accountNumber,
        ifscCode: bankData.ifscCode,
        accountHolderName: "Standard Account Node" // Can use a static fallback or pull name
      });

      // Show the centered SUCCESS modal layout
      setModalConfig({
        title: 'Funding Source Linked!',
        message: response.data.message || 'Bank Account Connected Successfully! Click dismiss to view your dashboard.',
        isError: false
      });
      setModalOpen(true);

    } catch (error: any) {
      // Show the centered ERROR modal layout if verification constraints fail
      setModalConfig({
        title: 'Connection Refused',
        message: error.response?.data?.error || error.response?.data || 'Failed to verify bank format details. Try again.',
        isError: true
      });
      setModalOpen(true);
    }
  };

  // --- MANDATES DISMISS INTERACTION BEFORE ROUTING ---
  const handleModalClose = () => {
    setModalOpen(false);
    
    // Only route forward if the server accepted the format metrics
    if (!modalConfig.isError) {
      navigate('/dashboard');
    }
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Segoe UI, sans-serif' }}>
      
      {/* THE CENTERED OVERLAY LOCKBOX */}
      <AlertModal 
        isOpen={modalOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        isError={modalConfig.isError}
        onClose={handleModalClose}
      />

      <form onSubmit={handleSubmit} style={{ backgroundColor: '#1e293b', padding: '40px', borderRadius: '12px', width: '380px', border: '1px solid #334155', opacity: modalOpen ? 0.3 : 1, transition: 'opacity 0.2s ease' }}>
        <h3 style={{ color: 'white', marginTop: '0', marginBottom: '10px' }}>Link Funding Source</h3>
        <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '25px' }}>Connect traditional banking directly into the wallet.</p>
        
        {userEmail && (
          <p style={{ color: '#3b82f6', fontSize: '12px', marginTop: '-15px', marginBottom: '20px' }}>
            Linking details for: <strong>{userEmail}</strong>
          </p>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: '#94a3b8', fontSize: '14px', display: 'block', marginBottom: '5px' }}> Bank Name</label>
          <input type="text" placeholder="e.g. HDFC, SBI, ICICI" required style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', boxSizing: 'border-box' }} onChange={(e) => setBankData({...bankData, bankName: e.target.value})} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: '#94a3b8', fontSize: '14px', display: 'block', marginBottom: '5px' }}> Account Number</label>
          <input type="text" placeholder="Enter bank account digits" required style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', boxSizing: 'border-box' }} onChange={(e) => setBankData({...bankData, accountNumber: e.target.value})} />
        </div>

        {/* FIX 3: Change the label and placeholder to collect IFSC Code instead of PIN to map to DB */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ color: '#94a3b8', fontSize: '14px', display: 'block', marginBottom: '5px' }}>IFSC Code</label>
          <input type="text" placeholder="e.g. SBIN0001234" maxLength={11} required style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', boxSizing: 'border-box' }} onChange={(e) => setBankData({...bankData, ifscCode: e.target.value})} />
        </div>

        <button type="submit" disabled={modalOpen} style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          Verify & Link
        </button>
      </form>
    </div>
  );
};

export default BankCredentials;