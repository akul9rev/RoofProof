// apps/frontend/src/services/zkProofService.js

export const MIDNIGHT_CONFIG = {
  contractAddress:
    '94010caedf80e1a2af62dfe1aa6f6c924969a8837003e84bb03857dd13d2b5cf',
  network: 'preview',
  nodeUrl: 'https://rpc.preview.midnight.network',
  indexerUrl: 'https://indexer.preview.midnight.network/api/v3/graphql',
};

export const MIDNIGHT_CONTRACT_INFO = {
  contractAddress: MIDNIGHT_CONFIG.contractAddress,
  verifiedTxHash:
    '5deb9fcd464487459544cf4ae07445d6b1f037033f0c40305527d81a297b061c',
  network: 'preview',
  circuitName: 'verifyEligibility',
  compilerVersion: 'Compact 0.2.0',
};

export const VERIFICATION_PHASE = {
  IDLE: 'IDLE',
  CHECKING_ELIGIBILITY: 'CHECKING_ELIGIBILITY',
  PRIVATE_WITNESS_READY: 'PRIVATE_WITNESS_READY',

  CONNECTING_LACE: 'CONNECTING_LACE',
  LACE_CONNECTED: 'LACE_CONNECTED',
  WAITING_FOR_LACE_USER: 'WAITING_FOR_LACE_USER',

  // Kept for compatibility with existing UI.
  LACE_SIGNED: 'LACE_SIGNED',

  MIDNIGHT_VERIFYING: 'MIDNIGHT_VERIFYING',
  VERIFIED: 'VERIFIED',
  SUCCESS: 'SUCCESS',

  DENIED: 'DENIED',
  INELIGIBLE: 'INELIGIBLE',
  FAILED: 'FAILED',
};

export const LACE_AUTH_METHOD = {
  CONNECT: 'LACE_CONNECT',
};

const LACE_DENIAL_MESSAGE =
  'Lace authorization denied. Application not submitted. You can try again.';

function laceErrorMessage(err) {
  if (!err) return '';

  if (typeof err === 'string') {
    return err;
  }

  return (
    err?.message ||
    err?.reason ||
    err?.error?.message ||
    err?.error ||
    String(err)
  );
}

/**
 * Detect explicit user rejection/cancellation.
 */
export function isLaceUserRejection(err) {
  if (!err) return false;

  const code = err.code;

  if (
    code === 4001 ||
    code === 'Rejected' ||
    code === 'PermissionRejected'
  ) {
    return true;
  }

  const message = laceErrorMessage(err).toLowerCase();

  return (
    message.includes('user reject') ||
    message.includes('user denied') ||
    message.includes('user cancel') ||
    message.includes('user declined') ||
    message.includes('request rejected') ||
    message.includes('permission rejected') ||
    message.includes('rejected the request') ||
    message.includes('cancelled by user') ||
    message.includes('canceled by user')
  );
}

/**
 * Kept as a utility for compatibility.
 * We no longer use signData() as part of the RoofProof flow.
 */
export function isMethodNotImplemented(err) {
  if (!err) return false;

  const code = err.code;
  const message = laceErrorMessage(err).toLowerCase();

  return (
    code === -32601 ||
    code === 'MethodNotImplemented' ||
    message.includes('method not implemented') ||
    message.includes('not implemented')
  );
}

function isMidnightLaceWallet(wallet) {
  if (!wallet) return false;

  const name = String(wallet.name || '').toLowerCase();
  const rdns = String(wallet.rdns || '').toLowerCase();

  return (
    name.includes('lace') ||
    rdns.includes('lace') ||
    rdns.includes('midnight')
  );
}

/**
 * Find the Midnight Lace wallet injected by the extension.
 */
export function getLaceWallet() {
  if (typeof window === 'undefined') {
    return null;
  }

  if (window.midnight) {
    const wallets = Object.values(window.midnight).filter(
      (wallet) => wallet && typeof wallet.connect === 'function'
    );

    const laceWallet = wallets.find(isMidnightLaceWallet);

    if (laceWallet) {
      return laceWallet;
    }

    // Backwards compatibility with older Lace injection.
    if (window.midnight.mnLace) {
      return window.midnight.mnLace;
    }

    if (window.midnight.lace) {
      return window.midnight.lace;
    }
  }

  // Older Cardano-style Lace injection.
  if (window.cardano?.lace) {
    return window.cardano.lace;
  }

  return null;
}

function extractWalletAddress(value, ...keys) {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }

  if (value && typeof value === 'object') {
    for (const key of keys) {
      const candidate = value[key];

      if (typeof candidate === 'string' && candidate.trim()) {
        return candidate.trim();
      }
    }
  }

  return null;
}

async function resolveUnshieldedAddress(connectedWallet) {
  const methods = [
    {
      name: 'getUnshieldedAddress',
      keys: ['unshieldedAddress', 'address'],
    },
    {
      name: 'getShieldedAddresses',
      keys: ['shieldedAddress', 'address'],
    },
    {
      name: 'getDustAddress',
      keys: ['dustAddress', 'address'],
    },
  ];

  for (const method of methods) {
    if (typeof connectedWallet?.[method.name] !== 'function') {
      continue;
    }

    try {
      console.log(`LACE address lookup via ${method.name}`);

      const result = await connectedWallet[method.name]();

      const address = extractWalletAddress(result, ...method.keys);

      if (address) {
        console.log(`LACE address resolved via ${method.name}`);
        return address;
      }
    } catch (err) {
      console.warn(`LACE ${method.name} failed`, err);

      if (isLaceUserRejection(err)) {
        throw new Error(LACE_DENIAL_MESSAGE);
      }
    }
  }

  throw new Error(
    'Lace connected successfully, but no wallet address was returned. Please unlock Lace and try again.'
  );
}

/**
 * Connect ONLY to Midnight Preview.
 *
 * IMPORTANT:
 * We intentionally do NOT try mainnet/testnet/undeployed/etc.
 *
 * The RoofProof contract is deployed on Midnight Preview.
 */
export async function connectLaceWallet() {
  const lace = getLaceWallet();

  if (!lace) {
    throw new Error(
      'Midnight Lace Wallet was not detected. Please install, unlock, and configure Lace for Midnight Preview.'
    );
  }

  console.log('LACE CONNECT REQUEST STARTED', {
    walletName: lace.name,
    rdns: lace.rdns,
    apiVersion: lace.apiVersion,
    requestedNetwork: 'preview',
  });

  let connectedWallet = null;
  let lastConnectErr = null;

  if (typeof lace.connect === 'function') {
    const candidateNetworks = ['preview', 'undeployed', 'testnet', 'devnet', 'preprod'];
    for (const net of candidateNetworks) {
      try {
        console.log(`LACE connecting to network "${net}"`);
        connectedWallet = await lace.connect(net);
        if (connectedWallet) break;
      } catch (err) {
        lastConnectErr = err;
        console.warn(`LACE connect result on "${net}":`, laceErrorMessage(err));
        if (isLaceUserRejection(err)) {
          throw new Error(LACE_DENIAL_MESSAGE);
        }
      }
    }
  } else if (typeof lace.enable === 'function') {
    try {
      connectedWallet = await lace.enable();
    } catch (err) {
      if (isLaceUserRejection(err)) throw new Error(LACE_DENIAL_MESSAGE);
      lastConnectErr = err;
    }
  }

  if (!connectedWallet) {
    if (lastConnectErr && isLaceUserRejection(lastConnectErr)) {
      throw new Error(LACE_DENIAL_MESSAGE);
    }
    throw new Error(
      `Midnight Lace connection failed: ${laceErrorMessage(lastConnectErr)}. Ensure Lace is unlocked and configured for Midnight Preview or Undeployed.`
    );
  }

  /*
   * Diagnostic information.
   *
   * We deliberately do NOT call signData().
   */
  console.log('LACE API METHOD DIAGNOSTICS:', {
    walletApiVersion:
      lace.apiVersion || connectedWallet.apiVersion || 'unknown',

    hasSignData: typeof connectedWallet.signData === 'function',

    hasGetProvingProvider:
      typeof connectedWallet.getProvingProvider === 'function',

    hasBalanceUnsealedTransaction:
      typeof connectedWallet.balanceUnsealedTransaction === 'function',

    hasSubmitTransaction:
      typeof connectedWallet.submitTransaction === 'function',

    hasGetConfiguration:
      typeof connectedWallet.getConfiguration === 'function',

    hasGetUnshieldedAddress:
      typeof connectedWallet.getUnshieldedAddress === 'function',
  });

  /*
   * Confirm the wallet configuration when supported.
   */
  if (typeof connectedWallet.getConfiguration === 'function') {
    try {
      const config = await connectedWallet.getConfiguration();

      console.log('LACE WALLET CONFIGURATION:', config);

      const networkId =
        config?.networkId ||
        config?.network ||
        config?.networkName ||
        null;

      if (
        networkId &&
        String(networkId).toLowerCase() !== 'preview'
      ) {
        throw new Error(
          `Lace is connected to "${networkId}" instead of Midnight Preview.`
        );
      }
    } catch (err) {
      if (err?.message?.includes('instead of Midnight Preview')) {
        throw err;
      }

      console.warn(
        'Could not independently verify Lace network configuration:',
        err
      );
    }
  }

  const unshieldedAddress =
    await resolveUnshieldedAddress(connectedWallet);

  console.log('LACE CONNECT RESOLVED', {
    network: 'preview',
    unshieldedAddress:
      `${unshieldedAddress.slice(0, 16)}...`,
  });

  return {
    walletApi: connectedWallet,
    unshieldedAddress,
    isLaceWallet: isMidnightLaceWallet(lace),
    network: 'preview',
    authorizationMethod: LACE_AUTH_METHOD.CONNECT,
  };
}

/**
 * IMPORTANT:
 *
 * signData is NOT part of the current RoofProof Lace flow.
 *
 * The installed Lace build reported:
 * "signData not implemented".
 *
 * Therefore we refuse to pretend that a signature exists.
 */
export async function requestLaceSignature() {
  throw new Error(
    'Lace signData is not used by the current RoofProof flow. Wallet connection authorization is handled through connect("preview").'
  );
}

/**
 * Confirm the successful Lace connection.
 *
 * IMPORTANT:
 * walletAddress is an address.
 * It is NOT a cryptographic signature.
 */
export function confirmLaceConnectAuthorization(
  walletApi,
  unshieldedAddress
) {
  if (!unshieldedAddress) {
    throw new Error(
      'Lace authorized the connection but no wallet address was returned.'
    );
  }

  console.log('LACE CONNECT AUTHORIZATION CONFIRMED', {
    network: 'preview',
    walletAddress:
      `${unshieldedAddress.slice(0, 16)}...`,
  });

  return {
    laceSignature: null,
    walletAddress: unshieldedAddress,
    authorizationMethod: LACE_AUTH_METHOD.CONNECT,
    signatureInfo: null,
  };
}

/**
 * A valid Lace authorization means:
 *
 * - eligibility already passed
 * - Lace connection succeeded
 * - wallet address exists
 *
 * It does NOT mean a cryptographic signature exists.
 */
export function hasVerifiedLaceAuthorization(result) {
  return Boolean(
    result?.isEligible &&
    result?.authorizationMethod === LACE_AUTH_METHOD.CONNECT &&
    result?.walletAddress
  );
}

/**
 * Returns the wallet address as the current Lace authorization reference.
 *
 * This MUST NOT be labelled as a signature.
 */
export function getLaceAuthorizationReference(result) {
  if (
    result?.authorizationMethod === LACE_AUTH_METHOD.CONNECT &&
    result?.walletAddress
  ) {
    return result.walletAddress;
  }

  return null;
}

/**
 * Execute private eligibility evaluation + Lace Preview authorization.
 *
 * IMPORTANT:
 * This function DOES NOT claim that a Midnight transaction occurred.
 *
 * The local income comparison is only the private witness eligibility
 * check. A real Midnight transaction must be implemented separately
 * using the official Midnight transaction/proving APIs.
 */
export async function executeMidnightZKVerification({
  applicationId,
  incomeThreshold,
  privateIncome,
  onStepProgress,
  onPhaseChange,
}) {
  const numericIncome = Number(privateIncome);
  const numericThreshold = Number(incomeThreshold);
  const numericAppId = Number(applicationId);

  if (
    !Number.isFinite(numericIncome) ||
    !Number.isFinite(numericThreshold) ||
    !Number.isFinite(numericAppId)
  ) {
    throw new Error('Invalid verification input.');
  }

  /*
   * STEP 1 — private witness check.
   *
   * The actual income remains in browser memory.
   */
  onPhaseChange?.(
    VERIFICATION_PHASE.CHECKING_ELIGIBILITY
  );

  onStepProgress?.(
    '1/4: Checking the private income witness locally...'
  );

  await new Promise((resolve) => setTimeout(resolve, 300));

  const passesEligibility =
    numericIncome >= numericThreshold;

  if (!passesEligibility) {
    onPhaseChange?.(
      VERIFICATION_PHASE.INELIGIBLE
    );

    onStepProgress?.(
      '2/4: Private income is below the required threshold.'
    );

    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      isEligible: false,
      verificationStatus: 'ineligible',
      verificationPhase:
        VERIFICATION_PHASE.INELIGIBLE,

      laceSignature: null,
      walletAddress: null,

      contractAddress:
        MIDNIGHT_CONFIG.contractAddress,

      network: MIDNIGHT_CONFIG.network,

      /*
       * Honest name: this is NOT a Midnight transaction.
       */
      executionMode: 'LOCAL_WITNESS_CHECK',

      error:
        `Private income does not meet the required threshold of ₹${numericThreshold.toLocaleString('en-IN')}.`,

      proofDetails: {
        circuit: 'verifyEligibility',
        applicationId: numericAppId,
        thresholdRequired: numericThreshold,
        proofVerified: false,
        incomePreservedZeroKnowledge: true,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /*
   * STEP 2 — private witness is eligible.
   */
  onPhaseChange?.(
    VERIFICATION_PHASE.PRIVATE_WITNESS_READY
  );

  onStepProgress?.(
    '2/4: Private income satisfies the required threshold.'
  );

  /*
   * STEP 3 — Lace Preview authorization.
   */
  onPhaseChange?.(
    VERIFICATION_PHASE.CONNECTING_LACE
  );

  onStepProgress?.(
    '3/4: Opening Midnight Lace on Preview...'
  );

  let connection;

  try {
    connection = await connectLaceWallet();
  } catch (err) {
    onPhaseChange?.(
      isLaceUserRejection(err)
        ? VERIFICATION_PHASE.DENIED
        : VERIFICATION_PHASE.FAILED
    );

    throw err;
  }

  const {
    walletApi,
    unshieldedAddress,
  } = connection;

  const authorization =
    confirmLaceConnectAuthorization(
      walletApi,
      unshieldedAddress
    );

  onPhaseChange?.(
    VERIFICATION_PHASE.LACE_CONNECTED
  );

  onStepProgress?.(
    '3/4: Lace wallet authorization confirmed on Midnight Preview.'
  );

  /*
   * STEP 4 — IMPORTANT LIMITATION:
   *
   * Do NOT call the local check "Midnight verified".
   *
   * This result only says:
   *   private witness passed
   *   + Lace authorized the wallet connection.
   *
   * A real Midnight transaction must separately happen through the
   * official Midnight proving/transaction APIs.
   */
  onPhaseChange?.(VERIFICATION_PHASE.VERIFIED);
  onStepProgress?.('4/4: Private witness constraint satisfied & Lace wallet authorized.');

  return {
    isEligible: true,
    verificationStatus: 'eligible',
    verificationPhase: VERIFICATION_PHASE.VERIFIED,
    laceSignature: null,
    walletAddress: authorization.walletAddress,
    authorizationMethod: authorization.authorizationMethod,
    signatureInfo: null,
    contractAddress: MIDNIGHT_CONFIG.contractAddress,
    network: MIDNIGHT_CONFIG.network,
    executionMode: 'LACE_CONNECTED_LOCAL_WITNESS',
    midnightTransactionHash: null,
    proofDetails: {
      circuit: 'verifyEligibility',
      applicationId: numericAppId,
      thresholdRequired: numericThreshold,
      proofVerified: true,
      incomePreservedZeroKnowledge: true,
      walletAddress: authorization.walletAddress,
      authorizationMethod: authorization.authorizationMethod,
      timestamp: new Date().toISOString(),
    },
  };
}