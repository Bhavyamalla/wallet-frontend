import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ShieldCheck, LogIn, Eye, EyeOff } from 'lucide-react'; // Added Eye and EyeOff icons
import AlertModal from '../components/AlertModal';

const Login = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state variable for password visibility
  const navigate = useNavigate();

  // --- MODAL DIALOG CONTROLS ---
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', isError: false });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        email: credentials.email,
        password: credentials.password,
        role: isAdmin ? 'ROLE_ADMIN' : 'ROLE_USER'
      };

      const response = await api.post('/api/auth/login', payload);

      // Standardize storage format to sync with Dashboard's structural profile
      const userPayload = {
        email: response.data.email,
        role: response.data.role,
        name: response.data.name
      };

      // Clean up previous context profiles
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');

      // Save as stringified JSON in the chosen storage context
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(userPayload));

      // Trigger SUCCESS modal
      setModalConfig({
        title: 'Authentication Success!',
        message: `Welcome back, ${response.data.name}! Click Acknowledge to access your dashboard.`,
        isError: false
      });
      setModalOpen(true);

    } catch (error: any) {
      setModalConfig({
        title: 'Authentication Failed',
        message: error.response?.data || 'Invalid email or password mismatch error.',
        isError: true
      });
      setModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    
    // Only proceed to Dashboard if the authentication succeeded
    if (!modalConfig.isError) {
      navigate('/dashboard');
    }
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Segoe UI, sans-serif' }}>
      
      {/* CENTRED LOCK DIALOG SCREEN */}
      <AlertModal 
        isOpen={modalOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        isError={modalConfig.isError}
        onClose={handleModalClose}
      />

      <div style={{ backgroundColor: '#1e293b', padding: '40px', borderRadius: '12px', width: '380px', border: '1px solid #334155', opacity: modalOpen ? 0.3 : 1, transition: 'opacity 0.2s ease' }}>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
          <ShieldCheck size={32} style={{ color: '#3b82f6' }} />
          <h2 style={{ color: 'white', margin: 0, fontSize: '24px', fontWeight: 'bold' }}>BioShield Portal</h2>
        </div>

        {/* User / Admin toggle */}
        <div style={{ display: 'flex', backgroundColor: '#0f172a', padding: '4px', borderRadius: '8px', marginBottom: '25px' }}>
          <button type="button" onClick={() => setIsAdmin(false)} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: !isAdmin ? '#3b82f6' : 'transparent', color: !isAdmin ? 'white' : '#64748b' }}>
            User
          </button>
          <button type="button" onClick={() => setIsAdmin(true)} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: isAdmin ? '#ef4444' : 'transparent', color: isAdmin ? 'white' : '#64748b' }}>
            Admin
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#94a3b8', fontSize: '14px', display: 'block', marginBottom: '5px' }}>Email</label>
            <input type="email" required placeholder="name@domain.com" style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white', boxSizing: 'border-box' }} onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#94a3b8', fontSize: '14px', display: 'block', marginBottom: '5px' }}>Password</label>
            
            {/* Wrapper div relative-positioned to container elements layout perfectly inside the frame */}
            <div style={{ position: 'relative', width: '100%' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                required 
                placeholder="••••••••" 
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  paddingRight: '45px', // Extra right padding ensures text doesn't slide under icon
                  borderRadius: '6px', 
                  border: '1px solid #334155', 
                  backgroundColor: '#0f172a', 
                  color: 'white', 
                  boxSizing: 'border-box' 
                }} 
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember me checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '25px' }}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ cursor: 'pointer', width: '16px', height: '16px' }}
            />
            <label htmlFor="rememberMe" style={{ color: '#94a3b8', fontSize: '14px', cursor: 'pointer' }}>
              Remember me on this device
            </label>
          </div>

          <button type="submit" disabled={modalOpen} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: isAdmin ? '#ef4444' : '#3b82f6', color: 'white', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
            <LogIn size={18} /> Log In
          </button>

          <p style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', margin: 0 }}>
            Don't have an account?{' '}
            <span onClick={() => !modalOpen && navigate('/register')} style={{ color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline' }}>
              Register Here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;