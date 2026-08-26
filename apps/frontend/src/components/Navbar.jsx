import React, { useState } from 'react';
import { Shield, User as UserIcon, LogOut } from 'lucide-react';

export default function Navbar({ activeView, setActiveView, currentRole, onListProperty, currentUser, onOpenLogin, onLogout }) {
  const isLandlord = currentRole === 'landlord';
  const [hoveredNav, setHoveredNav] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

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
      {/* Brand Logo */}
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginLeft: 'auto' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setActiveView('landing')}
            onMouseEnter={() => setHoveredNav('home')}
            onMouseLeave={() => setHoveredNav(null)}
            style={navLinkStyle('home', activeView === 'landing')}
          >
            Home
          </button>

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
              Browse Homes
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
            onMouseEnter={() => setHoveredNav('about')}
            onMouseLeave={() => setHoveredNav(null)}
            style={navLinkStyle('about', false)}
          >
            About
          </button>

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

        {/* Profile Avatar with Dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => currentUser ? setShowUserMenu(m => !m) : onOpenLogin()}
            title={currentUser ? `${currentUser.name} (${currentRole}) — Click to manage account` : 'Sign In to RoofProof'}
            style={{
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

          {/* Dropdown Menu — only when logged in */}
          {showUserMenu && currentUser && (
            <>
              {/* Backdrop to close menu */}
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 998 }}
                onClick={() => setShowUserMenu(false)}
              />
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 12px)',
                right: 0,
                background: 'rgba(12, 18, 25, 0.97)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                padding: '12px',
                minWidth: '200px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                zIndex: 999,
              }}>
                {/* User Info */}
                <div style={{ padding: '8px 10px 12px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>{currentUser.name}</div>
                  <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.5)' }}>{currentUser.email}</div>
                  <div style={{
                    marginTop: '6px',
                    display: 'inline-block',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 10px',
                    borderRadius: '999px',
                    background: isLandlord ? 'rgba(107, 155, 118, 0.2)' : 'rgba(235, 168, 52, 0.2)',
                    color: isLandlord ? '#6B9B76' : '#EBA834',
                    textTransform: 'capitalize',
                  }}>
                    {currentRole}
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    if (typeof onLogout === 'function') onLogout();
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    borderRadius: '12px',
                    color: '#ef4444',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {isLandlord ? (
            <button
              onClick={onListProperty}
              className="btn-white-pill"
              style={{ padding: '9px 22px', fontSize: '0.86rem', fontWeight: 700, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)' }}
            >
              List Now
            </button>
          ) : (
            <button
              onClick={() => setActiveView('tenant')}
              className="btn-white-pill"
              style={{ padding: '9px 22px', fontSize: '0.86rem', fontWeight: 700, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)' }}
            >
              Find a Home
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
