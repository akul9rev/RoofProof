import React from 'react';
import { Shield } from 'lucide-react';

export default function Navbar({ activeView, setActiveView, currentRole, setCurrentRole, onListProperty }) {
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
          width: '36px',
          height: '36px',
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

      {/* Right-aligned Nav Links & Action Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '32px',
        marginLeft: 'auto',
      }}>
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
        }}>
          <button
            onClick={() => {
              setCurrentRole('tenant');
              setActiveView('tenant');
            }}
            style={{
              background: 'transparent',
              color: activeView === 'tenant' ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
              fontWeight: 400,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Tenant Portal
          </button>

          <button
            onClick={() => {
              setCurrentRole('landlord');
              setActiveView('landlord');
            }}
            style={{
              background: 'transparent',
              color: activeView === 'landlord' ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
              fontWeight: 400,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Landlord Portal
          </button>

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
              color: 'rgba(255, 255, 255, 0.75)',
              fontWeight: 400,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Reviews
          </button>
        </nav>

        {/* Buttons: List Now and Find a Home */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={onListProperty}
            className="btn-white-pill"
            style={{ padding: '10px 22px', fontSize: '0.88rem' }}
          >
            List Now
          </button>

          <button 
            onClick={() => {
              setCurrentRole('tenant');
              setActiveView('tenant');
            }}
            className="btn-white-pill"
            style={{ padding: '10px 22px', fontSize: '0.88rem' }}
          >
            Find a Home
          </button>
        </div>
      </div>
    </header>
  );
}
