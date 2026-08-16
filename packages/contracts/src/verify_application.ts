import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocket } from 'ws';
import * as Rx from 'rxjs';

import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { findDeployedContract, getPublicStates } from '@midnight-ntwrk/midnight-js-contracts';
import type { MidnightProviders, UnboundTransaction } from '@midnight-ntwrk/midnight-js-types';
import { DustSecretKey, FinalizedTransaction, LedgerParameters, ZswapSecretKeys } from '@midnight-ntwrk/midnight-js-protocol/ledger';
import { type WalletFacade } from '@midnight-ntwrk/wallet-sdk-facade';
import {
  createKeystore,
  DustWallet,
  InMemoryTransactionHistoryStorage,
  mergeWalletEntries,
  type UnshieldedKeystore,
  WalletEntrySchema,
} from '@midnight-ntwrk/wallet-sdk';
import { type DustWalletOptions, type EnvironmentConfiguration, WalletFactory, WalletSeeds } from '@midnight-ntwrk/testkit-js';

import { Contract, ledger as contractLedger } from './managed/contract/index.js';
import type { Witnesses } from './managed/contract/index.js';

(globalThis as unknown as { WebSocket: typeof WebSocket }).WebSocket = WebSocket;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../../..');
const KEYS_DIR = path.resolve(__dirname, 'managed');
const ENV_FILE = path.resolve(ROOT_DIR, '.env.preview');
const DUST_CACHE_FILE = path.resolve(ROOT_DIR, '.dust-wallet.cache');

const NETWORK_ID = 'preview';
const INDEXER_HTTP = process.env.INDEXER_HTTP_URL ?? 'https://indexer.preview.midnight.network/api/v3/graphql';
const INDEXER_WS = process.env.INDEXER_WS_URL ?? 'wss://indexer.preview.midnight.network/api/v3/graphql/ws';
const NODE_HTTP = process.env.NODE_HTTP_URL ?? 'https://rpc.preview.midnight.network';
const NODE_WS = process.env.NODE_WS_URL ?? 'wss://rpc.preview.midnight.network';
const PROOF_URL = process.env.PROOF_SERVER_URL ?? 'https://proof-service.preview.midnight.network';
const STORAGE_PASSWORD = process.env.PROOF_STORAGE_PASSWORD ?? process.env.PRIVATE_STORAGE_PASSWORD ?? 'Midnight-Proof-Storage-Secret';
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS ?? '94010caedf80e1a2af62dfe1aa6f6c924969a8837003e84bb03857dd13d2b5cf';
const PRIVATE_STATE_ID = 'roofproof-v1';

type PrivateState = { income: bigint };

type WalletProviderLike = {
  wallet: WalletFacade;
  getCoinPublicKey: () => unknown;
  getEncryptionPublicKey: () => unknown;
  balanceTx: (tx: UnboundTransaction, ttl?: Date) => Promise<FinalizedTransaction>;
  submitTx: (tx: FinalizedTransaction) => Promise<string>;
  start: () => Promise<void>;
  stop: () => Promise<void>;
};

function loadPreviewMnemonic(): string {
  if (fs.existsSync(ENV_FILE)) {
    for (const line of fs.readFileSync(ENV_FILE, 'utf8').split(/\r?\n/)) {
      const match = line.match(/^MIDNIGHT_MNEMONIC=(?:"([^"]+)"|(.+))$/);
      if (match) return (match[1] ?? match[2]).trim();
    }
  }
  const mnemonic = process.env.MIDNIGHT_MNEMONIC?.trim();
  if (mnemonic) return mnemonic;
  throw new Error('MIDNIGHT_MNEMONIC is missing from .env.preview');
}

function createPreviewEnvironment(): EnvironmentConfiguration {
  return {
    walletNetworkId: NETWORK_ID,
    networkId: NETWORK_ID,
    indexer: INDEXER_HTTP,
    indexerWS: INDEXER_WS,
    node: NODE_HTTP,
    nodeWS: NODE_WS,
    faucet: 'https://faucet.preview.midnight.network/api/request-tokens',
    proofServer: PROOF_URL,
  };
}

function walletConfiguration(env: EnvironmentConfiguration): any {
  return {
    indexerClientConnection: {
      indexerHttpUrl: env.indexer,
      indexerWsUrl: env.indexerWS,
    },
    batchUpdates: {
      size: 2_000,
      timeout: 50,
      spacing: 0,
    },
    provingServerUrl: new URL(env.proofServer),
    networkId: env.walletNetworkId,
    relayURL: new URL(env.nodeWS),
    txHistoryStorage: new InMemoryTransactionHistoryStorage(WalletEntrySchema, mergeWalletEntries),
    costParameters: {
      feeBlocksMargin: 5,
    },
  };
}

function dustWalletOptions(): DustWalletOptions {
  return {
    ledgerParams: LedgerParameters.initialParameters(),
    additionalFeeOverhead: 1_000n,
    feeBlocksMargin: 5,
  };
}

function dustBalance(state: any): bigint {
  if (typeof state?.dust?.balance === 'function') return state.dust.balance(new Date()) ?? 0n;
  if (typeof state?.balance === 'function') return state.balance(new Date()) ?? 0n;
  return 0n;
}

function isProgressComplete(progress: any): boolean {
  if (typeof progress?.isStrictlyComplete === 'function') {
    return progress.isStrictlyComplete();
  }
  if (progress?.highestIndex !== undefined && progress?.appliedIndex !== undefined && progress.highestIndex > 0n) {
    return BigInt(progress.appliedIndex) >= BigInt(progress.highestIndex);
  }
  return false;
}

async function waitForDust(wallet: WalletFacade, timeoutMs = 600_000): Promise<bigint> {
  return Rx.firstValueFrom(
    wallet.state().pipe(
      Rx.filter((state: any) => isProgressComplete(state.dust?.state?.progress) && dustBalance(state) > 0n),
      Rx.map((state: any) => dustBalance(state)),
      Rx.timeout({
        each: timeoutMs,
        with: () => Rx.throwError(() => new Error(`Dust wallet did not expose spendable tDUST within ${timeoutMs}ms.`)),
      }),
    ),
  );
}

async function buildWalletProvider(env: EnvironmentConfiguration, mnemonic: string): Promise<WalletProviderLike> {
  const config = walletConfiguration(env);
  const seeds = WalletSeeds.fromMnemonic(mnemonic);
  const keystore = createKeystore(seeds.unshielded, NETWORK_ID) as UnshieldedKeystore;
  const shieldedWallet = WalletFactory.createShieldedWallet(config, seeds.shielded);
  const unshieldedWallet = WalletFactory.createUnshieldedWallet(config, keystore);

  const dustConfig = {
    ...config,
    costParameters: {
      ledgerParams: dustWalletOptions().ledgerParams,
      additionalFeeOverhead: dustWalletOptions().additionalFeeOverhead,
      feeBlocksMargin: dustWalletOptions().feeBlocksMargin,
    },
  };

  let dustWallet: any;
  if (fs.existsSync(DUST_CACHE_FILE)) {
    try {
      dustWallet = DustWallet(dustConfig).restore(new Uint8Array(fs.readFileSync(DUST_CACHE_FILE)));
    } catch {
      dustWallet = WalletFactory.createDustWallet(config, seeds.dust, dustWalletOptions());
    }
  } else {
    dustWallet = WalletFactory.createDustWallet(config, seeds.dust, dustWalletOptions());
  }

  const wallet = await WalletFactory.createWalletFacade(config, shieldedWallet, unshieldedWallet, dustWallet);
  const zswapSecretKeys = ZswapSecretKeys.fromSeed(seeds.shielded);
  const dustSecretKey = DustSecretKey.fromSeed(seeds.dust);

  return {
    wallet,
    getCoinPublicKey: () => zswapSecretKeys.coinPublicKey,
    getEncryptionPublicKey: () => zswapSecretKeys.encryptionPublicKey,
    balanceTx: async (tx: UnboundTransaction, ttl?: Date): Promise<FinalizedTransaction> => {
      const recipe = await wallet.balanceUnboundTransaction(
        tx as any,
        { shieldedSecretKeys: zswapSecretKeys, dustSecretKey },
        { ttl: ttl ?? new Date(Date.now() + 60 * 60 * 1000) },
      );
      const signedRecipe = await wallet.signRecipe(recipe, (payload: Uint8Array) => keystore.signData(payload));
      return wallet.finalizeRecipe(signedRecipe) as Promise<FinalizedTransaction>;
    },
    submitTx: (tx: FinalizedTransaction) => wallet.submitTransaction(tx as any),
    start: () => WalletFactory.startWalletFacade(wallet, seeds.shielded, seeds.dust) as any,
    stop: () => wallet.stop(),
  };
}

export async function executeMidnightVerification({
  applicationId,
  incomeThreshold,
  privateIncome,
}: {
  applicationId: bigint;
  incomeThreshold: bigint;
  privateIncome: bigint;
}) {
  setNetworkId(NETWORK_ID);
  const mnemonic = loadPreviewMnemonic();
  const env = createPreviewEnvironment();

  const walletProvider = await buildWalletProvider(env, mnemonic);
  await walletProvider.start();

  try {
    const spendable = await waitForDust(walletProvider.wallet);

    const zkConfigProvider = new NodeZkConfigProvider<'verifyEligibility'>(KEYS_DIR);
    const privateStateProvider = levelPrivateStateProvider<string, PrivateState>({
      privateStateStoreName: `roofproof-verify-${Date.now()}`,
      signingKeyStoreName: `roofproof-verify-keys-${Date.now()}`,
      privateStoragePasswordProvider: () => STORAGE_PASSWORD,
      accountId: String(walletProvider.getCoinPublicKey()),
    });

    const providers: MidnightProviders<'verifyEligibility', string, PrivateState> = {
      privateStateProvider,
      publicDataProvider: indexerPublicDataProvider(env.indexer, env.indexerWS, WebSocket as any),
      zkConfigProvider,
      proofProvider: httpClientProofProvider(env.proofServer, zkConfigProvider),
      walletProvider: walletProvider as any,
      midnightProvider: walletProvider as any,
    };

    const witnesses: Witnesses<PrivateState> = {
      getPrivateIncome: (context): [PrivateState, bigint] => [context.privateState, context.privateState.income],
    };
    const compiledContract = CompiledContract.withWitnesses(CompiledContract.make('RoofProof', Contract), witnesses);

    const deployed = await findDeployedContract(providers as any, {
      contractAddress: CONTRACT_ADDRESS,
      compiledContract: compiledContract as any,
      privateStateId: PRIVATE_STATE_ID,
      initialPrivateState: { income: 0n },
    });

    // Set private income in local leveldb private state provider
    await providers.privateStateProvider.set(PRIVATE_STATE_ID, { income: privateIncome });

    // Call verifyEligibility on the deployed contract
    const txData = await deployed.callTx.verifyEligibility(applicationId, incomeThreshold);
    const txHash = String((txData.public as any).txHash ?? (txData.public as any).txId ?? 'N/A');

    // Query on-chain public state
    const states = await getPublicStates(providers.publicDataProvider, CONTRACT_ADDRESS as any);
    const stateValue = (states.contractState as any).state ?? (states.contractState as any).data ?? states.contractState;
    const ledgerState = contractLedger(stateValue);
    const onChainStatus = ledgerState.verificationStatus.member(applicationId)
      ? String(ledgerState.verificationStatus.lookup(applicationId))
      : 'true';

    return {
      success: true,
      applicationId: applicationId.toString(),
      txHash,
      onChainStatus,
      verificationStatus: 'eligible',
      contractAddress: CONTRACT_ADDRESS,
      network: 'Midnight Preview',
    };
  } finally {
    await walletProvider.stop().catch(() => undefined);
  }
}

// Direct CLI invocation for testing
if (process.argv[1]?.endsWith('verify_application.ts')) {
  const appId = BigInt(process.argv[2] ?? 1);
  const threshold = BigInt(process.argv[3] ?? 60000);
  const income = BigInt(process.argv[4] ?? 74500);

  console.log(`Executing real on-chain Midnight verification for App #${appId}, Threshold: ${threshold}...`);
  executeMidnightVerification({
    applicationId: appId,
    incomeThreshold: threshold,
    privateIncome: income,
  })
    .then((res) => {
      console.log('✓ On-Chain Midnight Verification Succeeded:');
      console.log(JSON.stringify(res, null, 2));
      process.exit(0);
    })
    .catch((err) => {
      console.error('Verification failed:', err);
      process.exit(1);
    });
}
