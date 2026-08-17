import React, { useState } from 'react';
import { Shield, User as UserIcon } from 'lucide-react';

export default function Navbar({ activeView, setActiveView, currentRole, onListProperty, currentUser, onOpenLogin }) {
  const isLandlord = currentRole === 'landlord';
  const [hoveredNav, setHoveredNav] = useState(null);

  const getUserInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getUserInitials(currentUser?.name);

  const navLinkStyle = (viewKey, isActive) => ({
    background: 'transparent',
    color: isActive 
      ? '#ffffff' 
      : (hoveredNav === viewKey ? '#ffffff' : 'rgba(255, 255, 255, 0.85)'),
    fontWeight: isActive ? 700 : 500,
    fontSize: '0.92rem',
    letterSpacing: '-0.01em',
    border: 'none',
    padding: '6px 12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
  });

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '4px 0 20px',
      width: '100%',
      background: 'transparent',
      border: 'none',
      boxShadow: 'none',
    }}>
      {/* Brand Logo - RoofProof */}
      <div 
        onClick={() => setActiveView('landing')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          userSelect: 'none',
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
          boxShadow: '0 0 16px rgba(235, 168, 52, 0.4)',
        }}>
          <Shield size={19} color="#0c141d" />
        </div>
        <span style={{
          fontSize: '1.4rem',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          color: '#ffffff',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        }}>
          RoofProof
        </span>
      </div>

      {/* Navigation Links & Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        marginLeft: 'auto',
      }}>
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <button
            onClick={() => setActiveView('landing')}
            onMouseEnter={() => setHoveredNav('home')}
            onMouseLeave={() => setHoveredNav(null)}
            style={navLinkStyle('home', activeView === 'landing')}
          >
            Home
          </button>

          {/* Role Dependent Portal Link */}
          {isLandlord ? (
            <button
              onClick={() => setActiveView('landlord')}
              onMouseEnter={() => setHoveredNav('landlord')}
              onMouseLeave={() => setHoveredNav(null)}
              style={navLinkStyle('landlord', activeView === 'landlord')}
            >
              Landlord Portal
            </button>
          ) : (
            <button
              onClick={() => setActiveView('tenant')}
              onMouseEnter={() => setHoveredNav('tenant')}
              onMouseLeave={() => setHoveredNav(null)}
              style={navLinkStyle('tenant', activeView === 'tenant')}
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
            onMouseEnter={() => setHoveredNav('about')}
            onMouseLeave={() => setHoveredNav(null)}
            style={navLinkStyle('about', false)}
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
            onMouseEnter={() => setHoveredNav('reviews')}
            onMouseLeave={() => setHoveredNav(null)}
            style={navLinkStyle('reviews', false)}
          >
            Reviews
          </button>
        </nav>

        {/* Profile Avatar: Empty User Icon if Not Logged In, Initials if Logged In */}
        <div
          onClick={onOpenLogin}
          title={currentUser ? `Logged in as ${currentUser.name} (${currentRole}) - Click to switch account` : 'Sign In to RoofProof'}
          style={{
            position: 'relative',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {currentUser ? (
            <>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: isLandlord
                  ? 'linear-gradient(135deg, #6B9B76 0%, #4A7C59 100%)'
                  : 'linear-gradient(135deg, #EBA834 0%, #F59E0B 100%)',
                color: isLandlord ? '#ffffff' : '#0c141d',
                fontWeight: 800,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isLandlord ? '0 0 14px rgba(107, 155, 118, 0.4)' : '0 0 14px rgba(235, 168, 52, 0.4)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
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
            </>
          ) : (
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              color: 'rgba(255, 255, 255, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid rgba(255, 255, 255, 0.25)',
              transition: 'all 0.2s ease',
            }}>
              <UserIcon size={18} />
            </div>
          )}
        </div>

        {/* Action Button: Landlord sees 'List Now', Tenant sees 'Find a Home' */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {isLandlord ? (
            <button 
              onClick={onListProperty}
              className="btn-white-pill"
              style={{
                padding: '9px 22px',
                fontSize: '0.86rem',
                fontWeight: 700,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
              }}
            >
              List Now
            </button>
          ) : (
            <button 
              onClick={() => setActiveView('tenant')}
              className="btn-white-pill"
              style={{
                padding: '9px 22px',
                fontSize: '0.86rem',
                fontWeight: 700,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
              }}
            >
              Find a Home
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
