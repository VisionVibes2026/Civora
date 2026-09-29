# Civora Local Development Runner (PowerShell)
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Starting Civora Development Environment..." -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Start Backend in a background job or separate process
Write-Host "[1/2] Starting FastAPI Backend on http://localhost:8000..." -ForegroundColor Green
$backendProcess = Start-Process python -ArgumentList "-m uvicorn backend.app.main:app --reload --port 8000" -PassThru

# 2. Start Frontend
Write-Host "[2/2] Starting Vite Frontend on http://localhost:5173..." -ForegroundColor Green
npm run dev

# Cleanup on exit
if ($backendProcess) {
    Stop-Process -Id $backendProcess.Id -Force
}
