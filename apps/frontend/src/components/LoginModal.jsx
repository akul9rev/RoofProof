import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Shield, ArrowRight, CheckCircle2, Building, User, Phone, MapPin, Briefcase } from 'lucide-react';
import { loginOrRegister } from '../services/api';

export default function LoginModal({ isOpen, onClose, currentRole, onLoginSuccess, currentUser }) {
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'
  const [selectedRole, setSelectedRole] = useState(currentRole || 'tenant');
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
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

  const presetLandlords = [
    {
      id: 1,
      name: 'Rohan Mehta',
      email: 'rohan.mehta@roofproof.demo',
      role: 'landlord',
      phone: '+91 98200 11223',
      city: 'Coorg, KA',
      organization: 'Mehta Luxury Estates',
      title: 'Owner of 4 Luxury & Heritage Properties',
    },
    {
      id: 2,
      name: 'Priya Nair',
      email: 'priya.nair@roofproof.demo',
      role: 'landlord',
      phone: '+91 98450 33445',
      city: 'Jaipur, RJ',
      organization: 'Heritage Living India',
      title: 'Owner of 3 Palace & Courtyard Residences',
    },
  ];

  const presetTenants = [
    {
      id: 3,
      name: 'Arjun Sharma',
      email: 'arjun.sharma@roofproof.demo',
      role: 'tenant',
      phone: '+91 98765 43210',
      city: 'Bangalore, KA',
      occupation: 'Senior Software Engineer',
      title: 'Form 16 Verified (Gross: ₹18.5L)',
    },
    {
      id: 4,
      name: 'Neha Kapoor',
      email: 'neha.kapoor@roofproof.demo',
      role: 'tenant',
      phone: '+91 98111 22334',
      city: 'Mumbai, MH',
      occupation: 'Product Lead',
      title: 'Form 16 Verified (Gross: ₹15.2L)',
    },
  ];

  const handleQuickLogin = (preset) => {
    onLoginSuccess(preset);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Please enter your email address');
      return;
    }
    if (authMode === 'signup' && !name) {
      setError('Please enter your full name');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: name || (selectedRole === 'tenant' ? 'Arjun Sharma' : 'Rohan Mehta'),
        email,
        role: selectedRole,
        phone,
        city,
        occupation: selectedRole === 'tenant' ? occupation : undefined,
        organization: selectedRole === 'landlord' ? organization : undefined,
      };

      const res = await loginOrRegister(payload);
      const userObj = res?.user || {
        id: selectedRole === 'tenant' ? 3 : 1,
        ...payload,
      };

      onLoginSuccess(userObj);
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      setIsSubmitting(false);
      onLoginSuccess({
        id: selectedRole === 'tenant' ? 3 : 1,
        name: name || (selectedRole === 'tenant' ? 'Arjun Sharma' : 'Rohan Mehta'),
        email: email || (selectedRole === 'tenant' ? 'arjun.sharma@roofproof.demo' : 'rohan.mehta@roofproof.demo'),
        role: selectedRole,
        phone,
        city,
        occupation: selectedRole === 'tenant' ? occupation : undefined,
        organization: selectedRole === 'landlord' ? organization : undefined,
      });
      onClose();
    }
  };

  return createPortal(
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
        className="luxury-modal-container animate-modal-scale"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '28px 30px',
          borderRadius: '26px',
          background: 'linear-gradient(165deg, rgba(16, 24, 34, 0.98) 0%, rgba(10, 16, 24, 0.99) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.85), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
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
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
              {authMode === 'signin' ? 'Sign In to RoofProof' : 'Create RoofProof Account'}
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
              Midnight Zero-Knowledge Identity Protection
            </p>
          </div>
        </div>

        {/* Auth Mode Switcher (Sign In vs Create Account) */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.06)',
          borderRadius: '999px',
          padding: '3px',
          marginBottom: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <button
            type="button"
            onClick={() => setAuthMode('signin')}
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
            onClick={() => setAuthMode('signup')}
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

        {/* Role Selector Tabs */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
            Select Account Role
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div
              onClick={() => setSelectedRole('tenant')}
              style={{
                background: selectedRole === 'tenant' ? 'rgba(235, 168, 52, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${selectedRole === 'tenant' ? 'rgba(235, 168, 52, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: '14px',
                padding: '12px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <User size={20} color={selectedRole === 'tenant' ? '#EBA834' : 'rgba(255, 255, 255, 0.6)'} style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: selectedRole === 'tenant' ? '#EBA834' : '#ffffff' }}>Tenant</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }}>Verify Income</div>
            </div>

            <div
              onClick={() => setSelectedRole('landlord')}
              style={{
                background: selectedRole === 'landlord' ? 'rgba(107, 155, 118, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${selectedRole === 'landlord' ? 'rgba(107, 155, 118, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: '14px',
                padding: '12px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <Building size={20} color={selectedRole === 'landlord' ? '#6B9B76' : 'rgba(255, 255, 255, 0.6)'} style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: selectedRole === 'landlord' ? '#6B9B76' : '#ffffff' }}>Landlord</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.5)' }}>List Properties</div>
            </div>
          </div>
        </div>

        {/* Quick Demo Logins in Sign In mode */}
        {authMode === 'signin' && (
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '8px' }}>
              Quick Demo Accounts:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(selectedRole === 'landlord' ? presetLandlords : presetTenants).map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleQuickLogin(preset)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
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
                      width: '34px', height: '34px', borderRadius: '50%',
                      background: preset.role === 'landlord'
                        ? 'linear-gradient(135deg, #6B9B76 0%, #4A7C59 100%)'
                        : 'linear-gradient(135deg, #EBA834 0%, #F59E0B 100%)',
                      color: preset.role === 'landlord' ? '#ffffff' : '#0c141d',
                      fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem',
                    }}>
                      {preset.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>{preset.name}</div>
                      <div style={{ fontSize: '0.72rem', color: preset.role === 'landlord' ? '#6B9B76' : '#EBA834' }}>
                        {preset.title}
                      </div>
                    </div>
                  </div>
                  <span className="btn-white-pill" style={{ padding: '5px 12px', fontSize: '0.74rem' }}>
                    Quick Login <ArrowRight size={11} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Input Form */}
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '10px 14px',
              color: '#f87171',
              fontSize: '0.82rem',
              marginBottom: '14px',
            }}>
              {error}
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
                placeholder={selectedRole === 'tenant' ? 'e.g. Arjun Sharma' : 'e.g. Rohan Mehta'}
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
              placeholder={selectedRole === 'tenant' ? 'arjun.sharma@roofproof.demo' : 'rohan.mehta@roofproof.demo'}
              className="luxury-input"
            />
          </div>

          {authMode === 'signup' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
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

              {selectedRole === 'tenant' ? (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>
                    Occupation / Role
                  </label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="luxury-input"
                  />
                </div>
              ) : (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>
                    Realty Organization / Company
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Mehta Luxury Estates"
                    className="luxury-input"
                  />
                </div>
              )}
            </>
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
              background: selectedRole === 'landlord'
                ? 'linear-gradient(135deg, #6B9B76 0%, #4A7C59 100%)'
                : 'linear-gradient(135deg, #EBA834 0%, #F59E0B 100%)',
              color: selectedRole === 'landlord' ? '#ffffff' : '#0c141d',
              boxShadow: selectedRole === 'landlord'
                ? '0 6px 20px rgba(107, 155, 118, 0.4)'
                : '0 6px 20px rgba(235, 168, 52, 0.4)',
            }}
          >
            {isSubmitting ? 'Authenticating...' : (authMode === 'signin' ? 'Sign In Now' : 'Create & Sign In')}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
