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
  useTheme,
} from '@mui/material';
import {
  Person as UserIcon,
  Email as MailIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
  Security as SecurityIcon,
  Notifications as BellIcon,
  ChevronRight as ChevronRightIcon,
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
import { useNearUTheme } from '../../context/ThemeContext';

export default function Profile() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useNearUTheme();
  const theme = useTheme();
  const accent = theme.palette.primary.main;
  const accentAlpha = (a: number) => `rgba(61, 103, 138, ${a})`;

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

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar activeSection="profile" />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <PageLayout>
          <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 4 }}>My Profile</Typography>

            <Grid container spacing={4}>
              {/* Profile Card */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper', borderRadius: '1.5rem', border: `1px solid ${accentAlpha(0.12)}` }}>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: accent,
                      color: '#111111',
                      mx: 'auto',
                      mb: 2,
                      fontSize: '2.5rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {auth?.user?.email?.charAt(0).toUpperCase() || <UserIcon fontSize="large" />}
                  </Avatar>
                  <Typography variant="h6" sx={{ color: 'text.primary', mb: 0.5 }}>
                    {auth?.user?.email?.split('@')[0] || 'User'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                    {auth?.user?.roles?.[0] || 'Student'}
                  </Typography>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<EditIcon />}
                    sx={{ color: accent, borderColor: accentAlpha(0.35), borderRadius: '0.75rem', '&:hover': { bgcolor: accentAlpha(0.08) } }}
                  >
                    Edit Profile
                  </Button>
                </Paper>
              </Grid>

              {/* Settings List */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Paper sx={{ bgcolor: 'background.paper', borderRadius: '1.5rem', border: `1px solid ${accentAlpha(0.1)}`, overflow: 'hidden' }}>
                  <List disablePadding>
                    {/* Email */}
                    <ListItem sx={{ py: 2, px: 3 }}>
                      <ListItemIcon><MailIcon sx={{ color: accent }} /></ListItemIcon>
                      <ListItemText
                        primary={<Typography sx={{ color: 'text.primary' }}>Email Address</Typography>}
                        secondary={<Typography variant="body2" sx={{ color: 'text.secondary' }}>{auth?.user?.email || 'Not available'}</Typography>}
                      />
                    </ListItem>
                    <Divider sx={{ borderColor: accentAlpha(0.08) }} />

                    {/* Theme Toggle */}
                    <ListItem sx={{ py: 2, px: 3 }}>
                      <ListItemIcon>
                        <ThemeIcon sx={{ color: accent }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography sx={{ color: 'text.primary' }}>Appearance</Typography>}
                        secondary={
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {isDark ? 'Dark mode active' : 'Light mode active'}
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

                    {/* Security */}
                    <ListItem sx={{ py: 2, px: 3, cursor: 'pointer', '&:hover': { bgcolor: accentAlpha(0.04) } }}>
                      <ListItemIcon><SecurityIcon sx={{ color: accent }} /></ListItemIcon>
                      <ListItemText
                        primary={<Typography sx={{ color: 'text.primary' }}>Security</Typography>}
                        secondary={<Typography variant="body2" sx={{ color: 'text.secondary' }}>Password, 2FA, Login activity</Typography>}
                      />
                      <ChevronRightIcon sx={{ color: 'text.secondary' }} />
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
                        secondary={<Typography variant="body2" sx={{ color: 'text.secondary' }}>Manage jobs you have created</Typography>}
                      />
                      <ChevronRightIcon sx={{ color: 'text.secondary' }} />
                    </ListItem>
                    <Divider sx={{ borderColor: accentAlpha(0.08) }} />

                    {/* Notifications */}
                    <ListItem sx={{ py: 2, px: 3, cursor: 'pointer', '&:hover': { bgcolor: accentAlpha(0.04) } }}>
                      <ListItemIcon><BellIcon sx={{ color: accent }} /></ListItemIcon>
                      <ListItemText
                        primary={<Typography sx={{ color: 'text.primary' }}>Notifications</Typography>}
                        secondary={<Typography variant="body2" sx={{ color: 'text.secondary' }}>Push, Email, SMS alerts</Typography>}
                      />
                      <ChevronRightIcon sx={{ color: 'text.secondary' }} />
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
                        secondary={<Typography variant="body2" sx={{ color: 'rgba(239, 68, 68, 0.5)' }}>Sign out of your account</Typography>}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </PageLayout>
      </Box>
    </Box>
  );
}