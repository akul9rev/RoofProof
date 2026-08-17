import React from 'react';
import { Shield, User, LogIn } from 'lucide-react';

export default function Navbar({ activeView, setActiveView, currentRole, onListProperty, currentUser, onOpenLogin }) {
  const isLandlord = currentRole === 'landlord';

  const getUserInitials = (name) => {
    if (!name) return 'RP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getUserInitials(currentUser?.name);

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: '1.2rem',
      width: '100%',
    }}>
      {/* Brand Logo - RoofProof */}
      <div 
        onClick={() => setActiveView('landing')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
        }}
      >
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #EBA834 0%, #F59E0B 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(235, 168, 52, 0.45)',
        }}>
          <Shield size={20} color="#0c141d" />
        </div>
        <span style={{
          fontSize: '1.35rem',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          color: '#ffffff',
          fontFamily: 'var(--font-heading)',
        }}>
          RoofProof
        </span>
      </div>

      {/* Navigation Links - Role Dependent */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginLeft: 'auto',
      }}>
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
        }}>
          <button
            onClick={() => setActiveView('landing')}
            style={{
              background: 'transparent',
              color: activeView === 'landing' ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
              fontWeight: activeView === 'landing' ? 600 : 400,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Home
          </button>

          {/* If Landlord logged in -> Show ONLY Landlord Portal */}
          {isLandlord && (
            <button
              onClick={() => setActiveView('landlord')}
              style={{
                background: 'transparent',
                color: activeView === 'landlord' ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                fontWeight: activeView === 'landlord' ? 600 : 400,
                fontSize: '0.9rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Landlord Portal
            </button>
          )}

          {/* If Tenant logged in -> Show ONLY Tenant Portal */}
          {!isLandlord && (
            <button
              onClick={() => setActiveView('tenant')}
              style={{
                background: 'transparent',
                color: activeView === 'tenant' ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                fontWeight: activeView === 'tenant' ? 600 : 400,
                fontSize: '0.9rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Tenant Portal
            </button>
          )}

          <button
            onClick={() => {
              setActiveView('landing');
              setTimeout(() => {
                const el = document.getElementById('about-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 50);
            }}
            style={{
              background: 'transparent',
              color: 'rgba(255, 255, 255, 0.75)',
              fontWeight: 400,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            About
          </button>
        </nav>

        {/* Profile / Sign In Button - No Switch Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={onOpenLogin}
            className="btn-white-pill"
            style={{
              padding: '8px 18px',
              fontSize: '0.84rem',
              background: isLandlord
                ? 'linear-gradient(135deg, #4A7C59 0%, #3B6647 100%)'
                : 'linear-gradient(135deg, #EBA834 0%, #F59E0B 100%)',
              color: isLandlord ? '#ffffff' : '#0c141d',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <User size={15} /> Sign In
          </button>

          <div
            onClick={onOpenLogin}
            title={`Logged in as ${currentUser?.name || 'User'} (${currentRole})`}
            style={{
              position: 'relative',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: isLandlord
                ? 'linear-gradient(135deg, #6B9B76 0%, #4A7C59 100%)'
                : 'linear-gradient(135deg, #EBA834 0%, #F59E0B 100%)',
              color: isLandlord ? '#ffffff' : '#0c141d',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isLandlord ? '0 0 14px rgba(107, 155, 118, 0.35)' : '0 0 14px rgba(235, 168, 52, 0.35)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
            }}>
              {initials}
            </div>
            <span style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#22c55e',
              border: '2px solid #09121a',
            }}></span>
          </div>
        </div>

        {/* Action Button: Landlord sees 'List Now', Tenant sees 'Book / Apply' */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isLandlord ? (
            <button 
              onClick={onListProperty}
              className="btn-white-pill"
              style={{ padding: '9px 20px', fontSize: '0.86rem' }}
            >
              List Now
            </button>
          ) : (
            <button 
              onClick={() => setActiveView('tenant')}
              className="btn-white-pill"
              style={{ padding: '9px 20px', fontSize: '0.86rem' }}
            >
              Book / Apply
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
