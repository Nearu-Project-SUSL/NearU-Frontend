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
  Divider
} from '@mui/material';

// MUI Icons
import {
  Lock as LockIcon,
  Visibility as EyeIcon,
  VisibilityOff as EyeOffIcon,
  Key as KeyRoundIcon,
  CheckCircle as CheckCircle2Icon,
  ArrowBack as ArrowLeftIcon
} from '@mui/icons-material';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    currentPassword: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {
      currentPassword: !formData.currentPassword ? 'Current password is required' : '',
      newPassword: validatePassword(formData.newPassword),
      confirmPassword: formData.newPassword !== formData.confirmPassword 
        ? 'Passwords do not match' 
        : '',
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    }, 1000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
        <Paper 
          sx={{ 
            bgcolor: 'rgba(17, 24, 39, 0.8)', 
            backdropFilter: 'blur(16px)', 
            border: '2px solid #facc15', 
            borderRadius: '1.5rem', 
            p: 5, 
            maxWidth: '400px', 
            width: '100%', 
            textAlign: 'center',
            boxShadow: '0 20px 25px -5px rgba(250, 204, 21, 0.2)',
            animation: 'slideIn 0.5s ease-out'
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
          <Typography variant="h4" sx={{ color: '#facc15', fontWeight: 'bold', mb: 1 }}>Success!</Typography>
          <Typography sx={{ color: '#d1d5db', fontSize: '1.125rem' }}>
            Your password has been reset successfully
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Box sx={{ width: 8, height: 8, bgcolor: '#facc15', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></Box>
            <Box sx={{ width: 8, height: 8, bgcolor: '#facc15', borderRadius: '50%', animation: 'pulse 1.5s infinite', animationDelay: '0.1s' }}></Box>
            <Box sx={{ width: 8, height: 8, bgcolor: '#facc15', borderRadius: '50%', animation: 'pulse 1.5s infinite', animationDelay: '0.2s' }}></Box>
          </Box>
        </Paper>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <Button
          component={Link}
          to="/profile"
          startIcon={<ArrowLeftIcon />}
          sx={{ color: '#facc15', mb: 3, '&:hover': { bgcolor: 'transparent', transform: 'translateX(-4px)' }, transition: 'all 0.3s' }}
        >
          Back to Profile
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
            animation: 'slideIn 0.5s ease-out'
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ width: 64, height: 64, bgcolor: 'rgba(250, 204, 21, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, border: '1px solid rgba(250, 204, 21, 0.3)' }}>
              <KeyRoundIcon sx={{ fontSize: 32, color: '#facc15' }} />
            </Box>
            <Typography variant="h5" sx={{ color: '#facc15', fontWeight: 'bold', mb: 1 }}>Reset Password</Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af' }}>Create a new secure password</Typography>
          </Box>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Current Password */}
              <TextField
                fullWidth
                label="Current Password"
                type={showCurrentPassword ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                error={!!errors.currentPassword}
                helperText={errors.currentPassword}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#facc15', opacity: 0.7 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowCurrentPassword(!showCurrentPassword)} edge="end" sx={{ color: 'gray' }}>
                          {showCurrentPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }
                }}
              />

              {/* New Password */}
              <TextField
                fullWidth
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
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

              {/* Confirm Password */}
              <TextField
                fullWidth
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
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

              {/* Password Requirements */}
              <Paper sx={{ p: 2, bgcolor: 'rgba(250, 204, 21, 0.05)', border: '1px solid rgba(250, 204, 21, 0.2)' }}>
                <Typography variant="subtitle2" sx={{ color: '#facc15', mb: 1 }}>Requirements:</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 4, height: 4, bgcolor: '#facc15', borderRadius: '50%' }} />
                    <Typography variant="caption" sx={{ color: 'gray' }}>At least 8 characters long</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 4, height: 4, bgcolor: '#facc15', borderRadius: '50%' }} />
                    <Typography variant="caption" sx={{ color: 'gray' }}>Contains uppercase and lowercase letters</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 4, height: 4, bgcolor: '#facc15', borderRadius: '50%' }} />
                    <Typography variant="caption" sx={{ color: 'gray' }}>Contains at least one number</Typography>
                  </Box>
                </Box>
              </Paper>

              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{ py: 1.5, bgcolor: '#facc15', color: 'black', '&:hover': { bgcolor: '#eab308', transform: 'scale(1.02)' }, transition: 'all 0.3s' }}
              >
                Reset Password
              </Button>
            </Box>
          </form>
        </Paper>
      </div>
    </div>
  );
}