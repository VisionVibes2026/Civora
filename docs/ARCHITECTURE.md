# Civora System Architecture

**Civora** is an AI-powered multilingual assistance platform designed to help users understand cooperative services, government schemes, legal information, documents, and grievance processes through conversational, voice, and document-based interactions.

It bridges the information and governance accessibility gap for cooperative society members across India, including Primary Agricultural Credit Societies (PACS), dairy cooperatives, and multi-state cooperative societies.

---

## Architectural Principles

1. **Dual-Tier Jurisdiction Awareness**: Automatically differentiates between Central (Multi-State Co-operative Societies Act 2002) and State-specific Cooperative Societies Acts (e.g., Tamil Nadu 1983, Maharashtra 1960).
2. **Grounded Legal RAG (Retrieval-Augmented Generation)**: Grounded strictly in authenticated statutory texts, government notifications, and society by-laws, eliminating ungrounded hallucinations.
3. **Honest AI & Provenance Tracking**: Clear labeling of advisory drafts, confidence scores, and strict disclaimers that the system does not substitute for the official Registrar of Cooperative Societies.
4. **Offline & Edge Capability (Kiosk Mode)**: Large-format tactile UI with local caching and offline voice processing for rural deployment.
5. **Indic Multilingual First**: Full bidirectional support for Indian languages (English, Tamil, Hindi, Telugu, Kannada) across Voice and Text channels.

---

## System Diagram

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT LAYER                                      |
|                                                                                   |
|  +---------------------------+  +---------------------------+  +---------------+  |
|  |     Citizen Web App       |  |     Rural Touch Kiosk     |  |  Voice Modal  |  |
|  | (React 19 + TypeScript)   |  | (High Contrast / Big Tap) |  | (Web Speech)  |  |
|  +-------------+-------------+  +-------------+-------------+  +-------+-------+  |
+----------------|------------------------------|------------------------|----------+
                 |                              |                        |
                 +------------------------------+------------------------+
                                                |
                                    REST / WebSocket APIs
                                                |
+-----------------------------------------------v-----------------------------------+
|                                BACKEND API GATEWAY                                |
|                                 (FastAPI + Python)                                |
|                                                                                   |
|  - Rate Limiting Middleware                                                       |
|  - Request ID Tracing (X-Request-ID)                                              |
|  - PII Masking & Security Sanitizer                                               |
+-----------------------------------------------+-----------------------------------+
                                                |
      +-------------------+---------------------+--------------------+
      |                   |                     |                    |
+-----v-----+       +-----v-----+         +-----v-----+        +-----v-----+
|   Chat    |       | Document  |         | Grievance |        | Multilingual|
|  Service  |       |    OCR    |         |  Drafter  |        |  & Speech  |
+-----+-----+       +-----+-----+         +-----+-----+        +-----+-----+
      |                   |                     |                    |
      |   +---------------+                     |                    |
      |   |                                     |                    |
+-----v---v-----------------------+       +-----v--------------------v-----+
|  Multi-Tier Jurisdiction Engine |       |    Evidence Provenance Engine  |
| - Central (MSCS Act 2002)       |       | - SHA-256 Audit Hashing        |
| - State Acts (TN, MH, KA, AP)   |       | - Statutory Eligibility Check  |
+----------------+----------------+       +--------------------------------+
                 |
+----------------v------------------------------------------------------------------+
|                                KNOWLEDGE LAYER                                    |
|                                                                                   |
|  +------------------------------+  +--------------------------------------------+ |
|  |  Vector DB (Qdrant / Hybrid) |  |   Relational DB (PostgreSQL / SQLite)      | |
|  |  - Statutory Acts & Rules    |  |   - Conversations, Messages & Feedback     | |
|  |  - Government Scheme Guides  |  |   - Document Metadata & Grievance Drafts   | |
|  +------------------------------+  +--------------------------------------------+ |
+-----------------------------------------------------------------------------------+
```

---

## Key Subsystems

### 1. Multi-Tier Jurisdiction Resolver
Cooperative law in India operates under a constitutional dual structure:
- **Central Jurisdiction**: Multi-State Co-operative Societies (MSCS) Act, 2002 (amended 2023). Governed by the Central Registrar of Cooperative Societies, Ministry of Cooperation, New Delhi.
- **State Jurisdiction**: State Cooperative Societies Acts (e.g., Tamil Nadu Co-operative Societies Act 1983, Maharashtra Co-operative Societies Act 1960). Governed by State Registrars and District Deputy Registrars (DRCS).

The `JurisdictionResolver` dynamically routes queries to the correct statutory provisions and appellate authorities.

### 2. Grounded RAG & Citation Validator
- Text chunks are indexed with metadata: `act_code`, `section`, `state`, `effective_date`, `source_url`.
- Before returning answers, `CitationValidator` ensures every cited section exists in the statutory corpus to prevent hallucinated references.

### 3. Indic Multilingual Pipeline
- Fast Unicode-based script detection (`LanguageDetector`).
- Multi-engine translation interfaces (supporting Bhashini API, IndicTrans2, and local fallback).
- Voice processing supporting Web Speech API with fallback pre-recorded Indic phonetic TTS audio.

### 4. Grievance Representation Drafter
- Formats formal representations addressed to the competent Deputy Registrar / Joint Registrar.
- Cites exact legal dispute resolution sections (e.g., Section 90 of TNCSA 1983 for state disputes, Section 84 of MSCS Act 2002 for multi-state disputes).
- Emphasizes the **Advisory AI** boundary: Civora creates structured drafts for the citizen to review, sign, and submit.
