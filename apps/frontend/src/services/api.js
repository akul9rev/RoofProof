const API_BASE = '/api';

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

export async function fetchPropertyApplications(propertyId) {
  const res = await fetch(`${API_BASE}/properties/${propertyId}/applications`);
  return res.json();
}

export async function fetchApplications(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/applications?${query}`);
  return res.json();
}

export async function applyForProperty(propertyId, payload) {
  // STRICT PRIVACY CHECK: Ensure NO income or sensitive keys are in payload
  const { tenant_id, verification_status, zk_tx_hash } = payload;
  const res = await fetch(`${API_BASE}/properties/${propertyId}/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tenant_id,
      verification_status,
      zk_tx_hash,
    }),
  });
  return res.json();
}

export async function updateApplicationStatus(applicationId, status) {
  const res = await fetch(`${API_BASE}/applications/${applicationId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function fetchUsers() {
  const res = await fetch(`${API_BASE}/users`);
  return res.json();
}

export async function loginOrRegister(data) {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}
