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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
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

  // Account deletion states
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deletePhrase, setDeletePhrase] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteCountdown, setDeleteCountdown] = useState(3);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Safely extract the user ID — derive stable primitives to avoid re-render loops
  const userId = (auth?.user as any)?.userId || auth?.user?.id;
  const isGuest = userId === 'guest';

  // Capture auth snapshot for guest profile construction (avoids putting `auth` in deps)
  const authUserRef = useRef(auth?.user);
  useEffect(() => {
    authUserRef.current = auth?.user;
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      if (isGuest) {
        // Build guest mock profile from the ref snapshot (not from `auth` dep)
        const u = authUserRef.current;
        setProfile({
          userId: 'guest',
          username: u?.username || 'Guest',
          email: u?.email || 'guest@nearu.com',
          role: u?.roles?.[0] || 'Guest',
          studentId: 'N/A',
          faculty: 'N/A',
          year: 'N/A',
          address: 'N/A',
          city: 'N/A',
          dateOfBirth: 'N/A',
          mobileNumber: 'N/A',
          isActive: 1,
          createdDate: new Date().toISOString()
        });
        setLoading(false);
        return;
      }

      try {
        const data = await userService.getUserProfile(userId);
        setProfile(data);

        // Snapshot current auth user for fallback — safe because we read from ref
        const u = authUserRef.current;
        setEditForm({
          username: data.username || (data as any).Username || u?.username || '',
          mobileNumber: data.mobileNumber || '',
          faculty: data.faculty || '',
          year: data.year || '',
          address: data.address || '',
          city: data.city || '',
          dateOfBirth: data.dateOfBirth || ''
        });

        // Sync to global auth context only if values actually changed
        const latestUsername = data.username || (data as any).Username || u?.username || '';
        const latestProfilePictureUrl =
          data.profilePictureUrl ||
          (data as any).ProfilePictureUrl ||
          (data as any).profilePicture ||
          (data as any).ProfilePicture;

        if (latestProfilePictureUrl || latestUsername) {
          setAuth((prev) => {
            if (!prev.user) return prev;
            const hasPictureChanged = !!(latestProfilePictureUrl && prev.user.profilePictureUrl !== latestProfilePictureUrl);
            const hasUsernameChanged = !!(latestUsername && prev.user.username !== latestUsername);

            if (!hasPictureChanged && !hasUsernameChanged) return prev;

            return {
              ...prev,
              user: {
                ...prev.user,
                ...(hasPictureChanged ? { profilePictureUrl: latestProfilePictureUrl } : {}),
                ...(hasUsernameChanged ? { username: latestUsername } : {})
              }
            };
          });
        }
      } catch (error: any) {
        // Only show toast for non-auth errors; the axios interceptor handles 401/403 centrally
        const status = error?.response?.status;
        if (status === 404) {
          toast.error('Profile not found. Please contact support.');
        } else if (status !== 401 && status !== 403) {
          toast.error('Failed to load profile. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    // IMPORTANT: Do NOT add `auth` to this dep array — it causes an infinite loop
    // because setAuth() is called inside this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, isGuest]);

  // Handle account deletion countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (openDeleteModal && deleteCountdown > 0) {
      timer = setTimeout(() => setDeleteCountdown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [openDeleteModal, deleteCountdown]);

  const handleDeleteAccount = async () => {
    if (isGuest) return;
    if (deletePhrase !== 'DELETE') {
      toast.error('Please type the phrase "DELETE" exactly to confirm.');
      return;
    }
    if (!deletePassword) {
      toast.error('Password is required.');
      return;
    }

    setDeletingAccount(true);
    try {
      await userService.deleteUserAccount(userId, deletePassword);
      toast.success('Your account has been permanently deleted.');
      
      // Perform clean logout & redirection
      setAuth({ user: null, accessToken: null, refreshToken: null });
      localStorage.removeItem('accessToken');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete account. Please check your password.');
    } finally {
      setDeletingAccount(false);
    }
  };

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

      // Update global auth state to keep username and profile picture in sync
      if (updatedProfile.username) {
        setAuth((prev) => {
          if (!prev.user) return prev;
          return {
            ...prev,
            user: {
              ...prev.user,
              username: updatedProfile.username,
              profilePictureUrl: updatedProfile.profilePictureUrl ?? prev.user.profilePictureUrl
            }
          };
        });
      }

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
      const latestPicUrl =
        response.profilePictureUrl ||
        (response as any).ProfilePictureUrl ||
        (response as any).profilePicture ||
        (response as any).ProfilePicture;
      setProfile((prev) => prev ? { ...prev, profilePictureUrl: latestPicUrl } : null);

      // Update global auth state to propagate changes to Navbar/Sidebar immediately
      if (latestPicUrl) {
        setAuth((prev) => {
          if (!prev.user) return prev;
          return {
            ...prev,
            user: {
              ...prev.user,
              profilePictureUrl: latestPicUrl
            }
          };
        });
      }

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
                    boxShadow: `0 8px 32px ${accentAlpha(0.15)}`
                  }}
                />

                {/* Profile Header Info */}
                <Box 
                  sx={{ 
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'center', sm: 'flex-end' },
                    px: { xs: 2, sm: 6 },
                    mt: { xs: -10, sm: -8 },
                    mb: 5,
                    gap: { xs: 2, sm: 4 },
                    position: 'relative',
                    zIndex: 10
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      src={profile?.profilePictureUrl || (profile as any)?.ProfilePictureUrl || (profile as any)?.profilePicture || (profile as any)?.ProfilePicture}
                      sx={{
                        width: { xs: 120, sm: 150 },
                        height: { xs: 120, sm: 150 },
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
                      {!(profile?.profilePictureUrl || (profile as any)?.ProfilePictureUrl || (profile as any)?.profilePicture || (profile as any)?.ProfilePicture) && ((profile?.username || (profile as any)?.Username || auth?.user?.username || 'U').charAt(0).toUpperCase() || <UserIcon fontSize="large" />)}
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
                            right: 8, 
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

                  <Box sx={{ pb: { sm: 2 }, textAlign: { xs: 'center', sm: 'left' }, flexGrow: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
                      {profile?.username || (profile as any)?.Username || auth?.user?.username || 'User'}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                      {profile?.role || auth?.user?.roles?.[0] || 'Student'}
                    </Typography>
                  </Box>

                  <Box sx={{ pb: { sm: 2 } }}>
                    {!isGuest && (
                      !isEditing ? (
                        <Button
                          variant="outlined"
                          onClick={() => setIsEditing(true)}
                          startIcon={<EditIcon />}
                          sx={{ color: accent, borderColor: accentAlpha(0.35), borderRadius: '2rem', py: 1, px: 3, fontWeight: 'bold', '&:hover': { bgcolor: accentAlpha(0.08) }, minWidth: 160 }}
                        >
                          Edit Profile
                        </Button>
                      ) : (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Button
                            variant="contained"
                            disabled={saving}
                            onClick={handleSaveProfile}
                            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                            sx={{ borderRadius: '2rem', py: 1, px: 3, fontWeight: 'bold', bgcolor: accent, '&:hover': { bgcolor: accentAlpha(0.8) } }}
                          >
                            Save
                          </Button>
                          <Button
                            variant="outlined"
                            disabled={saving}
                            onClick={() => {
                              setIsEditing(false);
                              setEditForm({
                                username: profile?.username || (profile as any)?.Username || auth?.user?.username || '',
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
                            sx={{ borderRadius: '2rem', py: 1, px: 3, fontWeight: 'bold' }}
                          >
                            Cancel
                          </Button>
                        </Box>
                      )
                    )}
                  </Box>
                </Box>

                <Grid container spacing={4}>
                  {/* Left Column: Settings */}
                  <Grid size={{ xs: 12, md: 4 }}>
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

                            <ListItem
                              onClick={() => navigate('/reset-password')}
                              sx={{ py: 2.5, px: 3, cursor: 'pointer', transition: 'all 0.2s', '&:hover': { bgcolor: accentAlpha(0.04), paddingLeft: 4 } }}
                            >
                              <ListItemIcon><LockIcon sx={{ color: accent }} /></ListItemIcon>
                              <ListItemText
                                primary={<Typography sx={{ color: 'text.primary', fontWeight: 600 }}>Change Password</Typography>}
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

                    {/* Danger Zone (only for non-guest users) */}
                    {!isGuest && (
                      <Paper 
                        sx={{ 
                          ...glassStyles, 
                          mt: 4, 
                          p: 3, 
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          background: isDark ? 'rgba(239, 68, 68, 0.03)' : 'rgba(239, 68, 68, 0.015)'
                        }}
                      >
                        <Typography variant="h6" sx={{ color: '#ef4444', fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                          Danger Zone
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5 }}>
                          Permanently delete your NearU profile and all associated ride records, posted jobs, and history.
                        </Typography>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            setOpenDeleteModal(true);
                            setDeleteCountdown(3);
                          }}
                          sx={{ 
                            borderRadius: '2rem', 
                            fontWeight: 'bold', 
                            textTransform: 'none',
                            borderColor: 'rgba(239, 68, 68, 0.4)',
                            '&:hover': {
                              bgcolor: 'rgba(239, 68, 68, 0.08)',
                              borderColor: '#ef4444'
                            }
                          }}
                        >
                          Delete Account
                        </Button>
                      </Paper>
                    )}
                  </Grid>

                  {/* Right Column: Profile Details Form */}
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ ...glassStyles, p: 4 }}>
                      <Typography variant="h6" sx={{ mb: 3, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <UserIcon sx={{ color: accent }} /> Personal Information
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            label="Username / Name"
                            name="username"
                            value={isEditing ? editForm.username : profile?.username || (profile as any)?.Username || auth?.user?.username || ''}
                            onChange={handleEditChange}
                            disabled={!isEditing || isGuest}
                            variant={isEditing ? "outlined" : "filled"}
                            InputProps={{ sx: { borderRadius: '0.75rem', transition: 'all 0.2s' } }}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
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
                        <Grid size={{ xs: 12, sm: 6 }}>
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
                        <Grid size={{ xs: 12, sm: 6 }}>
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
                        
                        <Grid size={{ xs: 12 }}>
                          <Divider sx={{ my: 3, borderColor: accentAlpha(0.1) }} />
                          <Typography variant="h6" sx={{ mb: 3, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <WorkIcon sx={{ color: accent }} /> Academic Details
                          </Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
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
                        <Grid size={{ xs: 12, sm: 6 }}>
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
                        <Grid size={{ xs: 12, sm: 6 }}>
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

                        <Grid size={{ xs: 12 }}>
                          <Divider sx={{ my: 3, borderColor: accentAlpha(0.1) }} />
                          <Typography variant="h6" sx={{ mb: 3, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MailIcon sx={{ color: accent }} /> Location
                          </Typography>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
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
                        <Grid size={{ xs: 12, sm: 6 }}>
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

            {/* Account Deletion Confirmation Dialog */}
            <Dialog
              open={openDeleteModal}
              onClose={() => {
                if (!deletingAccount) {
                  setOpenDeleteModal(false);
                  setDeletePhrase('');
                  setDeletePassword('');
                }
              }}
              PaperProps={{
                sx: {
                  bgcolor: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '1.5rem',
                  p: 2,
                }
              }}
            >
              <DialogTitle sx={{ fontWeight: 800, color: '#ef4444', pb: 1 }}>
                Delete Your NearU Account?
              </DialogTitle>
              
              <DialogContent>
                <DialogContentText sx={{ color: 'text.primary', mb: 3 }}>
                  This action is <strong>irreversible</strong>. It will permanently purge all personal information, your posted jobs, active lists, and ride records from NearU.
                </DialogContentText>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  {/* Phrase Input */}
                  <TextField
                    fullWidth
                    size="small"
                    label='Type "DELETE" to confirm'
                    value={deletePhrase}
                    onChange={(e) => setDeletePhrase(e.target.value)}
                    disabled={deletingAccount}
                    error={deletePhrase.length > 0 && deletePhrase !== 'DELETE'}
                    helperText={deletePhrase.length > 0 && deletePhrase !== 'DELETE' ? 'Phrase must match exactly' : ''}
                    InputProps={{ sx: { borderRadius: '0.75rem' } }}
                  />
                  
                  {/* Password verification */}
                  <TextField
                    fullWidth
                    size="small"
                    type="password"
                    label="Enter your password to verify identity"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    disabled={deletingAccount}
                    InputProps={{ sx: { borderRadius: '0.75rem' } }}
                  />
                </Box>
              </DialogContent>
              
              <DialogActions sx={{ px: 3, pb: 2, gap: 1.5 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => {
                    setOpenDeleteModal(false);
                    setDeletePhrase('');
                    setDeletePassword('');
                  }}
                  disabled={deletingAccount}
                  sx={{ borderRadius: '2rem', textTransform: 'none', px: 3, fontWeight: 'bold' }}
                >
                  Cancel
                </Button>
                
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDeleteAccount}
                  disabled={
                    deletingAccount || 
                    deletePhrase !== 'DELETE' || 
                    !deletePassword || 
                    deleteCountdown > 0
                  }
                  sx={{ 
                    borderRadius: '2rem', 
                    textTransform: 'none', 
                    px: 3.5, 
                    fontWeight: 'bold',
                    bgcolor: '#ef4444',
                    '&:hover': { bgcolor: '#dc2626' }
                  }}
                >
                  {deletingAccount ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : deleteCountdown > 0 ? (
                    `Confirm (${deleteCountdown}s)`
                  ) : (
                    'Delete Permanently'
                  )}
                </Button>
              </DialogActions>
            </Dialog>
          </Container>
        </PageLayout>
      </Box>
    </Box>
  );
}