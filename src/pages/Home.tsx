import { ShieldCheck, ArrowRight, ShieldAlert, Cpu, Eye, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#ffffff', fontFamily: 'Segoe UI, sans-serif', paddingBottom: '60px' }}>
      
      {/* NAVIGATION HEADER */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', backgroundColor: '#1e293b', borderBottom: '2px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={28} style={{ color: '#3b82f6' }} />
          <span style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '0.5px' }}>BioShield</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#064e3b', padding: '6px 14px', borderRadius: '20px', border: '1px solid #10b981' }}>
          <ShieldAlert size={16} style={{ color: '#34d399' }} />
          <span style={{ fontSize: '12px', color: '#34d399', fontWeight: 'bold', letterSpacing: '0.5px' }}>AI MITIGATION LAYER ACTIVE</span>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div style={{ textAlign: 'center', paddingTop: '80px', paddingLeft: '20px', paddingRight: '20px' }}>
        <h1 style={{ fontSize: '46px', fontWeight: '800', marginBottom: '15px', lineHeight: '1.2' }}>
          Next-Generation Security for <br />
          <span style={{ color: '#3b82f6' }}>Digital Asset Ecosystems</span>
        </h1>
        <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0 auto 35px auto', fontSize: '16px', lineHeight: '1.6' }}>
          A secure decentralized wallet framework featuring real-time rule-based transaction evaluation, anomaly interception, and instant ledger accounting.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <button 
            onClick={() => navigate('/login')} 
            style={{ backgroundColor: '#3b82f6', color: '#ffffff', padding: '14px 28px', borderRadius: '6px', border: 'none', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)' }}
          >
            Get Started <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* VALUE SPECIFICATION LABS */}
      <div style={{ maxWidth: '950px', margin: '70px auto 0 auto', padding: '0 20px' }}>
        <h3 style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '35px' }}>
          Engineered Security Capabilities
        </h3>
        
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '280px', backgroundColor: '#1e293b', padding: '25px', borderRadius: '12px', border: '1px solid #334155' }}>
            <div style={{ color: '#3b82f6', marginBottom: '15px' }}><Cpu size={24} /></div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Velocity Threshold Metrics</h4>
            <p style={{ color: '#94a3b8', margin: '0', fontSize: '14px', lineHeight: '1.5' }}>
              Interceptors analyze transactional frequencies to block rapid malicious request spams automatically.
            </p>
          </div>

          <div style={{ flex: '1', minWidth: '280px', backgroundColor: '#1e293b', padding: '25px', borderRadius: '12px', border: '1px solid #334155' }}>
            <div style={{ color: '#10b981', marginBottom: '15px' }}><Zap size={24} /></div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Anomalous Cap Controls</h4>
            <p style={{ color: '#94a3b8', margin: '0', fontSize: '14px', lineHeight: '1.5' }}>
              High-volume single transfer requests automatically trigger strict backend authorization filters.
            </p>
          </div>

          <div style={{ flex: '1', minWidth: '280px', backgroundColor: '#1e293b', padding: '25px', borderRadius: '12px', border: '1px solid #334155' }}>
            <div style={{ color: '#a855f7', marginBottom: '15px' }}><Eye size={24} /></div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Real-Time Audit Ledgers</h4>
            <p style={{ color: '#94a3b8', margin: '0', fontSize: '14px', lineHeight: '1.5' }}>
              Every valid, failed, or blocked transaction attempt is preserved with persistent metadata in PostgreSQL.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;