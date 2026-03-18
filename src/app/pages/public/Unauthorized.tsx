import { useNavigate, Link } from "react-router";

// MUI Components
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack
} from '@mui/material';

// MUI Icons
import {
  ShieldOutlined as ShieldAlertIcon,
  ArrowBack as ArrowLeftIcon,
  Home as HomeIcon
} from '@mui/icons-material';

const Unauthorized = () => {
    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 via-transparent to-red-600/10 animate-gradient"></div>
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-400/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-red-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

            <Box sx={{ position: 'relative', zIndex: 10, maxWidth: '448px', width: '100%' }}>
                <Paper 
                    sx={{ 
                        bgcolor: 'rgba(17, 24, 39, 0.8)', 
                        backdropFilter: 'blur(16px)', 
                        border: '2px solid rgba(239, 68, 68, 0.3)', 
                        borderRadius: '1.5rem', 
                        p: 5, 
                        textAlign: 'center',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        animation: 'slideUp 0.5s ease-out'
                    }}
                >
                    {/* Icon */}
                    <Box 
                        sx={{ 
                            width: 80, 
                            height: 80, 
                            bgcolor: 'rgba(239, 68, 68, 0.1)', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            mx: 'auto', 
                            mb: 3,
                            border: '2px solid #ef4444',
                            animation: 'pulse 2s infinite'
                        }}
                    >
                        <ShieldAlertIcon sx={{ fontSize: 40, color: '#ef4444' }} />
                    </Box>

                    {/* Title */}
                    <Typography variant="h3" sx={{ color: '#ef4444', fontWeight: 'bold', mb: 2 }}>Access Denied</Typography>

                    {/* Message */}
                    <Typography variant="h6" sx={{ color: '#d1d5db', mb: 1 }}>Unauthorized Access</Typography>
                    <Typography variant="body2" sx={{ color: '#9ca3af', mb: 4 }}>
                        You do not have permission to access this page. Please contact an administrator if you believe this is an error.
                    </Typography>

                    {/* Buttons */}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={goBack}
                            startIcon={<ArrowLeftIcon />}
                            sx={{ 
                                color: 'white', 
                                borderColor: 'rgba(239, 68, 68, 0.2)',
                                py: 1.5,
                                borderRadius: '0.75rem',
                                '&:hover': { borderColor: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.05)' }
                            }}
                        >
                            Go Back
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            component={Link}
                            to="/"
                            startIcon={<HomeIcon />}
                            sx={{ 
                                bgcolor: '#ef4444', 
                                color: 'white',
                                py: 1.5,
                                borderRadius: '0.75rem',
                                '&:hover': { bgcolor: '#dc2626' }
                            }}
                        >
                            Go Home
                        </Button>
                    </Stack>
                </Paper>

                {/* Help Text */}
                <Typography variant="body2" sx={{ textAlign: 'center', color: 'gray', mt: 3 }}>
                    Need help? <Link to="/login" style={{ color: '#ef4444', textDecoration: 'none' }}>Contact Support</Link>
                </Typography>
            </Box>
        </div>
    )
}

export default Unauthorized;