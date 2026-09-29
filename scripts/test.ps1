# Civora Automated Test Runner (PowerShell)
Write-Host "Running Civora Test Suite..." -ForegroundColor Cyan

Write-Host "`n[1/2] Running Backend Pytest..." -ForegroundColor Green
python -m pytest backend/tests -v
$backendExit = $LASTEXITCODE

Write-Host "`n[2/2] Running Frontend TypeScript Check & Build..." -ForegroundColor Green
npm run build
$frontendExit = $LASTEXITCODE

if ($backendExit -eq 0 -and $frontendExit -eq 0) {
    Write-Host "`nAll Civora Backend & Frontend Tests Passed Successfully!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`nSome tests failed. Please inspect logs above." -ForegroundColor Red
    exit 1
}
