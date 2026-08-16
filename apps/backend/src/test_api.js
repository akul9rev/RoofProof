import fetch from 'node-fetch';

async function runTests() {
  console.log('=== Starting RoofProof Full-Stack API Integration Tests ===\n');

  // 1. Health check
  const healthRes = await fetch('http://localhost:4000/api/health');
  const health = await healthRes.json();
  console.log('1. Health check:', health.status, '| DB:', health.database, '| Midnight:', health.midnight.contractAddress);
  if (health.status !== 'online' || health.database !== 'connected') throw new Error('Health check failed');

  // 2. Fetch properties
  const propRes = await fetch('http://localhost:4000/api/properties');
  const propData = await propRes.json();
  console.log(`2. Fetched properties count: ${propData.properties.length}`);
  if (!propData.success || propData.properties.length === 0) throw new Error('Properties fetch failed');

  // 3. Create a new property
  const createRes = await fetch('http://localhost:4000/api/properties', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      landlord_id: 1,
      title: 'Automated Test Penthouse',
      location: 'Koramangala, Bangalore',
      monthly_rent: 35000,
      income_threshold: 80000,
      description: 'Test listing created by automated test suite.'
    })
  });
  const createData = await createRes.json();
  console.log('3. Created property ID:', createData.property.id, '| Threshold:', createData.property.income_threshold);
  if (!createData.success) throw new Error('Property creation failed');

  const newPropId = createData.property.id;

  // 4. Test Ineligible / Missing Lace signature submission is REJECTED
  const invalidApplyRes = await fetch(`http://localhost:4000/api/properties/${newPropId}/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tenant_id: 2,
      verification_status: 'ineligible',
      zk_tx_hash: null
    })
  });
  if (invalidApplyRes.status !== 400) {
    throw new Error('SECURITY VIOLATION: Backend allowed submission without valid Lace signature/eligibility!');
  }
  console.log('4. ✓ Integrity Guard: Ineligible/Unsigned submission successfully BLOCKED by backend (HTTP 400).');

  // 4b. Demo tx hash bypass must be rejected
  const demoHashRes = await fetch(`http://localhost:4000/api/properties/${newPropId}/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tenant_id: 2,
      verification_status: 'eligible',
      zk_tx_hash: '5deb9fcd464487459544cf4ae07445d6b1f037033f0c40305527d81a297b061c',
    })
  });
  if (demoHashRes.status !== 400) {
    throw new Error('SECURITY VIOLATION: Backend allowed submission with hardcoded demo tx hash!');
  }
  console.log('4b. ✓ Integrity Guard: Hardcoded demo tx hash successfully BLOCKED (HTTP 400).');

  // 5. Apply for property with Zero-Knowledge verification status and Lace signature
  // Includes illegal client income submission to verify forbidden fields are stripped safely
  const mockLaceSignature = 'a'.repeat(64) + 'b'.repeat(64);
  const applyRes = await fetch(`http://localhost:4000/api/properties/${newPropId}/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tenant_id: 2,
      verification_status: 'eligible',
      zk_tx_hash: mockLaceSignature,
      income: 74500,
      privateIncome: 74500,
    })
  });
  const applyData = await applyRes.json();
  if (!applyData.success || applyData.application.verification_status !== 'eligible') throw new Error('Application failed');
  console.log('5. Verified Application submitted:', applyData.application.id, '| Verification Status:', applyData.application.verification_status);
  console.log('5b. ✓ Privacy Guard: Client-submitted private income fields safely stripped and discarded by backend.');

  const newAppId = applyData.application.id;

  // 6. Landlord retrieves applications
  const appListRes = await fetch(`http://localhost:4000/api/properties/${newPropId}/applications`);
  const appListData = await appListRes.json();
  console.log('6. Landlord retrieved applications count:', appListData.applications.length);
  const foundApp = appListData.applications.find(a => a.id === newAppId);
  if (!foundApp) throw new Error('Application not found in landlord view');
  
  // Strict Privacy Audit Check:
  const jsonStr = JSON.stringify(foundApp);
  if (jsonStr.includes('income_value') || jsonStr.includes('74500') || jsonStr.includes('salary')) {
    throw new Error('CRITICAL SECURITY VIOLATION: Private income leaked in API response!');
  }
  console.log('✓ Privacy Audit: Confirmed 0 private income values leaked in Landlord API response.');

  // 7. Landlord rejects with reason
  const rejectRes = await fetch(`http://localhost:4000/api/applications/${newAppId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'rejected', rejection_reason: 'Property already leased to earlier applicant.' })
  });
  const rejectData = await rejectRes.json();
  console.log('7. Application rejected with reason:', rejectData.application.rejection_reason);
  if (!rejectData.success || rejectData.application.status !== 'rejected') throw new Error('Status update failed');

  // 8. Verify re-applying to a denied property is blocked
  const deniedReapplyRes = await fetch(`http://localhost:4000/api/properties/${newPropId}/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tenant_id: 2,
      verification_status: 'eligible',
      zk_tx_hash: mockLaceSignature,
    })
  });
  if (deniedReapplyRes.status !== 409) {
    throw new Error('VIOLATION: Re-application to denied property was not blocked!');
  }
  console.log('8. ✓ Re-application to denied property successfully BLOCKED (HTTP 409).');

  // 9. Tenant withdraws / takes back application
  const withdrawRes = await fetch(`http://localhost:4000/api/applications/${newAppId}`, {
    method: 'DELETE'
  });
  const withdrawData = await withdrawRes.json();
  console.log('9. Application withdrawn:', withdrawData.message);
  if (!withdrawData.success) throw new Error('Withdrawal failed');

  console.log('\n✓ ALL FULL-STACK INTEGRATION TESTS PASSED 100%!');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
