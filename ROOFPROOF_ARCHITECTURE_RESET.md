# RoofProof Architecture Reset: Transition from Lace-Centric to Midnight ZK + AI/OCR Verification Pipeline

> **Architectural Paradigm Shift**: Moving from browser wallet extension authorization (`Lace.connect()`) to an end-to-end privacy-preserving rental eligibility pipeline where **Midnight Compact ZK Circuit is the core verification engine**, powered by client-side AI/OCR witness generation from financial documents.

---

## A. Files to DELETE

*(No core files are deleted blindly in Prompt I to avoid breaking baseline builds during the architectural transition. Obsolete internal helper functions and unused mock routines within files are slated for removal during component rewrites).*

| File Path | Status / Notes |
|---|---|
| None (No orphan workspace files to delete) | Baseline workspace structure preserved. Cleaned up obsolete inner routines during component refactoring. |

---

## B. Files to REWRITE

The following frontend services and UI components currently contain obsolete Lace-centric wallet connection gates, `signData` checks, or wallet-authorization-as-proof states that will be rewritten to support the **AI/OCR Document ZK Witness pipeline**:

| File Path | Purpose of Rewrite |
|---|---|
| [`apps/frontend/src/services/zkProofService.js`](file:///d:/akul/PROJECTS/RoofProof/apps/frontend/src/services/zkProofService.js) | Replace `getLaceWallet()`, `connectLaceWallet()`, `isLaceUserRejection()`, and `LACE_AUTH_METHOD` with the new **Document OCR Reader + Midnight ZK Witness Evaluator & Proof Generator** service. |
| [`apps/frontend/src/components/ApplyModal.jsx`](file:///d:/akul/PROJECTS/RoofProof/apps/frontend/src/components/ApplyModal.jsx) | Replace Lace wallet popup trigger and wallet connection state machine (`CONNECTING_LACE`, `WAITING_FOR_LACE_USER`) with document upload dropzone (Pay Stub / Bank Statement / Tax Return), AI/OCR income extraction preview, and Midnight ZK Proof execution. |
| [`apps/frontend/src/components/TenantDashboard.jsx`](file:///d:/akul/PROJECTS/RoofProof/apps/frontend/src/components/TenantDashboard.jsx) | Remove Lace-specific wallet connection banners and update verification badges to reflect AI/OCR Document ZK Proof status. |
| [`apps/frontend/src/components/Navbar.jsx`](file:///d:/akul/PROJECTS/RoofProof/apps/frontend/src/components/Navbar.jsx) | Remove `Midnight Lace Connected` wallet address pill from navbar header, replacing it with Midnight Preview Node status & active role selector (Tenant / Landlord). |
| [`apps/frontend/src/components/PrivacyVerificationView.jsx`](file:///d:/akul/PROJECTS/RoofProof/apps/frontend/src/components/PrivacyVerificationView.jsx) | Update interactive privacy visualization to illustrate the Document &rarr; AI/OCR &rarr; Private Witness &rarr; Midnight Compact ZK Circuit &rarr; Proof verification pipeline. |
| [`apps/frontend/src/components/LandingPage.jsx`](file:///d:/akul/PROJECTS/RoofProof/apps/frontend/src/components/LandingPage.jsx) | Update hero section text and feature cards to highlight *"AI/OCR Document Witness + Midnight ZK Proofs"*. |

---

## C. Files to KEEP (Untouched & Preserved)

The following backend services, smart contracts, test suites, and database models contain genuine Midnight technology and core application lifecycle logic that **MUST remain preserved**:

| File Path | Core Functionality Preserved |
|---|---|
| [`packages/contracts/src/roofproof.compact`](file:///d:/akul/PROJECTS/RoofProof/packages/contracts/src/roofproof.compact) | The core **Compact 0.2.0 Zero-Knowledge Smart Contract**. Proves `privateIncome >= publicThreshold` without leaking `privateIncome`. |
| [`packages/contracts/tests/roofproof.test.ts`](file:///d:/akul/PROJECTS/RoofProof/packages/contracts/tests/roofproof.test.ts) | **Jest Unit Test Suite** for the Compact circuit verifying valid eligibility, invalid eligibility, boundary conditions, and 0-byte public ledger privacy leakage. |
| [`packages/contracts/src/verify_application.ts`](file:///d:/akul/PROJECTS/RoofProof/packages/contracts/src/verify_application.ts) | **Real Midnight JS Node SDK Execution Pipeline** that compiles Compact circuits, connects to proof server, generates real ZK proofs, and submits verification transactions to Midnight Preview. |
| [`packages/contracts/src/deploy.ts`](file:///d:/akul/PROJECTS/RoofProof/packages/contracts/src/deploy.ts) | Contract deployment script used to deploy RoofProof to Midnight Preview at `94010caedf80e1a2af62dfe1aa6f6c924969a8837003e84bb03857dd13d2b5cf`. |
| [`apps/backend/src/routes/properties.js`](file:///d:/akul/PROJECTS/RoofProof/apps/backend/src/routes/properties.js) | Backend REST API for property creation, property listings, and application submission with **strict privacy guards** that discard any submitted income fields. |
| [`apps/backend/src/routes/applications.js`](file:///d:/akul/PROJECTS/RoofProof/apps/backend/src/routes/applications.js) | Backend REST API for application status management (Landlord Approve/Reject, Tenant Withdraw/Reapply). |
| [`apps/backend/src/routes/health.js`](file:///d:/akul/PROJECTS/RoofProof/apps/backend/src/routes/health.js) | Backend health check verifying DB connection & deployed Midnight contract `94010caedf80e1a2af62dfe1aa6f6c924969a8837003e84bb03857dd13d2b5cf`. |
| [`apps/backend/src/services/midnightService.js`](file:///d:/akul/PROJECTS/RoofProof/apps/backend/src/services/midnightService.js) | Backend service managing Midnight Preview metadata and verification references. |
| [`apps/backend/src/test_api.js`](file:///d:/akul/PROJECTS/RoofProof/apps/backend/src/test_api.js) | **9-Scenario API Integration Test Suite** validating database integrity, privacy guards, state machine, and status updates. |
| [`apps/frontend/src/components/CreatePropertyModal.jsx`](file:///d:/akul/PROJECTS/RoofProof/apps/frontend/src/components/CreatePropertyModal.jsx) | Landlord property creation modal setting monthly rent and income threshold. |
| [`apps/frontend/src/components/LandlordDashboard.jsx`](file:///d:/akul/PROJECTS/RoofProof/apps/frontend/src/components/LandlordDashboard.jsx) | Landlord portal displaying property listings, pending applications, approval/rejection actions, and Inspect ZK Proof certificates. |
| [`apps/frontend/src/components/PropertyCard.jsx`](file:///d:/akul/PROJECTS/RoofProof/apps/frontend/src/components/PropertyCard.jsx) | Reusable property listing card component. |
| [`apps/frontend/src/services/api.js`](file:///d:/akul/PROJECTS/RoofProof/apps/frontend/src/services/api.js) | Frontend REST client for backend communication. |

---

## D. Old Verification Flow (Lace-Centric Architecture)

```
[Tenant] ──> Enter Manual Salary Number in Input
                  │
                  ▼
         Evaluate Local Witness (income >= threshold)
                  │
                  ▼
         Prompt Midnight Lace Extension (connect / signData)
                  │
                  ▼
         Lace Session Connected (mn_addr_preview1...)
                  │
                  ▼
         Submit Application with Lace Session Address as Reference
```

### Technical Weaknesses of Old Flow:
1. **Lace Extension Dependency**: Required an external browser wallet extension installed, unlocked, and configured for Midnight Preview.
2. **Missing Document Proof**: Relied on tenant manually typing a number into a text box, which provided no evidence of real income.
3. **Misleading Wallet Authorization**: Treating a wallet session connect as equivalent to a Midnight Zero-Knowledge proof created ambiguity between wallet connection and ZK verification.

---

## E. New Proposed Verification Flow (Midnight ZK + AI/OCR Pipeline)

```
[Landlord] ──> Creates Property Listing with Income Threshold (e.g. ₹60,000/mo)
                      │
                      ▼
[Tenant]   ──> Uploads Financial Document (Paystub / Bank Statement PDF/Image)
                      │
                      ▼
[Client AI/OCR] ──> Local OCR / Document Reader extracts Monthly Income
                      │
                      ▼
[ZK Witness] ──> Extracted Income becomes Private Witness in browser memory
                      │ (0 bytes ever uploaded or sent to backend/server)
                      ▼
[Midnight Compact] ──> Compact Circuit evaluates: privateIncome >= threshold Required
                      │
                      ▼
[Midnight Preview] ──> Proof generated & validated against Midnight Preview Contract
                      │
                      ▼
[Application] ──> Tenant submits verified application (Status: Eligible, Private Income: HIDDEN)
                      │
                      ▼
[Landlord Portal] ──> Landlord sees: "Eligibility: VERIFIED (Eligible = True)"
```

### Key Advantages of New Architecture:
1. **True Zero-Knowledge Privacy**: Financial document & extracted salary figure stay strictly inside the tenant's browser memory. Zero bytes leave the device.
2. **Real Proof of Income**: Replaces self-declared numbers with AI/OCR verification of actual paystubs/statements.
3. **Core Midnight Integration**: Uses Midnight Compact ZK circuit as the sole authority for eligibility verification.
4. **Zero Wallet Dependency**: Does not require complex browser extension wallet setups or RPC signature prompts to demonstrate ZK proof concepts.

---

## F. Open Technical Questions Before Implementation

1. **OCR / AI Document Parsing Engine**:
   - Should client-side OCR use a lightweight browser library (e.g., Tesseract.js) or a mock structured document parser for instant demo stability during hackathon judging?
2. **Midnight Node Proving Server Integration**:
   - In production browser environments, should ZK proof generation execute via the Node SDK proof server endpoint (`packages/contracts/src/verify_application.ts`) or client-side Compact WASM runtime?
3. **Document File Handling**:
   - Confirming that uploaded document files (PDF/PNG) are processed in-memory only via `FileReader` / Blob URLs and never stored or uploaded to backend PostgreSQL.

---

*Architectural Reset Specification compiled & ready for execution in subsequent prompts.*
