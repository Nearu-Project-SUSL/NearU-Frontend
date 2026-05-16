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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (auth?.user?.userId) {
          const data = await userService.getUserProfile(auth.user.userId);
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
        }
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [auth]);

  const handleLogout = async () => {
    try {
      if (auth.refreshToken) {
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
    if (!auth?.user?.userId) return;
    setSaving(true);
    try {
      const updatedProfile = await userService.updateUserProfile(auth.user.userId, editForm);
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
    const file = event.target.files?.[0];
    if (!file || !auth?.user?.userId) return;

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
      const response = await userService.uploadProfilePicture(auth.user.userId, file);
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

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar activeSection="profile" />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <PageLayout>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 4 }}>My Profile</Typography>

            <Grid container spacing={4}>
              {/* Profile Card */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper', borderRadius: '1.5rem', border: `1px solid ${accentAlpha(0.12)}` }}>
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <Avatar
                      src={profile?.profilePictureUrl}
                      sx={{
                        width: 120,
                        height: 120,
                        bgcolor: accent,
                        color: '#111111',
                        mx: 'auto',
                        mb: 2,
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        border: `4px solid ${theme.palette.background.paper}`,
                        boxShadow: `0 4px 12px ${accentAlpha(0.2)}`
                      }}
                    >
                      {!profile?.profilePictureUrl && (profile?.username?.charAt(0).toUpperCase() || <UserIcon fontSize="large" />)}
                    </Avatar>
                    
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
                        bottom: 16, 
                        right: -4, 
                        bgcolor: 'background.paper',
                        boxShadow: 2,
                        '&:hover': { bgcolor: 'background.paper' }
                      }}
                    >
                      <PhotoCameraIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="h6" sx={{ color: 'text.primary', mb: 0.5, fontWeight: 'bold' }}>
                    {profile?.username || 'User'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    {profile?.role || 'Student'}
                  </Typography>
                  
                  {!isEditing ? (
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => setIsEditing(true)}
                      startIcon={<EditIcon />}
                      sx={{ color: accent, borderColor: accentAlpha(0.35), borderRadius: '0.75rem', '&:hover': { bgcolor: accentAlpha(0.08) } }}
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
                        startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                        sx={{ borderRadius: '0.75rem', bgcolor: accent, '&:hover': { bgcolor: accentAlpha(0.8) } }}
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
                        sx={{ borderRadius: '0.75rem' }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                </Paper>

                {/* Settings List moved below Profile Card on Desktop */}
                <Paper sx={{ mt: 4, bgcolor: 'background.paper', borderRadius: '1.5rem', border: `1px solid ${accentAlpha(0.1)}`, overflow: 'hidden' }}>
                  <List disablePadding>
                    {/* Theme Toggle */}
                    <ListItem sx={{ py: 2, px: 3 }}>
                      <ListItemIcon>
                        <ThemeIcon sx={{ color: accent }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography sx={{ color: 'text.primary' }}>Appearance</Typography>}
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
                    <Divider sx={{ borderColor: accentAlpha(0.08) }} />

                    {/* My Jobs */}
                    <ListItem
                      onClick={() => navigate('/my-jobs')}
                      sx={{ py: 2, px: 3, cursor: 'pointer', '&:hover': { bgcolor: accentAlpha(0.04) } }}
                    >
                      <ListItemIcon><WorkIcon sx={{ color: accent }} /></ListItemIcon>
                      <ListItemText
                        primary={<Typography sx={{ color: 'text.primary' }}>My Posted Jobs</Typography>}
                      />
                    </ListItem>
                    <Divider sx={{ borderColor: accentAlpha(0.08) }} />

                    {/* Logout */}
                    <ListItem
                      onClick={handleLogout}
                      sx={{ py: 2, px: 3, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.05)' } }}
                    >
                      <ListItemIcon><LogoutIcon sx={{ color: '#ef4444' }} /></ListItemIcon>
                      <ListItemText
                        primary={<Typography sx={{ color: '#ef4444', fontWeight: 600 }}>Log Out</Typography>}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>

              {/* Profile Details */}
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 4, bgcolor: 'background.paper', borderRadius: '1.5rem', border: `1px solid ${accentAlpha(0.1)}` }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Personal Information</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Username / Name"
                        name="username"
                        value={isEditing ? editForm.username : profile?.username || ''}
                        onChange={handleEditChange}
                        disabled={!isEditing}
                        variant={isEditing ? "outlined" : "filled"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        value={profile?.email || ''}
                        disabled
                        variant="filled"
                        helperText="Email cannot be changed"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Mobile Number"
                        name="mobileNumber"
                        value={isEditing ? editForm.mobileNumber : profile?.mobileNumber || ''}
                        onChange={handleEditChange}
                        disabled={!isEditing}
                        variant={isEditing ? "outlined" : "filled"}
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
                        disabled={!isEditing}
                        variant={isEditing ? "outlined" : "filled"}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Academic Details</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Student ID"
                        value={profile?.studentId || ''}
                        disabled
                        variant="filled"
                        helperText="Student ID cannot be changed"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Faculty"
                        name="faculty"
                        value={isEditing ? editForm.faculty : profile?.faculty || ''}
                        onChange={handleEditChange}
                        disabled={!isEditing}
                        variant={isEditing ? "outlined" : "filled"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Year"
                        name="year"
                        value={isEditing ? editForm.year : profile?.year || ''}
                        onChange={handleEditChange}
                        disabled={!isEditing}
                        variant={isEditing ? "outlined" : "filled"}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Location</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="City"
                        name="city"
                        value={isEditing ? editForm.city : profile?.city || ''}
                        onChange={handleEditChange}
                        disabled={!isEditing}
                        variant={isEditing ? "outlined" : "filled"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={isEditing ? editForm.address : profile?.address || ''}
                        onChange={handleEditChange}
                        disabled={!isEditing}
                        variant={isEditing ? "outlined" : "filled"}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </PageLayout>
      </Box>
    </Box>
  );
}