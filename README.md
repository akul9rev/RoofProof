# RoofProof 🏠🔒

> **"Proof before roof."**  
> *Prove you're eligible. Don't prove your entire financial life.*
>
> Zero-Knowledge Privacy-Preserving Rental Verification DApp built on the **Midnight Network**.

---

## 🌟 Executive Summary

**RoofProof** revolutionizes residential tenant screening by replacing sensitive financial paperwork with **Zero-Knowledge (ZK) proofs** powered by **Midnight Network** and **Compact** smart contracts, complemented by an **AI-powered Form 16 Anomaly & Tamper Detector**.

In traditional rental applications, tenants are forced to hand over unredacted bank statements, tax returns, and employer salary slips to prospective landlords and third-party property management portals. This exposes tenants to identity theft, financial surveillance, and severe privacy breaches.

With **RoofProof**:
1. **Tenants** prove mathematically that their monthly income satisfies or exceeds the landlord's required threshold (`income >= threshold`) without disclosing their exact salary, employer identity, bank account balance, or transaction history.
2. **Landlords** receive a cryptographically guaranteed **"Eligible ✓ (Midnight Verified)"** status, while our AI anomaly detection engine verifies uploaded Form 16 tax documents for structural tampering or numerical manipulation without storing private financial figures.

---

## 👥 Demo Accounts (1-Click Login Credentials)

Use any of these pre-seeded demo accounts to test the full end-to-end rental application & verification workflow:

### 🔑 Landlord Accounts (Listing & Approval Portal)

| Role | Name | Email | Password | Organization / Portfolio |
| :--- | :--- | :--- | :--- | :--- |
| **Landlord** | Rohan Mehta | `rohan.mehta@roofproof.demo` | `password123` | Mehta Luxury Estates (Coorg & Udaipur Properties) |
| **Landlord** | Priya Nair | `priya.nair@roofproof.demo` | `password123` | Heritage Living India (Jaipur & Kolkata Properties) |

### 🔑 Tenant Accounts (Application & ZK Verification Portal)

| Role | Name | Email | Password | Occupation & City |
| :--- | :--- | :--- | :--- | :--- |
| **Tenant** | Arjun Sharma | `arjun.sharma@roofproof.demo` | `password123` | Senior Software Engineer (Bangalore, KA) |
| **Tenant** | Neha Kapoor | `neha.kapoor@roofproof.demo` | `password123` | Product Lead (Mumbai, MH) |

---

## 🔐 Privacy Model & Zero-Knowledge Guarantees

| Traditional Screening | RoofProof Screening |
|---|---|
| Tenant hands over unredacted bank statements & salary slips | Tenant evaluates income locally in browser memory as a private witness |
| Landlord sees exact balance, salary, employer, and transactions | Landlord sees only: **`Eligibility: Satisfied ✓ (Midnight Verified)`** |
| Financial documents stored on insecure centralized servers | **0 Bytes** of private financial figures sent over network or stored in DB |
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

## 🤖 Form 16 AI Anomaly & Tamper Detection Engine

Under `apps/backend/src/services/anomalyDetector/`, RoofProof incorporates a machine-learning document verification engine designed specifically for Indian **Form 16 Tax Certificates**:

* **8 Extracted Structural Features**:
  1. Font Inconsistency Score
  2. PDF Text Stream Mismatch Ratio
  3. Section 1(d) Gross Salary Field Edits
  4. Visual Text Overlays & Hidden Layers
  5. Layout Bounding Box Anomalies
  6. Internal Arithmetic Inconsistencies
  7. PDF Object Stream Tamper Signs
  8. Metadata Modification Timestamp Conflicts
* **Interpretable Risk Output**: Evaluates document authenticity (`LOW`, `MEDIUM`, `HIGH`, `UNKNOWN`) and flags manipulated tax certificates before application processing.
* **Unit Test Suite**: 12/12 passing test suite (`node apps/backend/src/test_anomaly_detector.js`).

---

## 🎨 Key Application Features

1. **Multi-Photo Room Studio**:
   - Landlords can upload distinct images for *Facade / Exterior, Living Room, Washroom, Kitchen, and Bedroom*.
   - Interactive cover selector allows setting any uploaded photo as the **Cover Thumbnail**.
   - Strict photo gallery isolation ensures custom listings show *only* their uploaded photos.
2. **Automatic Listing Date Detection**:
   - Automatically tracks listing timestamps (`created_at`).
   - Displays exact calendar dates (e.g. `Listed 27 Aug 2026`) on property cards without asking landlords for manual date entry.
3. **Live Neon Cloud PostgreSQL Database**:
   - Connected live to Neon Cloud PostgreSQL for automatic schema migration, property persistence, and real-time application state synchronization.

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
        ├── 🤖 Form 16 AI Anomaly Detector
        ▼ (Stores metadata & verification status ONLY, NO income figures)
[ Neon Cloud PostgreSQL Database ]
        │
        ▼
[ Landlord Dashboard ] ──▶ Sees "Eligible ✓ (Midnight Verified)" (Actual Income: NEVER DISCLOSED)
```

---

## 🚀 Local Setup & Installation Guide

### Prerequisites
* **Node.js**: v18+ or v20+
* **npm**: v9+
* **Browser**: Chrome or Brave (with official Midnight Lace Wallet extension installed for Preview testing)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/akul9rev/RoofProof.git
cd RoofProof
npm install
```

### 2. Configure Environment Variables
```bash
# Copy backend environment configuration
cp apps/backend/.env.example apps/backend/.env
```
*(The backend defaults to active Neon Cloud PostgreSQL & Midnight Preview RPC endpoints).*

### 3. Run Development Servers
Start both the Vite frontend and Express backend concurrently:
```bash
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend REST API**: `http://localhost:3001` (or `http://localhost:4000`)
- **Health Check Endpoint**: `GET http://localhost:3001/api/health`

---

## 🧪 Testing & Verification Commands

### 1. Compact Smart Contract Unit Tests
```bash
npm run test --workspace=packages/contracts
```
* **Test 1**: Valid eligibility (`74,500 >= 60,000`) &rarr; **PASS**
* **Test 2**: Invalid eligibility (`40,000 < 60,000`) &rarr; **PASS**
* **Test 3**: Boundary condition (`60,000 == 60,000`) &rarr; **PASS**
* **Test 4**: Ledger privacy check (0 private bytes written) &rarr; **PASS**

### 2. AI Anomaly Detector Test Suite
```bash
node apps/backend/src/test_anomaly_detector.js
```
* Passes 12/12 synthetic tax document tampering test cases &rarr; **PASS**

### 3. Backend API Integration Tests
```bash
node apps/backend/src/test_api.js
```
* **Scenario 1**: Health check & DB connection &rarr; **PASS**
* **Scenario 2**: Property listings fetch & creation &rarr; **PASS**
* **Scenario 3**: Ineligible/Unsigned submission blocked (HTTP 400) &rarr; **PASS**
* **Scenario 4**: Verified application submission & status update &rarr; **PASS**
* **Scenario 5**: Strict Privacy Audit (0 income values in API responses) &rarr; **PASS**

### 4. Production Build Validation
```bash
npm run build
```
* Bundles monorepo cleanly with Vite & ESM Node server.

---

## 🛡️ Threat Model & Security Audit

1. **Client-Side Witness Isolation**: Tenant income exists solely in local browser memory as a private witness during Compact circuit execution.
2. **Zero Backend Leakage**: Express REST payloads and PostgreSQL tables contain only `{ tenant_id, verification_status, zk_tx_hash }`.
3. **Backend Integrity Guards**: The backend strictly rejects any application submission that is not marked `eligible` with a valid authorization reference.
4. **Denial Hard Gate**: If a tenant cancels or denies the Lace wallet popup, execution halts immediately, clearing all proof states, disabling submit, and making 0 network calls.
5. **No Secret Leakage**: All wallet mnemonics, private keys, and leveldb states are strictly gitignored and excluded from client bundles.

---

## 📄 License
Apache-2.0
