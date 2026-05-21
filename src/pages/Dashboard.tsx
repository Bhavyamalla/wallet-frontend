import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AlertModal from '../components/AlertModal';
import { ShieldCheck, ArrowRightLeft, History, LogOut, User } from 'lucide-react';

interface Transaction {
  id: number;
  senderEmail: string;
  receiverAccountNumber: string; // Updated from receiverEmail
  amount: number;
  status: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  
  // App context states
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceRequested, setBalanceRequested] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [historyRecords, setHistoryRecords] = useState<Transaction[]>([]);

  // Transfer Form States - completely detached from email requirements
  const [transferData, setTransferData] = useState({ receiverAccountNumber: '', amount: '', otp: '' });

  // Modal Dialog Notification configurations
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', isError: false });

  // SAFE GUARD: Extract active user metadata strings securely from active local storage session profiles
  const activeUserJson = localStorage.getItem('user') || sessionStorage.getItem('user');
  const userObj = activeUserJson ? JSON.parse(activeUserJson) : null;
  const userEmail = userObj?.email || '';
  const userName = userObj?.name || 'Security Operator';
  const userRole = userObj?.role || 'ROLE_USER';

  // Redirect instantly back to login gateways if session parameters fail validation checks
  useEffect(() => {
    if (!userEmail) {
      navigate('/login');
    } else {
      loadAuditLedger();
    }
  }, [userEmail]);

  const loadAuditLedger = async () => {
    try {
      const response = await api.get(`/api/auth/ledger?email=${userEmail}&role=${userRole}`);
      setHistoryRecords(response.data);
    } catch (err: any) {
      console.error("Ledger failure:", err.message);
    }
  };

  const triggerSecurityToken = async () => {
    if (!userEmail) {
      setModalConfig({ title: 'Session Expired', message: 'Please re-authenticate your profile.', isError: true });
      setModalOpen(true);
      return;
    }
    try {
      await api.post('/api/auth/generate-otp', { email: userEmail });
      setOtpSent(true);
      setBalanceRequested(true);
      setModalConfig({ title: 'Token Dispatched', message: 'Verification security token successfully routed to your mail.', isError: false });
      setModalOpen(true);
    } catch (error: any) {
      setModalConfig({ title: 'Authentication Request Refused', message: error.response?.data || 'Failed to emit OTP.', isError: true });
      setModalOpen(true);
    }
  };

  const checkBalanceVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/auth/verify-balance-otp', { email: userEmail, otp: otpCode });
      setBalance(response.data.balance);
      setOtpSent(false);
      setBalanceRequested(false);
    } catch (error: any) {
      setModalConfig({ title: 'Access Unauthorized', message: error.response?.data || 'Invalid security pin matching verification.', isError: true });
      setModalOpen(true);
    }
  };

  const handleAssetTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Outbound DTO parameters update to transmit receiverAccountNumber property
      const response = await api.post('/api/auth/transfer', {
        senderEmail: userEmail,
        receiverAccountNumber: transferData.receiverAccountNumber,
        amount: parseFloat(transferData.amount),
        otp: transferData.otp
      });
      setModalConfig({ title: 'Transfer Complete', message: response.data.message || 'Cleared successfully.', isError: false });
      setModalOpen(true);
      setTransferData({ receiverAccountNumber: '', amount: '', otp: '' });
      loadAuditLedger();
    } catch (error: any) {
      setModalConfig({ title: 'Transaction Terminated', message: error.response?.data || 'Execution failed.', isError: true });
      setModalOpen(true);
    }
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', padding: '30px', color: 'white', fontFamily: 'Segoe UI, sans-serif' }}>
      <AlertModal isOpen={modalOpen} title={modalConfig.title} message={modalConfig.message} isError={modalConfig.isError} onClose={() => setModalOpen(false)} />

      {/* HEADER SECTION ROW */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '20px', marginBottom: '30px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px' }}>Welcome Back, {userName}</h2>
          <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '14px' }}>E-mail Address: {userEmail}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/profile')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#1e293b', color: 'white', border: '1px solid #334155', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#334155')} onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#1e293b')}>
            <User size={16} style={{ color: '#38bdf8' }} /> Profile Settings
          </button>
          <button onClick={() => navigate('/logout')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')} onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ef4444')}>
            <LogOut size={16} /> Close Terminal
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* LEFT COLUMN COMPONENTS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* BALANCE DISPLAY CARD BOX */}
          <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '12px', border: '1px solid #334155' }}>
            <h3 style={{ marginTop: 0, color: '#94a3b8', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck className="text-blue-500" /> Check Balance</h3>
            {balance !== null ? (
              <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#10b981', margin: '15px 0 0 0' }}>₹ {balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h1>
            ) : !balanceRequested ? (
              <button onClick={triggerSecurityToken} style={{ marginTop: '15px', padding: '12px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Reveal</button>
            ) : (
              <form onSubmit={checkBalanceVerification} style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <input type="password" required placeholder="Enter 4-Digit Security PIN" maxLength={4} value={otpCode} onChange={(e) => setOtpCode(e.target.value)} style={{ padding: '10px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white', flexGrow: 1 }} />
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Verify Access</button>
              </form>
            )}
          </div>

          {/* ASSET TRANSFER LEDGER MIGRATION INTERFACE */}
          <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '12px', border: '1px solid #334155' }}>
            <h3 style={{ marginTop: 0, color: '#94a3b8', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><ArrowRightLeft className="text-emerald-500" /> Transaction Column</h3>
            <form onSubmit={handleAssetTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              <input 
                type="text" 
                placeholder="Recipient Bank Account Number" 
                required 
                value={transferData.receiverAccountNumber} 
                onChange={(e) => setTransferData({ ...transferData, receiverAccountNumber: e.target.value })} 
                style={{ padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }} 
              />
              <input type="number" placeholder="Transfer Amount (INR)" required value={transferData.amount} onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })} style={{ padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <input type="password" placeholder="Pin Validation Code" required maxLength={4} value={transferData.otp} onChange={(e) => setTransferData({ ...transferData, otp: e.target.value })} style={{ padding: '12px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: 'white', flexGrow: 1 }} />
                <button type="button" onClick={() => api.post('/api/auth/generate-otp', { email: userEmail })} style={{ padding: '12px', backgroundColor: '#475569', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Dispatch Token</button>
              </div>
              <button type="submit" style={{ padding: '14px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>Transfer Amount</button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN components (AUDIT TRAILS GRAPH GRID) */}
        <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '12px', border: '1px solid #334155', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginTop: 0, color: '#94a3b8', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #334155', paddingBottom: '15px' }}><History className="text-purple-500" /> Transaction History</h3>
          <div style={{ overflowY: 'auto', flexGrow: 1, maxHeight: '420px', marginTop: '15px' }}>
            {historyRecords.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', marginTop: '40px' }}>Zero historical tracking data found within this session.</p>
            ) : (
              historyRecords.map((tx) => (
                <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid #334155', fontSize: '14px' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>
                      {tx.senderEmail === userEmail 
                        ? `To: ${tx.receiverAccountNumber || 'External Node'}` 
                        : `From: ${tx.senderEmail}`}
                    </p>
                    <span style={{ fontSize: '11px', color: tx.status === 'SUCCESS' ? '#10b981' : '#ef4444', backgroundColor: tx.status === 'SUCCESS' ? '#064e3b' : '#4c1d1d', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '4px' }}>{tx.status}</span>
                  </div>
                  <span style={{ fontWeight: 'bold', color: tx.senderEmail === userEmail ? '#ef4444' : '#10b981', fontSize: '16px' }}>{tx.senderEmail === userEmail ? '-' : '+'} ₹{tx.amount}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;