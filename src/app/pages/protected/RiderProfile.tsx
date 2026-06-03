import { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  CircularProgress
} from '@mui/material';
import {
  Person as UserIcon,
  Email as MailIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
  Security as SecurityIcon,
  Notifications as BellIcon,
  ChevronRight as ChevronRightIcon,
  DirectionsBike as BikeIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import useAuth from '../../hooks/useAuth';
import Navbar from '../../components/layout/Navbar';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import authService from '../../../api/authService';
import userService from '../../../api/userService';

export default function RiderProfile() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  // Deletion states
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deletePhrase, setDeletePhrase] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteCountdown, setDeleteCountdown] = useState(3);

  const userId = auth?.user?.id || (auth?.user as any)?.userId;
  const isGuest = userId === 'guest';

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
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 4 }}>Rider Profile</Typography>
            
            <Grid container spacing={4}>
              {/* Profile Card */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <Avatar 
                    src={auth?.user?.profilePictureUrl}
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      bgcolor: '#10b981', 
                      color: 'white', 
                      mx: 'auto', 
                      mb: 2,
                      fontSize: '2.5rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {!auth?.user?.profilePictureUrl && (auth?.user?.username?.charAt(0).toUpperCase() || auth?.user?.email?.charAt(0).toUpperCase() || <UserIcon fontSize="large" />)}
                  </Avatar>
                  <Typography variant="h6" sx={{ color: 'white', mb: 0.5 }}>
                    {auth?.user?.username || auth?.user?.email?.split('@')[0] || 'Rider'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#10b981', mb: 3 }}>
                    Active Rider
                  </Typography>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    startIcon={<EditIcon />}
                    sx={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)', borderRadius: '0.75rem' }}
                  >
                    Edit Profile
                  </Button>
                </Paper>

                {/* Danger Zone (only for non-guest users) */}
                {!isGuest && (
                  <Paper 
                    sx={{ 
                      p: 3, 
                      mt: 4,
                      bgcolor: 'rgba(239, 68, 68, 0.02)', 
                      borderRadius: '1.5rem', 
                      border: '1px solid rgba(239, 68, 68, 0.2)' 
                    }}
                  >
                    <Typography variant="h6" sx={{ color: '#ef4444', fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      Danger Zone
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'gray', mb: 2 }}>
                      Permanently delete your NearU profile and all associated ride records and history.
                    </Typography>
                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      onClick={() => {
                        setOpenDeleteModal(true);
                        setDeleteCountdown(3);
                      }}
                      sx={{ 
                        borderRadius: '0.75rem', 
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

              {/* Settings List */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Paper sx={{ bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
                  <List disablePadding>
                    <ListItem sx={{ py: 2, px: 3 }}>
                      <ListItemIcon><MailIcon sx={{ color: '#10b981' }} /></ListItemIcon>
                      <ListItemText 
                        primary={<Typography sx={{ color: 'white' }}>Email Address</Typography>} 
                        secondary={<Typography variant="body2" sx={{ color: 'gray' }}>{auth?.user?.email || 'Not available'}</Typography>} 
                      />
                    </ListItem>
                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />

                    <ListItem sx={{ py: 2, px: 3, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}>
                      <ListItemIcon><BikeIcon sx={{ color: '#10b981' }} /></ListItemIcon>
                      <ListItemText 
                        primary={<Typography sx={{ color: 'white' }}>Vehicle Details</Typography>} 
                        secondary={<Typography variant="body2" sx={{ color: 'gray' }}>Manage your vehicle & documents</Typography>} 
                      />
                      <ChevronRightIcon sx={{ color: 'gray' }} />
                    </ListItem>
                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />

                    <ListItem sx={{ py: 2, px: 3, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}>
                      <ListItemIcon><HistoryIcon sx={{ color: '#10b981' }} /></ListItemIcon>
                      <ListItemText 
                        primary={<Typography sx={{ color: 'white' }}>Ride History</Typography>} 
                        secondary={<Typography variant="body2" sx={{ color: 'gray' }}>View your completed deliveries</Typography>} 
                      />
                      <ChevronRightIcon sx={{ color: 'gray' }} />
                    </ListItem>
                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />
                    
                    <ListItem sx={{ py: 2, px: 3, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}>
                      <ListItemIcon><SecurityIcon sx={{ color: '#10b981' }} /></ListItemIcon>
                      <ListItemText 
                        primary={<Typography sx={{ color: 'white' }}>Security</Typography>} 
                        secondary={<Typography variant="body2" sx={{ color: 'gray' }}>Password & Security settings</Typography>} 
                      />
                      <ChevronRightIcon sx={{ color: 'gray' }} />
                    </ListItem>
                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />

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
                  bgcolor: 'rgba(30, 30, 30, 0.95)',
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
                <DialogContentText sx={{ color: 'white', mb: 3 }}>
                  This action is <strong>irreversible</strong>. It will permanently purge all personal information, vehicle details, completed ride histories, and ratings from NearU.
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
                    InputProps={{ sx: { borderRadius: '0.75rem', color: 'white' } }}
                    InputLabelProps={{ sx: { color: 'gray' } }}
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
                    InputProps={{ sx: { borderRadius: '0.75rem', color: 'white' } }}
                    InputLabelProps={{ sx: { color: 'gray' } }}
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
                  sx={{ borderRadius: '2rem', textTransform: 'none', px: 3, fontWeight: 'bold', color: 'white', borderColor: 'rgba(255, 255, 255, 0.2)' }}
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