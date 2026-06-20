import { PageLayout } from '../../components/layout/PageLayout';
import { Sidebar } from '../../components/layout/Sidebar';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import Navbar from '../../components/layout/Navbar';

export default function BusinessOwnerHome() {
  const { auth } = useAuth();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar activeSection="business" />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <PageLayout>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper 
              sx={{ 
                p: { xs: 3, md: 5 }, 
                display: 'flex', 
                flexDirection: 'column',
                bgcolor: 'rgba(59, 130, 246, 0.05)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '1.5rem',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Typography variant="h3" sx={{ color: '#3b82f6', fontWeight: 'bold', mb: 2 }}>
                Welcome, {auth?.user?.username || 'Owner'}!
              </Typography>
              <Typography variant="h6" sx={{ color: '#9ca3af', mb: 4 }}>
                You are logged in as a Business Owner.
              </Typography>
            
            </Paper>
          </Container>
        </PageLayout>
      </Box>
    </Box>
  );
}