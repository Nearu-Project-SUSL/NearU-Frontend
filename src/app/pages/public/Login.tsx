import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import authService from '../../../api/authService';
import useAuth from '../../hooks/useAuth';
import { validateEmail, validateRequired } from '../../utils/validation';

// MUI Components
import { 
  TextField, 
  Button, 
  IconButton, 
  InputAdornment, 
  CircularProgress,
  Box,
  Typography,
  Divider
} from '@mui/material';

// MUI Icons
import {
  Email as MailIcon,
  Lock as LockIcon,
  Visibility as EyeIcon,
  VisibilityOff as EyeOffIcon,
  School as GraduationCapIcon,
  DirectionsBike as BikeIcon,
  Store as StoreIcon,
  Google as GoogleIcon,
  Person as GuestIcon
} from '@mui/icons-material';

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = validateEmail(email);
    const passwordError = validateRequired(password, 'Password');
    
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setIsLoading(true);
    setErrors({ email: '', password: '' });

    try {
      const response = await authService.login({ email, password });
      setAuth({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
      
      localStorage.setItem('accessToken', response.accessToken);
      
      toast.success('Login successful!');
      
      const userRole = response.user.roles[0];
      if (userRole === 'Admin') {
        navigate('/admin-home');
      } else if (userRole === 'BusinessOwner') {
        navigate('/business-owner-home');
      } else if (userRole === 'Rider') {
        navigate('/rider-home');
      } else {
        navigate('/home');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      setErrors({ 
        email: '', 
        password: error.response?.status === 401 ? 'Invalid email or password' : '' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-yellow-600/10 animate-gradient"></div>
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-yellow-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

      {/* Top Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-8 lg:px-12 py-6 bg-black/30 backdrop-blur-sm border-b border-yellow-400/20">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300">
            <span className="text-black text-2xl">🎓</span>
          </div>
          <span className="text-white text-2xl">NearU</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">New to NearU?</span>
          <Button 
            component={Link}
            to="/register"
            variant="outlined"
            sx={{
              color: '#facc15',
              borderColor: 'rgba(250, 204, 21, 0.2)',
              borderRadius: '0.75rem',
              px: 3,
              '&:hover': {
                borderColor: '#facc15',
                bgcolor: 'rgba(250, 204, 21, 0.1)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s',
            }}
          >
            Sign Up
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-88px)] px-4 lg:px-8 py-12">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Illustration */}
          <div className="hidden lg:flex flex-col items-center justify-center space-y-8 animate-fadeIn">
            {/* Illustration */}
            <div className="relative w-full max-w-md">
              {/* Decorative circles */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-full blur-3xl animate-pulse"></div>
              
              {/* Central hub */}
              <div className="relative z-10 flex items-center justify-center">
                <div className="relative w-64 h-64 bg-gradient-to-br from-gray-800 to-black rounded-3xl border-2 border-yellow-400/30 shadow-2xl shadow-yellow-400/20 p-8">
                  {/* Center circle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <GraduationCapIcon sx={{ fontSize: 40, color: 'black' }} />
                  </div>

                  {/* Orbiting icons */}
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center border border-yellow-400/40 animate-float">
                    <StoreIcon sx={{ fontSize: 24, color: '#facc15' }} />
                  </div>
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center border border-yellow-400/40 animate-float" style={{ animationDelay: '1s' }}>
                    <BikeIcon sx={{ fontSize: 24, color: '#facc15' }} />
                  </div>
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center border border-yellow-400/40 animate-float" style={{ animationDelay: '2s' }}>
                    <MailIcon sx={{ fontSize: 24, color: '#facc15' }} />
                  </div>
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center border border-yellow-400/40 animate-float" style={{ animationDelay: '3s' }}>
                    <LockIcon sx={{ fontSize: 24, color: '#facc15' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="text-center space-y-4 max-w-md">
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
                Connecting Your Campus<br />
                <span className="text-yellow-400">One Click Away.</span>
              </Typography>
              <Typography variant="body1" sx={{ color: 'gray', fontSize: '1.125rem' }}>
                Discover local businesses, uni riders, and part-time jobs tailored for university students. Join the NearU community today.
              </Typography>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto animate-slideUp">
            <div className="bg-gradient-to-br from-yellow-400/5 to-black/50 backdrop-blur-xl rounded-3xl border-2 border-yellow-400/20 p-8 lg:p-10 shadow-2xl shadow-yellow-400/10 hover:border-yellow-400/30 transition-all duration-500">
              {/* Header */}
              <div className="text-center mb-8">
                <Typography variant="h4" sx={{ color: 'white', mb: 1 }}>Welcome Back</Typography>
                <Typography variant="body2" sx={{ color: 'gray' }}>Please Enter your Details to Sign in.</Typography>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
                  <Typography variant="body2" sx={{ color: '#d1d5db', mb: 1 }}>Enter your Email</Typography>
                  <TextField
                    fullWidth
                    placeholder="student@sab.lk"
                    variant="outlined"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors({ ...errors, email: '' });
                    }}
                    error={!!errors.email}
                    helperText={errors.email}
                    disabled={isLoading}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <MailIcon sx={{ color: 'gray' }} />
                          </InputAdornment>
                        ),
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(0,0,0,0.4)',
                        '& fieldset': { borderColor: 'rgba(250, 204, 21, 0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(250, 204, 21, 0.6)' },
                        '&.Mui-focused fieldset': { borderColor: 'rgba(250, 204, 21, 0.6)' },
                      },
                      input: { color: 'white' },
                    }}
                  />
                </div>

                {/* Password */}
                <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
                  <Typography variant="body2" sx={{ color: '#d1d5db', mb: 1 }}>Password</Typography>
                  <TextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors({ ...errors, password: '' });
                    }}
                    error={!!errors.password}
                    helperText={errors.password}
                    disabled={isLoading}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: 'gray' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{ color: 'gray', '&:hover': { color: '#facc15' } }}
                            >
                              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        bgcolor: 'rgba(0,0,0,0.4)',
                        '& fieldset': { borderColor: 'rgba(250, 204, 21, 0.2)' },
                        '&:hover fieldset': { borderColor: 'rgba(250, 204, 21, 0.6)' },
                        '&.Mui-focused fieldset': { borderColor: 'rgba(250, 204, 21, 0.6)' },
                      },
                      input: { color: 'white' },
                    }}
                  />
                  <div className="flex justify-end mt-2">
                    <Link to="/forgot-password" style={{ color: '#9ca3af', fontSize: '0.875rem' }} className="hover:text-yellow-400 transition-colors">
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    py: 1.5,
                    bgcolor: '#facc15',
                    color: 'black',
                    '&:hover': { bgcolor: '#eab308', transform: 'scale(1.05)' },
                    transition: 'all 0.3s',
                    boxShadow: '0 10px 15px -3px rgba(250, 204, 21, 0.3)',
                    fontSize: '1.125rem',
                  }}
                  startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>

                {/* Divider */}
                <Box sx={{ position: 'relative', my: 3 }}>
                  <Divider sx={{ borderColor: 'rgba(250, 204, 21, 0.2)' }} />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      position: 'absolute', 
                      top: '50%', 
                      left: '50%', 
                      transform: 'translate(-50%, -50%)',
                      bgcolor: 'black',
                      px: 2,
                      color: 'gray'
                    }}
                  >
                    OR CONTINUE WITH
                  </Typography>
                </Box>

                {/* Social Login */}
                <div className="grid grid-cols-2 gap-4 animate-slideUp" style={{ animationDelay: '0.5s' }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    onClick={() => toast.info('Google login coming soon!')}
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(250, 204, 21, 0.2)',
                      '&:hover': { borderColor: 'rgba(250, 204, 21, 0.4)', bgcolor: 'rgba(250, 204, 21, 0.05)' },
                    }}
                  >
                    Google
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<GuestIcon />}
                    onClick={() => {
                      setAuth({
                        user: { id: 'guest', username: 'Guest', email: 'guest@nearu.com', roles: ['Student'] },
                        accessToken: 'guest-token',
                        refreshToken: 'guest-token',
                      });
                      localStorage.setItem('accessToken', 'guest-token');
                      toast.success('Logged in as Guest');
                      navigate('/home');
                    }}
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(250, 204, 21, 0.2)',
                      '&:hover': { borderColor: 'rgba(250, 204, 21, 0.4)', bgcolor: 'rgba(250, 204, 21, 0.05)' },
                    }}
                  >
                    Guest
                  </Button>
                </div>

                {/* Terms */}
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: 'gray', mt: 2 }}>
                  By Continuing, you agree to NearU's Terms of Service and Privacy Policy.
                </Typography>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-20 text-center py-6 text-gray-500 text-sm">
        2025 NearU. All rights Reserved
      </footer>
    </div>
  );
}