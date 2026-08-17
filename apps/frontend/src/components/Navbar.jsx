import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

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
      position: 'sticky',
      top: '12px',
      zIndex: 900,
      width: '100%',
      marginBottom: '1.5rem',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 24px',
        width: '100%',
        background: 'rgba(8, 14, 22, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.14)',
        borderRadius: '999px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
        transition: 'all 0.3s ease',
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
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #EBA834 0%, #F59E0B 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(235, 168, 52, 0.5)',
          }}>
            <Shield size={20} color="#0c141d" />
          </div>
          <span style={{
            fontSize: '1.3rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            fontFamily: 'var(--font-heading)',
          }}>
            RoofProof
          </span>
        </div>

        {/* Navigation Links - Common & Role Dependent */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
        }}>
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '22px',
          }}>
            <button
              onClick={() => setActiveView('landing')}
              style={{
                background: 'transparent',
                color: activeView === 'landing' ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                fontWeight: activeView === 'landing' ? 700 : 500,
                fontSize: '0.88rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Home
            </button>

            {/* Role Dependent Portal Link */}
            {isLandlord ? (
              <button
                onClick={() => setActiveView('landlord')}
                style={{
                  background: activeView === 'landlord' ? 'rgba(107, 155, 118, 0.2)' : 'transparent',
                  color: activeView === 'landlord' ? '#6B9B76' : 'rgba(255, 255, 255, 0.7)',
                  fontWeight: activeView === 'landlord' ? 700 : 500,
                  fontSize: '0.88rem',
                  padding: '5px 14px',
                  borderRadius: '999px',
                  border: activeView === 'landlord' ? '1px solid rgba(107, 155, 118, 0.4)' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Landlord Portal
              </button>
            ) : (
              <button
                onClick={() => setActiveView('tenant')}
                style={{
                  background: activeView === 'tenant' ? 'rgba(235, 168, 52, 0.2)' : 'transparent',
                  color: activeView === 'tenant' ? '#EBA834' : 'rgba(255, 255, 255, 0.7)',
                  fontWeight: activeView === 'tenant' ? 700 : 500,
                  fontSize: '0.88rem',
                  padding: '5px 14px',
                  borderRadius: '999px',
                  border: activeView === 'tenant' ? '1px solid rgba(235, 168, 52, 0.4)' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Tenant Portal
              </button>
            )}

            {/* Common About Link */}
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
                color: 'rgba(255, 255, 255, 0.7)',
                fontWeight: 500,
                fontSize: '0.88rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              About
            </button>

            {/* Common Reviews Link */}
            <button
              onClick={() => {
                setActiveView('landing');
                setTimeout(() => {
                  const el = document.getElementById('reviews-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              style={{
                background: 'transparent',
                color: 'rgba(255, 255, 255, 0.7)',
                fontWeight: 500,
                fontSize: '0.88rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Reviews
            </button>
          </nav>

          {/* Profile Avatar Only - Clean & Minimalist */}
          <div
            onClick={onOpenLogin}
            title={`Logged in as ${currentUser?.name || 'User'} (${currentRole}) - Click to sign in or switch profile`}
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
              boxShadow: isLandlord ? '0 0 16px rgba(107, 155, 118, 0.4)' : '0 0 16px rgba(235, 168, 52, 0.4)',
              border: '2px solid rgba(255, 255, 255, 0.25)',
              transition: 'all 0.2s ease',
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

          {/* Action Button: Landlord sees 'List Now', Tenant sees 'Find a Home' */}
          <div>
            {isLandlord ? (
              <button 
                onClick={onListProperty}
                className="btn-white-pill"
                style={{ padding: '8px 20px', fontSize: '0.84rem' }}
              >
                List Now
              </button>
            ) : (
              <button 
                onClick={() => setActiveView('tenant')}
                className="btn-white-pill"
                style={{ padding: '8px 20px', fontSize: '0.84rem' }}
              >
                Find a Home
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
