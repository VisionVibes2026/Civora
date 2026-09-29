# Civora Developer & Contributor Guide

## Prerequisites

- **Node.js**: v18+ or v20+ LTS
- **Python**: 3.10+ (tested with Python 3.11, 3.12, 3.13)
- **Git**

---

## Local Development Quickstart

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/Civora.git
cd Civora
```

### 2. Backend Setup (FastAPI)
```bash
# Create and activate Python virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Run pytest backend test suite
python -m pytest backend/tests -v

# Start FastAPI development server
uvicorn backend.app.main:app --reload --port 8000
```
FastAPI Swagger documentation will be available at: `http://localhost:8000/docs`

### 3. Frontend Setup (React 19 + TypeScript + Vite)
```bash
# In the root or frontend directory:
npm install

# Start Vite hot-reloading dev server
npm run dev
```
The citizen web interface will open at: `http://localhost:5173`

---

## Architecture & Code Structure

```
Civora/
├── backend/                  # FastAPI Python backend
│   ├── app/
│   │   ├── api/routes/       # REST API Endpoints (chat, documents, grievances, speech, health)
│   │   ├── core/             # Config, security, logging
│   │   ├── domain/           # Pure business models (no ORM or web framework dependencies)
│   │   ├── evidence/         # Provenance verification & SHA-256 audit engine
│   │   ├── grievance/        # Statutory representation templates & rule engine
│   │   ├── integrations/     # External adapters (Bhashini, Qdrant, DigiLocker)
│   │   ├── jurisdiction/     # Dual-tier Central vs State Cooperative jurisdiction resolver
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── multilingual/     # Language detector & transliteration
│   │   ├── ocr/              # Indic document OCR extraction engine
│   │   ├── rag/              # Hybrid retrieval, embedding & citation validator
│   │   ├── repositories/     # Repository pattern data access layer
│   │   ├── schemas/          # Pydantic v2 validation schemas
│   │   └── services/         # Layered service implementations
│   └── tests/                # Backend pytest test suite (18 unit & integration tests)
├── frontend/                 # React 19 + TypeScript + Vite frontend
│   ├── src/
│   │   ├── components/       # UI Components (ChatWorkspace, KioskUI, GrievanceWizard, etc.)
│   │   ├── constants/        # Knowledge datasets, demo sequences, 5 Indic language translations
│   │   ├── hooks/            # useLanguage, speech recognition, audio management
│   │   ├── services/         # Typed API clients with offline mock fallback
│   │   └── types/            # TypeScript interfaces
├── data/                     # Sample cooperative datasets & legal benchmark queries
├── docs/                     # Full system architecture, API specifications, and capability guides
├── scripts/                  # Cross-platform development and test scripts
└── docker-compose.yml        # Multi-container orchestration
```

---

## Adding New State Cooperative Acts
To extend Civora with another state's Cooperative Societies Act (e.g. Kerala, Gujarat):
1. Add the state act metadata and statutory section mappings in `backend/app/jurisdiction/resolver.py`.
2. Add the statutory provisions and bye-laws to the knowledge corpus in `backend/app/repositories/in_memory.py` (or Qdrant vector database).
3. Add corresponding test cases in `backend/tests/test_jurisdiction_and_evidence.py`.
