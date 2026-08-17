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

  const presetTenant = {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    role: 'tenant',
    phone: '+91 98765 43210',
    city: 'Bangalore, KA',
    occupation: 'Software Engineer',
    title: 'Form 16 Ready (Gross: ₹9.2L)',
  };

  const presetLandlord = {
    id: 2,
    name: 'Ananya Verma',
    email: 'ananya.verma@example.com',
    role: 'landlord',
    phone: '+91 98123 45678',
    city: 'Mumbai, MH',
    organization: 'Verma Heritage Estates',
    title: 'Verified Property Owner',
  };

  const handleQuickLogin = (preset) => {
    onLoginSuccess(preset);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        name: name || (selectedRole === 'tenant' ? 'Rahul Sharma' : 'Ananya Verma'),
        email: email || (selectedRole === 'tenant' ? 'rahul.sharma@example.com' : 'ananya.verma@example.com'),
        role: selectedRole,
        phone,
        city,
        occupation: selectedRole === 'tenant' ? occupation : null,
        organization: selectedRole === 'landlord' ? organization : null,
      };

      const res = await loginOrRegister(payload);
      const userObj = res?.user || {
        id: selectedRole === 'tenant' ? 1 : 2,
        ...payload,
      };

      onLoginSuccess(userObj);
      setIsSubmitting(false);
      onClose();
    } catch (err) {
      setIsSubmitting(false);
      onLoginSuccess({
        id: selectedRole === 'tenant' ? 1 : 2,
        name: name || (selectedRole === 'tenant' ? 'Rahul Sharma' : 'Ananya Verma'),
        email: email || (selectedRole === 'tenant' ? 'rahul.sharma@example.com' : 'ananya.verma@example.com'),
        role: selectedRole,
        phone,
        city,
        occupation,
        organization,
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
        className="glass-card animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '480px',
          width: '100%',
          padding: '28px 30px',
          borderRadius: '26px',
          background: 'linear-gradient(165deg, rgba(16, 24, 34, 0.98) 0%, rgba(10, 16, 24, 0.99) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.85), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
          position: 'relative',
          maxHeight: '92vh',
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
              Quick Demo Login:
            </div>
            {selectedRole === 'tenant' ? (
              <div
                onClick={() => handleQuickLogin(presetTenant)}
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
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #EBA834 0%, #F59E0B 100%)',
                    color: '#0c141d', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem',
                  }}>RS</div>
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
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6B9B76 0%, #4A7C59 100%)',
                    color: '#ffffff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem',
                  }}>AV</div>
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
        )}

        {/* Detailed Account Registration / Sign In Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>Full Name *</label>
            <input 
              type="text" 
              placeholder={selectedRole === 'tenant' ? 'Rahul Sharma' : 'Ananya Verma'} 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
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

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>Email Address *</label>
            <input 
              type="email" 
              placeholder={selectedRole === 'tenant' ? 'rahul.sharma@example.com' : 'ananya.verma@example.com'} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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

          {/* Additional Profile Details when creating account */}
          {authMode === 'signup' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>Phone / WhatsApp</label>
                  <input 
                    type="text" 
                    placeholder="+91 98765 43210" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '12px',
                      padding: '9px 12px',
                      color: '#ffffff',
                      fontSize: '0.82rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>City / Region</label>
                  <input 
                    type="text" 
                    placeholder="Bangalore, KA" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '12px',
                      padding: '9px 12px',
                      color: '#ffffff',
                      fontSize: '0.82rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {selectedRole === 'tenant' ? (
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>Occupation / Job Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Senior Software Engineer" 
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '12px',
                      padding: '9px 12px',
                      color: '#ffffff',
                      fontSize: '0.82rem',
                      outline: 'none',
                    }}
                  />
                </div>
              ) : (
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>Realty / Business Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Verma Heritage Estates" 
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '12px',
                      padding: '9px 12px',
                      color: '#ffffff',
                      fontSize: '0.82rem',
                      outline: 'none',
                    }}
                  />
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-white-pill"
            style={{ width: '100%', padding: '12px', fontSize: '0.88rem', marginTop: '6px' }}
          >
            {authMode === 'signin' ? 'Sign In as ' : 'Create '} {selectedRole === 'tenant' ? 'Tenant Account' : 'Landlord Account'}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
