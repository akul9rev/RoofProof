import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import LandingPage from './components/LandingPage.jsx';
import TenantDashboard from './components/TenantDashboard.jsx';
import LandlordDashboard from './components/LandlordDashboard.jsx';
import PrivacyVerificationView from './components/PrivacyVerificationView.jsx';
import PdfExtractTestUI from './components/PdfExtractTestUI.jsx';
import ApplyModal from './components/ApplyModal.jsx';
import CreatePropertyModal from './components/CreatePropertyModal.jsx';
import { fetchProperties, fetchApplications, createApplication, updateApplicationStatus, createProperty } from './services/api.js';

export default function App() {
  const [activeView, setActiveView] = useState('landing'); // 'landing' | 'tenant' | 'landlord' | 'privacy' | 'testui'
  const [currentRole, setCurrentRole] = useState('tenant'); // 'tenant' | 'landlord'

  const tenantUser = {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    role: 'tenant',
  };

  const landlordUser = {
    id: 2,
    name: 'Ananya Verma',
    email: 'ananya.verma@example.com',
    role: 'landlord',
  };

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
      const [propsData, appsData] = await Promise.all([
        fetchProperties(),
        fetchApplications(),
      ]);
      setProperties(propsData || []);
      setApplications(appsData || []);
    } catch (err) {
      console.error('Failed to fetch DApp data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApplySubmit = async (payload) => {
    try {
      showNotification('Privacy proof generated and verified successfully!', 'success');
      setSelectedPropertyForApply(null);
      await fetchData();
    } catch (err) {
      showNotification('Application failed: ' + err.message, 'error');
    }
  };

  const handleCreateProperty = async (data) => {
    try {
      await createProperty(data);
      showNotification('Property listing created successfully!', 'success');
      setIsCreateModalOpen(false);
      await fetchData();
    } catch (err) {
      showNotification('Failed to create property: ' + err.message, 'error');
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
      showNotification('Application withdrawn', 'success');
      await fetchData();
    } catch (err) {
      alert('Error withdrawing application: ' + err.message);
    }
  };

  return (
    <div className="app-container">
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

      {/* Hero Glass Frame containing Navbar + Hero Landing Card */}
      <div className="hero-glass-frame">
        <Navbar
          activeView={activeView}
          setActiveView={setActiveView}
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          currentUser={currentRole === 'tenant' ? tenantUser : landlordUser}
          onListProperty={() => {
            setCurrentRole('landlord');
            setIsCreateModalOpen(true);
          }}
        />

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
            onApply={(property) => setSelectedPropertyForApply(property)}
            onWithdraw={handleWithdrawApplication}
            currentUser={tenantUser}
          />
        )}

        {activeView === 'landlord' && (
          <LandlordDashboard
            properties={properties}
            applications={applications}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onUpdateStatus={handleUpdateStatus}
            currentUser={landlordUser}
          />
        )}

        {activeView === 'privacy' && (
          <PrivacyVerificationView />
        )}

        {activeView === 'testui' && (
          <PdfExtractTestUI />
        )}
      </div>

      {/* Modals */}
      {selectedPropertyForApply && (
        <ApplyModal
          property={selectedPropertyForApply}
          tenant={tenantUser}
          onClose={() => setSelectedPropertyForApply(null)}
          onSuccess={handleApplySubmit}
        />
      )}

      {isCreateModalOpen && (
        <CreatePropertyModal
          landlord={landlordUser}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateProperty}
        />
      )}
    </div>
  );
}
