import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import LandingPage from './components/LandingPage.jsx';
import TenantDashboard from './components/TenantDashboard.jsx';
import LandlordDashboard from './components/LandlordDashboard.jsx';
import PrivacyVerificationView from './components/PrivacyVerificationView.jsx';
import PdfExtractTestUI from './components/PdfExtractTestUI.jsx';
import ApplyModal from './components/ApplyModal.jsx';
import CreatePropertyModal from './components/CreatePropertyModal.jsx';
import LoginModal from './components/LoginModal.jsx';
import { fetchProperties, fetchApplications, applyForProperty, updateApplicationStatus, createProperty, deleteProperty } from './services/api.js';

export default function App() {
  const [activeView, setActiveView] = useState('landing'); // 'landing' | 'tenant' | 'landlord' | 'privacy' | 'testui'
  const [currentRole, setCurrentRole] = useState('tenant'); // 'tenant' | 'landlord'

  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    role: 'tenant',
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [properties, setProperties] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedPropertyForApply, setSelectedPropertyForApply] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
        tenant_id: payload.tenant_id || currentUser?.id || 1,
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
        tenant_id: payload.tenant_id || currentUser?.id || 1,
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
      setIsCreateModalOpen(false);
      await fetchData();
    } catch (err) {
      showNotification('Published listing locally: ' + (err.message || 'Saved'), 'success');
      const fallbackProp = { ...data, id: Date.now() };
      setProperties(prev => [fallbackProp, ...prev]);
      try {
        const storedCustom = JSON.parse(localStorage.getItem('roofproof_custom_properties') || '[]');
        localStorage.setItem('roofproof_custom_properties', JSON.stringify([fallbackProp, ...storedCustom]));
      } catch (e) {}
      setIsCreateModalOpen(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await updateApplicationStatus(appId, newStatus);
      showNotification(`Application status updated to ${newStatus}`, 'success');
      await fetchData();
    } catch (err) {
      showNotification('Failed to update status: ' + err.message, 'error');
    }
  };

  const handleWithdrawApplication = async (appId) => {
    try {
      await withdrawApplication(appId);
    } catch (err) {
      console.log('Backend sync withdraw');
    }
    setApplications(prev => prev.filter(a => a.id !== appId && a.property_id !== appId));
    try {
      const stored = JSON.parse(localStorage.getItem('roofproof_my_apps') || '[]');
      const filtered = stored.filter(a => a.id !== appId && a.property_id !== appId);
      localStorage.setItem('roofproof_my_apps', JSON.stringify(filtered));
    } catch (e) {}
    showNotification('Rental application withdrawn successfully', 'success');
  };

  const [deletedPropertyIds, setDeletedPropertyIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('roofproof_deleted_props') || '[]');
    } catch {
      return [];
    }
  });

  const handleDeleteProperty = async (propId) => {
    try {
      await deleteProperty(propId);
    } catch (err) {
      console.log('Backend sync delete');
    }
    const nextDeleted = [...deletedPropertyIds, propId];
    setDeletedPropertyIds(nextDeleted);
    try {
      localStorage.setItem('roofproof_deleted_props', JSON.stringify(nextDeleted));
    } catch (e) {}

    setProperties(prev => prev.filter(p => p.id !== propId));
    showNotification('Property listing deleted successfully', 'success');
  };

  const isPortalView = activeView === 'tenant' || activeView === 'landlord';

  return (
    <div className={`app-viewport-frame ${isPortalView ? 'portal-white-frame' : ''}`}>
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onListProperty={() => {
          setCurrentRole('landlord');
          setIsCreateModalOpen(true);
        }}
      />

      {/* Global Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          background: notification.type === 'success' ? 'var(--bg-secondary)' : 'var(--danger-bg)',
          border: `1px solid ${notification.type === 'success' ? 'var(--success-border)' : 'var(--danger-border)'}`,
          color: notification.type === 'success' ? 'var(--success-text)' : 'var(--danger-text)',
          padding: '16px 24px',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          fontSize: '0.95rem',
          fontWeight: 600,
          animation: 'slideUp 0.3s ease-out',
        }}>
          ✓ {notification.message}
        </div>
      )}

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {activeView === 'landing' && (
          <LandingPage
            properties={properties}
            onApplyToProperty={(prop) => setSelectedPropertyForApply(prop)}
            onListProperty={() => {
              setCurrentRole('landlord');
              setIsCreateModalOpen(true);
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
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onUpdateStatus={handleUpdateStatus}
            onDeleteProperty={handleDeleteProperty}
            currentUser={currentUser}
          />
        )}

        {activeView === 'privacy' && (
          <PrivacyVerificationView />
        )}

        {activeView === 'testui' && (
          <PdfExtractTestUI />
        )}
      </main>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentRole={currentRole}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
      />

      {selectedPropertyForApply && (
        <ApplyModal
          property={selectedPropertyForApply}
          tenant={currentUser}
          onClose={() => setSelectedPropertyForApply(null)}
          onSuccess={handleApplySubmit}
        />
      )}

      {isCreateModalOpen && (
        <CreatePropertyModal
          landlord={currentUser}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateProperty}
        />
      )}
    </div>
  );
}
