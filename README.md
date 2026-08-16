# RoofProof 🏠🔒

> **Zero-Knowledge Privacy-Preserving Rental Verification on Midnight Network**
> 
> *Brainwave 2026 — Midnight Blockchain Track Submission*

---

## 🌟 Executive Summary

**RoofProof** revolutionizes the residential tenant screening process using Zero-Knowledge proofs powered by the **Midnight Network**.

In traditional rental applications, tenants are forced to hand over unredacted bank statements, tax returns, and employer salary slips to prospective landlords and property management portals. This creates massive privacy risks, exposure to identity theft, and unnecessary financial surveillance.

With **RoofProof**, tenants prove mathematically that their monthly income satisfies or exceeds the landlord's required threshold (`income >= threshold`) without revealing their exact salary, employer identity, or bank balance.

---

## 🔐 Zero-Knowledge Privacy Guarantees

| Traditional Screening | RoofProof Screening |
|---|---|
| Tenant submits bank statements & salary slips | Tenant enters income locally in private memory |
| Landlord sees exact balance, salary, and transactions | Landlord sees only: `Income Requirement: Satisfied ✓` |
| Financial documents stored on centralized servers | Zero private financial figures sent over the network |
| Vulnerable to data breaches & identity theft | Cryptographically guaranteed by Midnight Compact circuits |

---

## ⛓️ Confirmed On-Chain Midnight Deployment

RoofProof is live and verified on the **Midnight Preview Network**:

* **Contract Address**: `94010caedf80e1a2af62dfe1aa6f6c924969a8837003e84bb03857dd13d2b5cf`
* **Deployment Transaction**: `e44df905f615c8937636bb4b2bce9abf8c45da116c4ad2c8742d71942150b81c`
* **Verified `verifyEligibility` Transaction**: `5deb9fcd464487459544cf4ae07445d6b1f037033f0c40305527d81a297b061c`
* **Public Ledger State**: `verificationStatus[applicationId] = true`
* **Private Disclosure Check**: **0 Bytes of Private Income Exchanged or Logged On-Chain**

---

## 🏗️ Architecture & Technology Stack

```
[ Tenant Browser (React + Vite) ]
        │
        ├── 🔒 Private Income (Client Memory Only)
        │
        ▼
[ Midnight Compact Circuit (verifyEligibility) ] ── (Proof Server :6300 / Lace Wallet)
        │
        ├── 🔏 Zero-Knowledge Proof (income >= threshold)
        ▼
[ Midnight Preview Network ] ──▶ Public Ledger State: verificationStatus[appId] = true
        │
        ▼ (zk_tx_hash only)
[ Node.js + Express REST API ]
        │
        ▼ (Stores metadata only, NO income)
[ PostgreSQL Database ]
        │
        ▼
[ Landlord Dashboard ] ──▶ Sees "Eligible ✓ (Midnight Verified)" (Actual Income: NEVER DISCLOSED)
```

### Components
1. **Blockchain Layer (`packages/contracts`)**:
   * Compact Smart Contract (`roofproof.compact`)
   * Midnight JS SDK (`@midnight-ntwrk/midnight-js-*` v4.1.1, `@midnight-ntwrk/ledger-v8` v8.1.0)
   * Standalone on-chain verification engine (`verify_application.ts`)
2. **Backend Layer (`apps/backend`)**:
   * Node.js + Express REST API
   * PostgreSQL database connection pool
   * Strict privacy filter rejecting any illegal income payload
3. **Frontend Layer (`apps/frontend`)**:
   * React 18 + Vite (JavaScript / JSX)
   * Custom dark glassmorphism design system
   * DApp connector detection for Midnight Lace wallet (`window.midnight.mnLace`)
   * Real-time 4-step ZK proof progress indicators

---

## 🚀 Quickstart Guide

### Prerequisites
* **Node.js**: v18+ or v20+
* **Docker Desktop**: For running the local Midnight Proof Server
* **PostgreSQL**: Local or remote database instance

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/akul9rev/RoofProof.git
cd RoofProof
npm install
```

### 2. Start Midnight Proof Server (Docker)
```bash
docker run -d --name midnight-proof-server -p 6300:6300 midnightnetwork/proof-server:latest
```

### 3. Setup Backend & PostgreSQL Database
```bash
# Configure environment
cp .env.example .env

# Run database migrations and seed data
npm run db:migrate --workspace=apps/backend
npm run db:seed --workspace=apps/backend

# Start backend server (Port 4000)
npm run dev --workspace=apps/backend
```

### 4. Start Frontend Application
```bash
# Start Vite dev server (Port 5173)
npm run dev --workspace=apps/frontend
```
Open **`http://localhost:5173`** in your browser.

---

## 🧪 Testing & Verification

### Run Contract ZK Unit Tests
```bash
npm run test --workspace=packages/contracts
```
*Validates eligible income (`74,500 >= 60,000`), ineligible rejection (`40,000 < 60,000`), boundary checks, and public ledger privacy.*

### Run Full-Stack Backend Integration Tests
```bash
node apps/backend/src/test_api.js
```
*Validates health endpoints, property creation, ZK application submissions, landlord review, and privacy audits.*

### Build Frontend Production Bundle
```bash
npm run build --workspace=apps/frontend
```

---

## 📊 Brainwave 2026 Requirements Traceability

| Requirement | Status | Verification Evidence |
|---|---|---|
| **Full-Stack Application** | **PASS** | React + Express + PostgreSQL + Midnight monorepo |
| **Meaningful Midnight Tech** | **PASS** | Compact contract with private witness & ZK circuit constraints |
| **Deployed on Preview** | **PASS** | Contract `94010caedf80e1a2af62dfe1aa6f6c924969a8837003e84bb03857dd13d2b5cf` |
| **Working Demonstration** | **PASS** | End-to-end listing, local ZK proving, and landlord verification |
| **Privacy Audit** | **PASS** | Confirmed 0 private income values leaked in API, DB, or UI |

---

## 🛡️ Security & Privacy Audit Findings

* **Client-Side Witness Isolation**: Tenant income exists solely in browser memory during circuit execution.
* **Zero Backend Exposure**: Express REST payloads and database tables contain only `{ tenant_id, verification_status, zk_tx_hash }`.
* **Zero Landlord Exposure**: Landlords view cryptographically verified eligibility badges with `Actual Income: NEVER DISCLOSED`.
* **Secret Protection**: All wallet keys, mnemonics, and leveldb states are strictly gitignored.

---

## 📄 License
Apache-2.0
