import { useState } from 'react';
import { useNavigate, Link } from 'react-router';

// MUI Components
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Paper,
} from '@mui/material';

// MUI Icons
import {
  Email as MailIcon,
  Lock as LockIcon,
  Visibility as EyeIcon,
  VisibilityOff as EyeOffIcon,
  Key as KeyRoundIcon,
  CheckCircle as CheckCircle2Icon,
  ArrowBack as ArrowLeftIcon,
  Send as SendIcon,
  Shield as ShieldCheckIcon,
  School as GraduationCapIcon,
  VpnKey as VpnKeyIcon,
  Security as SecurityIcon,
  Restore as RestoreIcon,
} from '@mui/icons-material';

type Step = 'email' | 'verify' | 'reset' | 'success';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: '',
  });

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain uppercase, lowercase, and number';
    }
    return '';
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setErrors({ ...errors, email: 'Email is required' });
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ ...errors, email: 'Please enter a valid email' });
      return;
    }

    setIsLoading(true);
    // Simulate sending email
    setTimeout(() => {
      setIsLoading(false);
      setStep('verify');
    }, 1000);
  };

  const handleVerificationChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const code = verificationCode.join('');
    if (code.length !== 6) {
      setErrors({ ...errors, verificationCode: 'Please enter the complete code' });
      return;
    }

    setIsLoading(true);
    // Simulate verification
    setTimeout(() => {
      setIsLoading(false);
      setStep('reset');
    }, 1000);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = {
      email: '',
      verificationCode: '',
      newPassword: validatePassword(formData.newPassword),
      confirmPassword: formData.newPassword !== formData.confirmPassword 
        ? 'Passwords do not match' 
        : '',
    };

    setErrors(newErrors);

    if (newErrors.newPassword || newErrors.confirmPassword) {
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    }, 1000);
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
          <span className="text-gray-400 text-sm hidden sm:block">Remember your password?</span>
          <Button 
            component={Link}
            to="/login"
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
            Sign In
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
                    <VpnKeyIcon sx={{ fontSize: 40, color: 'black' }} />
                  </div>

                  {/* Orbiting icons */}
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center border border-yellow-400/40 animate-float">
                    <SecurityIcon sx={{ fontSize: 24, color: '#facc15' }} />
                  </div>
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center border border-yellow-400/40 animate-float" style={{ animationDelay: '1s' }}>
                    <LockIcon sx={{ fontSize: 24, color: '#facc15' }} />
                  </div>
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center border border-yellow-400/40 animate-float" style={{ animationDelay: '2s' }}>
                    <MailIcon sx={{ fontSize: 24, color: '#facc15' }} />
                  </div>
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center border border-yellow-400/40 animate-float" style={{ animationDelay: '3s' }}>
                    <RestoreIcon sx={{ fontSize: 24, color: '#facc15' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="text-center space-y-4 max-w-md">
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
                Secure Access<br />
                <span className="text-yellow-400">Restored Easily.</span>
              </Typography>
              <Typography variant="body1" sx={{ color: 'gray', fontSize: '1.125rem' }}>
                Regain access to your NearU account quickly and securely. We prioritize your privacy and smooth experience.
              </Typography>
            </div>
          </div>

          {/* Right Side - Recovery Form */}
          <div className="w-full max-w-md mx-auto animate-slideUp">
            <div className="bg-gradient-to-br from-yellow-400/5 to-black/50 backdrop-blur-xl rounded-3xl border-2 border-yellow-400/20 p-8 lg:p-10 shadow-2xl shadow-yellow-400/10 hover:border-yellow-400/30 transition-all duration-500">
              
              {/* Back Button */}
              {step !== 'success' && (
                <Button
                  component={Link}
                  to="/login"
                  startIcon={<ArrowLeftIcon />}
                  sx={{ color: '#facc15', mb: 3, ml: -1, '&:hover': { bgcolor: 'transparent', transform: 'translateX(-4px)' }, transition: 'all 0.3s' }}
                >
                  Back to Login
                </Button>
              )}

              {/* Progress Indicator */}
              {step !== 'success' && (
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 4 }}>
                  <Box sx={{ height: 4, width: step === 'email' ? 32 : 12, borderRadius: 2, bgcolor: step === 'email' ? '#facc15' : 'rgba(250, 204, 21, 0.2)', transition: 'all 0.3s' }} />
                  <Box sx={{ height: 4, width: step === 'verify' ? 32 : 12, borderRadius: 2, bgcolor: step === 'verify' ? '#facc15' : 'rgba(250, 204, 21, 0.2)', transition: 'all 0.3s' }} />
                  <Box sx={{ height: 4, width: step === 'reset' ? 32 : 12, borderRadius: 2, bgcolor: step === 'reset' ? '#facc15' : 'rgba(250, 204, 21, 0.2)', transition: 'all 0.3s' }} />
                </Box>
              )}

              {/* Step 1: Email Input */}
              {step === 'email' && (
                <Box className="animate-fadeIn">
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Box sx={{ width: 64, height: 64, bgcolor: 'rgba(250, 204, 21, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, border: '1px solid rgba(250, 204, 21, 0.3)' }}>
                      <MailIcon sx={{ fontSize: 32, color: '#facc15' }} />
                    </Box>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>Forgot Password?</Typography>
                    <Typography variant="body2" sx={{ color: 'gray' }}>Enter your email and we'll send you a reset code</Typography>
                  </Box>

                  <form onSubmit={handleEmailSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#d1d5db', mb: 1 }}>Email Address</Typography>
                        <TextField
                          fullWidth
                          placeholder="student@sab.lk"
                          variant="outlined"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: '' }); }}
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
                      </Box>
                      <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        disabled={isLoading}
                        startIcon={!isLoading && <SendIcon />}
                        sx={{ py: 1.5, bgcolor: '#facc15', color: 'black', '&:hover': { bgcolor: '#eab308', transform: 'scale(1.05)' }, transition: 'all 0.3s', boxShadow: '0 10px 15px -3px rgba(250, 204, 21, 0.3)' }}
                      >
                        {isLoading ? 'Sending...' : 'Send Reset Code'}
                      </Button>
                    </Box>
                  </form>
                </Box>
              )}

              {/* Step 2: Verification Code */}
              {step === 'verify' && (
                <Box className="animate-fadeIn">
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Box sx={{ width: 64, height: 64, bgcolor: 'rgba(250, 204, 21, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, border: '1px solid rgba(250, 204, 21, 0.3)' }}>
                      <ShieldCheckIcon sx={{ fontSize: 32, color: '#facc15' }} />
                    </Box>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>Check Your Email</Typography>
                    <Typography variant="body2" sx={{ color: 'gray' }}>We've sent a 6-digit code to</Typography>
                    <Typography variant="body2" sx={{ color: '#facc15', fontWeight: 'bold' }}>{email}</Typography>
                  </Box>

                  <form onSubmit={handleVerificationSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        {verificationCode.map((digit, index) => (
                          <TextField
                            key={index}
                            id={`code-${index}`}
                            value={digit}
                            onChange={(e) => handleVerificationChange(index, e.target.value)}
                            onKeyDown={(e: any) => {
                              if (e.key === 'Backspace' && !digit && index > 0) {
                                document.getElementById(`code-${index - 1}`)?.focus();
                              }
                            }}
                            disabled={isLoading}
                            slotProps={{
                              input: {
                                sx: { 
                                  width: '48px', 
                                  height: '56px', 
                                  bgcolor: 'rgba(0,0,0,0.4)',
                                  '& input': { textAlign: 'center', px: 0, fontSize: '1.25rem', fontWeight: 'bold', color: 'white' }
                                }
                              }
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: 'rgba(250, 204, 21, 0.2)' },
                                '&:hover fieldset': { borderColor: 'rgba(250, 204, 21, 0.6)' },
                                '&.Mui-focused fieldset': { borderColor: 'rgba(250, 204, 21, 0.6)' },
                              }
                            }}
                          />
                        ))}
                      </Box>
                      {errors.verificationCode && (
                        <Typography color="error" variant="caption" sx={{ textAlign: 'center' }}>{errors.verificationCode}</Typography>
                      )}
                      <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        disabled={isLoading}
                        sx={{ py: 1.5, bgcolor: '#facc15', color: 'black', '&:hover': { bgcolor: '#eab308', transform: 'scale(1.05)' }, transition: 'all 0.3s', boxShadow: '0 10px 15px -3px rgba(250, 204, 21, 0.3)' }}
                      >
                        {isLoading ? 'Verifying...' : 'Verify Code'}
                      </Button>
                      <Button
                        onClick={() => setStep('email')}
                        disabled={isLoading}
                        sx={{ color: 'gray', textTransform: 'none', '&:hover': { color: '#facc15' } }}
                      >
                        Didn't receive the code? <Typography component="span" sx={{ color: '#facc15', fontWeight: 'bold', ml: 1 }}>Resend</Typography>
                      </Button>
                    </Box>
                  </form>
                </Box>
              )}

              {/* Step 3: Reset Password */}
              {step === 'reset' && (
                <Box className="animate-fadeIn">
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Box sx={{ width: 64, height: 64, bgcolor: 'rgba(250, 204, 21, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, border: '1px solid rgba(250, 204, 21, 0.3)' }}>
                      <KeyRoundIcon sx={{ fontSize: 32, color: '#facc15' }} />
                    </Box>
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>Create New Password</Typography>
                    <Typography variant="body2" sx={{ color: 'gray' }}>Your new password must be different</Typography>
                  </Box>

                  <form onSubmit={handleResetSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#d1d5db', mb: 1 }}>New Password</Typography>
                        <TextField
                          fullWidth
                          placeholder="Enter new password"
                          type={showNewPassword ? 'text' : 'password'}
                          value={formData.newPassword}
                          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                          error={!!errors.newPassword}
                          helperText={errors.newPassword}
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
                                  <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end" sx={{ color: 'gray', '&:hover': { color: '#facc15' } }}>
                                    {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
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
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#d1d5db', mb: 1 }}>Confirm Password</Typography>
                        <TextField
                          fullWidth
                          placeholder="Confirm new password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          error={!!errors.confirmPassword}
                          helperText={errors.confirmPassword}
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
                                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" sx={{ color: 'gray', '&:hover': { color: '#facc15' } }}>
                                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
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
                      </Box>
                      
                      <Paper sx={{ p: 2, bgcolor: 'rgba(250, 204, 21, 0.05)', border: '1px solid rgba(250, 204, 21, 0.2)', borderRadius: '0.75rem' }}>
                        <Typography variant="subtitle2" sx={{ color: '#facc15', mb: 1 }}>Requirements:</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {[
                            { label: '8+ characters', met: formData.newPassword.length >= 8 },
                            { label: 'Upper & Lower case', met: /(?=.*[a-z])(?=.*[A-Z])/.test(formData.newPassword) },
                            { label: 'One number', met: /(?=.*\d)/.test(formData.newPassword) }
                          ].map((req, i) => (
                            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: req.met ? '#10b981' : 'gray' }} />
                              <Typography variant="caption" sx={{ color: req.met ? 'white' : 'gray' }}>{req.label}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </Paper>

                      <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        disabled={isLoading}
                        sx={{ py: 1.5, bgcolor: '#facc15', color: 'black', '&:hover': { bgcolor: '#eab308', transform: 'scale(1.05)' }, transition: 'all 0.3s', boxShadow: '0 10px 15px -3px rgba(250, 204, 21, 0.3)' }}
                      >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                      </Button>
                    </Box>
                  </form>
                </Box>
              )}

              {/* Step 4: Success Screen */}
              {step === 'success' && (
                <Box className="animate-fadeIn text-center">
                  <Box 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      bgcolor: 'rgba(250, 204, 21, 0.1)', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      mx: 'auto', 
                      mb: 3,
                      border: '2px solid #facc15',
                      animation: 'bounce 2s infinite'
                    }}
                  >
                    <CheckCircle2Icon sx={{ fontSize: 48, color: '#facc15' }} />
                  </Box>
                  <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>Password Reset!</Typography>
                  <Typography sx={{ color: 'gray', fontSize: '1.125rem', mb: 1 }}>
                    Your password has been reset successfully
                  </Typography>
                  <Typography sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                    Redirecting you to login...
                  </Typography>
                  <Box sx={{ mt: 3, display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Box sx={{ width: 8, height: 8, bgcolor: '#facc15', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></Box>
                    <Box sx={{ width: 8, height: 8, bgcolor: '#facc15', borderRadius: '50%', animation: 'pulse 1.5s infinite', animationDelay: '0.2s' }}></Box>
                    <Box sx={{ width: 8, height: 8, bgcolor: '#facc15', borderRadius: '50%', animation: 'pulse 1.5s infinite', animationDelay: '0.4s' }}></Box>
                  </Box>
                </Box>
              )}
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