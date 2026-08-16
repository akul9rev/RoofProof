import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import TenantDashboard from './components/TenantDashboard';
import LandlordDashboard from './components/LandlordDashboard';
import PrivacyVerificationView from './components/PrivacyVerificationView';
import ApplyModal from './components/ApplyModal';
import CreatePropertyModal from './components/CreatePropertyModal';
import PdfExtractTestUI from './components/PdfExtractTestUI';
import { fetchProperties, fetchApplications, applyForProperty, createProperty, updateApplicationStatus, withdrawApplication } from './services/api';

export default function App() {
  const [activeView, setActiveView] = useState('landing'); // 'landing' | 'tenant' | 'landlord' | 'privacy'
  const [currentRole, setCurrentRole] = useState('tenant'); // 'tenant' | 'landlord'
  
  // Default Demo Users
  const tenantUser = { id: 2, name: 'Priya Patel (Tenant)', email: 'priya.tenant@roofproof.io', role: 'tenant' };
  const landlordUser = { id: 1, name: 'Arjun Sharma (Landlord)', email: 'arjun.landlord@roofproof.io', role: 'landlord' };

  const [properties, setProperties] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPropertyForApply, setSelectedPropertyForApply] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadData = async () => {
    try {
      const [propsRes, appsRes] = await Promise.all([
        fetchProperties(),
        fetchApplications(),
      ]);
      if (propsRes.success) setProperties(propsRes.properties);
      if (appsRes.success) setApplications(appsRes.applications);
    } catch (err) {
      console.error('Error loading RoofProof data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApplySubmit = async (payload) => {
    try {
      const res = await applyForProperty(payload.propertyId, {
        tenant_id: payload.tenant_id,
        verification_status: payload.verification_status,
        zk_tx_hash: payload.zk_tx_hash,
      });

      if (res.success) {
        setSelectedPropertyForApply(null);
        showNotification('Application verified & saved successfully! Verified by Midnight Lace.');
        await loadData();
        return { success: true };
      } else {
        return { success: false, error: res.error || 'Failed to submit application.' };
      }
    } catch (err) {
      return { success: false, error: err.message || 'Error submitting application.' };
    }
  };

  const handleCreateProperty = async (data) => {
    const res = await createProperty(data);
    if (res.success) {
      setIsCreateModalOpen(false);
      showNotification('Property listed successfully on Midnight RoofProof!');
      await loadData();
    } else {
      throw new Error(res.error || 'Failed to create property');
    }
  };

  const handleUpdateStatus = async (applicationId, status, rejectionReason = null) => {
    try {
      const res = await updateApplicationStatus(applicationId, status, rejectionReason);
      if (res.success) {
        showNotification(`Application #${applicationId} marked as ${status}`);
        await loadData();
      }
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleWithdrawApplication = async (applicationId) => {
    try {
      const res = await withdrawApplication(applicationId);
      if (res.success) {
        showNotification('Application taken back. You can now re-verify with ZK proof and apply again.');
        await loadData();
      } else {
        alert(res.error || 'Failed to withdraw application.');
      }
    } catch (err) {
      alert('Error withdrawing application: ' + err.message);
    }
  };

  return (
    <div className="app-viewport-frame">
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
          boxShadow: 'var(--shadow-xl)',
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
            onExploreHomes={() => {
              setCurrentRole('tenant');
              setActiveView('tenant');
            }}
            onListProperty={() => {
              setCurrentRole('landlord');
              setActiveView('landlord');
            }}
            onLearnPrivacy={() => setActiveView('privacy')}
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
      </main>

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
