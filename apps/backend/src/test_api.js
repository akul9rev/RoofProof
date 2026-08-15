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

  // 4. Apply for property with Zero-Knowledge verification status (NO income in payload!)
  const applyRes = await fetch(`http://localhost:4000/api/properties/${newPropId}/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tenant_id: 2,
      verification_status: 'eligible',
      zk_tx_hash: '5deb9fcd464487459544cf4ae07445d6b1f037033f0c40305527d81a297b061c'
    })
  });
  const applyData = await applyRes.json();
  console.log('4. Application submitted:', applyData.application.id, '| Verification Status:', applyData.application.verification_status);
  if (!applyData.success || applyData.application.verification_status !== 'eligible') throw new Error('Application failed');

  const newAppId = applyData.application.id;

  // 5. Landlord retrieves applications
  const appListRes = await fetch(`http://localhost:4000/api/properties/${newPropId}/applications`);
  const appListData = await appListRes.json();
  console.log('5. Landlord retrieved applications count:', appListData.applications.length);
  const foundApp = appListData.applications.find(a => a.id === newAppId);
  if (!foundApp) throw new Error('Application not found in landlord view');
  
  // Strict Privacy Audit Check:
  const jsonStr = JSON.stringify(foundApp);
  if (jsonStr.includes('income_value') || jsonStr.includes('74500') || jsonStr.includes('salary')) {
    throw new Error('CRITICAL SECURITY VIOLATION: Private income leaked in API response!');
  }
  console.log('✓ Privacy Audit: Confirmed 0 private income values leaked in Landlord API response.');

  // 6. Landlord approves application
  const updateRes = await fetch(`http://localhost:4000/api/applications/${newAppId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'approved' })
  });
  const updateData = await updateRes.json();
  console.log('6. Application status updated to:', updateData.application.status);
  if (!updateData.success || updateData.application.status !== 'approved') throw new Error('Status update failed');

  console.log('\n✓ ALL FULL-STACK INTEGRATION TESTS PASSED 100%!');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
