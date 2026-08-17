const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchProperties() {
  const res = await fetch(`${API_BASE}/properties`);
  return res.json();
}

export async function fetchProperty(id) {
  const res = await fetch(`${API_BASE}/properties/${id}`);
  return res.json();
}

export async function createProperty(data) {
  const res = await fetch(`${API_BASE}/properties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteProperty(id) {
  const res = await fetch(`${API_BASE}/properties/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

export async function fetchApplications() {
  const res = await fetch(`${API_BASE}/applications`);
  return res.json();
}

export async function fetchPropertyApplications(propertyId) {
  const res = await fetch(`${API_BASE}/properties/${propertyId}/applications`);
  return res.json();
}

export async function fetchTenantApplications(tenantId) {
  const res = await fetch(`${API_BASE}/applications/tenant/${tenantId}`);
  return res.json();
}

export async function submitApplication(data) {
  const res = await fetch(`${API_BASE}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function applyForProperty(propertyIdOrData, payload = null) {
  if (typeof propertyIdOrData === 'object' && propertyIdOrData !== null) {
    return submitApplication(propertyIdOrData);
  }
  const fullData = {
    property_id: propertyIdOrData,
    ...payload,
  };
  return submitApplication(fullData);
}

export const createApplication = applyForProperty;

export async function withdrawApplication(id) {
  const res = await fetch(`${API_BASE}/applications/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

export async function updateApplicationStatus(id, status, landlordNotes = '') {
  const res = await fetch(`${API_BASE}/applications/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, landlord_notes: landlordNotes }),
  });
  return res.json();
}

export async function loginOrRegister(data) {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.error || 'Authentication failed');
  }
  return json;
}

export async function extractPdfText(file) {
  const formData = new FormData();
  formData.append('pdfFile', file);

  const res = await fetch(`${API_BASE}/pdf/extract`, {
    method: 'POST',
    body: formData,
  });

  return res.json();
}

export async function analyzeForm16Document(file) {
  return extractPdfText(file);
}

export async function uploadImageToCloudinaryApi(fileOrBase64) {
  if (typeof fileOrBase64 === 'string') {
    const res = await fetch(`${API_BASE}/upload/image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64: fileOrBase64 }),
    });
    return res.json();
  }

  const formData = new FormData();
  formData.append('image', fileOrBase64);
  const res = await fetch(`${API_BASE}/upload/image`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}
