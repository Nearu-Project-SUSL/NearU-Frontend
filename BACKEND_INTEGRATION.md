# Backend Integration Guide

This document explains how the NearU Frontend is integrated with the NearU Backend.

## Backend Location
- **Path**: `C:\Users\THIMIRA\source\repos\NearU_Backend_Revised`
- **Technology**: ASP.NET Core Web API with PostgreSQL
- **Default Port**: 5059 (HTTP), 7189 (HTTPS)

## Frontend Configuration

### Environment Variables
The frontend uses environment variables to configure the backend API URL:

- **File**: `.env` (not committed to git)
- **Example**: `.env.example` (template file)
- **Key Variable**: `VITE_API_BASE_URL=http://localhost:5059/api`

### API Configuration
- **File**: `src/api/axios.ts`
- **Base URL**: Reads from `VITE_API_BASE_URL` environment variable
- **Fallback**: `http://localhost:5059/api` if env var not set

## Backend Endpoints

The backend provides the following authentication endpoints:

### Auth Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### Auth Response Format
```json
{
  "accessToken": "jwt_token_here",
  "refreshToken": "refresh_token_here",
  "userId": "user_id",
  "username": "username",
  "email": "user@example.com",
  "role": "Student/Business/Rider"
}
```

## CORS Configuration

The backend is configured to allow requests from:
- `http://localhost:3000`
- `http://localhost:5173` (Vite default port)

**Note**: If you change the frontend port, update `Program.cs` in the backend:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
```

## Authentication Flow

### 1. Login Process
1. User submits credentials via `src/app/pages/public/Login.tsx`
2. Frontend calls `authService.login()` in `src/api/authService.ts`
3. Backend validates credentials and returns JWT tokens
4. Frontend stores tokens in auth context

### 2. Token Management
- **Access Token**: Short-lived (15 minutes), sent with each authenticated request
- **Refresh Token**: Long-lived (7 days), used to get new access tokens
- **Interceptor**: `useAxiosPrivate` hook automatically refreshes expired tokens

### 3. Protected Requests
1. Use `useAxiosPrivate()` hook for authenticated requests
2. Hook automatically adds Bearer token to Authorization header
3. If token expires (401), automatically refreshes and retries request

## Running Both Projects

### Option 1: Start Backend First
```powershell
# Terminal 1 - Backend
cd C:\Users\THIMIRA\source\repos\NearU_Backend_Revised
dotnet run

# Terminal 2 - Frontend
cd C:\Users\THIMIRA\NearU-Frontend
npm run dev
```

### Option 2: Use npm-run-all (if configured)
```powershell
npm run dev:all  # If you add a script to run both
```

## Environment Setup

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5059/api
VITE_APP_ENV=development
```

### Backend (appsettings.json)
```json
{
  "ConnectionStrings": {
    "PostgreSQL": "Host=...;Port=...;Database=...;Username=...;Password=..."
  },
  "JwtSettings": {
    "SecretKey": "your-secret-key",
    "Issuer": "NearU-Backend",
    "Audience": "NearU-Client",
    "AccessTokenExpiryInMinutes": 15,
    "RefreshTokenExpiryInDays": 7
  }
}
```

## Troubleshooting

### CORS Errors
- Ensure backend CORS policy includes your frontend URL
- Check that `withCredentials: true` is set in axios config

### Authentication Errors
- Verify JWT settings match between frontend and backend
- Check that tokens are properly stored in auth context
- Ensure Authorization header format is `Bearer {token}`

### Connection Errors
- Confirm backend is running on port 5059
- Check that `VITE_API_BASE_URL` points to correct backend URL
- Verify firewall allows local connections on port 5059

## API Service Files

### Authentication Service
- **File**: `src/api/authService.ts`
- **Exports**: login, register, forgotPassword, resetPassword, logout functions

### Axios Configuration
- **Default Instance**: `src/api/axios.ts` - For public endpoints
- **Private Instance**: `axiosPrivate` - For authenticated endpoints with auto-refresh

### Hooks
- **useAuth**: Access auth context (tokens, user info)
- **useRefreshToken**: Refresh access token
- **useAxiosPrivate**: Get axios instance with auto-refresh interceptor

## Next Steps

1. **Test Integration**: Run both backend and frontend, test login flow
2. **Add More Endpoints**: Extend `authService.ts` as backend adds more APIs
3. **Environment Variables**: Add production URLs when deploying
4. **Error Handling**: Enhance error messages for better UX

## Database Connection

The backend is configured to use PostgreSQL on Railway:
- **Host**: crossover.proxy.rlwy.net
- **Port**: 26206
- **Database**: railway

Migrations run automatically on backend startup.

## Security Notes

- JWT secret key is configured in backend `appsettings.json`
- Never commit `.env` file with sensitive data
- Use HTTPS in production
- Rotate JWT secret keys periodically
- Implement rate limiting on auth endpoints
