import React from 'react';
import { ShieldAlert, AlertTriangle, Lock, ArrowLeft, RefreshCw, UserCheck } from 'lucide-react';

export default function ErrorPage({ type = '403', onNavigate, onOpenLogin, currentRole }) {
  const isLandlordRole = currentRole === 'landlord';

  const errorConfigs = {
    403: {
      code: '403',
      title: 'Access Restricted',
      subtitle: isLandlordRole ? 'Tenant Portal Restricted for Landlords' : 'Landlord Portal Restricted for Tenants',
      description: isLandlordRole 
        ? 'You are signed in as a Landlord. Landlord accounts are restricted from viewing the Tenant Portal. Please access the Landlord Portal to manage your properties and review tenant applications.'
        : 'You are signed in as a Tenant. Tenant accounts do not have permission to view the Landlord Management Portal or publish new property listings. Please switch or sign in as a Landlord.',
      icon: Lock,
      color: '#ef4444',
      bgGlow: 'rgba(239, 68, 68, 0.15)',
      borderColor: 'rgba(239, 68, 68, 0.3)',
      primaryActionText: isLandlordRole ? 'Go to Landlord Portal' : 'Go to Tenant Portal',
      primaryActionView: isLandlordRole ? 'landlord' : 'tenant',
      showLoginButton: true,
      loginButtonText: 'Switch Account',
    },
    404: {
      code: '404',
      title: 'Page Not Found',
      subtitle: 'Resource Missing or Moved',
      description: 'The requested page URL does not exist or has been relocated. Please return to the homepage or use the main navigation bar to browse properties.',
      icon: AlertTriangle,
      color: '#EBA834',
      bgGlow: 'rgba(235, 168, 52, 0.15)',
      borderColor: 'rgba(235, 168, 52, 0.3)',
      primaryActionText: 'Back to Homepage',
      primaryActionView: 'landing',
      showLoginButton: false,
    },
    401: {
      code: '401',
      title: 'Authentication Required',
      subtitle: 'Session Expired or Login Required',
      description: 'Your session requires authentication. Please sign in to your RoofProof account using your registered email and password to access private portal features.',
      icon: ShieldAlert,
      color: '#3b82f6',
      bgGlow: 'rgba(59, 130, 246, 0.15)',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      primaryActionText: 'Back to Homepage',
      primaryActionView: 'landing',
      showLoginButton: true,
      loginButtonText: 'Sign In Now',
    },
    500: {
      code: '500',
      title: 'Internal Server Error',
      subtitle: 'Backend Database Connection Timeout',
      description: 'An unexpected backend database error occurred while processing your request. Please reload the application or try again in a few moments.',
      icon: RefreshCw,
      color: '#f97316',
      bgGlow: 'rgba(249, 115, 22, 0.15)',
      borderColor: 'rgba(249, 115, 22, 0.3)',
      primaryActionText: 'Reload Page',
      primaryActionView: 'landing',
      showLoginButton: false,
    },
  };

  const config = errorConfigs[type] || errorConfigs[404];
  const IconComponent = config.icon;

  return (
    <div className="animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '65vh',
      textAlign: 'center',
      padding: '40px 20px',
    }}>
      <div style={{
        maxWidth: '540px',
        width: '100%',
        padding: '36px',
        borderRadius: '28px',
        background: 'linear-gradient(165deg, rgba(16, 24, 34, 0.98) 0%, rgba(10, 16, 24, 0.99) 100%)',
        border: `1px solid ${config.borderColor}`,
        boxShadow: '0 30px 90px rgba(0, 0, 0, 0.85), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
        position: 'relative',
      }}>
        {/* Error Code Glow Badge */}
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '20px',
          background: config.bgGlow,
          border: `1px solid ${config.borderColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: `0 0 30px ${config.bgGlow}`,
        }}>
          <IconComponent size={34} color={config.color} />
        </div>

        <span style={{
          fontSize: '0.85rem',
          fontWeight: 800,
          color: config.color,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          display: 'block',
          marginBottom: '6px',
        }}>
          ERROR {config.code}
        </span>

        <h2 style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: '#ffffff',
          marginBottom: '6px',
        }}>
          {config.title}
        </h2>

        <p style={{
          fontSize: '0.9rem',
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.7)',
          marginBottom: '16px',
        }}>
          {config.subtitle}
        </p>

        <p style={{
          fontSize: '0.88rem',
          color: 'rgba(255, 255, 255, 0.65)',
          lineHeight: 1.6,
          marginBottom: '28px',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '14px 18px',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}>
          {config.description}
        </p>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          alignItems: 'center',
        }}>
          <button
            onClick={() => {
              if (type === '500') {
                window.location.reload();
              } else {
                onNavigate(config.primaryActionView);
              }
            }}
            className="btn-white-pill"
            style={{
              width: '100%',
              padding: '12px 24px',
              fontSize: '0.9rem',
              fontWeight: 700,
            }}
          >
            <ArrowLeft size={16} /> {config.primaryActionText}
          </button>

          {config.showLoginButton && (
            <button
              onClick={onOpenLogin}
              style={{
                width: '100%',
                padding: '12px 24px',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              <UserCheck size={16} color="#EBA834" /> {config.loginButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
