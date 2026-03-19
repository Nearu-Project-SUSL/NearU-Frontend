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
  Divider,
  Grid
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
  Shield as ShieldCheckIcon
} from '@mui/icons-material';

type Step = 'email' | 'verify' | 'reset' | 'success';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
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

    // Simulate sending email
    setTimeout(() => {
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

    // Simulate verification
    setTimeout(() => {
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

    // Simulate API call
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    }, 1000);
  };

  // Success Screen
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-yellow-600/10 animate-gradient"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-yellow-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

        <Paper 
          sx={{ 
            position: 'relative', 
            zIndex: 10, 
            bgcolor: 'rgba(17, 24, 39, 0.8)', 
            backdropFilter: 'blur(16px)', 
            border: '2px solid #facc15', 
            borderRadius: '1.5rem', 
            p: 5, 
            maxWidth: '400px', 
            width: '100%', 
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(250, 204, 21, 0.2)',
            animation: 'slideUp 0.5s ease-out'
          }}
        >
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
          <Typography variant="h4" sx={{ color: '#facc15', fontWeight: 'bold', mb: 1 }}>Password Reset!</Typography>
          <Typography sx={{ color: '#d1d5db', fontSize: '1.125rem', mb: 1 }}>
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
        </Paper>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-yellow-600/10 animate-gradient"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-yellow-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

      <Box sx={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '448px' }}>
        {/* Back Button */}
        <Button
          component={Link}
          to="/login"
          startIcon={<ArrowLeftIcon />}
          sx={{ color: '#facc15', mb: 3, '&:hover': { bgcolor: 'transparent', transform: 'translateX(-4px)' }, transition: 'all 0.3s' }}
        >
          Back to Login
        </Button>

        {/* Main Card */}
        <Paper 
          sx={{ 
            bgcolor: 'rgba(17, 24, 39, 0.8)', 
            backdropFilter: 'blur(16px)', 
            border: '2px solid rgba(250, 204, 21, 0.2)', 
            borderRadius: '1.5rem', 
            p: 4, 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            animation: 'slideUp 0.5s ease-out'
          }}
        >
          {/* Progress Indicator */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 4 }}>
            <Box sx={{ height: 4, width: step === 'email' ? 32 : 12, borderRadius: 2, bgcolor: step === 'email' ? '#facc15' : 'rgba(250, 204, 21, 0.2)', transition: 'all 0.3s' }} />
            <Box sx={{ height: 4, width: step === 'verify' ? 32 : 12, borderRadius: 2, bgcolor: step === 'verify' ? '#facc15' : 'rgba(250, 204, 21, 0.2)', transition: 'all 0.3s' }} />
            <Box sx={{ height: 4, width: step === 'reset' ? 32 : 12, borderRadius: 2, bgcolor: step === 'reset' ? '#facc15' : 'rgba(250, 204, 21, 0.2)', transition: 'all 0.3s' }} />
          </Box>

          {/* Step 1: Email Input */}
          {step === 'email' && (
            <Box className="animate-fadeIn">
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box sx={{ width: 64, height: 64, bgcolor: 'rgba(250, 204, 21, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, border: '1px solid rgba(250, 204, 21, 0.3)' }}>
                  <MailIcon sx={{ fontSize: 32, color: '#facc15' }} />
                </Box>
                <Typography variant="h5" sx={{ color: '#facc15', fontWeight: 'bold', mb: 1 }}>Forgot Password?</Typography>
                <Typography variant="body2" sx={{ color: '#9ca3af' }}>Enter your email and we'll send you a reset code</Typography>
              </Box>

              <form onSubmit={handleEmailSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    placeholder="student@sab.lk"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: '' }); }}
                    error={!!errors.email}
                    helperText={errors.email}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <MailIcon sx={{ color: '#facc15', opacity: 0.7 }} />
                          </InputAdornment>
                        ),
                      }
                    }}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    startIcon={<SendIcon />}
                    sx={{ py: 1.5, bgcolor: '#facc15', color: 'black', '&:hover': { bgcolor: '#eab308' } }}
                  >
                    Send Reset Code
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
                <Typography variant="h5" sx={{ color: '#facc15', fontWeight: 'bold', mb: 1 }}>Check Your Email</Typography>
                <Typography variant="body2" sx={{ color: '#9ca3af' }}>We've sent a 6-digit code to</Typography>
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
                        slotProps={{
                          input: {
                            sx: { 
                              width: '48px', 
                              height: '56px', 
                              '& input': { textAlign: 'center', px: 0, fontSize: '1.25rem', fontWeight: 'bold' }
                            }
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
                    sx={{ py: 1.5, bgcolor: '#facc15', color: 'black', '&:hover': { bgcolor: '#eab308' } }}
                  >
                    Verify Code
                  </Button>
                  <Button
                    onClick={() => setStep('email')}
                    sx={{ color: '#9ca3af', textTransform: 'none', '&:hover': { color: '#facc15' } }}
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
                <Typography variant="h5" sx={{ color: '#facc15', fontWeight: 'bold', mb: 1 }}>Create New Password</Typography>
                <Typography variant="body2" sx={{ color: '#9ca3af' }}>Your new password must be different</Typography>
              </Box>

              <form onSubmit={handleResetSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    fullWidth
                    label="New Password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    error={!!errors.newPassword}
                    helperText={errors.newPassword}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: '#facc15', opacity: 0.7 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end" sx={{ color: 'gray' }}>
                              {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: '#facc15', opacity: 0.7 }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" sx={{ color: 'gray' }}>
                              {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }
                    }}
                  />
                  
                  <Paper sx={{ p: 2, bgcolor: 'rgba(250, 204, 21, 0.05)', border: '1px solid rgba(250, 204, 21, 0.2)' }}>
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
                    sx={{ py: 1.5, bgcolor: '#facc15', color: 'black', '&:hover': { bgcolor: '#eab308' } }}
                  >
                    Reset Password
                  </Button>
                </Box>
              </form>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Help Text */}
      <Typography variant="body2" sx={{ position: 'relative', zIndex: 10, textAlign: 'center', color: 'gray', mt: 3 }}>
        Need help? <Link to="/login" style={{ color: '#facc15', textDecoration: 'none' }}>Contact Support</Link>
      </Typography>
    </div>
  );
}