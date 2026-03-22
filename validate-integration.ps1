# Integration Validation Script
# Run this to check if the frontend-backend integration is properly configured

Write-Host "=== NearU Integration Validator ===" -ForegroundColor Cyan
Write-Host ""

$errors = 0
$warnings = 0

# Check 1: Frontend .env file exists
Write-Host "Checking .env file..." -NoNewline
if (Test-Path ".env") {
    Write-Host " ✓" -ForegroundColor Green
    
    # Check if it contains required variables
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "VITE_API_BASE_URL") {
        Write-Host "  - VITE_API_BASE_URL found ✓" -ForegroundColor Green
    } else {
        Write-Host "  - VITE_API_BASE_URL missing ✗" -ForegroundColor Red
        $errors++
    }
} else {
    Write-Host " ✗" -ForegroundColor Red
    Write-Host "  - .env file not found. Copy from .env.example" -ForegroundColor Yellow
    $errors++
}

# Check 2: Backend directory exists
Write-Host "Checking backend directory..." -NoNewline
$backendPath = "C:\Users\THIMIRA\source\repos\NearU_Backend_Revised"
if (Test-Path $backendPath) {
    Write-Host " ✓" -ForegroundColor Green
} else {
    Write-Host " ✗" -ForegroundColor Red
    Write-Host "  - Backend not found at expected location" -ForegroundColor Yellow
    $errors++
}

# Check 3: Node modules installed
Write-Host "Checking node_modules..." -NoNewline
if (Test-Path "node_modules") {
    Write-Host " ✓" -ForegroundColor Green
} else {
    Write-Host " ✗" -ForegroundColor Red
    Write-Host "  - Run 'npm install' to install dependencies" -ForegroundColor Yellow
    $errors++
}

# Check 4: .NET SDK installed
Write-Host "Checking .NET SDK..." -NoNewline
try {
    $dotnetVersion = dotnet --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host " ✓ (v$dotnetVersion)" -ForegroundColor Green
    } else {
        Write-Host " ✗" -ForegroundColor Red
        $errors++
    }
} catch {
    Write-Host " ✗" -ForegroundColor Red
    Write-Host "  - .NET SDK not installed or not in PATH" -ForegroundColor Yellow
    $errors++
}

# Check 5: Backend configuration
Write-Host "Checking backend configuration..." -NoNewline
$backendConfigPath = Join-Path $backendPath "appsettings.json"
if (Test-Path $backendConfigPath) {
    Write-Host " ✓" -ForegroundColor Green
    
    $config = Get-Content $backendConfigPath -Raw | ConvertFrom-Json
    if ($config.ConnectionStrings.PostgreSQL) {
        Write-Host "  - Database connection configured ✓" -ForegroundColor Green
    } else {
        Write-Host "  - Database connection missing ✗" -ForegroundColor Red
        $errors++
    }
    
    if ($config.JwtSettings.SecretKey) {
        Write-Host "  - JWT settings configured ✓" -ForegroundColor Green
    } else {
        Write-Host "  - JWT settings missing ✗" -ForegroundColor Red
        $errors++
    }
} else {
    Write-Host " ✗" -ForegroundColor Red
    $warnings++
}

# Check 6: CORS configuration
Write-Host "Checking CORS configuration..." -NoNewline
$programCsPath = Join-Path $backendPath "Program.cs"
if (Test-Path $programCsPath) {
    $programCs = Get-Content $programCsPath -Raw
    if ($programCs -match "localhost:5173") {
        Write-Host " ✓" -ForegroundColor Green
    } else {
        Write-Host " ⚠" -ForegroundColor Yellow
        Write-Host "  - Vite port (5173) not found in CORS config" -ForegroundColor Yellow
        $warnings++
    }
} else {
    Write-Host " ✗" -ForegroundColor Red
    $warnings++
}

# Check 7: API service files
Write-Host "Checking API service files..." -NoNewline
if ((Test-Path "src\api\axios.ts") -and (Test-Path "src\api\authService.ts")) {
    Write-Host " ✓" -ForegroundColor Green
} else {
    Write-Host " ✗" -ForegroundColor Red
    $errors++
}

# Summary
Write-Host ""
Write-Host "=== Validation Summary ===" -ForegroundColor Cyan

if ($errors -eq 0 -and $warnings -eq 0) {
    Write-Host "All checks passed! ✓" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now run:" -ForegroundColor White
    Write-Host "  npm run start:all   # Start both frontend and backend" -ForegroundColor Cyan
    Write-Host "  npm run dev         # Start frontend only" -ForegroundColor Cyan
} elseif ($errors -eq 0) {
    Write-Host "$warnings warning(s) found ⚠" -ForegroundColor Yellow
    Write-Host "Integration should work, but review warnings above" -ForegroundColor Yellow
} else {
    Write-Host "$errors error(s) and $warnings warning(s) found ✗" -ForegroundColor Red
    Write-Host "Please fix errors before running the application" -ForegroundColor Red
}

Write-Host ""
Write-Host "For detailed integration guide, see BACKEND_INTEGRATION.md" -ForegroundColor Gray
