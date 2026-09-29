#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "Starting Civora Development Environment..."
echo "=========================================================="

# Trap SIGINT to kill background jobs on Ctrl+C
trap 'kill $(jobs -p) 2>/dev/null' EXIT

echo "[1/2] Starting FastAPI Backend on http://localhost:8000..."
uvicorn backend.app.main:app --reload --port 8000 &

echo "[2/2] Starting Vite Frontend on http://localhost:5173..."
npm run dev
