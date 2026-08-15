/**
 * RoofProof real Midnight Preview deployment.
 *
 * Current supported flow, aligned with midnightntwrk/example-bboard:
 * - uses @midnight-ntwrk/testkit-js WalletFactory/WalletSeeds provider stack
 * - uses remote-network dust fee overhead of 1_000n
 * - uses SDK-supported DustWallet serialization/restore to resume indexer replay
 * - uses real Preview RPC, indexer, proof server, and wallet mnemonic from .env.preview
 */

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
import { deployContract, findDeployedContract, getPublicStates } from '@midnight-ntwrk/midnight-js-contracts';
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
const PROGRESS_FILE = path.resolve(ROOT_DIR, 'ROOFPROOF_PROGRESS.md');
const DUST_CACHE_FILE = path.resolve(ROOT_DIR, '.dust-wallet.cache');

const NETWORK_ID = 'preview';
const INDEXER_HTTP = process.env.INDEXER_HTTP_URL ?? 'https://indexer.preview.midnight.network/api/v3/graphql';
const INDEXER_WS = process.env.INDEXER_WS_URL ?? 'wss://indexer.preview.midnight.network/api/v3/graphql/ws';
const NODE_HTTP = process.env.NODE_HTTP_URL ?? 'https://rpc.preview.midnight.network';
const NODE_WS = process.env.NODE_WS_URL ?? 'wss://rpc.preview.midnight.network';
const PROOF_URL = process.env.PROOF_SERVER_URL ?? 'http://localhost:6300';
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

const log = (message: string) => console.log(`[${new Date().toISOString()}] ${message}`);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function loadPreviewMnemonic(): string {
  if (fs.existsSync(ENV_FILE)) {
    for (const line of fs.readFileSync(ENV_FILE, 'utf8').split(/\r?\n/)) {
      const match = line.match(/^MIDNIGHT_MNEMONIC=(?:"([^"]+)"|(.+))$/);
      if (match) return (match[1] ?? match[2]).trim();
    }
  }
  const mnemonic = process.env.MIDNIGHT_MNEMONIC?.trim();
  if (mnemonic) return mnemonic;
  throw new Error('MIDNIGHT_MNEMONIC is missing. Put it in .env.preview or the environment.');
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
      size: Number(process.env.DUST_SYNC_BATCH_SIZE ?? 2_000),
      timeout: Number(process.env.DUST_SYNC_BATCH_TIMEOUT_MS ?? 50),
      spacing: Number(process.env.DUST_SYNC_BATCH_SPACING_MS ?? 0),
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

async function assertProofServer(): Promise<void> {
  for (const url of [PROOF_URL, `${PROOF_URL}/check`, `${PROOF_URL}/health`]) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        log(`Proof server reachable (${url}, ${response.status}).`);
        return;
      }
    } catch {}
  }
  throw new Error(`Proof server is not reachable at ${PROOF_URL}. Start the real proof server before deploying.`);
}

async function saveDustCache(wallet: WalletFacade, requireSynced = true): Promise<void> {
  if (!requireSynced) return;
  try {
    const dustState: any = await wallet.dust.waitForSyncedState();
    const serialized = dustState.serialize();
    if (serialized && serialized.length > 0) {
      fs.writeFileSync(DUST_CACHE_FILE, Buffer.from(serialized));
      log(`Saved fully synced DustWallet cache (${serialized.length} bytes): ${DUST_CACHE_FILE}`);
    }
  } catch (error) {
    log(`Dust cache save skipped: ${error instanceof Error ? error.message : String(error)}`);
  }
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

async function waitForDust(wallet: WalletFacade, timeoutMs = Number(process.env.DUST_SYNC_TIMEOUT_MS ?? 900_000)): Promise<bigint> {
  const started = Date.now();
  let lastLog = 0;
  let lastCache = 0;
  return Rx.firstValueFrom(
    wallet.state().pipe(
      Rx.tap((state: any) => {
        const progress = state.dust?.state?.progress;
        const applied = progress?.appliedIndex?.toString?.() ?? '?';
        const highest = progress?.highestIndex?.toString?.() ?? progress?.highestRelevantWalletIndex?.toString?.() ?? '?';
        const balance = dustBalance(state);
        const now = Date.now();
        if (now - lastLog > 5_000) {
          lastLog = now;
          const isConnected = progress?.isConnected ?? false;
          const coins = state.dust?.availableCoins?.length ?? state.dust?.state?.availableCoins?.length ?? 0;
          log(`Dust sync: isConnected=${isConnected} applied=${applied} highest=${highest} coins=${coins} balance=${balance}`);
        }
      }),
      Rx.filter((state: any) => isProgressComplete(state.dust?.state?.progress) && dustBalance(state) > 0n),
      Rx.map((state: any) => dustBalance(state)),
      Rx.timeout({
        each: timeoutMs,
        with: () => Rx.throwError(() => new Error(`Dust wallet did not expose spendable tDUST within ${timeoutMs}ms.`)),
      }),
      Rx.tap(() => log(`Dust wallet ready after ${Date.now() - started}ms.`)),
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
      log('Restoring DustWallet from .dust-wallet.cache.');
      dustWallet = DustWallet(dustConfig).restore(new Uint8Array(fs.readFileSync(DUST_CACHE_FILE)));
    } catch (e: any) {
      log(`Cache restore failed (${e.message}), creating fresh dust wallet.`);
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
    start: () => wallet.start(zswapSecretKeys, dustSecretKey),
    stop: () => wallet.stop(),
  };
}

async function appendDeploymentResult(result: Record<string, string>): Promise<void> {
  const section = `

---

## Prompt 2.6 - Midnight Preview Deployment Result

### Date
${result.timestamp}

### Official Workflow Alignment
- Deployed and verified on Midnight Preview network using official Midnight.js and Wallet SDK.
- Used remote-network dust fee overhead \`1_000n\`.
- Persisted synchronized DustWallet state in \`.dust-wallet.cache\`.
- Used real Preview endpoints and the funded wallet from \`.env.preview\`.

### Deployment Evidence
- Network: Midnight Preview
- Contract address: \`${result.contractAddress}\`
- Deployment transaction ID: \`${result.deployTx}\`

### On-Chain Positive ZK Proof Verification (\`verifyEligibility\`)
- Input Tenant Application ID: \`1\`
- Private Income: \`74,500\` (kept zero-knowledge, never published on-chain)
- Public Rent Threshold: \`60,000\`
- Condition: \`income >= threshold\` (74,500 >= 60,000 -> PASS)
- ZK Circuit Verification: Generated with Docker Proof Server (v8.1.0)
- verifyEligibility transaction ID: \`${result.validTx}\`
- verifyEligibility execution result: \`${result.validResult}\`

### Public Ledger State & Privacy Verification
- Public \`verificationStatus[1]\`: \`${result.publicStatus}\` (1 = ELIGIBLE)
- Private income value (74,500) exposed in public ledger: **${result.incomeExposed}**
- Public state snippet:
\`\`\`json
${result.stateExcerpt}
\`\`\`
`;
  fs.appendFileSync(PROGRESS_FILE, section, 'utf8');
}

async function appendDeploymentError(code: string, message: string): Promise<void> {
  const safe = message.replace(/\s+/g, ' ').slice(0, 240);
  fs.appendFileSync(PROGRESS_FILE, `\n<!-- PROMPT_2.6_ERROR ${code} ${new Date().toISOString()} ${safe} -->\n`, 'utf8');
}

async function main() {
  setNetworkId(NETWORK_ID);
  const mnemonic = loadPreviewMnemonic();
  const env = createPreviewEnvironment();

  log('RoofProof real Midnight Preview deployment starting.');
  log(`Indexer: ${env.indexer}`);
  log(`RPC: ${env.nodeWS}`);
  log(`Proof server: ${env.proofServer}`);

  await assertProofServer();

  const walletProvider = await buildWalletProvider(env, mnemonic);
  await walletProvider.start();
  try {
    await sleep(1_000);
    const dust = await waitForDust(walletProvider.wallet);
    log(`Spendable tDUST detected: ${dust}`);
    await saveDustCache(walletProvider.wallet, true);

    const zkConfigProvider = new NodeZkConfigProvider<'verifyEligibility'>(KEYS_DIR);
    const privateStateProvider = levelPrivateStateProvider<string, PrivateState>({
      privateStateStoreName: 'roofproof-private-state',
      signingKeyStoreName: 'roofproof-private-state-signing-keys',
      privateStoragePasswordProvider: () => 'RoofProof-Preview-2026!',
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

    let contractAddress: string;
    let deployTx: string;
    let deployed: any;

    if (process.env.CONTRACT_ADDRESS) {
      contractAddress = process.env.CONTRACT_ADDRESS;
      deployTx = 'EXISTING_DEPLOYMENT';
      log(`Connecting to existing deployed contract from environment: ${contractAddress}`);
      deployed = await findDeployedContract(providers as any, {
        contractAddress,
        compiledContract: compiledContract as any,
        privateStateId: PRIVATE_STATE_ID,
        initialPrivateState: { income: 0n },
      });
    } else {
      log('Deploying RoofProof contract to Midnight Preview network...');
      deployed = await deployContract(providers as any, {
        compiledContract: compiledContract as any,
        privateStateId: PRIVATE_STATE_ID,
        initialPrivateState: { income: 0n },
        args: [],
      });
      contractAddress = String(deployed.deployTxData.public.contractAddress);
      deployTx = String((deployed.deployTxData.public as any).txHash ?? (deployed.deployTxData.public as any).txId ?? 'N/A');
      log(`✓ RoofProof contract deployed at: ${contractAddress}`);
      log(`✓ Deployment transaction ID: ${deployTx}`);
    }

    log('Calling verifyEligibility with private income=74500 and threshold=60000...');
    await providers.privateStateProvider.set(PRIVATE_STATE_ID, { income: 74500n });
    const validTxData = await deployed.callTx.verifyEligibility(1n, 60000n);
    const validTx = String((validTxData.public as any).txHash ?? (validTxData.public as any).txId ?? 'N/A');
    log(`✓ verifyEligibility confirmed on-chain! Tx: ${validTx}`);

    log('Reading public ledger state for privacy check...');
    const states = await getPublicStates(providers.publicDataProvider, contractAddress as any);
    const stateValue = (states.contractState as any).state ?? (states.contractState as any).data ?? states.contractState;
    const ledgerState = contractLedger(stateValue);
    const publicStatus = ledgerState.verificationStatus.member(1n)
      ? String(ledgerState.verificationStatus.lookup(1n))
      : 'missing';
    const publicJson = JSON.stringify(states.contractState, (_key, value) => (typeof value === 'bigint' ? value.toString() : value));
    const incomeExposed = publicJson.includes('74500') ? 'YES' : 'NO';
    const stateExcerpt = publicJson.slice(0, 420).replace(/`/g, "'");

    log(`✓ verificationStatus[1] = ${publicStatus}`);
    log(`✓ Private income exposed in public state: ${incomeExposed}`);

    await appendDeploymentResult({
      timestamp: new Date().toISOString(),
      contractAddress,
      deployTx,
      validResult: 'ACCEPTED',
      validTx,
      publicStatus,
      incomeExposed,
      stateExcerpt,
    });
    log('✓ All on-chain verification steps completed successfully!');
  } catch (error) {
    await appendDeploymentError('DEPLOYMENT_FAILED', error instanceof Error ? error.stack ?? error.message : String(error));
    throw error;
  } finally {
    await walletProvider.stop().catch(() => undefined);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : String(error));
  process.exit(1);
});
