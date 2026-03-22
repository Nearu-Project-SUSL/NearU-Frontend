import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import authService from '../../../api/authService';
import useAuth from '../../hooks/useAuth';

// MUI Components
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Divider,
  Paper,
  CircularProgress
} from '@mui/material';

// MUI Icons
import {
  Person as UserIcon,
  Email as MailIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
  Map as MapIcon,
  Business as BuildingIcon,
  Description as FileTextIcon,
  Work as BriefcaseIcon,
  DirectionsBike as BikeIcon,
  CreditCard as CreditCardIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowRightIcon,
  Visibility as EyeIcon,
  VisibilityOff as EyeOffIcon,
  School as GraduationCapIcon,
  Store as StoreIcon
} from '@mui/icons-material';

type UserType = 'student' | 'business' | 'rider';
type StudentStep = 0 | 1 | 2; // MUI Stepper uses 0-based index

export default function Register() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [userType, setUserType] = useState<UserType>('student');
  const [activeStep, setActiveStep] = useState<StudentStep>(0);

  // Student form state
  const [studentForm, setStudentForm] = useState({
    // Step 1: Basic Info
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Step 2: Personal Details
    studentId: '',
    faculty: '',
    year: '',
    phone: '',
    // Step 3: Additional Info
    address: '',
    city: '',
    dateOfBirth: '',
    emergencyContact: ''
  });

  // Business form state
  const [businessForm, setBusinessForm] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    businessType: 'Food Vendor',
    address: '',
    description: '',
    registrationNumber: '',
    taxId: ''
  });

  // Rider form state
  const [riderForm, setRiderForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    vehicleType: 'Tuk Tuk',
    vehicleNumber: '',
    licenseNumber: '',
    address: '',
    emergencyContact: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const faculties = ['Computing', 'Engineering', 'Management', 'Social Sciences', 'Applied Sciences'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const businessTypes = ['Food Vendor', 'Accommodation', 'Transport', 'Retail Shop', 'Services'];
  const vehicleTypes = ['Tuk Tuk', 'Motorcycle', 'Bicycle', 'Car'];

  const steps = ['Basic Info', 'Personal Details', 'Additional Info'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) as StudentStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep - 1) as StudentStep);
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (studentForm.password !== studentForm.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    
    setIsLoading(true);
    try {
      await authService.registerStudent(studentForm);
      const loginResponse = await authService.login({ email: studentForm.email, password: studentForm.password });
      
      setAuth({
        user: loginResponse.user,
        accessToken: loginResponse.accessToken,
        refreshToken: loginResponse.refreshToken,
      });
      localStorage.setItem('accessToken', loginResponse.accessToken);
      
      toast.success('Registration and login successful!');
      navigate('/home');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (businessForm.password !== businessForm.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    
    setIsLoading(true);
    try {
      await authService.registerBusiness(businessForm);
      const loginResponse = await authService.login({ email: businessForm.email, password: businessForm.password });
      
      setAuth({
        user: loginResponse.user,
        accessToken: loginResponse.accessToken,
        refreshToken: loginResponse.refreshToken,
      });
      localStorage.setItem('accessToken', loginResponse.accessToken);
      
      toast.success('Registration and login successful!');
      navigate('/business-owner-home');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRiderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (riderForm.password !== riderForm.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    
    setIsLoading(true);
    try {
      await authService.registerRider(riderForm);
      const loginResponse = await authService.login({ email: riderForm.email, password: riderForm.password });
      
      setAuth({
        user: loginResponse.user,
        accessToken: loginResponse.accessToken,
        refreshToken: loginResponse.refreshToken,
      });
      localStorage.setItem('accessToken', loginResponse.accessToken);
      
      toast.success('Registration and login successful!');
      navigate('/rider-home');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed.';
      toast.error(errorMessage);
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
          <span className="text-gray-400 text-sm">Already have an account?</span>
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
          {/* Left Side - Illustration & Info */}
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
                    <UserIcon sx={{ fontSize: 24, color: '#facc15' }} />
                  </div>
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center border border-yellow-400/40 animate-float" style={{ animationDelay: '1s' }}>
                    <BikeIcon sx={{ fontSize: 24, color: '#facc15' }} />
                  </div>
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center border border-yellow-400/40 animate-float" style={{ animationDelay: '2s' }}>
                    <StoreIcon sx={{ fontSize: 24, color: '#facc15' }} />
                  </div>
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center border border-yellow-400/40 animate-float" style={{ animationDelay: '3s' }}>
                    <BuildingIcon sx={{ fontSize: 24, color: '#facc15' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="text-center space-y-4 max-w-md">
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}>
                Join the NearU<br />
                <span className="text-yellow-400">Community Today.</span>
              </Typography>
              <Typography variant="body1" sx={{ color: 'gray', fontSize: '1.125rem' }}>
                Connect with campus services, discover local businesses, and find part-time opportunities at Sabaragamuwa University.
              </Typography>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="w-full max-w-md mx-auto animate-slideUp">
            <div className="bg-gradient-to-br from-yellow-400/5 to-black/50 backdrop-blur-xl rounded-3xl border-2 border-yellow-400/20 p-8 lg:p-10 shadow-2xl shadow-yellow-400/10 hover:border-yellow-400/30 transition-all duration-500">
              {/* Header */}
              <div className="text-center mb-6">
                <Typography variant="h4" sx={{ color: 'white', mb: 1 }}>Create Account</Typography>
                <Typography variant="body2" sx={{ color: 'gray' }}>Join the Sabaragamuwa University community</Typography>
              </div>

              {/* User Type Selector */}
              <Grid container spacing={2} sx={{ mb: 4 }}>
                {[
                  { type: 'student', icon: UserIcon, label: 'Student' },
                  { type: 'business', icon: BuildingIcon, label: 'Business' },
                  { type: 'rider', icon: BikeIcon, label: 'Rider' }
                ].map((item) => (
                  <Grid item xs={4} key={item.type}>
                    <Button
                      fullWidth
                      onClick={() => setUserType(item.type as UserType)}
                      sx={{
                        flexDirection: 'column',
                        py: 2,
                        borderRadius: '0.75rem',
                        border: '2px solid',
                        borderColor: userType === item.type ? '#facc15' : 'rgba(250, 204, 21, 0.2)',
                        bgcolor: userType === item.type ? 'rgba(250, 204, 21, 0.1)' : 'rgba(0,0,0,0.4)',
                        color: 'white',
                        '&:hover': {
                          borderColor: userType === item.type ? '#facc15' : 'rgba(250, 204, 21, 0.4)',
                          bgcolor: userType === item.type ? 'rgba(250, 204, 21, 0.15)' : 'rgba(0,0,0,0.6)',
                        },
                      }}
                    >
                      <Box sx={{ 
                        bgcolor: userType === item.type ? '#facc15' : 'rgba(156, 163, 175, 0.2)',
                        p: 1, 
                        borderRadius: '0.5rem',
                        mb: 1,
                        display: 'flex',
                        transition: 'all 0.3s'
                      }}>
                        <item.icon sx={{ color: userType === item.type ? 'black' : 'white' }} />
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>{item.label}</Typography>
                    </Button>
                  </Grid>
                ))}
              </Grid>

              {/* Form Content */}
              {userType === 'student' && (
                <Box className="animate-fadeIn">
                  <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4, '& .MuiStepIcon-root.Mui-active': { color: '#facc15' }, '& .MuiStepIcon-root.Mui-completed': { color: '#facc15' } }}>
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel sx={{ '& .MuiStepLabel-label': { color: 'gray' }, '& .MuiStepLabel-label.Mui-active': { color: 'white' } }}>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>

                  <form onSubmit={handleStudentSubmit}>
                    {activeStep === 0 && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          variant="outlined"
                          required
                          value={studentForm.fullName}
                          onChange={(e) => setStudentForm({...studentForm, fullName: e.target.value})}
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <UserIcon sx={{ color: 'gray' }} />
                                </InputAdornment>
                              ),
                            }
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Email Address"
                          type="email"
                          variant="outlined"
                          required
                          value={studentForm.email}
                          onChange={(e) => setStudentForm({...studentForm, email: e.target.value})}
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <MailIcon sx={{ color: 'gray' }} />
                                </InputAdornment>
                              ),
                            }
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Password"
                          type={showPassword ? "text" : "password"}
                          variant="outlined"
                          required
                          value={studentForm.password}
                          onChange={(e) => setStudentForm({...studentForm, password: e.target.value})}
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LockIcon sx={{ color: 'gray' }} />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'gray' }}>
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Confirm Password"
                          type={showConfirmPassword ? "text" : "password"}
                          variant="outlined"
                          required
                          value={studentForm.confirmPassword}
                          onChange={(e) => setStudentForm({...studentForm, confirmPassword: e.target.value})}
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LockIcon sx={{ color: 'gray' }} />
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
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={handleNext}
                          sx={{ mt: 2, bgcolor: '#facc15', color: 'black', '&:hover': { bgcolor: '#eab308' } }}
                          endIcon={<ChevronRightIcon />}
                        >
                          Next Step
                        </Button>
                      </Box>
                    )}

                    {activeStep === 1 && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="Student ID"
                              required
                              value={studentForm.studentId}
                              onChange={(e) => setStudentForm({...studentForm, studentId: e.target.value})}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="Phone Number"
                              type="tel"
                              required
                              value={studentForm.phone}
                              onChange={(e) => setStudentForm({...studentForm, phone: e.target.value})}
                            />
                          </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <FormControl fullWidth>
                              <InputLabel>Faculty</InputLabel>
                              <Select
                                value={studentForm.faculty}
                                label="Faculty"
                                onChange={(e) => setStudentForm({...studentForm, faculty: e.target.value})}
                                required
                              >
                                {faculties.map(faculty => (
                                  <MenuItem key={faculty} value={faculty}>{faculty}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={6}>
                            <FormControl fullWidth>
                              <InputLabel>Year</InputLabel>
                              <Select
                                value={studentForm.year}
                                label="Year"
                                onChange={(e) => setStudentForm({...studentForm, year: e.target.value})}
                                required
                              >
                                {years.map(year => (
                                  <MenuItem key={year} value={year}>{year}</MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                          <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleBack}
                            startIcon={<ChevronLeftIcon />}
                            sx={{ color: 'white', borderColor: 'rgba(250, 204, 21, 0.2)' }}
                          >
                            Back
                          </Button>
                          <Button
                            fullWidth
                            variant="contained"
                            onClick={handleNext}
                            endIcon={<ChevronRightIcon />}
                            sx={{ bgcolor: '#facc15', color: 'black', '&:hover': { bgcolor: '#eab308' } }}
                          >
                            Next Step
                          </Button>
                        </Box>
                      </Box>
                    )}

                    {activeStep === 2 && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                          fullWidth
                          label="Address"
                          multiline
                          rows={2}
                          required
                          value={studentForm.address}
                          onChange={(e) => setStudentForm({...studentForm, address: e.target.value})}
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <MapIcon sx={{ color: 'gray', mt: -1 }} />
                                </InputAdornment>
                              ),
                            }
                          }}
                        />
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="City"
                              required
                              value={studentForm.city}
                              onChange={(e) => setStudentForm({...studentForm, city: e.target.value})}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="Date of Birth"
                              type="date"
                              required
                              slotProps={{ inputLabel: { shrink: true } }}
                              value={studentForm.dateOfBirth}
                              onChange={(e) => setStudentForm({...studentForm, dateOfBirth: e.target.value})}
                            />
                          </Grid>
                        </Grid>
                        <TextField
                          fullWidth
                          label="Emergency Contact"
                          required
                          value={studentForm.emergencyContact}
                          onChange={(e) => setStudentForm({...studentForm, emergencyContact: e.target.value})}
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PhoneIcon sx={{ color: 'gray' }} />
                                </InputAdornment>
                              ),
                            }
                          }}
                        />
                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                          <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleBack}
                            startIcon={<ChevronLeftIcon />}
                            sx={{ color: 'white', borderColor: 'rgba(250, 204, 21, 0.2)' }}
                          >
                            Back
                          </Button>
                          <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            disabled={isLoading}
                            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                            sx={{ bgcolor: '#10b981', color: 'white', '&:hover': { bgcolor: '#059669' } }}
                          >
                            {isLoading ? 'Processing...' : 'Complete'}
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </form>
                </Box>
              )}

              {/* Business Registration */}
              {userType === 'business' && (
                <Box className="animate-fadeIn">
                  <form onSubmit={handleBusinessSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }} className="custom-scrollbar">
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField fullWidth label="Business Name" required value={businessForm.businessName} onChange={(e) => setBusinessForm({...businessForm, businessName: e.target.value})} />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField fullWidth label="Owner Name" required value={businessForm.ownerName} onChange={(e) => setBusinessForm({...businessForm, ownerName: e.target.value})} />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField fullWidth label="Email" type="email" required value={businessForm.email} onChange={(e) => setBusinessForm({...businessForm, email: e.target.value})} />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField fullWidth label="Phone" type="tel" required value={businessForm.phone} onChange={(e) => setBusinessForm({...businessForm, phone: e.target.value})} />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField fullWidth label="Password" type={showPassword ? "text" : "password"} required value={businessForm.password} onChange={(e) => setBusinessForm({...businessForm, password: e.target.value})} />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField fullWidth label="Confirm" type={showConfirmPassword ? "text" : "password"} required value={businessForm.confirmPassword} onChange={(e) => setBusinessForm({...businessForm, confirmPassword: e.target.value})} />
                      </Grid>
                    </Grid>
                    <FormControl fullWidth>
                      <InputLabel>Business Type</InputLabel>
                      <Select value={businessForm.businessType} label="Business Type" onChange={(e) => setBusinessForm({...businessForm, businessType: e.target.value})} required>
                        {businessTypes.map(type => (
                          <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField fullWidth label="Address" multiline rows={2} required value={businessForm.address} onChange={(e) => setBusinessForm({...businessForm, address: e.target.value})} />
                    <TextField fullWidth label="Description" multiline rows={2} required value={businessForm.description} onChange={(e) => setBusinessForm({...businessForm, description: e.target.value})} />
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField fullWidth label="Registration No." required value={businessForm.registrationNumber} onChange={(e) => setBusinessForm({...businessForm, registrationNumber: e.target.value})} />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField fullWidth label="Tax ID" value={businessForm.taxId} onChange={(e) => setBusinessForm({...businessForm, taxId: e.target.value})} />
                      </Grid>
                    </Grid>
                    <Paper sx={{ p: 2, bgcolor: 'rgba(250, 204, 21, 0.05)', border: '1px solid rgba(250, 204, 21, 0.2)' }}>
                      <Typography variant="caption" sx={{ color: '#facc15' }}>
                        Note: Your application will be reviewed by our admin team.
                      </Typography>
                    </Paper>
                    <Button fullWidth variant="contained" type="submit" disabled={isLoading} endIcon={isLoading ? undefined : <ArrowRightIcon />} startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null} sx={{ mt: 2, bgcolor: '#facc15', color: 'black', '&:hover': { bgcolor: '#eab308' } }}>
                      {isLoading ? 'Processing...' : 'Submit for Review'}
                    </Button>
                  </form>
                </Box>
              )}

              {/* Rider Registration */}
              {userType === 'rider' && (
                <Box className="animate-fadeIn">
                  <form onSubmit={handleRiderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }} className="custom-scrollbar">
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField fullWidth label="Full Name" required value={riderForm.fullName} onChange={(e) => setRiderForm({...riderForm, fullName: e.target.value})} />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField fullWidth label="Phone" type="tel" required value={riderForm.phone} onChange={(e) => setRiderForm({...riderForm, phone: e.target.value})} />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField fullWidth label="Email" type="email" required value={riderForm.email} onChange={(e) => setRiderForm({...riderForm, email: e.target.value})} />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField fullWidth label="Emergency Contact" type="tel" required value={riderForm.emergencyContact} onChange={(e) => setRiderForm({...riderForm, emergencyContact: e.target.value})} />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField fullWidth label="Password" type={showPassword ? "text" : "password"} required value={riderForm.password} onChange={(e) => setRiderForm({...riderForm, password: e.target.value})} />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField fullWidth label="Confirm" type={showConfirmPassword ? "text" : "password"} required value={riderForm.confirmPassword} onChange={(e) => setRiderForm({...riderForm, confirmPassword: e.target.value})} />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <InputLabel>Vehicle Type</InputLabel>
                          <Select value={riderForm.vehicleType} label="Vehicle Type" onChange={(e) => setRiderForm({...riderForm, vehicleType: e.target.value})} required>
                            {vehicleTypes.map(type => (
                              <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <TextField fullWidth label="Vehicle No." required value={riderForm.vehicleNumber} onChange={(e) => setRiderForm({...riderForm, vehicleNumber: e.target.value})} />
                      </Grid>
                    </Grid>
                    <TextField fullWidth label="License No." required value={riderForm.licenseNumber} onChange={(e) => setRiderForm({...riderForm, licenseNumber: e.target.value})} />
                    <TextField fullWidth label="Address" multiline rows={2} required value={riderForm.address} onChange={(e) => setRiderForm({...riderForm, address: e.target.value})} />
                    <Paper sx={{ p: 2, bgcolor: 'rgba(250, 204, 21, 0.05)', border: '1px solid rgba(250, 204, 21, 0.2)' }}>
                      <Typography variant="caption" sx={{ color: '#facc15' }}>
                        Note: Your application will be reviewed by our admin team.
                      </Typography>
                    </Paper>
                    <Button fullWidth variant="contained" type="submit" disabled={isLoading} endIcon={isLoading ? undefined : <ArrowRightIcon />} startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null} sx={{ mt: 2, bgcolor: '#facc15', color: 'black', '&:hover': { bgcolor: '#eab308' } }}>
                      {isLoading ? 'Processing...' : 'Submit for Review'}
                    </Button>
                  </form>
                </Box>
              )}

              {/* Terms */}
              <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: 'gray', mt: 4 }}>
                By Continuing, you agree to NearU's Terms of Service and Privacy Policy.
              </Typography>
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