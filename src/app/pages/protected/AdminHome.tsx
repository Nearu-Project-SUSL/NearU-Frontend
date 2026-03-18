import { PageLayout } from '../../components/layout/PageLayout';
import { Sidebar } from '../../components/layout/Sidebar';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import Navbar from '../../components/layout/Navbar';

export default function AdminHome() {
  const { auth } = useAuth();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar activeSection="home" />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <PageLayout>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper 
              sx={{ 
                p: { xs: 3, md: 5 }, 
                display: 'flex', 
                flexDirection: 'column',
                bgcolor: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '1.5rem',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Typography variant="h3" sx={{ color: '#ef4444', fontWeight: 'bold', mb: 2 }}>
                Welcome Admin, {auth?.user?.email || 'User'}!
              </Typography>
              <Typography variant="h6" sx={{ color: '#9ca3af', mb: 4 }}>
                You have full system access.
              </Typography>
              
              <Grid container spacing={3}>
                {[
                  { title: 'Users', count: '1,240', color: '#ef4444' },
                  { title: 'Business Apps', count: '12 Pending', color: '#facc15' },
                  { title: 'System Health', count: '99.9%', color: '#34d399' }
                ].map((stat, i) => (
                  <Grid item xs={12} sm={4} key={i}>
                    <Paper 
                      sx={{ 
                        p: 3, 
                        textAlign: 'center', 
                        bgcolor: 'rgba(255, 255, 255, 0.03)', 
                        borderRadius: '1rem',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'transform 0.3s',
                        '&:hover': { transform: 'translateY(-5px)', borderColor: stat.color }
                      }}
                    >
                      <Typography variant="h4" sx={{ color: 'white', mb: 1 }}>{stat.count}</Typography>
                      <Typography variant="body2" sx={{ color: 'gray' }}>{stat.title}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Container>
        </PageLayout>
      </Box>
    </Box>
  );
}