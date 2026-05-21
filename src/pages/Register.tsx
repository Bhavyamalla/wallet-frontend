import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import AlertModal from '../components/AlertModal'; // Imports the new centered component

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phoneNumber: '', password: '' });
  const navigate = useNavigate();

  // --- NEW: MODAL STATES CONTAINER ---
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', isError: false });

  const handleRegister = async (event: any) => {
    event.preventDefault();

    // Basic frontend validation using our new centered modal instead of toast
    if (formData.password.length < 6) {
      setModalConfig({
        title: 'Validation Error',
        message: 'Password must be at least 6 characters.',
        isError: true
      });
      setModalOpen(true);
      return;
    }

    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      setModalConfig({
        title: 'Validation Error',
        message: 'Phone number must be exactly 10 digits.',
        isError: true
      });
      setModalOpen(true);
      return;
    }

    try {
      // Hits your AuthController's mapping
      const response = await api.post('/api/auth/register', formData);

      // Trigger the centered Success Modal
      setModalConfig({
        title: 'Account Created!',
        message: response.data.message || 'Account created successfully! Click dismiss to link your bank details.',
        isError: false
      });
      setModalOpen(true);

    } catch (error: any) {
      // Trigger the centered Error Modal
      setModalConfig({
        title: 'Registration Failed',
        message: error.response?.data || 'Registration failed. Try again.',
        isError: true
      });
      setModalOpen(true);
    }
  };

  // --- NEW: FUNCTION MANDATES DISMISS ACTION BEFORE ROUTING ---
  const handleModalClose = () => {
    setModalOpen(false);
    
    // Only route to the next page if there was no validation or backend error
    if (!modalConfig.isError) {
      navigate('/bank-credentials', { state: { email: formData.email } });
    }
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Segoe UI, sans-serif' }}>
      
      {/* INJECTED CENTRED DIALOG COMPONENT */}
      <AlertModal 
        isOpen={modalOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        isError={modalConfig.isError}
        onClose={handleModalClose}
      />

      <form onSubmit={handleRegister} style={{ backgroundColor: '#1e293b', padding: '40px', borderRadius: '12px', width: '380px', border: '1px solid #334155', opacity: modalOpen ? 0.3 : 1, transition: 'opacity 0.2s ease' }}>
        <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', marginBottom: '25px', textAlign: 'center' }}>Create Account</h2>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: '#94a3b8', fontSize: '14px', display: 'block', marginBottom: '5px' }}>Full Name</label>
          <input type="text" required placeholder="Your full name" style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', boxSizing: 'border-box' }} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: '#94a3b8', fontSize: '14px', display: 'block', marginBottom: '5px' }}>Email</label>
          <input type="email" required placeholder="name@gmail.com" style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', boxSizing: 'border-box' }} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: '#94a3b8', fontSize: '14px', display: 'block', marginBottom: '5px' }}>Phone Number</label>
          <input type="text" required placeholder="10 digit mobile number" maxLength={10} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', boxSizing: 'border-box' }} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ color: '#94a3b8', fontSize: '14px', display: 'block', marginBottom: '5px' }}>Password</label>
          <input type="password" required placeholder="Min 6 characters" style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', boxSizing: 'border-box' }} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
        </div>

        <button type="submit" disabled={modalOpen} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: '#3b82f6', color: 'white', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginBottom: '15px' }}>
  Register
</button>

        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', margin: 0 }}>
          Already have an account?{' '}
          <span onClick={() => !modalOpen && navigate('/login')} style={{ color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline' }}>
            Login Here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;