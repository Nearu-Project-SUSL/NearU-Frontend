import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { PageLayout } from '../../components/layout/PageLayout';
import { Sidebar } from '../../components/layout/Sidebar';
import { Container, Typography, Box, Paper, Grid, Button } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import Navbar from '../../components/layout/Navbar';
import DealFormDialog from '../../components/deal/DealFormDialog';
import { useCreateDeal } from '../../hooks/useDeals';

export default function BusinessOwnerHome() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(false);
  const createDealMutation = useCreateDeal();

  const handleSubmitDeal = async (formData: FormData) => {
    try {
      await createDealMutation.mutateAsync(formData);
      toast.success('Deal submitted! Admin will review it shortly.');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message || 'Failed to submit deal');
      throw err;
    }
  };

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
                bgcolor: 'rgba(59, 130, 246, 0.05)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '1.5rem',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Typography variant="h3" sx={{ color: '#3b82f6', fontWeight: 'bold', mb: 2 }}>
                Welcome, {auth?.user?.email || 'Owner'}!
              </Typography>
              <Typography variant="h6" sx={{ color: '#9ca3af', mb: 3 }}>
                You are logged in as a Business Owner.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={() => setFormOpen(true)}
                  sx={{ fontWeight: 700, borderRadius: '12px', bgcolor: '#3b82f6', color: '#fff' }}
                >
                  Submit Deal / Offer
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/deals')}
                  sx={{ fontWeight: 700, borderRadius: '12px', borderColor: '#3b82f6', color: '#3b82f6' }}
                >
                  View My Deals
                </Button>
              </Box>
              
              <Grid container spacing={3}>
                {[
                  { title: 'Total Sales', count: 'Rs. 45,000', color: '#3b82f6' },
                  { title: 'Active Orders', count: '14', color: '#facc15' },
                  { title: 'Rating', count: '4.8/5.0', color: '#34d399' }
                ].map((stat, i) => (
                  <Grid size={{ xs: 12, sm: 4 }} key={i}>
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

      <DealFormDialog open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmitDeal} />
    </Box>
  );
}