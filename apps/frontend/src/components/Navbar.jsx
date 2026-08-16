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

      {/* Right-aligned Nav Links & Buttons matching Image 2 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '36px',
      }}>
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '28px',
        }}>
          <button
            onClick={() => setActiveView('landing')}
            style={{
              background: 'transparent',
              color: activeView === 'landing' ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
              fontWeight: 400,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Locations
          </button>

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
            onClick={() => setActiveView('testui')}
            style={{
              background: 'transparent',
              color: activeView === 'testui' ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
              fontWeight: 400,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            Form 16 Test UI
          </button>

          <button
            onClick={() => setActiveView('privacy')}
            style={{
              background: 'transparent',
              color: activeView === 'privacy' ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
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
            onClick={() => setActiveView('privacy')}
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

        {/* Both List Now and Book Now are solid white pill buttons */}
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
              setActiveView('landing');
            }}
            className="btn-white-pill"
            style={{ padding: '10px 22px', fontSize: '0.88rem' }}
          >
            Book Now
          </button>
        </div>
      </div>
    </header>
  );
}
