$log = Join-Path $PSScriptRoot "push-nu30-log.txt"
$FeatureBranch = "NU-30-Deals-and-offers"
$DeployBranch = "dev"

function Log($msg) {
    $line = "$(Get-Date -Format 'HH:mm:ss') $msg"
    Add-Content -Path $log -Value $line
    Write-Host $line
}

"" | Set-Content $log
Log "=== NU-30 push started ==="

# --- Backend ---
$backend = "d:\New Fork\New Backend\NearU-Backend"
if (Test-Path "$backend\.git") {
    Set-Location $backend
    Log "BACKEND: $(Get-Location)"
    git fetch origin 2>&1 | ForEach-Object { Log $_ }
    $cur = git rev-parse --abbrev-ref HEAD 2>&1
    Log "BACKEND branch before: $cur"
    git checkout $FeatureBranch 2>&1 | ForEach-Object { Log $_ }
    if ($LASTEXITCODE -ne 0) {
        git checkout -b $FeatureBranch 2>&1 | ForEach-Object { Log $_ }
        if ($LASTEXITCODE -ne 0) {
            git checkout -b $FeatureBranch "origin/$FeatureBranch" 2>&1 | ForEach-Object { Log $_ }
        }
    }
    dotnet build NearU_Backend_Revised.csproj -c Release 2>&1 | ForEach-Object { Log $_ }
    git add Models/Deal.cs Enums/DealApprovalStatus.cs DTOs/Deal/ `
        Repositories/DealRepository.cs Repositories/Interfaces/IDealRepository.cs `
        Services/DealService.cs Services/Interfaces/IDealService.cs `
        Controllers/DealsController.cs Controllers/AdminController.cs `
        Data/ApplicationDbContext.cs Program.cs `
        Migrations/20260518120000_AddDealsTable.cs `
        Migrations/ApplicationDbContextModelSnapshot.cs `
        .github/workflows/deploy.yml scripts/deploy-deals-to-vps.ps1 2>&1 | ForEach-Object { Log $_ }
    git status -sb 2>&1 | ForEach-Object { Log $_ }
    $staged = git diff --cached --name-only 2>&1
    if ($staged) {
        git commit -m "NU-30: Add deals and offers API with admin approval" 2>&1 | ForEach-Object { Log $_ }
    } else {
        Log "BACKEND: nothing to commit (already committed?)"
    }
    git push -u origin $FeatureBranch 2>&1 | ForEach-Object { Log $_ }
} else {
    Log "BACKEND: no .git at $backend"
}

# --- Frontend ---
$frontend = "d:\New Fork\NearU-Frontend"
if (Test-Path "$frontend\.git") {
    Set-Location $frontend
    Log "FRONTEND: $(Get-Location)"
    git fetch origin 2>&1 | ForEach-Object { Log $_ }
    git checkout $FeatureBranch 2>&1 | ForEach-Object { Log $_ }
    if ($LASTEXITCODE -ne 0) {
        git checkout -b $FeatureBranch 2>&1 | ForEach-Object { Log $_ }
        if ($LASTEXITCODE -ne 0) {
            git checkout -b $FeatureBranch "origin/$FeatureBranch" 2>&1 | ForEach-Object { Log $_ }
        }
    }
    if (-not (Test-Path ".env")) {
        Set-Content .env "VITE_API_BASE_URL=https://api.nearusab.me/api"
        Log "FRONTEND: created .env"
    }
    git add src/api/services/dealsApi.ts src/app/hooks/useDeals.ts `
        src/app/components/deal/ src/app/pages/protected/Deals.tsx `
        src/app/pages/protected/AdminDeals.tsx src/app/pages/protected/Home.tsx `
        src/app/routes.tsx src/app/pages/protected/AdminHome.tsx `
        src/app/pages/protected/BusinessOwnerHome.tsx .env.example 2>&1 | ForEach-Object { Log $_ }
    git status -sb 2>&1 | ForEach-Object { Log $_ }
    $staged = git diff --cached --name-only 2>&1
    if ($staged) {
        git commit -m "NU-30: Deals and offers UI connected to api.nearusab.me" 2>&1 | ForEach-Object { Log $_ }
    } else {
        Log "FRONTEND: nothing to commit"
    }
    git push -u origin $FeatureBranch 2>&1 | ForEach-Object { Log $_ }
} else {
    Log "FRONTEND: no .git at $frontend"
}

# --- PR (backend) ---
Set-Location $backend
if (Get-Command gh -ErrorAction SilentlyContinue) {
    gh pr create --base $DeployBranch --head $FeatureBranch `
        --title "NU-30: Deals and offers API" `
        --body "Deals submission, admin approval, public GET /api/deals for home page." 2>&1 | ForEach-Object { Log $_ }
}

Log "=== Done. Log: $log ==="
