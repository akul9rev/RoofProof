import React, { useState, useEffect } from 'react';
import { Shield, Home, Building2, Lock, UserCheck, Sparkles, Wallet, CheckCircle2, FileText } from 'lucide-react';
import { getLaceWallet } from '../services/zkProofService';

export default function Navbar({ activeView, setActiveView, currentRole, setCurrentRole, currentUser }) {
  const [hasLace, setHasLace] = useState(false);

  useEffect(() => {
    const check = () => setHasLace(!!getLaceWallet());
    check();
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(10, 13, 20, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '74px',
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveView('landing')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
          }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--accent-glow)',
          }}>
            <Shield size={24} color="#ffffff" />
          </div>
          <div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Roof<span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Proof</span>
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '-2px' }}>
              <span className="badge-pill badge-midnight" style={{ fontSize: '0.65rem', padding: '1px 7px' }}>
                Midnight Preview
              </span>
              {hasLace && (
                <span className="badge-pill badge-eligible" style={{ fontSize: '0.65rem', padding: '1px 7px' }}>
                  <CheckCircle2 size={10} /> Lace Active
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setActiveView('landing')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              background: activeView === 'landing' ? 'var(--bg-tertiary)' : 'transparent',
              color: activeView === 'landing' ? 'var(--accent-secondary)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={16} />
            Home
          </button>

          <button
            onClick={() => {
              setCurrentRole('tenant');
              setActiveView('tenant');
            }}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              background: activeView === 'tenant' ? 'var(--bg-tertiary)' : 'transparent',
              color: activeView === 'tenant' ? 'var(--accent-secondary)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Home size={16} />
            Find a Home (Tenant)
          </button>

          <button
            onClick={() => {
              setCurrentRole('landlord');
              setActiveView('landlord');
            }}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              background: activeView === 'landlord' ? 'var(--bg-tertiary)' : 'transparent',
              color: activeView === 'landlord' ? 'var(--accent-secondary)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Building2 size={16} />
            Landlord Portal
          </button>

          <button
            onClick={() => setActiveView('privacy')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              background: activeView === 'privacy' ? 'var(--bg-tertiary)' : 'transparent',
              color: activeView === 'privacy' ? 'var(--accent-secondary)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Lock size={16} />
            ZK Architecture
          </button>

          <button
            onClick={() => setActiveView('testui')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              background: activeView === 'testui' ? 'var(--bg-tertiary)' : 'transparent',
              color: activeView === 'testui' ? 'var(--accent-secondary)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <FileText size={16} />
            Form 16 Test UI
          </button>
        </nav>

        {/* Role & Persona Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-full)',
            padding: '4px 6px',
            display: 'flex',
            gap: '4px',
          }}>
            <button
              onClick={() => {
                setCurrentRole('tenant');
                if (activeView !== 'landing' && activeView !== 'privacy') setActiveView('tenant');
              }}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: currentRole === 'tenant' ? 'var(--accent-primary)' : 'transparent',
                color: currentRole === 'tenant' ? '#ffffff' : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: 700,
                transition: 'var(--transition)',
              }}
            >
              Tenant View
            </button>
            <button
              onClick={() => {
                setCurrentRole('landlord');
                if (activeView !== 'landing' && activeView !== 'privacy') setActiveView('landlord');
              }}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: currentRole === 'landlord' ? 'var(--accent-primary)' : 'transparent',
                color: currentRole === 'landlord' ? '#ffffff' : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: 700,
                transition: 'var(--transition)',
              }}
            >
              Landlord View
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
