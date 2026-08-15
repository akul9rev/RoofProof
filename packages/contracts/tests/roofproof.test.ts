// @ts-ignore
import { createSimulator } from '@openzeppelin/compact-simulator';
// @ts-ignore
import { Contract, ledger } from '../src/managed/contract';

describe('RoofProof Smart Contract ZK eligibility tests', () => {
  let privateIncomeValue: bigint = 0n;

  // Implement the witness callback that the simulator will invoke
  const mockWitnesses = {
    getPrivateIncome: () => {
      // Return a tuple of [privateState, value]
      return [null, privateIncomeValue];
    }
  };

  // Helper to initialize a simulator instance
  const getSimulatorInstance = async () => {
    // @ts-ignore
    const RoofProofSimulator = createSimulator({
      contractFactory: (witnesses: any) => new Contract(witnesses),
      defaultPrivateState: () => null,
      contractArgs: () => [],
      ledgerExtractor: ledger,
      witnessesFactory: () => mockWitnesses
    });
    
    // Create the simulator instance
    return await RoofProofSimulator.create([], {
      witnesses: mockWitnesses
    });
  };

  it('Test 1 — Valid eligibility: Income >= Threshold', async () => {
    // Given the tenant's private income is 74500 (satisfies threshold)
    privateIncomeValue = 74500n;
    const publicThreshold = 60000n;
    const applicationId = 123n;

    const sim = await getSimulatorInstance();
    
    // When verifying eligibility
    // @ts-ignore
    await sim.circuits.impure.verifyEligibility(applicationId, publicThreshold);

    // Then it should succeed, and verificationStatus ledger map should record "true"
    const publicState = await sim.getPublicState();
    // @ts-ignore
    const result = publicState.verificationStatus.lookup(applicationId);
    expect(result).toBe(true);
  });

  it('Test 2 — Invalid eligibility: Income < Threshold', async () => {
    // Given the tenant's private income is 40000 (below threshold)
    privateIncomeValue = 40000n;
    const publicThreshold = 60000n;
    const applicationId = 124n;

    const sim = await getSimulatorInstance();

    // When verifying eligibility, it should throw an assertion error inside the ZK circuit
    await expect(async () => {
      // @ts-ignore
      await sim.circuits.impure.verifyEligibility(applicationId, publicThreshold);
    }).rejects.toThrow();
  });

  it('Test 3 — Boundary condition: Income == Threshold', async () => {
    // Given the tenant's private income is exactly equal to the threshold
    privateIncomeValue = 60000n;
    const publicThreshold = 60000n;
    const applicationId = 125n;

    const sim = await getSimulatorInstance();

    // When verifying eligibility
    // @ts-ignore
    await sim.circuits.impure.verifyEligibility(applicationId, publicThreshold);

    // Then it should succeed, and verificationStatus map should record "true"
    const publicState = await sim.getPublicState();
    // @ts-ignore
    const result = publicState.verificationStatus.lookup(applicationId);
    expect(result).toBe(true);
  });

  it('Test 4 — Privacy check: Private income is not written into public ledger state', async () => {
    privateIncomeValue = 74500n;
    const publicThreshold = 60000n;
    const applicationId = 126n;

    const sim = await getSimulatorInstance();
    
    // @ts-ignore
    await sim.circuits.impure.verifyEligibility(applicationId, publicThreshold);

    // Verify that the private income value 74500 is NOT present anywhere in the public ledger state.
    // The public state must only contain the verificationStatus map and no record of the private income.
    const publicState = await sim.getPublicState();
    const ledgerStateString = JSON.stringify(publicState);
    expect(ledgerStateString).not.toContain('74500');
    expect(ledgerStateString).not.toContain('74500n');
  });
});
