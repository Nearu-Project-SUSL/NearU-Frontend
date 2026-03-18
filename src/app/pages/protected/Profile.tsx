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
  Grid
} from '@mui/material';
import {
  Person as UserIcon,
  Email as MailIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
  Security as SecurityIcon,
  Notifications as BellIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import useAuth from '../../hooks/useAuth';
import Navbar from '../../components/layout/Navbar';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function Profile() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({ user: null, accessToken: null });
    localStorage.removeItem('accessToken');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar activeSection="profile" />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <PageLayout>
          <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 4 }}>My Profile</Typography>
            
            <Grid container spacing={4}>
              {/* Profile Card */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <Avatar 
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      bgcolor: '#facc15', 
                      color: 'black', 
                      mx: 'auto', 
                      mb: 2,
                      fontSize: '2.5rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {auth?.user?.email?.charAt(0).toUpperCase() || <UserIcon fontSize="large" />}
                  </Avatar>
                  <Typography variant="h6" sx={{ color: 'white', mb: 0.5 }}>
                    {auth?.user?.email?.split('@')[0] || 'User'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'gray', mb: 3 }}>
                    {auth?.user?.roles?.[0] || 'Student'}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    startIcon={<EditIcon />}
                    sx={{ color: '#facc15', borderColor: 'rgba(250, 204, 21, 0.3)', borderRadius: '0.75rem' }}
                  >
                    Edit Profile
                  </Button>
                </Paper>
              </Grid>

              {/* Settings List */}
              <Grid item xs={12} md={8}>
                <Paper sx={{ bgcolor: 'rgba(255, 255, 255, 0.03)', borderRadius: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
                  <List disablePadding>
                    <ListItem sx={{ py: 2, px: 3 }}>
                      <ListItemIcon><MailIcon sx={{ color: '#facc15' }} /></ListItemIcon>
                      <ListItemText 
                        primary={<Typography sx={{ color: 'white' }}>Email Address</Typography>} 
                        secondary={<Typography variant="body2" sx={{ color: 'gray' }}>{auth?.user?.email || 'Not available'}</Typography>} 
                      />
                    </ListItem>
                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />
                    
                    <ListItem sx={{ py: 2, px: 3, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}>
                      <ListItemIcon><SecurityIcon sx={{ color: '#facc15' }} /></ListItemIcon>
                      <ListItemText 
                        primary={<Typography sx={{ color: 'white' }}>Security</Typography>} 
                        secondary={<Typography variant="body2" sx={{ color: 'gray' }}>Password, 2FA, Login activity</Typography>} 
                      />
                      <ChevronRightIcon sx={{ color: 'gray' }} />
                    </ListItem>
                    <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />

                    <ListItem sx={{ py: 2, px: 3, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}>
                      <ListItemIcon><BellIcon sx={{ color: '#facc15' }} /></ListItemIcon>
                      <ListItemText 
                        primary={<Typography sx={{ color: 'white' }}>Notifications</Typography>} 
                        secondary={<Typography variant="body2" sx={{ color: 'gray' }}>Push, Email, SMS alerts</Typography>} 
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
          </Container>
        </PageLayout>
      </Box>
    </Box>
  );
}