# NearU Demonstration Launcher
# Launches NearU Backend, Web Frontend, and Mobile App concurrently in separate PowerShell windows.

Write-Host "🚀 Launching NearU Multi-Platform Ecosystem for Demonstration..." -ForegroundColor Green

# 1. Start Backend API
Write-Host "1. Starting ASP.NET Core Backend API (http://localhost:5059)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location 'C:\Users\THIMIRA\NearU-Backend'; Write-Host '=== Starting NearU Backend API ===' -ForegroundColor Green; dotnet run"

Start-Sleep -Seconds 2

# 2. Start Web Frontend
Write-Host "3. Starting React + Vite Web Frontend (http://localhost:5173)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location 'C:\Users\THIMIRA\NearU-Frontend'; Write-Host '=== Starting NearU Web Frontend ===' -ForegroundColor Green; npm run dev"

Start-Sleep -Seconds 2

# 3. Start Mobile App (Expo Web / Metro)
Write-Host "3. Starting React Native / Expo Mobile App..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location 'C:\Users\THIMIRA\NearU-Mobile-App'; Write-Host '=== Starting NearU Mobile App ===' -ForegroundColor Green; npx expo start --web"

Write-Host ""
Write-Host "✅ All 3 services launched in separate windows!" -ForegroundColor Green
Write-Host "  - Backend API & Scalar UI: http://localhost:5059/scalar/v1" -ForegroundColor Yellow
Write-Host "  - Web Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "  - Mobile App Metro Dev Server: Running in 3rd terminal window" -ForegroundColor Yellow
