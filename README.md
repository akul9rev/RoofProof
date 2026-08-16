# RoofProof 🏠🔒

> **"Proof before roof."**  
> *Prove you're eligible. Don't prove your entire financial life.*
>
> Zero-Knowledge Privacy-Preserving Rental Eligibility DApp built on the **Midnight Network**.

---

## 🌟 Executive Summary

**RoofProof** revolutionizes residential tenant screening by replacing sensitive financial paperwork with **Zero-Knowledge (ZK) proofs** powered by **Midnight Network** and **Compact** smart contracts.

In traditional rental applications, tenants are forced to hand over unredacted bank statements, tax returns, and employer salary slips to prospective landlords and third-party property management portals. This exposes tenants to identity theft, financial surveillance, and severe privacy breaches.

With **RoofProof**, tenants prove mathematically that their monthly income satisfies or exceeds the landlord's required threshold (`income >= threshold`) without disclosing their exact salary, employer identity, bank account balance, or transaction history.

---

## 🔐 Privacy Model & Zero-Knowledge Guarantees

| Traditional Screening | RoofProof Screening |
|---|---|
| Tenant hands over unredacted bank statements & salary slips | Tenant evaluates income locally in browser memory as a private witness |
| Landlord sees exact balance, salary, employer, and transactions | Landlord sees only: **`Eligibility: Satisfied ✓ (Midnight Verified)`** |
| Financial documents stored on insecure centralized servers | **0 Bytes** of private financial figures sent over the network |
| High exposure to data breaches & identity theft | Cryptographically guaranteed by Midnight Compact ZK circuits |

---

## ⛓️ Confirmed On-Chain Midnight Deployment

RoofProof is live and verified on the **Midnight Preview Network**:

* **Contract Address**: `94010caedf80e1a2af62dfe1aa6f6c924969a8837003e84bb03857dd13d2b5cf`
* **Deployment Transaction**: `e44df905f615c8937636bb4b2bce9abf8c45da116c4ad2c8742d71942150b81c`
* **Verified `verifyEligibility` Transaction**: `5deb9fcd464487459544cf4ae07445d6b1f037033f0c40305527d81a297b061c`
* **Public Ledger State**: `verificationStatus[applicationId] = true`
* **Private Disclosure Check**: **0 Bytes of Private Income Exchanged or Logged On-Chain**

---

## 🧮 Compact Zero-Knowledge Circuit

The core smart contract logic is written in **Compact 0.2.0** (`packages/contracts/src/roofproof.compact`):

```compact
pragma language_version >= 0.20.0;

import CompactStandardLibrary;

// Public ledger state mapping Application ID to verification success
export ledger verificationStatus: Map<Uint<64>, Boolean>;

// Private witness callback to fetch the tenant's actual income locally
witness getPrivateIncome(): Uint<64>;

// Public circuit that verifies if the tenant's private income satisfies
// the required threshold without revealing the actual income.
export circuit verifyEligibility(applicationId: Uint<64>, threshold: Uint<64>): [] {
    // 1. Fetch the private income locally via witness
    const privateIncome = getPrivateIncome();

    // 2. Perform zero-knowledge assertion that the income satisfies the criteria
    assert(privateIncome >= threshold, "Income is below the required threshold");

    // 3. Write a public confirmation to the ledger mapping for this application ID
    verificationStatus.insert(disclose(applicationId), true);
}
```

---

## 🏗️ Architecture & Technical Data Flow

```
[ Tenant Browser (React 18 + Vite) ]
        │
        ├── 🔒 Private Income (Browser Memory Only)
        │
        ▼
[ Midnight Compact Circuit (verifyEligibility) ] ── (Lace Wallet / Proof Provider)
        │
        ├── 🔏 Zero-Knowledge Witness Evaluation (income >= threshold)
        ▼
[ Midnight Preview Network ] ──▶ Public Ledger State: verificationStatus[appId] = true
        │
        ▼ (Verification Status & Authorization Reference)
[ Node.js + Express REST API ]
        │
        ▼ (Stores metadata & verification status ONLY, NO income)
[ PostgreSQL Database ]
        │
        ▼
[ Landlord Dashboard ] ──▶ Sees "Eligible ✓ (Midnight Verified)" (Actual Income: NEVER DISCLOSED)
```

---

## 🔑 Data Element Segregation & Terminology

RoofProof strictly segregates data elements to maintain technical defensibility:

* `walletAddress`: Authentic Bech32m wallet address from Midnight Lace (`mn_addr_preview1...`).
* `laceSignature`: Cryptographic signature returned by Lace `signData` (where supported).
* `authorizationProof`: Authenticated Lace connection reference token.
* `zkTxHash`: Real Midnight transaction hash (`5deb9fcd464487459544cf4ae07445d6b1f037033f0c40305527d81a297b061c`).
* `verificationStatus`: `eligible` | `ineligible`.

*Note: RoofProof never uses wallet addresses as signatures or assigns transaction hashes to synthetic identifiers.*

---

## 🚀 Quickstart Guide

### Prerequisites
* **Node.js**: v18+ or v20+
* **PostgreSQL**: Local or remote database instance
* **Chrome Browser**: With official Midnight Lace Wallet extension installed for Preview testing

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/akul9rev/RoofProof.git
cd RoofProof
npm install
```

### 2. Setup Backend & PostgreSQL Database
```bash
# Configure environment
cp .env.example .env

# Run database migrations and seed data
npm run db:migrate --workspace=apps/backend
npm run db:seed --workspace=apps/backend

# Start backend server (Port 4000)
npm run dev --workspace=apps/backend
```

### 3. Start Frontend Application
```bash
# Start Vite dev server (Port 5173)
npm run dev --workspace=apps/frontend
```
Open **`http://localhost:5173`** in your browser.

---

## 🧪 Testing & Verification Evidence

### 1. Compact Smart Contract Unit Tests
```bash
npm run test --workspace=packages/contracts
```
* **Test 1**: Valid eligibility (`74,500 >= 60,000`) &rarr; **PASS**
* **Test 2**: Invalid eligibility (`40,000 < 60,000`) &rarr; **PASS**
* **Test 3**: Boundary condition (`60,000 == 60,000`) &rarr; **PASS**
* **Test 4**: Ledger privacy check (0 private bytes written) &rarr; **PASS**

### 2. Full-Stack Backend API Integration Tests
```bash
node apps/backend/src/test_api.js
```
* **Scenario 1**: Health check & DB connection &rarr; **PASS**
* **Scenario 2**: Property listings fetch & creation &rarr; **PASS**
* **Scenario 3**: Ineligible/Unsigned submission blocked (HTTP 400) &rarr; **PASS**
* **Scenario 4**: Verified application submission & status update &rarr; **PASS**
* **Scenario 5**: Strict Privacy Audit (0 income values in API responses) &rarr; **PASS**
* **Scenario 6**: Re-application lock on denied listing (HTTP 409) &rarr; **PASS**
* **Scenario 7**: Application withdrawal flow &rarr; **PASS**

### 3. Frontend Production Build
```bash
npm run build --workspace=apps/frontend
```
* **Vite Production Build**: **0 errors**

---

## 🛡️ Threat Model & Security Audit

1. **Client-Side Witness Isolation**: Tenant income exists solely in local browser memory as a private witness during Compact circuit execution.
2. **Zero Backend Leakage**: Express REST payloads and PostgreSQL tables contain only `{ tenant_id, verification_status, zk_tx_hash }`.
3. **Backend Integrity Guards**: The backend strictly rejects any application submission that is not marked `eligible` with a valid authorization reference.
4. **Denial Hard Gate**: If a tenant cancels or denies the Lace wallet popup, execution halts immediately, clearing all proof states, disabling submit, and making 0 network calls.
5. **No Secret Leakage**: All wallet mnemonics, private keys, and leveldb states are strictly excluded from client code and gitignored.

---

## 🔮 Future Architecture: Verifiable Credential Issuers

In this hackathon demonstration, income input can be evaluated either as a **Self-Declared Private Witness** or as a **RoofProof Demo Credential Issuer (W3C Signed)**.

In full production deployment, RoofProof will integrate trusted **W3C Verifiable Credential Issuers**:
* Employer / Payroll APIs (e.g., ADP, Gusto, Deel)
* Open Banking APIs (e.g., Plaid, MX, Salt Edge)
* Government Tax Portals

The issuer digitally signs the tenant's income credential off-chain. The tenant stores the credential in their local wallet, using it as the private witness in the Midnight Compact circuit without ever exposing the credential payload to the landlord.

---

## 📄 License
Apache-2.0
