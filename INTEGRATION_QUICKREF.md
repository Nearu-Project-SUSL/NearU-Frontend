# NearU Integration Quick Reference

## 🚀 Quick Start

### Start Both Projects
```powershell
npm run start:all
```

### Start Individually
```powershell
# Backend only
npm run start:backend
# or
cd C:\Users\THIMIRA\source\repos\NearU_Backend_Revised
dotnet run

# Frontend only
npm run dev
```

## 📡 Service URLs

| Service  | URL                     | Port |
|----------|------------------------|------|
| Backend  | http://localhost:5059  | 5059 |
| Frontend | http://localhost:5173  | 5173 |

## 🔐 Authentication Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout user |

## 🔧 Configuration Files

### Frontend
- **Environment**: `.env`
- **API Config**: `src/api/axios.ts`
- **Auth Service**: `src/api/authService.ts`

### Backend
- **Settings**: `appsettings.json`
- **Launch**: `Properties/launchSettings.json`
- **Startup**: `Program.cs`

## 📦 Key Dependencies

### Frontend
- `axios` - HTTP client
- `react-router` - Routing
- `@mui/material` - UI components

### Backend
- `Microsoft.EntityFrameworkCore` - ORM
- `Microsoft.AspNetCore.Authentication.JwtBearer` - JWT auth
- `Npgsql.EntityFrameworkCore.PostgreSQL` - PostgreSQL

## 🛠️ Common Tasks

### Update Backend URL
Edit `.env`:
```env
VITE_API_BASE_URL=http://new-backend-url/api
```

### Add New API Endpoint
1. Add method in `src/api/authService.ts` (or create new service)
2. Use `axios` (public) or `axiosPrivate` (authenticated)
3. Call from components using the service

### Add CORS Origin
Edit backend `Program.cs`:
```csharp
policy.WithOrigins("http://localhost:3000", "http://localhost:5173", "http://new-origin")
```

## 🔍 Debugging Tips

### Check Backend Status
```powershell
curl http://localhost:5059/api/auth/login -Method POST
```

### Check Frontend Connection
1. Open browser DevTools (F12)
2. Go to Network tab
3. Trigger an API call
4. Check request/response

### Common Issues

| Issue | Solution |
|-------|----------|
| CORS error | Add origin to backend CORS policy |
| 401 Unauthorized | Check token in Authorization header |
| Connection refused | Ensure backend is running on port 5059 |
| Token expired | Refresh token should auto-refresh |

## 📚 Documentation

- **Integration Guide**: [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)
- **Authentication**: [AUTHENTICATION_OPTIMIZATIONS.md](./AUTHENTICATION_OPTIMIZATIONS.md)
- **Backend README**: `C:\Users\THIMIRA\source\repos\NearU_Backend_Revised\README.md`

## 🔐 Environment Variables

### Required
```env
VITE_API_BASE_URL=http://localhost:5059/api
```

### Optional
```env
VITE_APP_ENV=development
```

## 🎯 Testing Authentication Flow

### 1. Register User
```bash
POST http://localhost:5059/api/auth/register
Body: { "username": "test", "email": "test@example.com", "password": "Test123!" }
```

### 2. Login
```bash
POST http://localhost:5059/api/auth/login
Body: { "email": "test@example.com", "password": "Test123!" }
```

### 3. Use Access Token
```bash
GET http://localhost:5059/api/protected-endpoint
Header: Authorization: Bearer {accessToken}
```

### 4. Refresh Token
```bash
POST http://localhost:5059/api/auth/refresh
Body: { "refreshToken": "{refreshToken}" }
```

## 🏗️ Project Structure

```
NearU-Frontend/
├── src/
│   ├── api/
│   │   ├── axios.ts           # API client config
│   │   └── authService.ts     # Auth API calls
│   ├── app/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts     # Auth context hook
│   │   │   ├── useAxiosPrivate.ts  # Authenticated requests
│   │   │   └── useRefreshToken.ts  # Token refresh
│   │   └── pages/
│   │       └── public/
│   │           └── Login.tsx  # Login page
│   └── main.tsx
├── .env                       # Environment variables
├── .env.example               # Environment template
└── start-dev.ps1              # Startup script

NearU_Backend_Revised/
├── Controllers/
│   └── AuthController.cs      # Auth endpoints
├── Services/
│   ├── UserService.cs         # User operations
│   └── TokenService.cs        # JWT operations
├── Program.cs                 # App startup & config
└── appsettings.json           # Configuration
```

## 💡 Pro Tips

1. **Use `useAxiosPrivate()` for authenticated requests** - It handles token refresh automatically
2. **Keep tokens in memory** - Don't store in localStorage (XSS vulnerability)
3. **Check backend logs** - Helpful for debugging auth issues
4. **Use `.env.example`** - Document all environment variables
5. **Test with Postman** - Backend includes Postman collections

## 🆘 Need Help?

1. Check [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for detailed docs
2. Review backend API testing guide: `C:\Users\THIMIRA\source\repos\NearU_Backend_Revised\API_TESTING_GUIDE.md`
3. Check console logs in both frontend and backend
4. Verify environment variables are loaded correctly
