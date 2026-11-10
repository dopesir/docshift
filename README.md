# DocShift — Clinical Operating Workbench for Indian Medical Officers

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Verification: 3588 Tests Passed](https://img.shields.io/badge/Verification-3588%20Passed%20%2F%200%20Failed-brightgreen)](tests/test_suite.js)
[![Architecture: 100% Client-Side](https://img.shields.io/badge/Architecture-100%25%20Offline%20PWA-orange)](index.html)

**DocShift** (formerly MO Desk) is a high-speed, offline-first clinical survival workbench engineered for Indian MBBS Medical Officers serving in high-volume OPDs and high-anxiety emergency/casualty shifts (PHCs, CHCs, Sub-District Hospitals, and Civil Hospitals).

It is built with a zero-cloud, deterministic clinical rules engine that executes 100% in-browser with zero latency, zero paid API dependencies, and zero Protected Health Information (PHI) transmission.

---

## Key Pillars

### 1. Pediatric Dosing Desk (45+ NLEM / Jan Aushadhi Drugs)
* Real-time weight slider ($2.5\text{ kg} - 40\text{ kg}$) calculating exact mL and drop volumes.
* Configured specifically for Indian government supply syrup strengths (e.g., Paracetamol 120mg/5mL and 250mg/5mL, Amoxiclav 228.5mg/5mL & 457mg/5mL, Ondansetron 2mg/5mL, Ibuprofen 100mg/5mL).
* Strict age/weight boundary contraindication guardrails (e.g., avoiding NSAIDs $<6$ months).

### 2. Casualty Emergency Protocols & Pre-Referral Stabilization
* Step-by-step ICMR Standard Treatment Workflows (STWs).
* National Snakebite Protocol with interactive 20WBCT (Whole Blood Clotting Time) timer and ASV administration guidance.
* OP/Celphos Poisoning atropinization protocols and PAM dosage rules.
* Acute Coronary Syndrome (STEMI) loading dose checklist & Stroke pre-referral stabilization protocol.
* Instant 1-tap pre-referral transfer slip generator.

### 3. Medico-Legal Injury Documentation Shield
* Statutory injury classification mapped to **Bharatiya Nyaya Sanhita, 2023 (BNS) Section 114–116** and **Indian Penal Code (IPC) Section 319–320** (all 8 statutory clauses of Grievous Hurt).
* Objective terminology validation to prevent defensive medico-legal errors in injury reporting.

---

## Verification & Test Harness

DocShift includes an automated test runner testing across 14 test suites and 50+ real-world clinical scenarios:

```bash
node tests/test_suite.js
```

**Test Results:** **3,588 / 3,588 Passed (100% Pass Rate)**

---

## Deployment & Local Setup

DocShift requires no build step, no npm install, and no backend:

1. Clone the repository:
   ```bash
   git clone https://github.com/dopesir/docshift.git
   cd docshift
   ```
2. Open `index.html` directly in any web browser or serve locally:
   ```bash
   npx serve .
   ```
3. Can be installed directly to mobile homescreens as an offline PWA.

---

## Statutory Disclaimer

DocShift is a deterministic clinical workflow formatter, reference engine, and educational support tool. It does not provide autonomous medical diagnosis or prescription. All clinical actions remain under the professional medical judgment of the registered medical practitioner.

---

## License

MIT License. Designed and maintained by **DOPESIR** / **Nobuswork**.
