import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import AlertModal from '../components/AlertModal';
import { User, Shield, CreditCard, ArrowLeft, Save } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', isError: false });

  const activeUserJson = localStorage.getItem('user') || sessionStorage.getItem('user');
  const userObj = activeUserJson ? JSON.parse(activeUserJson) : null;
  const userEmail = userObj?.email || '';

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
    bankName: '',
    accountNumber: '',
    ifscCode: ''
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) {
      navigate('/login');
      return;
    }
    loadUserProfile();
  }, [userEmail]);

  const loadUserProfile = async () => {
    try {
      const response = await api.get(`/api/auth/profile?email=${userEmail}`);
      setProfileData({
        name: response.data.name || '',
        email: response.data.email || '',
        role: response.data.role || '',
        password: '',
        confirmPassword: '',
        bankName: response.data.bankName || '',
        accountNumber: response.data.accountNumber || '',
        ifscCode: response.data.ifscCode || ''
      });
      setLoading(false);
    } catch (err: any) {
      setModalConfig({
        title: 'Error',
        message: err.response?.data || 'Failed to load profile. Please try again.',
        isError: true
      });
      setModalOpen(true);
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (profileData.password) {
      if (profileData.password.length < 6) {
        setModalConfig({ title: 'Validation Error', message: 'Password must be at least 6 characters.', isError: true });
        setModalOpen(true);
        return;
      }
      if (profileData.password !== profileData.confirmPassword) {
        setModalConfig({ title: 'Validation Error', message: 'Passwords do not match.', isError: true });
        setModalOpen(true);
        return;
      }
    }

    try {
      const response = await api.post('/api/auth/update-profile', {
        email: userEmail,
        name: profileData.name,
        password: profileData.password || null,
        bankName: profileData.bankName,
        accountNumber: profileData.accountNumber,
        ifscCode: profileData.ifscCode
      });

      if (profileData.name && userObj) {
        userObj.name = profileData.name;
        const storage = localStorage.getItem('user') ? localStorage : sessionStorage;
        storage.setItem('user', JSON.stringify(userObj));
      }

      setModalConfig({
        title: 'Profile Updated',
        message: response.data.message || 'Profile updated successfully.',
        isError: false
      });
      setModalOpen(true);
      setProfileData(prev => ({ ...prev, password: '', confirmPassword: '' }));

    } catch (error: any) {
      setModalConfig({
        title: 'Update Failed',
        message: error.response?.data || 'Failed to save changes.',
        isError: true
      });
      setModalOpen(true);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '6px',
    color: 'white',
    boxSizing: 'border-box' as const,
  };

  const disabledInputStyle = {
    ...inputStyle,
    border: '1px solid #1e293b',
    color: '#64748b',
    cursor: 'not-allowed',
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Segoe UI, sans-serif' }}>
        <h3>Loading Profile...</h3>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', padding: '40px 20px', color: 'white', fontFamily: 'Segoe UI, sans-serif', boxSizing: 'border-box' }}>

      <AlertModal
        isOpen={modalOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        isError={modalConfig.isError}
        onClose={() => setModalOpen(false)}
      />

      <div style={{ maxWidth: '650px', margin: '0 auto' }}>

        <button
          onClick={() => navigate('/dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#1e293b', color: 'white', border: '1px solid #334155', borderRadius: '6px', cursor: 'pointer', marginBottom: '24px', fontWeight: '600', transition: 'background-color 0.2s' }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#334155')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#1e293b')}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px' }}>Profile Settings</h1>
        <p style={{ color: '#64748b', margin: '0 0 32px', fontSize: '15px' }}>Update your profile, password, and bank details.</p>

        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* SECTION 1: Personal Info */}
          <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px', color: '#38bdf8', borderBottom: '1px solid #334155', paddingBottom: '12px' }}>
              <User size={20} /> Personal Profile
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label htmlFor="name" style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={profileData.name}
                  required
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="email" style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Email (Read-only)</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  disabled
                  style={disabledInputStyle}
                />
              </div>
            </div>

            <span style={{ fontSize: '12px', color: '#34d399', backgroundColor: '#064e3b', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold' }}>
              Access Level: {profileData.role === 'ROLE_ADMIN' ? 'Administrator' : 'Standard User'}
            </span>
          </div>

          {/* SECTION 2: Password */}
          <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px', color: '#a855f7', borderBottom: '1px solid #334155', paddingBottom: '12px' }}>
              <Shield size={20} /> Change Password
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label htmlFor="newPassword" style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>New Password (leave blank to keep current)</label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="Min 6 characters"
                  value={profileData.password}
                  onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Confirm New Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Retype password"
                  value={profileData.confirmPassword}
                  onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Bank Details */}
          <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981', borderBottom: '1px solid #334155', paddingBottom: '12px' }}>
              <CreditCard size={20} /> Bank Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label htmlFor="bankName" style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Bank Name</label>
                <input
                  id="bankName"
                  name="bankName"
                  type="text"
                  value={profileData.bankName}
                  placeholder="e.g. HDFC, SBI, ICICI"
                  onChange={(e) => setProfileData({ ...profileData, bankName: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="ifscCode" style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>IFSC Code</label>
                <input
                  id="ifscCode"
                  name="ifscCode"
                  type="text"
                  value={profileData.ifscCode}
                  maxLength={11}
                  placeholder="e.g. SBIN0001234"
                  onChange={(e) => setProfileData({ ...profileData, ifscCode: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label htmlFor="accountNumber" style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Account Number</label>
              <input
                id="accountNumber"
                name="accountNumber"
                type="text"
                value={profileData.accountNumber}
                placeholder="Enter bank account number"
                inputMode="numeric"
                onChange={(e) => setProfileData({ ...profileData, accountNumber: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              padding: '14px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#3b82f6')}
          >
            <Save size={18} /> Save Changes
          </button>

        </form>
      </div>
    </div>
  );
};

export default Profile;