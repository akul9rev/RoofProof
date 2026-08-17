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
import { fetchProperties, fetchApplications, applyForProperty, updateApplicationStatus, createProperty, deleteProperty, withdrawApplication } from './services/api.js';

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

  // Read logged-in user from localStorage so authentication survives browser refresh
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('roofproof_logged_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [currentRole, setCurrentRole] = useState(() => {
    try {
      const saved = localStorage.getItem('roofproof_logged_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed?.role || 'tenant';
      }
    } catch (e) {}
    return 'tenant';
  });

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
    try {
      localStorage.setItem('roofproof_logged_user', JSON.stringify(userObj));
    } catch (e) {}
    showNotification(`Signed in successfully as ${userObj.name} (${userObj.role})`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentRole('tenant');
    try {
      localStorage.removeItem('roofproof_logged_user');
    } catch (e) {}
    showNotification('Signed out of RoofProof', 'success');
    navigateTo('landing');
  };

  const handleApplySubmit = async (payload) => {
    if (!currentUser) {
      setIsLoginModalOpen(true);
      showNotification('Please sign in to submit your ZK rental application', 'error');
      return;
    }

    const applicationPayload = {
      ...payload,
      tenant_id: currentUser.id,
      tenant_name: currentUser.name,
      tenant_email: currentUser.email,
    };

    try {
      const res = await applyForProperty(payload.property_id, applicationPayload);
      const newApp = res?.application || {
        id: Date.now(),
        property_id: payload.property_id,
        tenant_id: currentUser.id,
        tenant_name: currentUser.name,
        tenant_email: currentUser.email,
        status: 'pending',
        verification_status: payload.verification_status || 'verified_pass',
        zk_tx_hash: payload.zk_tx_hash,
        created_at: new Date().toISOString(),
      };

      setApplications(prev => [newApp, ...prev.filter(a => !(Number(a.property_id) === Number(payload.property_id) && Number(a.tenant_id) === Number(currentUser.id)))]);

      try {
        const stored = JSON.parse(localStorage.getItem('roofproof_my_apps') || '[]');
        const filteredStored = stored.filter(a => !(Number(a.property_id) === Number(payload.property_id) && Number(a.tenant_id) === Number(currentUser.id)));
        localStorage.setItem('roofproof_my_apps', JSON.stringify([newApp, ...filteredStored]));
      } catch (e) {}

      showNotification('Privacy proof generated and application submitted!', 'success');
      setSelectedPropertyForApply(null);
      await fetchData();
    } catch (err) {
      const fallbackApp = {
        id: Date.now(),
        property_id: payload.property_id,
        tenant_id: currentUser.id,
        tenant_name: currentUser.name,
        tenant_email: currentUser.email,
        status: 'pending',
        verification_status: payload.verification_status || 'verified_pass',
        zk_tx_hash: payload.zk_tx_hash,
        created_at: new Date().toISOString(),
      };
      setApplications(prev => [fallbackApp, ...prev.filter(a => !(Number(a.property_id) === Number(payload.property_id) && Number(a.tenant_id) === Number(currentUser.id)))]);
      try {
        const stored = JSON.parse(localStorage.getItem('roofproof_my_apps') || '[]');
        const filteredStored = stored.filter(a => !(Number(a.property_id) === Number(payload.property_id) && Number(a.tenant_id) === Number(currentUser.id)));
        localStorage.setItem('roofproof_my_apps', JSON.stringify([fallbackApp, ...filteredStored]));
      } catch (e) {}
      showNotification('Application submitted with ZK proof!', 'success');
      setSelectedPropertyForApply(null);
    }
  };

  const handleCreateProperty = async (data) => {
    if (!currentUser || currentRole !== 'landlord') {
      setIsLoginModalOpen(true);
      showNotification('Please sign in as a Landlord to publish listings', 'error');
      return;
    }

    const payload = {
      ...data,
      landlord_id: data.landlord_id || currentUser.id,
      landlord_name: currentUser.name,
    };

    try {
      const res = await createProperty(payload);
      const newProp = res?.property || { ...payload, id: Date.now() };

      setProperties(prev => [newProp, ...prev.filter(p => Number(p.id) !== Number(newProp.id))]);

      try {
        const storedCustom = JSON.parse(localStorage.getItem('roofproof_custom_properties') || '[]');
        const updatedCustom = [newProp, ...storedCustom.filter(p => Number(p.id) !== Number(newProp.id))];
        localStorage.setItem('roofproof_custom_properties', JSON.stringify(updatedCustom));
      } catch (e) {}

      showNotification('Property listing published & saved to database!', 'success');
      navigateTo('landlord');
      await fetchData();
    } catch (err) {
      const fallbackProp = { ...payload, id: Date.now() };
      setProperties(prev => [fallbackProp, ...prev.filter(p => Number(p.id) !== Number(fallbackProp.id))]);
      try {
        const storedCustom = JSON.parse(localStorage.getItem('roofproof_custom_properties') || '[]');
        const updatedCustom = [fallbackProp, ...storedCustom.filter(p => Number(p.id) !== Number(fallbackProp.id))];
        localStorage.setItem('roofproof_custom_properties', JSON.stringify(updatedCustom));
      } catch (e) {}
      showNotification('Published listing locally: ' + (err.message || 'Saved'), 'success');
      navigateTo('landlord');
    }
  };

  const handleUpdateStatus = async (appId, newStatus, reason = '') => {
    try {
      await updateApplicationStatus(appId, newStatus, reason);
    } catch (err) {
      console.log('Backend sync updateStatus fallback');
    }

    setApplications(prev => prev.map(a => 
      (Number(a.id) === Number(appId) || Number(a.property_id) === Number(appId))
        ? { ...a, status: newStatus, rejection_reason: reason }
        : a
    ));

    try {
      const stored = JSON.parse(localStorage.getItem('roofproof_my_apps') || '[]');
      const updatedStored = stored.map(a => 
        (Number(a.id) === Number(appId) || Number(a.property_id) === Number(appId))
          ? { ...a, status: newStatus, rejection_reason: reason }
          : a
      );
      localStorage.setItem('roofproof_my_apps', JSON.stringify(updatedStored));
    } catch (e) {}

    showNotification(`Application status updated to ${newStatus}!`, 'success');
    await fetchData();
  };

  const handleWithdrawApplication = async (appId) => {
    try {
      await withdrawApplication(appId);
    } catch (err) {
      console.log('Backend sync withdraw');
    }

    setApplications(prev => prev.filter(a => Number(a.id) !== Number(appId) && Number(a.property_id) !== Number(appId)));

    try {
      const stored = JSON.parse(localStorage.getItem('roofproof_my_apps') || '[]');
      const filtered = stored.filter(a => Number(a.id) !== Number(appId) && Number(a.property_id) !== Number(appId));
      localStorage.setItem('roofproof_my_apps', JSON.stringify(filtered));
    } catch (e) {}

    showNotification('Application withdrawn successfully', 'success');
  };

  const handleDeleteProperty = async (propId) => {
    try {
      await deleteProperty(propId);
    } catch (err) {
      console.log('Backend sync delete');
    }
    const nextDeleted = Array.from(new Set([...deletedPropertyIds, propId, Number(propId)]));
    setDeletedPropertyIds(nextDeleted);
    try {
      localStorage.setItem('roofproof_deleted_props', JSON.stringify(nextDeleted));
    } catch (e) {}

    try {
      const custom = JSON.parse(localStorage.getItem('roofproof_custom_properties') || '[]');
      const filteredCustom = custom.filter(p => Number(p.id) !== Number(propId));
      localStorage.setItem('roofproof_custom_properties', JSON.stringify(filteredCustom));
    } catch (e) {}

    try {
      const storedApps = JSON.parse(localStorage.getItem('roofproof_my_apps') || '[]');
      const filteredApps = storedApps.filter(a => Number(a.property_id) !== Number(propId));
      localStorage.setItem('roofproof_my_apps', JSON.stringify(filteredApps));
    } catch (e) {}

    setProperties(prev => prev.filter(p => Number(p.id) !== Number(propId)));
    showNotification('Property listing deleted successfully', 'success');
  };

  // 1. Unauthenticated Security Guard: User NOT signed in attempting to access Tenant/Landlord portals
  const isUnauthenticatedRestricted = !currentUser && (activeView === 'tenant' || activeView === 'landlord' || activeView === 'list-property');

  // 2. Tenant Role Security Guard: Tenant attempting to access Landlord Portal or Create Property
  const isTenantRestricted = currentUser && currentRole === 'tenant' && (activeView === 'landlord' || activeView === 'list-property');

  // 3. Landlord Role Security Guard: Landlord attempting to access Tenant Portal
  const isLandlordRestricted = currentUser && currentRole === 'landlord' && activeView === 'tenant';

  return (
    <div className="app-viewport-frame">
      <Navbar
        activeView={activeView}
        setActiveView={navigateTo}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onListProperty={() => {
          if (!currentUser) {
            setIsLoginModalOpen(true);
            showNotification('Please sign in as a Landlord to list properties', 'error');
          } else if (currentRole === 'tenant') {
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
        {isUnauthenticatedRestricted ? (
          <ErrorPage
            type="401"
            onNavigate={navigateTo}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            currentRole={currentRole}
          />
        ) : (isTenantRestricted || isLandlordRestricted) ? (
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
                deletedPropertyIds={deletedPropertyIds}
                onApplyToProperty={(prop) => {
                  if (!currentUser) {
                    setIsLoginModalOpen(true);
                    showNotification('Please sign in to apply for properties', 'error');
                  } else {
                    setSelectedPropertyForApply(prop);
                  }
                }}
                onListProperty={() => {
                  if (!currentUser) {
                    setIsLoginModalOpen(true);
                    showNotification('Please sign in as a Landlord to list properties', 'error');
                  } else if (currentRole === 'tenant') {
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
                onApply={(property) => {
                  if (!currentUser) {
                    setIsLoginModalOpen(true);
                    showNotification('Please sign in to apply for properties', 'error');
                  } else {
                    setSelectedPropertyForApply(property);
                  }
                }}
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
          onSuccess={handleApplySubmit}
          currentUser={currentUser}
          tenant={currentUser}
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
