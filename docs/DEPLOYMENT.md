# Civora Deployment & Operations Guide

## Production Architecture Options

Civora is architected for two primary deployment topologies:
1. **Central Cloud Deployment**: High-availability Kubernetes / Container Service hosting API gateway, vector store, and scalable inference backends.
2. **Rural Edge / PACS Kiosk Deployment**: Lightweight self-contained single-node or touch-kiosk appliance for Common Service Centres (CSCs) and Primary Agricultural Cooperative Societies with intermittent internet connectivity.

---

## 1. Docker Compose Deployment

Civora includes a production-ready `docker-compose.yml` for unified deployment:

```bash
# Clone repository
git clone https://github.com/your-org/Civora.git
cd Civora

# Copy and configure environment variables
cp .env.example .env

# Build and start all services
docker compose up --build -d
```

### Services Started:
- `backend`: FastAPI server running on port `8000`
- `frontend`: High-performance Nginx web server serving Vite bundle on port `80` (or `5173`)
- `qdrant` *(optional)*: Vector search database on port `6333`

---

## 2. Kiosk Mode Edge Deployment (PACS / CSCs)

For touch-screen kiosks in rural cooperative societies:
- Chromium / Electron running in fullscreen kiosk mode:
  ```bash
  chromium-browser --kiosk --incognito http://localhost:5173/?mode=kiosk
  ```
- Audio hardware integration: USB directional microphone with noise-suppression hardware for ambient rural environments.
- Offline local SQLite database and pre-cached Indic voice synthesis assets.
