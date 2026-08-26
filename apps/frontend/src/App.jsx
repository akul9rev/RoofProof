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

const DEFAULT_PROPERTIES = [
  {
    id: 1,
    landlord_id: 1,
    title: 'Misty Valley Villa',
    property_type: 'Luxury Villa',
    location: 'Coorg, Karnataka',
    monthly_rent: 65000,
    income_threshold: 195000,
    description: '3 BHK luxury villa with a private outdoor area, mountain views, furnished living spaces, and a modern kitchen.',
    image_url: '/houses/house1.jpg',
    landlord_name: 'Rohan Mehta',
    landlord_email: 'rohan.mehta@roofproof.demo',
    bedrooms: '3 BHK',
    bathrooms: '3 Bathrooms',
    furnishing: 'Fully Furnished',
    area_sqft: '2,400 sq.ft',
    parking: 'Covered (2 Cars + 2 Bikes)',
    deposit: '₹1,30,000 (2 Months)',
    preferred_tenants: 'Families & Working Professionals',
    available_from: 'Immediate Move-in',
    amenities: ['Mountain View', 'Private Balcony', 'Modular Kitchen', '24/7 Power Backup', 'Gated Community', 'High-Speed Fiber Ready'],
  },
  {
    id: 2,
    landlord_id: 1,
    title: 'Royal Courtyard Residence',
    property_type: 'Heritage House',
    location: 'Udaipur, Rajasthan',
    monthly_rent: 55000,
    income_threshold: 165000,
    description: 'Spacious heritage-style residence with a private courtyard, traditional interiors, large living areas, and a peaceful setting.',
    image_url: '/houses/house2.jpg',
    landlord_name: 'Rohan Mehta',
    landlord_email: 'rohan.mehta@roofproof.demo',
    bedrooms: '3 BHK',
    bathrooms: '3 Bathrooms',
    furnishing: 'Fully Furnished',
    area_sqft: '2,100 sq.ft',
    parking: 'Open Courtyard Parking (2 Cars)',
    deposit: '₹1,10,000 (2 Months)',
    preferred_tenants: 'Families & Expats',
    available_from: 'Immediate Move-in',
    amenities: ['Private Courtyard', 'Traditional Architecture', 'Modular Kitchen', '24/7 Security & CCTV', 'High-Speed Fiber Ready'],
  },
  {
    id: 3,
    landlord_id: 1,
    title: 'Heritage Garden Bungalow',
    property_type: 'Bungalow',
    location: 'Ooty, Tamil Nadu',
    monthly_rent: 48000,
    income_threshold: 144000,
    description: 'Charming 3 BHK bungalow with a large garden, traditional architecture, wooden interiors, spacious rooms, and a peaceful hill-station setting.',
    image_url: '/houses/house3.jpg',
    landlord_name: 'Rohan Mehta',
    landlord_email: 'rohan.mehta@roofproof.demo',
    bedrooms: '3 BHK',
    bathrooms: '2 Bathrooms',
    furnishing: 'Semi-Furnished',
    area_sqft: '1,950 sq.ft',
    parking: 'Dedicated Car Porch (1 Car)',
    deposit: '₹96,000 (2 Months)',
    preferred_tenants: 'Families & Remote Workers',
    available_from: 'Immediate Move-in',
    amenities: ['Private Botanical Garden', 'Fireplace', 'Hill Station Views', 'Power Backup', 'Pet Friendly'],
  },
  {
    id: 4,
    landlord_id: 1,
    title: 'Greenview Family Home',
    property_type: 'Family House',
    location: 'Bangalore, Karnataka',
    monthly_rent: 38000,
    income_threshold: 114000,
    description: 'Comfortable 3 BHK family home with generous natural light, multiple balconies, a quiet neighborhood, and nearby residential amenities.',
    image_url: '/houses/house4.jpg',
    landlord_name: 'Rohan Mehta',
    landlord_email: 'rohan.mehta@roofproof.demo',
    bedrooms: '3 BHK',
    bathrooms: '2 Bathrooms',
    furnishing: 'Semi-Furnished',
    area_sqft: '1,650 sq.ft',
    parking: 'Covered Parking (1 Car)',
    deposit: '₹76,000 (2 Months)',
    preferred_tenants: 'Families & Professionals',
    available_from: 'Immediate Move-in',
    amenities: ['Multiple Balconies', 'Park Facing', '24/7 Security', 'High-Speed Fiber Ready', 'Children Play Area'],
  },
  {
    id: 5,
    landlord_id: 2,
    title: 'Pink Palace Residence',
    property_type: 'Luxury Residence',
    location: 'Jaipur, Rajasthan',
    monthly_rent: 72000,
    income_threshold: 216000,
    description: 'Elegant 3 BHK residence inspired by Jaipur architecture, featuring ornate interiors, spacious common areas, and a distinctive heritage character.',
    image_url: '/houses/house5.jpg',
    landlord_name: 'Priya Nair',
    landlord_email: 'priya.nair@roofproof.demo',
    bedrooms: '3 BHK',
    bathrooms: '3 Bathrooms',
    furnishing: 'Fully Furnished',
    area_sqft: '2,600 sq.ft',
    parking: 'Covered Parking (2 Cars)',
    deposit: '₹1,44,000 (2 Months)',
    preferred_tenants: 'Families & Corporate Executives',
    available_from: 'Immediate Move-in',
    amenities: ['Rooftop Terrace', 'Jaipur Architecture', 'Modular Kitchen', 'Gym & Fitness', '24/7 Security & CCTV'],
  },
  {
    id: 6,
    landlord_id: 2,
    title: 'Glassfront Modern Estate',
    property_type: 'Modern Villa',
    location: 'Kolkata, West Bengal',
    monthly_rent: 52000,
    income_threshold: 156000,
    description: 'Characterful independent modern villa with glass facades, bright interiors, private entry, and a quiet residential setting.',
    image_url: '/houses/house6.jpg',
    landlord_name: 'Priya Nair',
    landlord_email: 'priya.nair@roofproof.demo',
    bedrooms: '3 BHK',
    bathrooms: '3 Bathrooms',
    furnishing: 'Fully Furnished',
    area_sqft: '2,300 sq.ft',
    parking: 'Covered Parking (1 Car + 2 Bikes)',
    deposit: '₹1,04,000 (2 Months)',
    preferred_tenants: 'Any Working Professionals',
    available_from: 'Immediate Move-in',
    amenities: ['Floor-to-Ceiling Glass', 'Private Garden', 'Modular Kitchen', '24/7 Power Backup', 'Smart Home Ready'],
  },
];

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
    const handlePopState = () => setActiveView(getViewFromPath());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [properties, setProperties] = useState(DEFAULT_PROPERTIES);
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
      const loadedProperties = Array.isArray(propsRes)
        ? propsRes
        : (propsRes?.properties && propsRes.properties.length > 0 ? propsRes.properties : DEFAULT_PROPERTIES);
      const loadedApplications = Array.isArray(appsRes) ? appsRes : (appsRes?.applications || []);

      setProperties(loadedProperties);
      setApplications(loadedApplications);
    } catch (err) {
      console.error('Failed to fetch DApp data, using fallback properties:', err);
      setProperties(DEFAULT_PROPERTIES);
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
        id: `local_${Date.now()}`,
        property_id: payload.property_id,
        tenant_id: currentUser.id,
        tenant_name: currentUser.name,
        tenant_email: currentUser.email,
        status: 'pending',
        verification_status: payload.verification_status || 'eligible',
        zk_tx_hash: payload.zk_tx_hash,
        created_at: new Date().toISOString(),
      };

      setApplications(prev => [newApp, ...prev.filter(a =>
        !(String(a.property_id) === String(payload.property_id) && String(a.tenant_id) === String(currentUser.id))
      )]);

      try {
        const stored = JSON.parse(localStorage.getItem('roofproof_my_apps') || '[]');
        const filteredStored = stored.filter(a =>
          !(String(a.property_id) === String(payload.property_id) && String(a.tenant_id) === String(currentUser.id))
        );
        localStorage.setItem('roofproof_my_apps', JSON.stringify([newApp, ...filteredStored]));
      } catch (e) {}

      showNotification('Privacy proof generated and application submitted!', 'success');
      setSelectedPropertyForApply(null);
      await fetchData();
    } catch (err) {
      const fallbackApp = {
        id: `local_${Date.now()}`,
        property_id: payload.property_id,
        tenant_id: currentUser.id,
        tenant_name: currentUser.name,
        tenant_email: currentUser.email,
        status: 'pending',
        verification_status: payload.verification_status || 'eligible',
        zk_tx_hash: payload.zk_tx_hash,
        created_at: new Date().toISOString(),
      };
      setApplications(prev => [fallbackApp, ...prev.filter(a =>
        !(String(a.property_id) === String(payload.property_id) && String(a.tenant_id) === String(currentUser.id))
      )]);
      try {
        const stored = JSON.parse(localStorage.getItem('roofproof_my_apps') || '[]');
        const filteredStored = stored.filter(a =>
          !(String(a.property_id) === String(payload.property_id) && String(a.tenant_id) === String(currentUser.id))
        );
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
      landlord_id: currentUser.id,
      landlord_name: currentUser.name,
    };

    try {
      const res = await createProperty(payload);
      const newProp = res?.property
        ? { ...res.property, landlord_id: currentUser.id, landlord_name: currentUser.name }
        : { ...payload, id: `local_${Date.now()}` };

      setProperties(prev => [newProp, ...prev.filter(p => String(p.id) !== String(newProp.id))]);
      showNotification('Property listing published & saved to database!', 'success');
      navigateTo('landlord');
      await fetchData();
    } catch (err) {
      console.error('Property creation error:', err);
      const fallbackProp = { ...payload, id: `local_${Date.now()}` };
      setProperties(prev => [fallbackProp, ...prev.filter(p => String(p.id) !== String(fallbackProp.id))]);
      showNotification('Published listing: ' + (err.message || 'Saved'), 'success');
      navigateTo('landlord');
    }
  };

  // FIX: Only match on a.id (not a.property_id) to avoid bulk-updating wrong applications
  const handleUpdateStatus = async (appId, newStatus, reason = '') => {
    try {
      await updateApplicationStatus(appId, newStatus, reason);
    } catch (err) {
      console.log('Backend sync updateStatus fallback');
    }

    setApplications(prev => prev.map(a =>
      String(a.id) === String(appId)
        ? { ...a, status: newStatus, rejection_reason: reason }
        : a
    ));

    try {
      const stored = JSON.parse(localStorage.getItem('roofproof_my_apps') || '[]');
      const updatedStored = stored.map(a =>
        String(a.id) === String(appId)
          ? { ...a, status: newStatus, rejection_reason: reason }
          : a
      );
      localStorage.setItem('roofproof_my_apps', JSON.stringify(updatedStored));
    } catch (e) {}

    showNotification(`Application status updated to ${newStatus}!`, 'success');
    await fetchData();
  };

  const handleWithdrawApplication = async (appId, propertyId) => {
    try {
      if (appId) {
        await withdrawApplication(appId);
      }
    } catch (err) {
      console.log('Backend sync withdraw');
    }

    setApplications(prev => prev.filter(a =>
      String(a.id) !== String(appId) &&
      (!propertyId || String(a.property_id) !== String(propertyId))
    ));

    try {
      const stored = JSON.parse(localStorage.getItem('roofproof_my_apps') || '[]');
      const filtered = stored.filter(a =>
        String(a.id) !== String(appId) &&
        (!propertyId || String(a.property_id) !== String(propertyId))
      );
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
    const nextDeleted = Array.from(new Set([...deletedPropertyIds, propId, String(propId)]));
    setDeletedPropertyIds(nextDeleted);
    try {
      localStorage.setItem('roofproof_deleted_props', JSON.stringify(nextDeleted));
    } catch (e) {}

    try {
      const custom = JSON.parse(localStorage.getItem('roofproof_custom_properties') || '[]');
      const filteredCustom = custom.filter(p => String(p.id) !== String(propId));
      localStorage.setItem('roofproof_custom_properties', JSON.stringify(filteredCustom));
    } catch (e) {}

    try {
      const storedApps = JSON.parse(localStorage.getItem('roofproof_my_apps') || '[]');
      const filteredApps = storedApps.filter(a => String(a.property_id) !== String(propId));
      localStorage.setItem('roofproof_my_apps', JSON.stringify(filteredApps));
    } catch (e) {}

    setProperties(prev => prev.filter(p => String(p.id) !== String(propId)));
    showNotification('Property listing deleted successfully', 'success');
  };

  // Security guards
  const isUnauthenticatedRestricted = !currentUser && (activeView === 'tenant' || activeView === 'landlord' || activeView === 'list-property');
  const isTenantRestricted = currentUser && currentRole === 'tenant' && (activeView === 'landlord' || activeView === 'list-property');
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
        <div className={`toast-notification ${notification.type === 'error' ? 'toast-notification--error' : ''}`} role="status">
          <div className="toast-notification__icon" aria-hidden="true">
            {notification.type === 'success' ? '✓' : '!'}
          </div>
          <div className="toast-notification__copy">{notification.message}</div>
        </div>
      )}

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {isUnauthenticatedRestricted ? (
          <ErrorPage type="401" onNavigate={navigateTo} onOpenLogin={() => setIsLoginModalOpen(true)} currentRole={currentRole} />
        ) : (isTenantRestricted || isLandlordRestricted) ? (
          <ErrorPage type="403" onNavigate={navigateTo} onOpenLogin={() => setIsLoginModalOpen(true)} currentRole={currentRole} />
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
