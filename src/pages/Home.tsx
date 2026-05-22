import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const orbRef = useRef<HTMLDivElement>(null);

  // Subtle mouse parallax on orb
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!orbRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      orbRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <div style={{
      backgroundColor: '#020817',
      minHeight: '100vh',
      fontFamily: "'Segoe UI', sans-serif",
      color: 'white',
      overflowX: 'hidden',
      position: 'relative',
    }}>

      {/* ── BACKGROUND GRID ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      {/* ── AMBIENT GLOW BLOBS ── */}
      <div style={{
        position: 'fixed', top: '-20%', left: '-10%', width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', bottom: '-20%', right: '-10%', width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'relative', zIndex: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 48px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
        backgroundColor: 'rgba(2,8,23,0.6)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path d="M15 2L3 8v8c0 6 4.8 11.6 12 13 7.2-1.4 12-7 12-13V8L15 2z"
              fill="url(#shieldGrad)" />
            <path d="M10 15l4 4 7-7" stroke="white" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="shieldGrad" x1="3" y1="2" x2="27" y2="28">
                <stop stopColor="#3b82f6" />
                <stop offset="1" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Bio<span style={{ color: '#3b82f6' }}>Shield</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/login')} style={{
            padding: '10px 24px', borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.12)',
            backgroundColor: 'transparent', color: '#94a3b8',
            fontSize: '14px', fontWeight: '600', cursor: 'pointer',
            transition: 'all 0.2s',
          }}
            onMouseOver={e => {
              (e.target as HTMLButtonElement).style.borderColor = 'rgba(59,130,246,0.5)';
              (e.target as HTMLButtonElement).style.color = '#3b82f6';
            }}
            onMouseOut={e => {
              (e.target as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)';
              (e.target as HTMLButtonElement).style.color = '#94a3b8';
            }}
          >
            Login
          </button>
          <button onClick={() => navigate('/register')} style={{
            padding: '10px 24px', borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            color: 'white', fontSize: '14px', fontWeight: '700',
            cursor: 'pointer', boxShadow: '0 0 24px rgba(59,130,246,0.3)',
            transition: 'box-shadow 0.2s, transform 0.2s',
          }}
            onMouseOver={e => {
              (e.target as HTMLButtonElement).style.boxShadow = '0 0 40px rgba(59,130,246,0.5)';
              (e.target as HTMLButtonElement).style.transform = 'scale(1.03)';
            }}
            onMouseOut={e => {
              (e.target as HTMLButtonElement).style.boxShadow = '0 0 24px rgba(59,130,246,0.3)';
              (e.target as HTMLButtonElement).style.transform = 'scale(1)';
            }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        paddingTop: '72px', paddingBottom: '48px',
        textAlign: 'center', padding: '72px 24px 48px',
      }}>

        {/* STATUS PILL */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          backgroundColor: 'rgba(16,185,129,0.1)',
          border: '1px solid rgba(16,185,129,0.25)',
          borderRadius: '100px', padding: '6px 16px',
          marginBottom: '32px', animation: 'fadeUp 0.6s ease forwards',
        }}>
          <span style={{
            width: '7px', height: '7px', borderRadius: '50%',
            backgroundColor: '#10b981',
            boxShadow: '0 0 8px #10b981',
            animation: 'blink 2s ease-in-out infinite',
            display: 'inline-block',
          }} />
          <span style={{ color: '#10b981', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Fraud Shield Active
          </span>
        </div>

        {/* HEADING */}
        <h1 style={{
          fontSize: 'clamp(36px, 5vw, 58px)',
          fontWeight: '900',
          lineHeight: '1.1',
          margin: '0 0 20px',
          letterSpacing: '-1.5px',
          animation: 'fadeUp 0.6s 0.1s ease forwards',
          opacity: 0,
          animationFillMode: 'forwards',
          maxWidth: '700px',
        }}>
          Your Money.{' '}
          <span style={{
            background: 'linear-gradient(90deg, #3b82f6, #06b6d4, #818cf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Shielded.
          </span>
        </h1>

        <p style={{
          color: '#64748b', fontSize: '18px',
          maxWidth: '520px', lineHeight: '1.7',
          margin: '0 0 40px',
          animation: 'fadeUp 0.6s 0.2s ease forwards',
          opacity: 0, animationFillMode: 'forwards',
        }}>
          Send money instantly with real-time fraud detection that watches every
          transaction before it clears — so you don't have to worry.
        </p>

        {/* CTA BUTTONS */}
        <div style={{
          display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center',
          animation: 'fadeUp 0.6s 0.3s ease forwards',
          opacity: 0, animationFillMode: 'forwards',
        }}>
          <button onClick={() => navigate('/register')} style={{
            padding: '15px 36px', borderRadius: '50px',
            border: 'none',
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            color: 'white', fontSize: '16px', fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 0 32px rgba(59,130,246,0.35)',
            transition: 'box-shadow 0.3s, transform 0.2s',
          }}
            onMouseOver={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 52px rgba(59,130,246,0.6)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)';
            }}
            onMouseOut={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 32px rgba(59,130,246,0.35)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            }}
          >
            Get Started Free →
          </button>
          <button onClick={() => navigate('/login')} style={{
            padding: '15px 36px', borderRadius: '50px',
            border: '1px solid rgba(255,255,255,0.12)',
            backgroundColor: 'transparent', color: '#94a3b8',
            fontSize: '16px', fontWeight: '600', cursor: 'pointer',
            transition: 'border-color 0.3s, color 0.3s',
          }}
            onMouseOver={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(59,130,246,0.4)';
              (e.currentTarget as HTMLButtonElement).style.color = '#3b82f6';
            }}
            onMouseOut={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)';
              (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8';
            }}
          >
            Already have an account
          </button>
        </div>
      </div>

      {/* ── ROTATING ORB ── */}
      <div style={{
        display: 'flex', justifyContent: 'center',
        margin: '0 0 72px', position: 'relative', zIndex: 1,
      }}>
        {/* Wrapper handles mouse parallax */}
        <div ref={orbRef} style={{
          position: 'relative', width: '360px', height: '360px',
          transition: 'transform 0.1s ease-out',
        }}>

          {/* ── ENTIRE ORB DRAWN IN ONE SVG ── */}
          {/*
            Why SVG + animateMotion?
            - animateMotion makes the dot literally travel along a <circle> path
            - No JavaScript needed, pure declarative animation
            - Each ring is a <circle> stroke, dot rides its circumference
            - Easy to explain: "the dot follows a circular path element"
          */}
          <svg
            width="360" height="360"
            viewBox="0 0 360 360"
            style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible' }}
          >
            <defs>
              {/* Outer glow gradient for the core sphere */}
              <radialGradient id="coreGrad" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.5" />
              </radialGradient>

              {/* Soft ambient glow behind whole orb */}
              <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.14" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </radialGradient>

              {/* Filter: soft blur glow for dots */}
              <filter id="dotGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* 
                PATH DEFINITIONS for animateMotion
                Each path is a full circle centered at 180,180.
                Ring 1 radius=160, Ring 2 radius=130, Ring 3 radius=100 (tilted via transform)
                animateMotion uses these paths so dots travel the exact ring circumference.
              */}
              <path id="orbit1"
                d="M 180,20 A 160,160 0 1,1 179.999,20"
                fill="none"
              />
              <path id="orbit2"
                d="M 180,50 A 130,130 0 1,1 179.999,50"
                fill="none"
              />
              {/* orbit3 is tilted 60deg — we rotate the whole group */}
              <path id="orbit3"
                d="M 180,80 A 100,100 0 1,1 179.999,80"
                fill="none"
              />
            </defs>

            {/* ── AMBIENT GLOW ── */}
            <circle cx="180" cy="180" r="180" fill="url(#glowGrad)" />

            {/* ── RING 1 — outermost, slow clockwise ── */}
            <circle
              cx="180" cy="180" r="160"
              fill="none"
              stroke="rgba(59,130,246,0.25)"
              strokeWidth="1"
              strokeDasharray="6 5"
            />
            {/* Dot travelling ring 1 */}
            <circle r="6" fill="#3b82f6" filter="url(#dotGlow)">
              <animateMotion dur="12s" repeatCount="indefinite">
                <mpath href="#orbit1" />
              </animateMotion>
            </circle>

            {/* ── RING 2 — middle, faster counter-clockwise ── */}
            <circle
              cx="180" cy="180" r="130"
              fill="none"
              stroke="rgba(6,182,212,0.2)"
              strokeWidth="1"
              strokeDasharray="5 6"
            />
            {/* Dot travelling ring 2 — reverse via keyTimes trick */}
            <circle r="5" fill="#06b6d4" filter="url(#dotGlow)">
              <animateMotion dur="8s" repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear">
                <mpath href="#orbit2" />
              </animateMotion>
            </circle>

            {/* ── RING 3 — inner, tilted 60°, fastest ── */}
            <g transform="rotate(60 180 180)">
              <circle
                cx="180" cy="180" r="100"
                fill="none"
                stroke="rgba(129,140,248,0.18)"
                strokeWidth="1"
                strokeDasharray="4 7"
              />
              <circle r="4" fill="#818cf8" filter="url(#dotGlow)">
                <animateMotion dur="6s" repeatCount="indefinite">
                  <mpath href="#orbit3" />
                </animateMotion>
              </circle>
            </g>

            {/* ── CORE SPHERE ── */}
            {/* Outer soft ring around core */}
            <circle
              cx="180" cy="180" r="74"
              fill="none"
              stroke="rgba(59,130,246,0.3)"
              strokeWidth="1"
            />
            {/* Core fill */}
            <circle cx="180" cy="180" r="70" fill="url(#coreGrad)" />
            {/* Inner highlight */}
            <circle cx="162" cy="162" r="20" fill="rgba(255,255,255,0.07)" />

            {/* Shield icon centered in core */}
            <g transform="translate(155, 152)">
              <path
                d="M25 3L5 11v12c0 9 6.7 17.4 20 20 13.3-2.6 20-11 20-20V11L25 3z"
                fill="rgba(255,255,255,0.15)"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="1.5"
              />
              <path
                d="M17 25l6 6 12-12"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </g>
          </svg>

          {/* ── FLOATING BADGES (HTML, outside SVG) ── */}
          <div style={{
            position: 'absolute', top: '28px', right: '-36px',
            backgroundColor: 'rgba(16,185,129,0.12)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: '20px', padding: '7px 14px',
            display: 'flex', alignItems: 'center', gap: '7px',
            animation: 'float 3s ease-in-out infinite',
            backdropFilter: 'blur(8px)',
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
            <span style={{ color: '#10b981', fontSize: '12px', fontWeight: '700' }}>Protected</span>
          </div>

          <div style={{
            position: 'absolute', bottom: '60px', left: '-40px',
            backgroundColor: 'rgba(59,130,246,0.12)',
            border: '1px solid rgba(59,130,246,0.3)',
            borderRadius: '20px', padding: '7px 14px',
            display: 'flex', alignItems: 'center', gap: '7px',
            animation: 'float 3s 1.5s ease-in-out infinite',
            backdropFilter: 'blur(8px)',
          }}>
            <span style={{ color: '#60a5fa', fontSize: '12px', fontWeight: '700' }}>🔐 OTP Secured</span>
          </div>

          <div style={{
            position: 'absolute', bottom: '140px', right: '-32px',
            backgroundColor: 'rgba(129,140,248,0.12)',
            border: '1px solid rgba(129,140,248,0.3)',
            borderRadius: '20px', padding: '7px 14px',
            animation: 'float 3s 0.8s ease-in-out infinite',
            backdropFilter: 'blur(8px)',
          }}>
            <span style={{ color: '#818cf8', fontSize: '12px', fontWeight: '700' }}>⚡ Instant</span>
          </div>
        </div>
      </div>

      {/* ── STATS ROW ── */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: '0',
        maxWidth: '560px', margin: '0 auto 80px',
        position: 'relative', zIndex: 1,
        backgroundColor: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px', overflow: 'hidden',
      }}>
        {[
          { value: '₹2.4Cr+', label: 'Secured Daily' },
          { value: '99.8%', label: 'Fraud Blocked' },
          { value: '12K+', label: 'Active Users' },
        ].map((stat, i) => (
          <div key={i} style={{
            flex: 1, padding: '28px 16px', textAlign: 'center',
            borderRight: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none',
          }}>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: 'white', letterSpacing: '-0.5px' }}>{stat.value}</p>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#475569' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── FEATURES GRID ── */}
      <div style={{
        maxWidth: '900px', margin: '0 auto', padding: '0 24px 80px',
        position: 'relative', zIndex: 1,
      }}>
        <p style={{
          textAlign: 'center', color: '#334155',
          fontSize: '11px', fontWeight: '700', letterSpacing: '3px',
          textTransform: 'uppercase', marginBottom: '40px',
        }}>
          What makes BioShield different
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            {
              icon: '🛡️',
              color: '#3b82f6',
              bg: 'rgba(59,130,246,0.08)',
              border: 'rgba(59,130,246,0.15)',
              title: 'Fraud Detection',
              desc: 'Every transfer scanned for velocity spikes, off-hours activity, and amount anomalies before it clears.',
            },
            {
              icon: '⚡',
              color: '#06b6d4',
              bg: 'rgba(6,182,212,0.08)',
              border: 'rgba(6,182,212,0.15)',
              title: 'Instant Transfers',
              desc: 'Send money to any account in seconds. OTP-verified, backend-secured, instant ledger update.',
            },
            {
              icon: '📊',
              color: '#10b981',
              bg: 'rgba(16,185,129,0.08)',
              border: 'rgba(16,185,129,0.15)',
              title: 'Full Audit Trail',
              desc: 'Every transaction — successful, blocked, or failed — logged with status and stored persistently.',
            },
          ].map((f, i) => (
            <div key={i} style={{
              backgroundColor: f.bg,
              border: `1px solid ${f.border}`,
              borderRadius: '16px', padding: '28px 24px',
              transition: 'transform 0.25s, box-shadow 0.25s',
              cursor: 'default',
            }}
              onMouseOver={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-5px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 40px ${f.border}`;
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontSize: '28px', marginBottom: '16px',
                width: '52px', height: '52px', borderRadius: '12px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {f.icon}
              </div>
              <h4 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: '700', color: 'white' }}>{f.title}</h4>
              <p style={{ margin: 0, color: '#64748b', fontSize: '14px', lineHeight: '1.65' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM CTA ── */}
      <div style={{
        textAlign: 'center', padding: '60px 24px 80px',
        position: 'relative', zIndex: 1,
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <h2 style={{
          fontSize: '36px', fontWeight: '800', margin: '0 0 16px',
          letterSpacing: '-0.5px',
        }}>
          Ready to secure your wallet?
        </h2>
        <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '16px' }}>
          Join users who trust BioShield to keep their money safe.
        </p>
        <button onClick={() => navigate('/register')} style={{
          padding: '16px 48px', borderRadius: '50px',
          border: 'none',
          background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
          color: 'white', fontSize: '17px', fontWeight: '700',
          cursor: 'pointer',
          boxShadow: '0 0 40px rgba(59,130,246,0.35)',
          transition: 'box-shadow 0.3s, transform 0.2s',
        }}
          onMouseOver={e => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 60px rgba(59,130,246,0.55)';
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)';
          }}
          onMouseOut={e => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 40px rgba(59,130,246,0.35)';
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
          }}
        >
          Create Free Account →
        </button>
      </div>

      {/* ── KEYFRAME STYLES ── */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinReverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.03); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default Home;