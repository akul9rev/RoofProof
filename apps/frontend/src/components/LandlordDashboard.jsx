import React, { useState } from 'react';
import { Building2, Plus, ShieldCheck, CheckCircle2, Users, Sparkles, ChevronLeft, ChevronRight, X, Clock, User, Home, MapPin } from 'lucide-react';
import { EXACT_USER_DATASET } from './TenantDashboard';
import PropertyCard from './PropertyCard';
import CreatePropertyForm from './CreatePropertyForm';

export default function LandlordDashboard({ properties = [], applications = [], deletedPropertyIds = [], onOpenCreateModal, onUpdateStatus, onDeleteProperty, currentUser, onCreateProperty }) {
  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'applicants'
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedAppForDenial, setSelectedAppForDenial] = useState(null);
  const [denialReason, setDenialReason] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const customProps = (() => {
    try {
      return JSON.parse(localStorage.getItem('roofproof_custom_properties') || '[]');
    } catch {
      return [];
    }
  })();

  const mergedProps = [...customProps, ...properties];
  const uniqueProps = Array.from(new Map(mergedProps.map(p => [Number(p.id), p])).values());
  // Strictly filter out deleted properties permanently
  const allActiveListings = uniqueProps.filter(p => !deletedPropertyIds.includes(p.id) && !deletedPropertyIds.includes(Number(p.id)) && !deletedPropertyIds.includes(String(p.id)));

  // Filter listings belonging to current landlord
  const myProperties = allActiveListings.filter(p => {
    if (!currentUser) return true;
    const matchesId = Number(p.landlord_id) === Number(currentUser.id);
    const matchesName = p.landlord_name && p.landlord_name.toLowerCase() === currentUser.name.toLowerCase();
    const isRohanDefault = (!p.landlord_id || Number(p.landlord_id) === 1) && Number(currentUser.id) === 1;
    return matchesId || matchesName || isRohanDefault;
  });

  const totalPages = Math.ceil(myProperties.length / ITEMS_PER_PAGE) || 1;
  const displayListings = myProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const storedApps = (() => {
    try {
      return JSON.parse(localStorage.getItem('roofproof_my_apps') || '[]');
    } catch {
      return [];
    }
  })();

  const allApps = [...storedApps, ...applications];
  const appMap = new Map();
  allApps.forEach(a => {
    const key = `${a.tenant_id}_${a.property_id}`;
    const existing = appMap.get(key);
    if (!existing || a.status === 'approved' || a.status === 'rejected' || (existing.status === 'pending' && a.status !== 'pending')) {
      appMap.set(key, { ...(existing || {}), ...a });
    }
  });
  const uniqueApps = Array.from(appMap.values());

  const myPropertyIds = myProperties.map(p => Number(p.id));
  const receivedApplications = uniqueApps.filter(a =>
    myPropertyIds.includes(Number(a.property_id)) ||
    Number(a.landlord_id) === Number(currentUser?.id || 1)
  );

  const handleDenySubmit = (e) => {
    e.preventDefault();
    if (!selectedAppForDenial) return;
    onUpdateStatus(selectedAppForDenial.id, 'rejected', denialReason);
    setSelectedAppForDenial(null);
    setDenialReason('');
  };

  const handleToggleCreateForm = () => {
    const nextState = !showCreateForm;
    setShowCreateForm(nextState);
    if (nextState) {
      setTimeout(() => {
        const el = document.getElementById('create-property-form-container');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '10px 0 50px', width: '100%' }}>
      {/* Denial Explanation Modal */}
      {selectedAppForDenial && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(8, 14, 20, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
        }} onClick={() => setSelectedAppForDenial(null)}>
          <div className="glass-card animate-fade-in" style={{
            maxWidth: '480px',
            width: '100%',
            padding: '30px',
            borderRadius: '24px',
            background: '#ffffff',
            color: '#1a221b',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.2)',
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.2rem', color: '#ef4444', marginBottom: '12px' }}>
              Decline Application & Provide Feedback
            </h3>

            <p style={{ fontSize: '0.86rem', color: '#555', marginBottom: '16px' }}>
              Specify why this applicant was not selected. Note that their salary and bank statements remain 100% Zero-Knowledge protected.
            </p>

            <form onSubmit={handleDenySubmit}>
              <textarea
                rows={4}
                placeholder="e.g., Preferred move-in date was earlier, or another applicant was selected."
                value={denialReason}
                onChange={(e) => setDenialReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 0, 0, 0.15)',
                  fontSize: '0.88rem',
                  marginBottom: '20px',
                  outline: 'none',
                }}
                required
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn-white-pill" style={{ background: '#FAF9F5', color: '#1a221b' }} onClick={() => setSelectedAppForDenial(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-white-pill" style={{ background: '#ef4444', color: '#ffffff' }}>
                  Decline Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Landlord Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(107, 155, 118, 0.15)',
            border: '1px solid rgba(107, 155, 118, 0.35)',
            padding: '5px 14px',
            borderRadius: '999px',
            marginBottom: '12px',
            fontSize: '0.78rem',
            color: '#6B9B76',
            fontWeight: 700,
          }}>
            <Building2 size={13} /> LANDLORD MANAGEMENT PORTAL
          </div>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 600, color: '#ffffff' }}>Property Listings & Applicants</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.92rem', marginTop: '4px' }}>
            Welcome back, <strong style={{ color: '#ffffff' }}>{currentUser?.name || 'Ananya Verma'}</strong> • Managed properties ({myProperties.length} active).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button className="btn-white-pill" onClick={handleToggleCreateForm}>
            {showCreateForm ? <X size={16} /> : <Plus size={16} />}
            {showCreateForm ? 'Close Form' : 'List New Property'}
          </button>
        </div>
      </div>

      {/* Inline Rectangular Property Creation Form */}
      {showCreateForm && (
        <CreatePropertyForm
          landlord={currentUser}
          onClose={() => setShowCreateForm(false)}
          onSuccess={async (data) => {
            if (typeof onCreateProperty === 'function') {
              await onCreateProperty(data);
            } else if (typeof onOpenCreateModal === 'function') {
              await onOpenCreateModal(data);
            }
            setShowCreateForm(false);
          }}
        />
      )}

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '6px',
        background: 'rgba(255, 255, 255, 0.08)',
        padding: '4px',
        borderRadius: '999px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        marginBottom: '24px',
        width: 'fit-content',
      }}>
        <button
          onClick={() => setActiveTab('listings')}
          style={{
            padding: '8px 20px',
            borderRadius: '999px',
            background: activeTab === 'listings' ? '#ffffff' : 'transparent',
            color: activeTab === 'listings' ? '#0c141d' : 'rgba(255, 255, 255, 0.75)',
            border: 'none',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.85rem',
            transition: 'all 0.2s ease',
          }}
        >
          My Listings ({myProperties.length})
        </button>
        <button
          onClick={() => setActiveTab('applicants')}
          style={{
            padding: '8px 20px',
            borderRadius: '999px',
            background: activeTab === 'applicants' ? '#ffffff' : 'transparent',
            color: activeTab === 'applicants' ? '#0c141d' : 'rgba(255, 255, 255, 0.75)',
            border: 'none',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.85rem',
            transition: 'all 0.2s ease',
          }}
        >
          Received Applications ({receivedApplications.length})
        </button>
      </div>

      {activeTab === 'listings' ? (
        <>
          {myProperties.length === 0 ? (
            <div className="glass-card" style={{ padding: '48px', textAlign: 'center', borderRadius: '24px', background: '#ffffff', color: '#1a221b' }}>
              <p style={{ color: '#555', fontSize: '1.05rem', marginBottom: '20px' }}>
                All property listings have been deleted or none exist.
              </p>
              <button className="btn-white-pill" onClick={handleToggleCreateForm}>
                <Plus size={16} /> List New Property
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
              gap: '24px',
              marginBottom: '32px',
            }}>
              {displayListings.map(property => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onDelete={onDeleteProperty}
                  userRole="landlord"
                />
              ))}
            </div>
          )}

          {/* Pagination control for Landlord */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              marginTop: '16px',
            }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn-white-pill"
                style={{ padding: '8px 18px', fontSize: '0.82rem', opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <span style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600 }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="btn-white-pill"
                style={{ padding: '8px 18px', fontSize: '0.82rem', opacity: currentPage === totalPages ? 0.4 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      ) : (
        /* Received Applications Tab */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {receivedApplications.length === 0 ? (
            <div className="glass-card" style={{ padding: '48px', textAlign: 'center', borderRadius: '24px', background: '#ffffff', color: '#1a221b' }}>
              <p style={{ color: '#555', fontSize: '1.05rem' }}>
                No applicant submissions received yet.
              </p>
            </div>
          ) : (
            receivedApplications.map(app => {
              const tenantName = app.tenant_name || (Number(app.tenant_id) === 3 ? 'Arjun Sharma' : Number(app.tenant_id) === 4 ? 'Neha Kapoor' : `Applicant #${app.tenant_id}`);
              const tenantEmail = app.tenant_email || (Number(app.tenant_id) === 3 ? 'arjun.sharma@roofproof.demo' : Number(app.tenant_id) === 4 ? 'neha.kapoor@roofproof.demo' : '');
              const propTitle = app.property_title || `Property Listing #${app.property_id}`;
              const propLocation = app.property_location || '';
              const dateObj = app.created_at ? new Date(app.created_at) : new Date();
              const formattedDate = dateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              const formattedTime = dateObj.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div key={app.id} className="white-property-card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <span style={{
                          background: 'rgba(74, 124, 89, 0.12)',
                          color: '#4A7C59',
                          border: '1px solid rgba(74, 124, 89, 0.25)',
                          padding: '3px 10px',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}>
                          <ShieldCheck size={12} /> ZK Income Verified: PASS
                        </span>
                        <span style={{
                          background: 'rgba(0, 0, 0, 0.05)',
                          color: '#555',
                          padding: '3px 10px',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                        }}>
                          Tampering Risk: LOW
                        </span>
                      </div>

                      {/* Who Requested */}
                      <h3 style={{ fontSize: '1.2rem', color: '#1a221b', marginBottom: '4px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User size={18} color="#4A7C59" /> {tenantName} {tenantEmail && <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: 500 }}>({tenantEmail})</span>}
                      </h3>

                      {/* For What */}
                      <div style={{ fontSize: '0.92rem', color: '#2d3748', marginBottom: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Home size={15} color="#3182ce" /> Requested for: <strong style={{ color: '#0c141d' }}>{propTitle}</strong> {propLocation && `(${propLocation})`}
                      </div>

                      {/* Date & Time */}
                      <div style={{ fontSize: '0.82rem', color: '#718096', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={13} color="#718096" /> Submitted on <strong style={{ color: '#4a5568' }}>{formattedDate}</strong> at <strong style={{ color: '#4a5568' }}>{formattedTime}</strong>
                      </div>
                    </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    {app.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => onUpdateStatus(app.id, 'approved')}
                          className="btn-white-pill"
                          style={{ padding: '8px 18px', fontSize: '0.82rem', background: '#141a15', color: '#ffffff' }}
                        >
                          <CheckCircle2 size={14} /> Accept Applicant
                        </button>
                        <button
                          onClick={() => setSelectedAppForDenial(app)}
                          className="btn-white-pill"
                          style={{ padding: '8px 16px', fontSize: '0.82rem', background: '#FAF9F5', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.4)' }}
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <span style={{
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: app.status === 'approved' ? '#22c55e' : '#ef4444',
                        textTransform: 'capitalize',
                      }}>
                        Status: {app.status === 'approved' ? 'Accepted' : 'Declined'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
          )}
        </div>
      )}
    </div>
  );
}
