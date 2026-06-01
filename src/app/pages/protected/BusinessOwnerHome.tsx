import { useState, useEffect } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { Sidebar } from '../../components/layout/Sidebar';
import { Container, Typography, Box, Paper, Grid, Button, CircularProgress } from '@mui/material';
import { Store as StoreIcon, HourglassEmpty as PendingIcon } from '@mui/icons-material';
import useAuth from '../../hooks/useAuth';
import Navbar from '../../components/layout/Navbar';
import businessService, { BusinessStatus } from '../../../api/businessService';
import BusinessProfileSetupModal from '../../components/businessapplication/BusinessProfileSet';
import { useNavigate } from 'react-router';

export default function BusinessOwnerHome() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [status, setStatus]           = useState<BusinessStatus | null>(null);
  const [hasShop, setHasShop]         = useState(false);
  const [loading, setLoading]         = useState(true);
  const [modalOpen, setModalOpen]     = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        // 1. Check application status
        const appStatus = await businessService.getStatus();
        setStatus(appStatus);

        if (appStatus.status !== 'Approved') {
          setLoading(false);
          return; // don't check shop if not approved
        }

        // 2. If approved, check if shop profile already exists
        try {
          await businessService.getMyFoodShop();
          setHasShop(true); // shop exists
        } catch {
          // No shop yet — auto open modal
          setHasShop(false);
          setModalOpen(true);
        }
      } catch {
        // No application found at all
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // Redirect to correct page based on business type after shop created
  const handleProfileCompleted = () => {
    setModalOpen(false);
    setHasShop(true);
    if (status?.businessType === 'Food') navigate('/business/food');
    else if (status?.businessType === 'Accommodation') navigate('/business/accommodation');
    else if (status?.businessType === 'CustomGifts') navigate('/business/gifts');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
        <CircularProgress sx={{ color: '#2E9EBF' }} />
      </Box>
    );
  }

  // ── Pending state ────────────────────────────────────────────────────────────
  if (status?.status === 'Pending') {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Sidebar activeSection="business" />
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <PageLayout>
            <Container maxWidth="sm" sx={{ mt: 8 }}>
              <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '1.5rem' }}>
                <PendingIcon sx={{ fontSize: 72, color: '#f59e0b', mb: 2 }} />
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                  Application Under Review
                </Typography>
                <Typography sx={{ color: 'gray', mb: 2 }}>
                  Your application for <strong style={{ color: 'white' }}>{status.businessName}</strong> is being reviewed.
                  You'll get full access once an admin approves it.
                </Typography>
                <Typography variant="caption" sx={{ color: '#f59e0b' }}>
                  Submitted: {new Date(status.submittedAt).toLocaleDateString()}
                </Typography>
              </Paper>
            </Container>
          </PageLayout>
        </Box>
      </Box>
    );
  }

  // ── Rejected state ───────────────────────────────────────────────────────────
  if (status?.status === 'Rejected') {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Sidebar activeSection="business" />
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <PageLayout>
            <Container maxWidth="sm" sx={{ mt: 8 }}>
              <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '1.5rem' }}>
                <Typography variant="h5" sx={{ color: '#ef4444', fontWeight: 700, mb: 1 }}>
                  Application Rejected
                </Typography>
                <Typography sx={{ color: 'gray' }}>
                  Unfortunately your application was not approved. Please contact support for more information.
                </Typography>
              </Paper>
            </Container>
          </PageLayout>
        </Box>
      </Box>
    );
  }

  // ── Approved — main dashboard ────────────────────────────────────────────────
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar activeSection="business" />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <PageLayout>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{
              p: { xs: 3, md: 5 },
              bgcolor: 'rgba(46,158,191,0.05)',
              border: '1px solid rgba(46,158,191,0.2)',
              borderRadius: '1.5rem',
              backdropFilter: 'blur(10px)'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="h4" sx={{ color: '#2E9EBF', fontWeight: 'bold', mb: 1 }}>
                    Welcome, {status?.businessName || auth?.user?.email}!
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#9ca3af' }}>
                    {status?.businessType} Business Dashboard
                  </Typography>
                </Box>

                {/* Add Your Business button — only if shop not yet created */}
                {!hasShop && (
                  <Button
                    variant="outlined"
                    startIcon={<StoreIcon />}
                    onClick={() => setModalOpen(true)}
                    sx={{
                      color: '#2E9EBF',
                      borderColor: 'rgba(46,158,191,0.3)',
                      borderRadius: '0.75rem',
                      fontWeight: 700,
                      '&:hover': { borderColor: '#2E9EBF', bgcolor: 'rgba(46,158,191,0.08)' }
                    }}
                  >
                    Add Your Business Profile
                  </Button>
                )}
              </Box>

              
            </Paper>
          </Container>
        </PageLayout>
      </Box>

      {/* Profile Setup Modal */}
      <BusinessProfileSetupModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCompleted={handleProfileCompleted}
      />
    </Box>
  );
}