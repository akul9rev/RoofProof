import React, { useState } from 'react';
import { X, Shield, ArrowRight, UserCheck, Lock, Sparkles, CheckCircle2, Building, User } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, currentRole, onLoginSuccess, currentUser }) {
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'
  const [selectedRole, setSelectedRole] = useState(currentRole || 'tenant');
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');

  if (!isOpen) return null;

  const presetTenant = {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    role: 'tenant',
    title: 'Form 16 Ready (Gross Salary: ₹9.2L)',
  };

  const presetLandlord = {
    id: 2,
    name: 'Ananya Verma',
    email: 'ananya.verma@example.com',
    role: 'landlord',
    title: 'Verified Property Owner',
  };

  const handleQuickLogin = (preset) => {
    onLoginSuccess(preset);
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess({
      id: selectedRole === 'tenant' ? 1 : 2,
      name: name || (selectedRole === 'tenant' ? 'Rahul Sharma' : 'Ananya Verma'),
      email: email || (selectedRole === 'tenant' ? 'rahul.sharma@example.com' : 'ananya.verma@example.com'),
      role: selectedRole,
    });
    onClose();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 10, 16, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div 
        className="glass-card animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '480px',
          width: '100%',
          padding: '36px',
          borderRadius: '32px',
          background: 'linear-gradient(165deg, rgba(16, 24, 34, 0.96) 0%, rgba(10, 16, 24, 0.98) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 40px 100px rgba(0, 0, 0, 0.85), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow backdrop accent */}
        <div style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: selectedRole === 'tenant' ? 'rgba(235, 168, 52, 0.12)' : 'rgba(107, 155, 118, 0.15)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <X size={16} />
        </button>

        {/* Header Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #EBA834 0%, #F59E0B 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(235, 168, 52, 0.4)',
          }}>
            <Shield size={22} color="#0c141d" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.02em' }}>
              RoofProof
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)' }}>
              Midnight Zero-Knowledge Authentication
            </span>
          </div>
        </div>

        {/* Auth Mode Switcher (Sign In vs Sign Up) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6px',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '4px',
          borderRadius: '16px',
          marginBottom: '20px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <button
            type="button"
            onClick={() => setAuthMode('signin')}
            style={{
              padding: '10px',
              borderRadius: '12px',
              background: authMode === 'signin' ? '#ffffff' : 'transparent',
              color: authMode === 'signin' ? '#0c141d' : 'rgba(255, 255, 255, 0.7)',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('signup')}
            style={{
              padding: '10px',
              borderRadius: '12px',
              background: authMode === 'signup' ? '#ffffff' : 'transparent',
              color: authMode === 'signup' ? '#0c141d' : 'rgba(255, 255, 255, 0.7)',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Create Account
          </button>
        </div>

        {/* Role Selector Cards */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px', fontWeight: 600 }}>
            Select Account Role:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div
              onClick={() => setSelectedRole('tenant')}
              style={{
                background: selectedRole === 'tenant' ? 'rgba(235, 168, 52, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${selectedRole === 'tenant' ? 'rgba(235, 168, 52, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: '18px',
                padding: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: selectedRole === 'tenant' ? '#EBA834' : 'rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <User size={16} color={selectedRole === 'tenant' ? '#0c141d' : '#ffffff'} />
                </div>
                {selectedRole === 'tenant' && <CheckCircle2 size={16} color="#EBA834" />}
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ffffff' }}>Tenant</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>Verify income privately</div>
            </div>

            <div
              onClick={() => setSelectedRole('landlord')}
              style={{
                background: selectedRole === 'landlord' ? 'rgba(107, 155, 118, 0.14)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${selectedRole === 'landlord' ? 'rgba(107, 155, 118, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: '18px',
                padding: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: selectedRole === 'landlord' ? '#6B9B76' : 'rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Building size={16} color={selectedRole === 'landlord' ? '#0c141d' : '#ffffff'} />
                </div>
                {selectedRole === 'landlord' && <CheckCircle2 size={16} color="#6B9B76" />}
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ffffff' }}>Landlord</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>List & verify tenants</div>
            </div>
          </div>
        </div>

        {/* 1-Click Quick Demo Sign-In Card */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', fontWeight: 600 }}>
            Instant Demo Account:
          </div>

          {selectedRole === 'tenant' ? (
            <div 
              onClick={() => handleQuickLogin(presetTenant)}
              style={{
                background: 'rgba(235, 168, 52, 0.08)',
                border: '1px solid rgba(235, 168, 52, 0.25)',
                borderRadius: '16px',
                padding: '12px 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #EBA834 0%, #F59E0B 100%)',
                  color: '#0c141d',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                }}>
                  RS
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>Rahul Sharma</div>
                  <div style={{ fontSize: '0.75rem', color: '#EBA834' }}>{presetTenant.title}</div>
                </div>
              </div>
              <span className="btn-white-pill" style={{ padding: '6px 14px', fontSize: '0.75rem' }}>
                Quick Login <ArrowRight size={12} />
              </span>
            </div>
          ) : (
            <div 
              onClick={() => handleQuickLogin(presetLandlord)}
              style={{
                background: 'rgba(107, 155, 118, 0.12)',
                border: '1px solid rgba(107, 155, 118, 0.3)',
                borderRadius: '16px',
                padding: '12px 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6B9B76 0%, #4A7C59 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                }}>
                  AV
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>Ananya Verma</div>
                  <div style={{ fontSize: '0.75rem', color: '#6B9B76' }}>{presetLandlord.title}</div>
                </div>
              </div>
              <span className="btn-white-pill" style={{ padding: '6px 14px', fontSize: '0.75rem' }}>
                Quick Login <ArrowRight size={12} />
              </span>
            </div>
          )}
        </div>

        {/* Custom Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <input 
              type="text" 
              placeholder={selectedRole === 'tenant' ? 'Full Name (e.g. Rahul Sharma)' : 'Full Name (e.g. Ananya Verma)'} 
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '14px',
                padding: '12px 16px',
                color: '#ffffff',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input 
              type="email" 
              placeholder={selectedRole === 'tenant' ? 'rahul.sharma@example.com' : 'ananya.verma@example.com'} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '14px',
                padding: '12px 16px',
                color: '#ffffff',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />
          </div>

          <button type="submit" className="btn-white-pill" style={{ width: '100%', padding: '14px' }}>
            {authMode === 'signin' ? 'Sign In as ' : 'Create '} {selectedRole === 'tenant' ? 'Tenant Account' : 'Landlord Account'}
          </button>
        </form>

        <div style={{ marginTop: '18px', textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.4)' }}>
          🔒 Powered by Midnight ZK Witness Engine • 100% Private Data
        </div>
      </div>
    </div>
  );
}
