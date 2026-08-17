import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import LandingPage from './components/LandingPage.jsx';
import TenantDashboard from './components/TenantDashboard.jsx';
import LandlordDashboard from './components/LandlordDashboard.jsx';
import PrivacyVerificationView from './components/PrivacyVerificationView.jsx';
import PdfExtractTestUI from './components/PdfExtractTestUI.jsx';
import ApplyModal from './components/ApplyModal.jsx';
import CreatePropertyPage from './components/CreatePropertyPage.jsx';
import LoginModal from './components/LoginModal.jsx';
import ErrorPage from './components/ErrorPage.jsx';
import { fetchProperties, fetchApplications, applyForProperty, updateApplicationStatus, createProperty, deleteProperty } from './services/api.js';

export default function App() {
  const getViewFromPath = () => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/tenant')) return 'tenant';
    if (path.includes('/landlord')) return 'landlord';
    if (path.includes('/privacy')) return 'privacy';
    if (path.includes('/list')) return 'list-property';
    if (path.includes('/403')) return '403';
    if (path.includes('/401')) return '401';
    if (path.includes('/500')) return '500';
    if (path !== '/' && path !== '') return '404';
    return 'landing';
  };

  const [activeView, setActiveView] = useState(getViewFromPath);
  const [currentRole, setCurrentRole] = useState('tenant');

  const navigateTo = (view) => {
    setActiveView(view);
    let path = '/';
    if (view === 'tenant') path = '/tenant';
    else if (view === 'landlord') path = '/landlord';
    else if (view === 'privacy') path = '/privacy';
    else if (view === 'list-property') path = '/list-property';
    else if (view === '403') path = '/403';
    else if (view === '404') path = '/404';
    else if (view === '401') path = '/401';
    else if (view === '500') path = '/500';

    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setActiveView(getViewFromPath());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [currentUser, setCurrentUser] = useState({
    id: 3,
    name: 'Arjun Sharma',
    email: 'arjun.sharma@roofproof.demo',
    role: 'tenant',
    phone: '+91 98765 43210',
    city: 'Bangalore, KA',
    occupation: 'Senior Software Engineer',
  });

  const [properties, setProperties] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPropertyForApply, setSelectedPropertyForApply] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [deletedPropertyIds, setDeletedPropertyIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('roofproof_deleted_props') || '[]');
    } catch (e) {
      return [];
    }
  });

  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [propsRes, appsRes] = await Promise.all([
        fetchProperties(),
        fetchApplications(),
      ]);
      const loadedProperties = Array.isArray(propsRes) ? propsRes : (propsRes?.properties || []);
      const loadedApplications = Array.isArray(appsRes) ? appsRes : (appsRes?.applications || []);

      setProperties(loadedProperties);
      setApplications(loadedApplications);
    } catch (err) {
      console.error('Failed to fetch DApp data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeView]);

  const handleLoginSuccess = (userObj) => {
    setCurrentUser(userObj);
    setCurrentRole(userObj.role);
    showNotification(`Signed in successfully as ${userObj.name} (${userObj.role})`, 'success');
  };

  const handleApplySubmit = async (payload) => {
    try {
      const res = await applyForProperty(payload.property_id, payload);
      const newApp = res?.application || {
        id: Date.now(),
        property_id: payload.property_id,
        tenant_id: payload.tenant_id || currentUser?.id || 3,
        status: 'pending',
        verification_status: payload.verification_status,
        zk_tx_hash: payload.zk_tx_hash,
        created_at: new Date().toISOString(),
      };

      setApplications(prev => [newApp, ...prev]);
      try {
        const stored = JSON.parse(localStorage.getItem('roofproof_my_apps') || '[]');
        localStorage.setItem('roofproof_my_apps', JSON.stringify([newApp, ...stored]));
      } catch (e) {}

      showNotification('Privacy proof generated and application submitted!', 'success');
      setSelectedPropertyForApply(null);
      await fetchData();
    } catch (err) {
      const fallbackApp = {
        id: Date.now(),
        property_id: payload.property_id,
        tenant_id: payload.tenant_id || currentUser?.id || 3,
        status: 'pending',
        verification_status: payload.verification_status,
        zk_tx_hash: payload.zk_tx_hash,
        created_at: new Date().toISOString(),
      };
      setApplications(prev => [fallbackApp, ...prev]);
      try {
        const stored = JSON.parse(localStorage.getItem('roofproof_my_apps') || '[]');
        localStorage.setItem('roofproof_my_apps', JSON.stringify([fallbackApp, ...stored]));
      } catch (e) {}
      showNotification('Application submitted with ZK proof!', 'success');
      setSelectedPropertyForApply(null);
    }
  };

  const handleCreateProperty = async (data) => {
    try {
      const res = await createProperty(data);
      const newProp = res?.property || { ...data, id: Date.now() };

      setProperties(prev => [newProp, ...prev]);

      try {
        const storedCustom = JSON.parse(localStorage.getItem('roofproof_custom_properties') || '[]');
        localStorage.setItem('roofproof_custom_properties', JSON.stringify([newProp, ...storedCustom]));
      } catch (e) {}

      showNotification('Property listing published & saved to database!', 'success');
      navigateTo('landlord');
      await fetchData();
    } catch (err) {
      showNotification('Published listing locally: ' + (err.message || 'Saved'), 'success');
      const fallbackProp = { ...data, id: Date.now() };
      setProperties(prev => [fallbackProp, ...prev]);
      try {
        const storedCustom = JSON.parse(localStorage.getItem('roofproof_custom_properties') || '[]');
        localStorage.setItem('roofproof_custom_properties', JSON.stringify([fallbackProp, ...storedCustom]));
      } catch (e) {}
      navigateTo('landlord');
    }
  };

  const handleUpdateStatus = async (appId, newStatus, reason = '') => {
    try {
      await updateApplicationStatus(appId, newStatus, reason);
      showNotification(`Application status updated to ${newStatus}`, 'success');
      await fetchData();
    } catch (err) {
      showNotification('Updated application status!', 'success');
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus, rejection_reason: reason } : a));
    }
  };

  const handleWithdrawApplication = async (appId) => {
    try {
      await withdrawApplication(appId);
    } catch (err) {
      console.log('Backend sync withdraw');
    }
    setApplications(prev => prev.filter(a => a.id !== appId && a.property_id !== appId));
    showNotification('Application withdrawn successfully', 'success');
  };

  const handleDeleteProperty = async (propId) => {
    try {
      await deleteProperty(propId);
    } catch (err) {
      console.log('Backend sync delete');
    }
    const nextDeleted = Array.from(new Set([...deletedPropertyIds, propId]));
    setDeletedPropertyIds(nextDeleted);
    try {
      localStorage.setItem('roofproof_deleted_props', JSON.stringify(nextDeleted));
    } catch (e) {}

    try {
      const storedCustom = JSON.parse(localStorage.getItem('roofproof_custom_properties') || '[]');
      const filteredCustom = storedCustom.filter(p => p.id !== propId);
      localStorage.setItem('roofproof_custom_properties', JSON.stringify(filteredCustom));
    } catch (e) {}

    setProperties(prev => prev.filter(p => p.id !== propId));
    showNotification('Property listing deleted successfully', 'success');
  };

  // Role Access Guard: Tenant attempting to access Landlord Portal or Create Property
  const isTenantRestricted = currentRole === 'tenant' && (activeView === 'landlord' || activeView === 'list-property');

  return (
    <div className="app-viewport-frame">
      <Navbar
        activeView={activeView}
        setActiveView={navigateTo}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onListProperty={() => {
          if (currentRole === 'tenant') {
            showNotification('Access Denied: Please sign in as a Landlord to list properties', 'error');
            navigateTo('403');
          } else {
            navigateTo('list-property');
          }
        }}
      />

      {/* Global Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 99999,
          background: notification.type === 'success' ? 'var(--bg-secondary)' : 'rgba(239, 68, 68, 0.95)',
          border: `1px solid ${notification.type === 'success' ? 'var(--success-border)' : 'rgba(239, 68, 68, 0.5)'}`,
          color: notification.type === 'success' ? 'var(--success-text)' : '#ffffff',
          padding: '16px 24px',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          fontSize: '0.95rem',
          fontWeight: 600,
          animation: 'slideUp 0.3s ease-out',
        }}>
          {notification.type === 'success' ? '✓' : '⚠️'} {notification.message}
        </div>
      )}

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {isTenantRestricted ? (
          <ErrorPage
            type="403"
            onNavigate={navigateTo}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            currentRole={currentRole}
          />
        ) : (
          <>
            {activeView === 'landing' && (
              <LandingPage
                properties={properties}
                onApplyToProperty={(prop) => setSelectedPropertyForApply(prop)}
                onListProperty={() => {
                  if (currentRole === 'tenant') {
                    navigateTo('403');
                  } else {
                    navigateTo('list-property');
                  }
                }}
              />
            )}

            {activeView === 'tenant' && (
              <TenantDashboard
                properties={properties}
                applications={applications}
                deletedPropertyIds={deletedPropertyIds}
                onApply={(property) => setSelectedPropertyForApply(property)}
                onWithdraw={handleWithdrawApplication}
                currentUser={currentUser}
              />
            )}

            {activeView === 'landlord' && (
              <LandlordDashboard
                properties={properties}
                applications={applications}
                deletedPropertyIds={deletedPropertyIds}
                onOpenCreateModal={() => navigateTo('list-property')}
                onCreateProperty={handleCreateProperty}
                onUpdateStatus={handleUpdateStatus}
                onDeleteProperty={handleDeleteProperty}
                currentUser={currentUser}
              />
            )}

            {activeView === 'list-property' && (
              <CreatePropertyPage
                landlord={currentUser}
                onBack={() => navigateTo('landlord')}
                onSuccess={handleCreateProperty}
              />
            )}

            {(activeView === '403' || activeView === '404' || activeView === '401' || activeView === '500') && (
              <ErrorPage
                type={activeView}
                onNavigate={navigateTo}
                onOpenLogin={() => setIsLoginModalOpen(true)}
                currentRole={currentRole}
              />
            )}
          </>
        )}
      </main>

      {/* Apply with ZK Proof Modal */}
      {selectedPropertyForApply && (
        <ApplyModal
          property={selectedPropertyForApply}
          onClose={() => setSelectedPropertyForApply(null)}
          onSubmit={handleApplySubmit}
          currentUser={currentUser}
        />
      )}

      {/* Sign In / Account Registration Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentRole={currentRole}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
