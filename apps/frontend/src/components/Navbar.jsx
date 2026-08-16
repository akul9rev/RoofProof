import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

export default function Navbar({ activeView, setActiveView, currentRole, setCurrentRole, onListProperty }) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: '2.5rem',
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
          borderRadius: '11px',
          background: 'linear-gradient(135deg, #EBA834 0%, #F59E0B 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(235, 168, 52, 0.45)',
        }}>
          <Shield size={22} color="#0c141d" />
        </div>
        <span style={{
          fontSize: '1.45rem',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: '#ffffff',
          fontFamily: 'var(--font-heading)',
        }}>
          RoofProof
        </span>
      </div>

      {/* Nav Links: Locations, Tenant Portal, Landlord Portal, Form 16 Test UI, About, Reviews */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '26px',
      }}>
        <button
          onClick={() => setActiveView('landing')}
          style={{
            background: 'transparent',
            color: activeView === 'landing' ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
            fontWeight: activeView === 'landing' ? 700 : 500,
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
            fontWeight: activeView === 'tenant' ? 700 : 500,
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
            fontWeight: activeView === 'landlord' ? 700 : 500,
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
            fontWeight: activeView === 'testui' ? 700 : 500,
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
            fontWeight: activeView === 'privacy' ? 700 : 500,
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
            fontWeight: 500,
            fontSize: '0.9rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          Reviews
        </button>
      </nav>

      {/* Right Controls: List Now Glass Button & Book Now White Pill Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button 
          onClick={onListProperty}
          className="btn-glass"
          style={{ padding: '10px 20px', fontSize: '0.85rem' }}
        >
          List Now
        </button>

        <button 
          onClick={() => {
            setCurrentRole('tenant');
            setActiveView('landing');
          }}
          className="btn-white-pill"
          style={{ padding: '12px 26px', fontSize: '0.9rem' }}
        >
          Book Now
        </button>
      </div>
    </header>
  );
}
