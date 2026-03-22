# NearU Development Startup Script
# This script starts both the backend and frontend in separate terminals

Write-Host "Starting NearU Backend and Frontend..." -ForegroundColor Green

# Backend path
$backendPath = "C:\Users\THIMIRA\source\repos\NearU_Backend_Revised"

# Frontend path
$frontendPath = "C:\Users\THIMIRA\NearU-Frontend"

# Start Backend in new PowerShell window
Write-Host "Starting Backend on http://localhost:5059..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Starting NearU Backend...' -ForegroundColor Green; dotnet run"

# Wait a few seconds for backend to start
Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start Frontend in new PowerShell window
Write-Host "Starting Frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'Starting NearU Frontend...' -ForegroundColor Green; npm run dev"

Write-Host "`nBoth services are starting!" -ForegroundColor Green
Write-Host "Backend: http://localhost:5059" -ForegroundColor White
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "`nPress any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
