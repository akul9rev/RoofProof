import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Shield, ArrowRight, CheckCircle2, Building, User } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, currentRole, onLoginSuccess, currentUser }) {
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'
  const [selectedRole, setSelectedRole] = useState(currentRole || 'tenant');
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');

  // Disable background body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const presetTenant = {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    role: 'tenant',
    title: 'Form 16 Ready (Gross: ₹9.2L)',
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

  return createPortal(
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(5, 10, 16, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div 
        className="glass-card animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '450px',
          width: '100%',
          padding: '26px 28px',
          borderRadius: '26px',
          background: 'linear-gradient(165deg, rgba(16, 24, 34, 0.98) 0%, rgba(10, 16, 24, 0.99) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.85), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
          }}
        >
          <X size={15} />
        </button>

        {/* Header Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '11px',
            background: 'linear-gradient(135deg, #EBA834 0%, #F59E0B 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 18px rgba(235, 168, 52, 0.4)',
          }}>
            <Shield size={18} color="#0c141d" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.22rem', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              RoofProof
            </h3>
            <span style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.5)' }}>
              Midnight Zero-Knowledge Authentication
            </span>
          </div>
        </div>

        {/* Auth Mode Switcher (Sign In vs Sign Up) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4px',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '4px',
          borderRadius: '14px',
          marginBottom: '14px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <button
            type="button"
            onClick={() => setAuthMode('signin')}
            style={{
              padding: '8px',
              borderRadius: '10px',
              background: authMode === 'signin' ? '#ffffff' : 'transparent',
              color: authMode === 'signin' ? '#0c141d' : 'rgba(255, 255, 255, 0.7)',
              fontWeight: 700,
              fontSize: '0.84rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('signup')}
            style={{
              padding: '8px',
              borderRadius: '10px',
              background: authMode === 'signup' ? '#ffffff' : 'transparent',
              color: authMode === 'signup' ? '#0c141d' : 'rgba(255, 255, 255, 0.7)',
              fontWeight: 700,
              fontSize: '0.84rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Create Account
          </button>
        </div>

        {/* Role Selector Cards */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', fontWeight: 600 }}>
            Select Account Role:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div
              onClick={() => setSelectedRole('tenant')}
              style={{
                background: selectedRole === 'tenant' ? 'rgba(235, 168, 52, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${selectedRole === 'tenant' ? 'rgba(235, 168, 52, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: '14px',
                padding: '10px 12px',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '8px',
                  background: selectedRole === 'tenant' ? '#EBA834' : 'rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <User size={14} color={selectedRole === 'tenant' ? '#0c141d' : '#ffffff'} />
                </div>
                {selectedRole === 'tenant' && <CheckCircle2 size={14} color="#EBA834" />}
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>Tenant</div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)' }}>Verify income privately</div>
            </div>

            <div
              onClick={() => setSelectedRole('landlord')}
              style={{
                background: selectedRole === 'landlord' ? 'rgba(107, 155, 118, 0.14)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${selectedRole === 'landlord' ? 'rgba(107, 155, 118, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: '14px',
                padding: '10px 12px',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '8px',
                  background: selectedRole === 'landlord' ? '#6B9B76' : 'rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Building size={14} color={selectedRole === 'landlord' ? '#0c141d' : '#ffffff'} />
                </div>
                {selectedRole === 'landlord' && <CheckCircle2 size={14} color="#6B9B76" />}
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>Landlord</div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)' }}>List & verify tenants</div>
            </div>
          </div>
        </div>

        {/* 1-Click Quick Demo Sign-In Card */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', fontWeight: 600 }}>
            Instant Demo Account:
          </div>

          {selectedRole === 'tenant' ? (
            <div 
              onClick={() => handleQuickLogin(presetTenant)}
              style={{
                background: 'rgba(235, 168, 52, 0.08)',
                border: '1px solid rgba(235, 168, 52, 0.25)',
                borderRadius: '14px',
                padding: '10px 14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #EBA834 0%, #F59E0B 100%)',
                  color: '#0c141d',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.82rem',
                }}>
                  RS
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>Rahul Sharma</div>
                  <div style={{ fontSize: '0.72rem', color: '#EBA834' }}>{presetTenant.title}</div>
                </div>
              </div>
              <span className="btn-white-pill" style={{ padding: '5px 12px', fontSize: '0.74rem' }}>
                Quick Login <ArrowRight size={11} />
              </span>
            </div>
          ) : (
            <div 
              onClick={() => handleQuickLogin(presetLandlord)}
              style={{
                background: 'rgba(107, 155, 118, 0.12)',
                border: '1px solid rgba(107, 155, 118, 0.3)',
                borderRadius: '14px',
                padding: '10px 14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6B9B76 0%, #4A7C59 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.82rem',
                }}>
                  AV
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>Ananya Verma</div>
                  <div style={{ fontSize: '0.72rem', color: '#6B9B76' }}>{presetLandlord.title}</div>
                </div>
              </div>
              <span className="btn-white-pill" style={{ padding: '5px 12px', fontSize: '0.74rem' }}>
                Quick Login <ArrowRight size={11} />
              </span>
            </div>
          )}
        </div>

        {/* Custom Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <input 
              type="text" 
              placeholder={selectedRole === 'tenant' ? 'Full Name (e.g. Rahul Sharma)' : 'Full Name (e.g. Ananya Verma)'} 
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '10px 14px',
                color: '#ffffff',
                fontSize: '0.86rem',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
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
                padding: '10px 14px',
                color: '#ffffff',
                fontSize: '0.86rem',
                outline: 'none',
              }}
            />
          </div>

          <button type="submit" className="btn-white-pill" style={{ width: '100%', padding: '12px', fontSize: '0.88rem' }}>
            {authMode === 'signin' ? 'Sign In as ' : 'Create '} {selectedRole === 'tenant' ? 'Tenant Account' : 'Landlord Account'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
