import React, { useState } from 'react';
import { Shield } from 'lucide-react';

export default function Navbar({ activeView, setActiveView, currentRole, onListProperty, currentUser, onOpenLogin }) {
  const isLandlord = currentRole === 'landlord';
  const [hoveredNav, setHoveredNav] = useState(null);

  const getUserInitials = (name) => {
    if (!name) return 'RP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getUserInitials(currentUser?.name);

  const navItemStyle = (viewKey, isTargetActive) => ({
    background: isTargetActive 
      ? 'rgba(255, 255, 255, 0.12)' 
      : (hoveredNav === viewKey ? 'rgba(255, 255, 255, 0.07)' : 'transparent'),
    color: isTargetActive || hoveredNav === viewKey ? '#ffffff' : 'rgba(255, 255, 255, 0.78)',
    fontWeight: isTargetActive ? 700 : 500,
    fontSize: '0.88rem',
    letterSpacing: '-0.01em',
    border: 'none',
    padding: '7px 16px',
    borderRadius: '999px',
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backdropFilter: 'blur(4px)',
  });

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 24px',
      width: '100%',
      marginBottom: '24px',
      background: 'rgba(255, 255, 255, 0.04)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.14)',
      borderRadius: '999px',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.28), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
      transition: 'all 0.3s ease',
    }}>
      {/* Brand Logo - RoofProof */}
      <div 
        onClick={() => setActiveView('landing')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #EBA834 0%, #F59E0B 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 24px rgba(235, 168, 52, 0.5)',
          transition: 'transform 0.3s ease',
        }}>
          <Shield size={20} color="#0c141d" />
        </div>
        <span style={{
          fontSize: '1.4rem',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: '#ffffff',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.85) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          RoofProof
        </span>
      </div>

      {/* Navigation Links & User Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginLeft: 'auto',
      }}>
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <button
            onClick={() => setActiveView('landing')}
            onMouseEnter={() => setHoveredNav('home')}
            onMouseLeave={() => setHoveredNav(null)}
            style={navItemStyle('home', activeView === 'landing')}
          >
            Home
          </button>

          {/* Role Dependent Portal Link */}
          {isLandlord ? (
            <button
              onClick={() => setActiveView('landlord')}
              onMouseEnter={() => setHoveredNav('landlord')}
              onMouseLeave={() => setHoveredNav(null)}
              style={navItemStyle('landlord', activeView === 'landlord')}
            >
              Landlord Portal
            </button>
          ) : (
            <button
              onClick={() => setActiveView('tenant')}
              onMouseEnter={() => setHoveredNav('tenant')}
              onMouseLeave={() => setHoveredNav(null)}
              style={navItemStyle('tenant', activeView === 'tenant')}
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
            style={navItemStyle('about', false)}
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
            style={navItemStyle('reviews', false)}
          >
            Reviews
          </button>
        </nav>

        {/* Profile Avatar Only - Glowing Glass Pill */}
        <div
          onClick={onOpenLogin}
          title={`Logged in as ${currentUser?.name || 'User'} (${currentRole}) - Click to sign in or switch account`}
          style={{
            position: 'relative',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s ease',
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: isLandlord
              ? 'linear-gradient(135deg, #6B9B76 0%, #4A7C59 100%)'
              : 'linear-gradient(135deg, #EBA834 0%, #F59E0B 100%)',
            color: isLandlord ? '#ffffff' : '#0c141d',
            fontWeight: 800,
            fontSize: '0.92rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isLandlord ? '0 0 20px rgba(107, 155, 118, 0.45)' : '0 0 20px rgba(235, 168, 52, 0.45)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
          }}>
            {initials}
          </div>
          <span style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            width: '11px',
            height: '11px',
            borderRadius: '50%',
            background: '#22c55e',
            border: '2px solid #09121a',
            boxShadow: '0 0 8px #22c55e',
          }}></span>
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
                boxShadow: '0 6px 20px rgba(255, 255, 255, 0.25)',
                transition: 'all 0.25s ease',
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
                boxShadow: '0 6px 20px rgba(255, 255, 255, 0.25)',
                transition: 'all 0.25s ease',
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
