#!/usr/bin/env bash
set -e

echo "Running Civora Test Suite..."

echo "[1/2] Running Backend Pytest..."
python -m pytest backend/tests -v

echo "[2/2] Running Frontend TypeScript Check & Build..."
npm run build

echo "All Civora Backend & Frontend Tests Passed Successfully!"
