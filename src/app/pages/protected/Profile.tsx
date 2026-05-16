import { useState, useEffect, useRef } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { Sidebar } from '../../components/layout/Sidebar';
import {
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid,
  Switch,
  TextField,
  CircularProgress,
  IconButton,
  useTheme,
  Fade,
} from '@mui/material';
import {
  Person as UserIcon,
  Email as MailIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  WorkOutline as WorkIcon,
  WbSunny as SunIcon,
  NightlightRound as MoonIcon,
  Palette as ThemeIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import useAuth from '../../hooks/useAuth';
import Navbar from '../../components/layout/Navbar';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import authService from '../../../api/authService';
import userService, { UserProfileResponse, UpdateProfileRequest } from '../../../api/userService';
import { useNearUTheme } from '../../context/ThemeContext';

export default function Profile() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useNearUTheme();
  const theme = useTheme();
  const accent = theme.palette.primary.main;
  const accentAlpha = (a: number) => `rgba(46, 158, 191, ${a})`;

  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [editForm, setEditForm] = useState<UpdateProfileRequest>({
    username: '',
    mobileNumber: '',
    faculty: '',
    year: '',
    address: '',
    city: '',
    dateOfBirth: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Safely extract the user ID
  const userId = auth?.user?.userId || auth?.user?.id;
  const isGuest = userId === 'guest';

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      if (isGuest) {
        // Mock profile for guest
        setProfile({
          userId: 'guest',
          username: auth?.user?.username || 'Guest',
          email: auth?.user?.email || 'guest@nearu.com',
          role: auth?.user?.roles?.[0] || 'Guest',
          studentId: 'N/A',
          faculty: 'N/A',
          year: 'N/A',
          address: 'N/A',
          city: 'N/A',
          dateOfBirth: 'N/A',
          mobileNumber: 'N/A'
        });
        setLoading(false);
        return;
      }

      try {
        const data = await userService.getUserProfile(userId);
        setProfile(data);
        setEditForm({
          username: data.username || '',
          mobileNumber: data.mobileNumber || '',
          faculty: data.faculty || '',
          year: data.year || '',
          address: data.address || '',
          city: data.city || '',
          dateOfBirth: data.dateOfBirth || ''
        });
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [auth, userId, isGuest]);

  const handleLogout = async () => {
    try {
      if (auth.refreshToken && !isGuest) {
        await authService.logout(auth.refreshToken);
      }
    } catch (error) {
      console.error('Logout failed on the backend:', error);
    } finally {
      setAuth({ user: null, accessToken: null, refreshToken: null });
      localStorage.removeItem('accessToken');
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    if (!userId || isGuest) return;
    setSaving(true);
    try {
      const updatedProfile = await userService.updateUserProfile(userId, editForm);
      setProfile(updatedProfile);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isGuest) {
      toast.error('Guests cannot upload profile pictures');
      return;
    }

    const file = event.target.files?.[0];
    if (!file || !userId) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, and WEBP images are allowed');
      return;
    }

    try {
      const toastId = toast.loading('Uploading profile picture...');
      const response = await userService.uploadProfilePicture(userId, file);
      setProfile((prev) => prev ? { ...prev, profilePictureUrl: response.profilePictureUrl } : null);
      toast.success('Profile picture updated', { id: toastId });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload profile picture');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Common glassmorphism styles
  const glassStyles = {
    bgcolor: isDark ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(12px)',
    border: `1px solid ${accentAlpha(0.15)}`,
    borderRadius: '1.5rem',
    boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar activeSection="profile" />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <PageLayout>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            
            <Fade in timeout={800}>
              <Box>
                {/* Guest Banner */}
                {isGuest && (
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 3, 
                      mb: 4, 
                      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
                      border: '1px solid rgba(239, 68, 68, 0.3)', 
                      borderRadius: '1rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      backdropFilter: 'blur(10px)',
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <LockIcon color="error" fontSize="large" />
                      <Box>
                        <Typography variant="h6" color="error" sx={{ fontWeight: 'bold' }}>Guest Account</Typography>
                        <Typography variant="body2" color="error">You are browsing as a guest. Register an account to edit your profile and access all features.</Typography>
                      </Box>
                    </Box>
                    <Button 
                      variant="contained" 
                      color="error" 
                      onClick={handleLogout} 
                      sx={{ borderRadius: '2rem', px: 4, py: 1, fontWeight: 'bold', whiteSpace: 'nowrap' }}
                    >
                      Create Account
                    </Button>
                  </Paper>
                )}

                {/* Hero Header */}
                <Box 
                  sx={{ 
                    height: 220, 
                    borderRadius: '1.5rem', 
                    background: `linear-gradient(135deg, ${accentAlpha(0.6)} 0%, ${accentAlpha(0.1)} 100%)`,
                    position: 'relative',
                    mb: 8,
                    overflow: 'visible',
                    boxShadow: `0 8px 32px ${accentAlpha(0.15)}`
                  }}
                >
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      bottom: { xs: -50, sm: -60 }, 
                      left: { xs: '50%', sm: 40 },
                      transform: { xs: 'translateX(-50%)', sm: 'none' },
                      display: 'inline-block',
                      zIndex: 10
                    }}
                  >
                    <Avatar
                      src={profile?.profilePictureUrl}
                      sx={{
                        width: { xs: 120, sm: 140 },
                        height: { xs: 120, sm: 140 },
                        bgcolor: accent,
                        color: '#fff',
                        fontSize: '3.5rem',
                        fontWeight: 'bold',
                        border: `6px solid ${theme.palette.background.default}`,
                        boxShadow: `0 8px 24px ${accentAlpha(0.3)}`,
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    >
                      {!profile?.profilePictureUrl && (profile?.username?.charAt(0).toUpperCase() || <UserIcon fontSize="large" />)}
                    </Avatar>
                    
                    {!isGuest && (
                      <>
                        <input 
                          type="file" 
                          hidden 
                          ref={fileInputRef} 
                          accept="image/jpeg, image/png, image/webp" 
                          onChange={handleFileChange} 
                        />
                        <IconButton 
                          color="primary" 
                          aria-label="upload picture" 
                          component="span"
                          onClick={() => fileInputRef.current?.click()}
                          sx={{ 
                            position: 'absolute', 
                            bottom: 8, 
                            right: 0, 
                            bgcolor: 'background.paper',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            transition: 'all 0.2s',
                            '&:hover': { bgcolor: 'background.paper', transform: 'scale(1.1)' }
                          }}
                        >
                          <PhotoCameraIcon />
                        </IconButton>
                      </>
                    )}
                  </Box>
                </Box>

                <Grid container spacing={4}>
                  {/* Left Column: Quick Info & Settings */}
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ ...glassStyles, p: 4, textAlign: 'center', mb: 4 }}>
                      <Typography variant="h5" sx={{ color: 'text.primary', mb: 1, fontWeight: 800 }}>
                        {profile?.username || 'User'}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ color: accent, fontWeight: 600, mb: 3 }}>
                        {profile?.role || 'Student'}
                      </Typography>
                      
                      {!isGuest && (
                        !isEditing ? (
                          <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => setIsEditing(true)}
                            startIcon={<EditIcon />}
                            sx={{ color: accent, borderColor: accentAlpha(0.35), borderRadius: '0.75rem', py: 1.5, fontWeight: 'bold', '&:hover': { bgcolor: accentAlpha(0.08) } }}
                          >
                            Edit Profile
                          </Button>
                        ) : (
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                              variant="contained"
                              fullWidth
                              disabled={saving}
                              onClick={handleSaveProfile}
                              startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                              sx={{ borderRadius: '0.75rem', py: 1.5, fontWeight: 'bold', bgcolor: accent, '&:hover': { bgcolor: accentAlpha(0.8) } }}
                            >
                              Save
                            </Button>
                            <Button
                              variant="outlined"
                              fullWidth
                              disabled={saving}
                              onClick={() => {
                                setIsEditing(false);
                                setEditForm({
                                  username: profile?.username || '',
                                  mobileNumber: profile?.mobileNumber || '',
                                  faculty: profile?.faculty || '',
                                  year: profile?.year || '',
                                  address: profile?.address || '',
                                  city: profile?.city || '',
                                  dateOfBirth: profile?.dateOfBirth || ''
                                });
                              }}
                              startIcon={<CancelIcon />}
                              color="error"
                              sx={{ borderRadius: '0.75rem', py: 1.5, fontWeight: 'bold' }}
                            >
                              Cancel
                            </Button>
                          </Box>
                        )
                      )}
                    </Paper>

                    {/* Settings List */}
                    <Paper sx={{ ...glassStyles, overflow: 'hidden' }}>
                      <List disablePadding>
                        <ListItem sx={{ py: 2.5, px: 3 }}>
                          <ListItemIcon><ThemeIcon sx={{ color: accent }} /></ListItemIcon>
                          <ListItemText
                            primary={<Typography sx={{ color: 'text.primary', fontWeight: 600 }}>Appearance</Typography>}
                            secondary={
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {isDark ? 'Dark mode' : 'Light mode'}
                              </Typography>
                            }
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MoonIcon sx={{ fontSize: 18, color: isDark ? accent : 'text.disabled' }} />
                            <Switch
                              checked={!isDark}
                              onChange={toggleTheme}
                              id="profile-theme-toggle"
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': { color: accent },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: accent },
                              }}
                            />
                            <SunIcon sx={{ fontSize: 18, color: !isDark ? accent : 'text.disabled' }} />
                          </Box>
                        </ListItem>
                        <Divider sx={{ borderColor: accentAlpha(0.1) }} />

                        {!isGuest && (
                          <>
                            <ListItem
                              onClick={() => navigate('/my-jobs')}
                              sx={{ py: 2.5, px: 3, cursor: 'pointer', transition: 'all 0.2s', '&:hover': { bgcolor: accentAlpha(0.04), paddingLeft: 4 } }}
                            >
                              <ListItemIcon><WorkIcon sx={{ color: accent }} /></ListItemIcon>
                              <ListItemText
                                primary={<Typography sx={{ color: 'text.primary', fontWeight: 600 }}>My Posted Jobs</Typography>}
                              />
                            </ListItem>
                            <Divider sx={{ borderColor: accentAlpha(0.1) }} />
                          </>
                        )}

                        <ListItem
                          onClick={handleLogout}
                          sx={{ py: 2.5, px: 3, cursor: 'pointer', transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.05)', paddingLeft: 4 } }}
                        >
                          <ListItemIcon><LogoutIcon sx={{ color: '#ef4444' }} /></ListItemIcon>
                          <ListItemText
                            primary={<Typography sx={{ color: '#ef4444', fontWeight: 600 }}>{isGuest ? 'Exit Guest Mode' : 'Log Out'}</Typography>}
                          />
                        </ListItem>
                      </List>
                    </Paper>
                  </Grid>

                  {/* Right Column: Profile Details Form */}
                  <Grid item xs={12} md={8}>
                    <Paper sx={{ ...glassStyles, p: 4 }}>
                      <Typography variant="h6" sx={{ mb: 3, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <UserIcon sx={{ color: accent }} /> Personal Information
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Username / Name"
                            name="username"
                            value={isEditing ? editForm.username : profile?.username || ''}
                            onChange={handleEditChange}
                            disabled={!isEditing || isGuest}
                            variant={isEditing ? "outlined" : "filled"}
                            InputProps={{ sx: { borderRadius: '0.75rem', transition: 'all 0.2s' } }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Email Address"
                            value={profile?.email || ''}
                            disabled
                            variant="filled"
                            InputProps={{ sx: { borderRadius: '0.75rem' } }}
                            helperText={!isGuest ? "Email cannot be changed" : ""}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Mobile Number"
                            name="mobileNumber"
                            value={isEditing ? editForm.mobileNumber : profile?.mobileNumber || ''}
                            onChange={handleEditChange}
                            disabled={!isEditing || isGuest}
                            variant={isEditing ? "outlined" : "filled"}
                            InputProps={{ sx: { borderRadius: '0.75rem' } }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Date of Birth"
                            name="dateOfBirth"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={isEditing ? editForm.dateOfBirth : profile?.dateOfBirth || ''}
                            onChange={handleEditChange}
                            disabled={!isEditing || isGuest}
                            variant={isEditing ? "outlined" : "filled"}
                            InputProps={{ sx: { borderRadius: '0.75rem' } }}
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <Divider sx={{ my: 3, borderColor: accentAlpha(0.1) }} />
                          <Typography variant="h6" sx={{ mb: 3, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <WorkIcon sx={{ color: accent }} /> Academic Details
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Student ID"
                            value={profile?.studentId || ''}
                            disabled
                            variant="filled"
                            InputProps={{ sx: { borderRadius: '0.75rem' } }}
                            helperText={!isGuest ? "Student ID cannot be changed" : ""}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Faculty"
                            name="faculty"
                            value={isEditing ? editForm.faculty : profile?.faculty || ''}
                            onChange={handleEditChange}
                            disabled={!isEditing || isGuest}
                            variant={isEditing ? "outlined" : "filled"}
                            InputProps={{ sx: { borderRadius: '0.75rem' } }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Year"
                            name="year"
                            value={isEditing ? editForm.year : profile?.year || ''}
                            onChange={handleEditChange}
                            disabled={!isEditing || isGuest}
                            variant={isEditing ? "outlined" : "filled"}
                            InputProps={{ sx: { borderRadius: '0.75rem' } }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Divider sx={{ my: 3, borderColor: accentAlpha(0.1) }} />
                          <Typography variant="h6" sx={{ mb: 3, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MailIcon sx={{ color: accent }} /> Location
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="City"
                            name="city"
                            value={isEditing ? editForm.city : profile?.city || ''}
                            onChange={handleEditChange}
                            disabled={!isEditing || isGuest}
                            variant={isEditing ? "outlined" : "filled"}
                            InputProps={{ sx: { borderRadius: '0.75rem' } }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Address"
                            name="address"
                            value={isEditing ? editForm.address : profile?.address || ''}
                            onChange={handleEditChange}
                            disabled={!isEditing || isGuest}
                            variant={isEditing ? "outlined" : "filled"}
                            InputProps={{ sx: { borderRadius: '0.75rem' } }}
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </Fade>
          </Container>
        </PageLayout>
      </Box>
    </Box>
  );
}