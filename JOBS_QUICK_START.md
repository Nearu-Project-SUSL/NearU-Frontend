# Quick Start Guide - Jobs Backend Integration

## ✅ Integration Complete

The Jobs section has been successfully integrated with the backend API.

## 🚀 How to Run

### 1. Start the Backend
```bash
cd C:\Users\THIMIRA\NearU-Backend
dotnet run
```
The backend should start on `http://localhost:5059`

### 2. Start the Frontend
```bash
cd C:\Users\THIMIRA\NearU-Frontend
npm run dev
```
The frontend will start on `http://localhost:5173`

### 3. Test the Integration

1. **Login** to the application
2. **Navigate to Jobs** section from the sidebar
3. **Browse Jobs** - Jobs will load from the backend API
4. **Create a Job** - Click "Post a Job" button
5. **View My Jobs** - Go to Profile → My Jobs to see your postings
6. **Delete a Job** - Use the delete button on your job listings

## 📁 Key Files

### API Service
- `src/api/jobService.ts` - All job-related API calls

### Pages
- `src/app/pages/protected/Jobs.tsx` - Browse all jobs
- `src/app/pages/protected/CreateJob.tsx` - Create new job
- `src/app/pages/protected/MyJobs.tsx` - Manage your jobs

### Configuration
- `.env` - Backend API URL configuration

### Documentation
- `LOGO_UPLOAD_DOCUMENTATION.md` - Original logo upload docs (Base64)
- `IMAGEKIT_INTEGRATION.md` - **NEW: ImageKit cloud storage integration**

## 🔌 API Endpoints Connected

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | /api/job | Get all jobs | No |
| GET | /api/job/new | Get new jobs | No |
| GET | /api/job/category/{category} | Get by category | No |
| GET | /api/job/type/{type} | Get by type | No |
| GET | /api/job/search?q={query} | Search jobs | No |
| GET | /api/job/{id} | Get specific job | No |
| POST | /api/job | Create job | Yes |
| PUT | /api/job/{id} | Update job | Yes |
| DELETE | /api/job/{id} | Delete job | Yes |

## ✨ Features Working

- ✅ Browse all jobs from database
- ✅ Filter by category (Campus, Tech, Marketing, etc.)
- ✅ Filter by job type (Part-Time, Full-Time, etc.)
- ✅ Search by title or company name
- ✅ View detailed job information
- ✅ Create new job postings
- ✅ **Upload company logos via ImageKit Cloud CDN** (Same system as food section!)
- ✅ Delete your job postings
- ✅ Contact job posters via email
- ✅ Loading states and error handling
- ✅ Authentication for protected actions

## 🎨 UI Updates Made

1. **Loading States** - Shows "Loading jobs..." while fetching
2. **Empty States** - Shows helpful message when no jobs found
3. **Error Handling** - Toast notifications for all errors
4. **Data Mapping** - Backend field names correctly mapped to UI
5. **Default Images** - Fallback avatars when logos missing

## 🔐 Authentication

- Uses JWT tokens stored in localStorage
- Token automatically sent with protected requests
- Login required for: Create, Update, Delete jobs
- Public access for: Browse and search jobs

## 📝 Notes

- Pre-existing TypeScript errors in other files don't affect jobs functionality
- Build completes successfully
- All job features working with real backend data

## 🆘 Troubleshooting

**Jobs not loading?**
- Check backend is running on port 5059
- Verify `.env` file has correct API URL
- Check browser console for errors

**Can't create jobs?**
- Make sure you're logged in
- Check JWT token in localStorage
- Verify backend authentication is working

**Build errors?**
- Pre-existing errors in Register.tsx are unrelated
- Jobs integration files build successfully
- `npm run build` completes without errors

## 📞 Contact

For issues or questions about the integration, refer to:
- `JOBS_INTEGRATION_SUMMARY.md` - Detailed technical documentation
- Backend API docs: `C:\Users\THIMIRA\NearU-Backend\API_TESTING_GUIDE.md`
