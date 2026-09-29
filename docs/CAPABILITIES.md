# Civora Core Capabilities & Governance Framework

## Overview

Civora is an AI-powered multilingual assistance platform designed to help users understand cooperative services, government schemes, legal information, documents, and grievance processes through conversational, voice, and document-based interactions.

---

## 1. Dual-Tier Cooperative Governance Engine

Cooperative societies in India operate across two distinct legal tiers:
1. **Multi-State Cooperative Societies**: Governed by the Central Multi-State Co-operative Societies Act, 2002 (amended 2023) under the Central Registrar of Cooperative Societies (Ministry of Cooperation, New Delhi).
2. **Single-State Cooperative Societies**: Governed by respective State Cooperative Societies Acts (e.g., Tamil Nadu Co-operative Societies Act 1983, Maharashtra Co-operative Societies Act 1960) under State and District Deputy Registrars.

Civora automatically identifies the society context from user queries or uploaded documents and routes queries to the appropriate statutory framework and competent administrative forum.

---

## 2. Indic Multilingual & Voice Support

- Native text and speech processing across 5 scheduled Indian languages: English, Tamil (தமிழ்), Hindi (हिन्दी), Telugu (తెలుగు), and Kannada (ಕನ್ನಡ).
- Automatic Unicode script detection for seamless multi-script inputs.
- Audio-reactive voice modal with real-time feedback and pre-recorded phonetic fallback support.

---

## 3. Document OCR & Evidence Extraction

- Structured parsing of primary cooperative documents (Passbooks, Patta extracts, Loan sanctions, and Society notices).
- Key field extraction: Account Number, Member Name, Society Registration, Land Extent, Survey Number, and Sanctioned Loan Amount.
- Rule-based eligibility cross-checking against scheme criteria.

---

## 4. Statutory Grievance Drafting

- Generates structured, formal representations addressed to the competent Deputy Registrar or Joint Registrar.
- Cites exact statutory dispute resolution sections (e.g., Section 90 of TNCSA 1983 or Section 84 of MSCS Act 2002).
- Includes structured prayer clauses, factual recitals, and annexure lists.

---

## 5. Grounded RAG & Citation Validation

- Embeddings and hybrid search across verified statutory acts, rules, and government scheme notifications.
- Citation validation module ensures cited section numbers exist in the statutory index before delivering responses to users.
- SHA-256 evidence hashing for auditability and verification tracking.

---

## 6. Touch-First Kiosk Mode

- High-contrast, large-button tactile user interface optimized for village Common Service Centres (CSCs) and Primary Agricultural Cooperative Society (PACS) touch screens.
- Voice-first interaction model with visual action cards for users with low digital literacy.
