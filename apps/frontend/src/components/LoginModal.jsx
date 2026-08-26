import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Shield, Building, User, Lock, ArrowRight, AlertTriangle } from 'lucide-react';
import { loginOrRegister } from '../services/api';

export default function LoginModal({ isOpen, onClose, currentRole, onLoginSuccess, currentUser }) {
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'
  const [selectedRole, setSelectedRole] = useState(currentRole || 'tenant');
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [occupation, setOccupation] = useState('');
  const [organization, setOrganization] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Please enter your email address');
      return;
    }
    if (!password) {
      setError('Please enter your account password');
      return;
    }
    if (authMode === 'signup' && !name) {
      setError('Please enter your full name to register');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        mode: authMode,
        name: authMode === 'signup' ? name : undefined,
        email: email.trim(),
        password: password.trim(),
        role: authMode === 'signup' ? selectedRole : undefined,
        phone: authMode === 'signup' ? phone : undefined,
        city: authMode === 'signup' ? city : undefined,
        occupation: (authMode === 'signup' && selectedRole === 'tenant') ? occupation : undefined,
        organization: (authMode === 'signup' && selectedRole === 'landlord') ? organization : undefined,
      };

      const res = await loginOrRegister(payload);
      const userObj = res?.user || {
        id: selectedRole === 'tenant' ? 3 : 1,
        name: name || (selectedRole === 'tenant' ? 'Arjun Sharma' : 'Rohan Mehta'),
        email: email.trim(),
        role: res?.user?.role || selectedRole,
      };

      onLoginSuccess(userObj);
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    }
  };

  return createPortal(
    <div
      className="modal-backdrop"
      onClick={onClose}
    >
      <div 
        className="luxury-modal-container modal-surface animate-modal-scale"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '460px',
          width: '100%',
          padding: '28px 30px',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="modal-close"
          style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div className="modal-header" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div className="modal-icon-badge" style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #EBA834 0%, #F59E0B 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(235, 168, 52, 0.35)',
          }}>
            <Shield size={20} color="#0c141d" />
          </div>
          <div>
            <div className="modal-eyebrow">Private access layer</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
              {authMode === 'signin' ? 'Sign In to RoofProof' : 'Create RoofProof Account'}
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
              Midnight Zero-Knowledge Account Authentication
            </p>
          </div>
        </div>

        {/* Auth Mode Switcher (Sign In vs Create Account) */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.06)',
          borderRadius: '999px',
          padding: '3px',
          marginBottom: '22px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <button
            type="button"
            onClick={() => { setAuthMode('signin'); setError(null); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '999px',
              background: authMode === 'signin' ? '#ffffff' : 'transparent',
              color: authMode === 'signin' ? '#0c141d' : 'rgba(255, 255, 255, 0.7)',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setError(null); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '999px',
              background: authMode === 'signup' ? '#ffffff' : 'transparent',
              color: authMode === 'signup' ? '#0c141d' : 'rgba(255, 255, 255, 0.7)',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            Create Account
          </button>
        </div>

        {/* Compact Role Selection Pill during Account Creation */}
        {authMode === 'signup' && (
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '6px' }}>
              Account Type
            </label>
            <div style={{
              display: 'inline-flex',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '999px',
              padding: '3px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              width: '100%',
            }}>
              <button
                type="button"
                onClick={() => setSelectedRole('tenant')}
                style={{
                  flex: 1,
                  padding: '6px 14px',
                  borderRadius: '999px',
                  background: selectedRole === 'tenant' ? 'rgba(235, 168, 52, 0.25)' : 'transparent',
                  color: selectedRole === 'tenant' ? '#EBA834' : 'rgba(255, 255, 255, 0.7)',
                  border: selectedRole === 'tenant' ? '1px solid rgba(235, 168, 52, 0.4)' : '1px solid transparent',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  transition: 'all 0.2s ease',
                }}
              >
                <User size={13} /> Tenant
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('landlord')}
                style={{
                  flex: 1,
                  padding: '6px 14px',
                  borderRadius: '999px',
                  background: selectedRole === 'landlord' ? 'rgba(107, 155, 118, 0.25)' : 'transparent',
                  color: selectedRole === 'landlord' ? '#6B9B76' : 'rgba(255, 255, 255, 0.7)',
                  border: selectedRole === 'landlord' ? '1px solid rgba(107, 155, 118, 0.4)' : '1px solid transparent',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  transition: 'all 0.2s ease',
                }}
              >
                <Building size={13} /> Landlord
              </button>
            </div>
          </div>
        )}

        {/* Real User Input Form */}
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '14px',
              padding: '14px 16px',
              marginBottom: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <AlertTriangle size={18} color="#ef4444" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f87171', marginBottom: '4px' }}>
                    Authentication Failed
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.45 }}>
                    {error}
                  </div>
                  {authMode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => { setAuthMode('signup'); setError(null); }}
                      style={{
                        marginTop: '10px',
                        background: '#ffffff',
                        color: '#0c141d',
                        border: 'none',
                        borderRadius: '999px',
                        padding: '6px 14px',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      Switch to Create Account <ArrowRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {authMode === 'signup' && (
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Arjun Sharma"
                className="luxury-input"
              />
            </div>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. arjun.sharma@roofproof.demo"
              className="luxury-input"
            />
          </div>

          {/* Password Field for both Sign In and Create Account */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>
              Password *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="luxury-input"
            />
          </div>

          {authMode === 'signup' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="luxury-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bangalore"
                  className="luxury-input"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-white-pill"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '0.9rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #EBA834 0%, #F59E0B 100%)',
              color: '#0c141d',
              boxShadow: '0 6px 20px rgba(235, 168, 52, 0.4)',
            }}
          >
            {isSubmitting ? 'Authenticating with DB...' : (authMode === 'signin' ? 'Sign In' : 'Create & Sign In')}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
