import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PageLayout } from '../../components/layout/PageLayout';
import { Sidebar } from '../../components/layout/Sidebar';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Stack,
  Avatar,
  CardMedia,
  Divider,
  Chip,
  CircularProgress
} from '@mui/material';
import useAuth from '../../hooks/useAuth';
import Navbar from '../../components/layout/Navbar';
import { useQuery } from '@tanstack/react-query';
import businessService from '../../../api/businessService';
import { getMyDeals } from '../../../api/services/dealsApi';
import { getMenuItems } from '../../../api/foodapi';
import BusinessProfileSetupModal from '../../components/businessapplication/BusinessProfileSet';
import DealFormDialog from '../../components/deal/DealFormDialog';
import { useCreateDeal } from '../../hooks/useDeals';
import { toast } from 'sonner';
import {
  Store as StoreIcon,
  RestaurantMenu as MenuIcon,
  LocalOffer as OfferIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  HourglassEmpty as PendingIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  ArrowForward as ArrowForwardIcon,
  Add as AddIcon
} from '@mui/icons-material';

export default function BusinessOwnerHome() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [dealModalOpen, setDealModalOpen] = useState(false);

  // 1. Fetch real food shop profile
  const {
    data: shop,
    isLoading: loadingShop,
    refetch: refetchShop
  } = useQuery({
    queryKey: ['myFoodShop'],
    queryFn: businessService.getMyFoodShop,
    retry: false
  });

  // 2. Fetch real deals posted by this business owner
  const { data: myDeals = [], isLoading: loadingDeals } = useQuery({
    queryKey: ['deals', 'mine'],
    queryFn: getMyDeals,
    retry: false
  });

  // 3. Fetch real menu items (only if shop exists)
  const { data: menuItems = [], isLoading: loadingMenu } = useQuery({
    queryKey: ['menuitems', shop?.id],
    queryFn: () => getMenuItems(shop!.id),
    enabled: !!shop?.id,
    retry: false
  });

  // 4. Fetch registration status (only if shop doesn't exist to check if they need to setup)
  const { data: status, isLoading: loadingStatus } = useQuery({
    queryKey: ['businessStatus'],
    queryFn: businessService.getStatus,
    enabled: !shop && !loadingShop,
    retry: false
  });

  // Deal submission mutation hook
  const createDealMutation = useCreateDeal();

  const handleDealSubmit = async (formData: FormData) => {
    try {
      await createDealMutation.mutateAsync(formData);
      toast.success("Deal application submitted! Awaiting admin review.");
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message || "Failed to submit deal application");
      throw err;
    }
  };

  const isLoading = loadingShop || loadingDeals || (!!shop?.id && loadingMenu) || (!shop && loadingStatus);

  // Calc real stats
  const activeDealsCount = myDeals.filter(d => d.approvalStatus === 'Approved').length;
  const pendingDealsCount = myDeals.filter(d => d.approvalStatus === 'Pending').length;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#050505' }}>
      <Sidebar activeSection="business" />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar />
        <PageLayout>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
            
            {/* Header Banner */}
            <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', mb: 1 }}>
                  Business <span style={{ color: '#2E9EBF' }}>Dashboard</span>
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                  Welcome, {auth?.user?.username || auth?.user?.email || 'Owner'}! Manage your profile, menu, and student offers.
                </Typography>
              </Box>
              {shop && (
                <Button
                  variant="contained"
                  onClick={() => setDealModalOpen(true)}
                  startIcon={<AddIcon />}
                  sx={{
                    fontWeight: 700,
                    borderRadius: '12px',
                    bgcolor: '#2E9EBF',
                    color: '#050505',
                    textTransform: 'none',
                    px: 3,
                    py: 1.5,
                    boxShadow: '0 8px 20px rgba(46,158,191,0.15)',
                    '&:hover': { bgcolor: '#1e82a0' }
                  }}
                >
                  Post a Deal
                </Button>
              )}
            </Box>

            {isLoading ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10, gap: 2 }}>
                <CircularProgress sx={{ color: '#2E9EBF' }} />
                <Typography sx={{ color: 'gray' }}>Loading your business details...</Typography>
              </Box>
            ) : !shop ? (
              /* ==================== STATE: NO SHOP PROFILE CREATED YET ==================== */
              <Box>
                {status?.status === 'Pending' && (
                  <Paper
                    sx={{
                      p: 5,
                      bgcolor: 'rgba(245, 158, 11, 0.03)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      borderRadius: '1.5rem',
                      textAlign: 'center',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <PendingIcon sx={{ fontSize: 64, color: '#f59e0b', mb: 2 }} />
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 800, mb: 1.5 }}>
                      Application Under Review
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', maxWidth: 600, mx: 'auto', mb: 4, lineHeight: 1.6 }}>
                      Your application for <strong>{status.businessName}</strong> is currently being reviewed by our admin team. 
                      Once approved, you'll be able to set up your shop profile and publish deals here.
                    </Typography>
                    <Chip
                      icon={<PendingIcon sx={{ color: '#f59e0b !important' }} />}
                      label="Pending Admin Approval"
                      sx={{ color: '#f59e0b', bgcolor: 'rgba(245,158,11,0.1)', border: '1px solid #f59e0b', fontWeight: 700, px: 1 }}
                    />
                  </Paper>
                )}

                {status?.status === 'Rejected' && (
                  <Paper
                    sx={{
                      p: 5,
                      bgcolor: 'rgba(239, 68, 68, 0.03)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      borderRadius: '1.5rem',
                      textAlign: 'center',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <RejectedIcon sx={{ fontSize: 64, color: '#ef4444', mb: 2 }} />
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 800, mb: 1.5 }}>
                      Application Rejected
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', maxWidth: 600, mx: 'auto', mb: 4, lineHeight: 1.6 }}>
                      Unfortunately, your business registration application was not approved by the administrator. 
                      Please contact support or resubmit with the requested information.
                    </Typography>
                    <Chip
                      icon={<RejectedIcon sx={{ color: '#ef4444 !important' }} />}
                      label="Registration Rejected"
                      sx={{ color: '#ef4444', bgcolor: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', fontWeight: 700, px: 1 }}
                    />
                  </Paper>
                )}

                {/* Approved but Shop Profile not created */}
                {(!status || status.status === 'Approved') && (
                  <Paper
                    sx={{
                      p: { xs: 4, md: 6 },
                      bgcolor: 'rgba(46, 158, 191, 0.04)',
                      border: '1px solid rgba(46, 158, 191, 0.2)',
                      borderRadius: '1.5rem',
                      textAlign: 'center',
                      backdropFilter: 'blur(10px)',
                      backgroundImage: 'radial-gradient(circle at top right, rgba(46,158,191,0.08) 0%, transparent 60%)'
                    }}
                  >
                    <StoreIcon sx={{ fontSize: 64, color: '#2E9EBF', mb: 2 }} />
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 800, mb: 1.5 }}>
                      Set Up Your Shop Profile
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', maxWidth: 600, mx: 'auto', mb: 4, lineHeight: 1.6 }}>
                      Congratulations! Your business registration has been approved. 
                      Create your shop profile now to display your shop to students, start adding menu items, and offer exclusive deals.
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => setProfileModalOpen(true)}
                      startIcon={<StoreIcon />}
                      sx={{
                        fontWeight: 700,
                        borderRadius: '14px',
                        bgcolor: '#2E9EBF',
                        color: '#050505',
                        textTransform: 'none',
                        px: 4,
                        py: 1.8,
                        fontSize: '1rem',
                        boxShadow: '0 8px 24px rgba(46,158,191,0.2)',
                        '&:hover': { bgcolor: '#1e82a0', boxShadow: '0 12px 30px rgba(46,158,191,0.3)' }
                      }}
                    >
                      Complete Shop Profile Setup
                    </Button>
                  </Paper>
                )}
              </Box>
            ) : (
              /* ==================== STATE: ACTIVE SHOP PROFILE ==================== */
              <Box>
                {/* 1. Statistics Cards */}
                <Grid container spacing={3} sx={{ mb: 5 }}>
                  <Grid item xs={12} sm={4}>
                    <Paper
                      onClick={() => navigate(`/shop/${shop.id}`)}
                      sx={{
                        p: 3,
                        bgcolor: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '1.25rem',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        cursor: 'pointer',
                        transition: 'all 0.23s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          borderColor: '#2E9EBF',
                          bgcolor: 'rgba(46, 158, 191, 0.03)'
                        }
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800, mb: 0.5 }}>
                            {menuItems.length}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.48)' }}>
                            Menu Items Listed
                          </Typography>
                        </Box>
                        <Avatar sx={{ bgcolor: 'rgba(46,158,191,0.1)', color: '#2E9EBF' }}>
                          <MenuIcon />
                        </Avatar>
                      </Stack>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Paper
                      onClick={() => navigate('/deals')}
                      sx={{
                        p: 3,
                        bgcolor: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '1.25rem',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        cursor: 'pointer',
                        transition: 'all 0.23s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          borderColor: '#10b981',
                          bgcolor: 'rgba(16, 185, 129, 0.03)'
                        }
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800, mb: 0.5 }}>
                            {activeDealsCount}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.48)' }}>
                            Active Deals & Offers
                          </Typography>
                        </Box>
                        <Avatar sx={{ bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                          <ApprovedIcon />
                        </Avatar>
                      </Stack>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Paper
                      onClick={() => navigate('/deals')}
                      sx={{
                        p: 3,
                        bgcolor: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '1.25rem',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        cursor: 'pointer',
                        transition: 'all 0.23s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          borderColor: '#f59e0b',
                          bgcolor: 'rgba(245, 158, 11, 0.03)'
                        }
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800, mb: 0.5 }}>
                            {pendingDealsCount}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.48)' }}>
                            Pending Applications
                          </Typography>
                        </Box>
                        <Avatar sx={{ bgcolor: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                          <PendingIcon />
                        </Avatar>
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>

                {/* 2. Main Grid Layout */}
                <Grid container spacing={4}>
                  {/* Left Column: Shop Profile Card */}
                  <Grid item xs={12} md={5}>
                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StoreIcon sx={{ color: '#2E9EBF' }} /> Shop Profile
                    </Typography>
                    
                    <Paper
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '1.5rem',
                        overflow: 'hidden',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      {shop.photoUrl ? (
                        <CardMedia
                          component="img"
                          height="200"
                          image={shop.photoUrl}
                          alt={shop.name}
                          sx={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: 200,
                            bgcolor: 'rgba(255,255,255,0.03)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderBottom: '1px solid rgba(255,255,255,0.06)'
                          }}
                        >
                          <StoreIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.1)' }} />
                        </Box>
                      )}
                      
                      <Box sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                          <Typography variant="h5" sx={{ color: '#fff', fontWeight: 800 }}>
                            {shop.name}
                          </Typography>
                          <Chip
                            label={shop.category}
                            size="small"
                            sx={{ bgcolor: 'rgba(46,158,191,0.1)', color: '#2E9EBF', fontWeight: 700, border: '1px solid rgba(46,158,191,0.2)' }}
                          />
                        </Stack>

                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 3, lineHeight: 1.6 }}>
                          {shop.description || 'No description provided.'}
                        </Typography>

                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', my: 2 }} />

                        <Stack spacing={2} sx={{ mb: 4 }}>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <LocationIcon sx={{ color: '#2E9EBF', fontSize: 20 }} />
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                              {shop.address || 'Address not listed'}
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <PhoneIcon sx={{ color: '#22c55e', fontSize: 20 }} />
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                              {shop.phoneNumber || 'Phone not listed'}
                            </Typography>
                          </Stack>
                        </Stack>

                        <Box sx={{ mt: 'auto', pt: 2 }}>
                          <Stack direction="row" spacing={2}>
                            <Button
                              fullWidth
                              variant="contained"
                              onClick={() => navigate(`/shop/${shop.id}`)}
                              startIcon={<MenuIcon />}
                              sx={{
                                bgcolor: '#2E9EBF',
                                color: '#050505',
                                fontWeight: 700,
                                textTransform: 'none',
                                borderRadius: '12px',
                                py: 1.5,
                                '&:hover': { bgcolor: '#1e82a0' }
                              }}
                            >
                              Manage Menu
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() => navigate('/food')}
                              sx={{
                                color: 'rgba(255,255,255,0.6)',
                                borderColor: 'rgba(255,255,255,0.12)',
                                textTransform: 'none',
                                borderRadius: '12px',
                                px: 3,
                                '&:hover': { borderColor: 'rgba(255,255,255,0.25)', color: '#fff' }
                              }}
                            >
                              Edit Profile
                            </Button>
                          </Stack>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>

                  {/* Right Column: Deals Overview */}
                  <Grid item xs={12} md={7}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <OfferIcon sx={{ color: '#2E9EBF' }} /> Recent Deals
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => navigate('/deals')}
                        endIcon={<ArrowForwardIcon />}
                        sx={{ color: '#2E9EBF', textTransform: 'none', fontWeight: 600 }}
                      >
                        All Deals
                      </Button>
                    </Stack>

                    <Paper
                      sx={{
                        p: 3,
                        bgcolor: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '1.5rem',
                        minHeight: 400,
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      {myDeals.length === 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, py: 6, textAlign: 'center', gap: 2 }}>
                          <OfferIcon sx={{ fontSize: 48, color: 'rgba(255,255,255,0.1)' }} />
                          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                            No deals published yet
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.3)', maxWidth: 350, mb: 1 }}>
                            Create custom discount badges and deals to attract students to your food shop.
                          </Typography>
                          <Button
                            variant="outlined"
                            onClick={() => setDealModalOpen(true)}
                            startIcon={<AddIcon />}
                            sx={{
                              color: '#2E9EBF',
                              borderColor: 'rgba(46,158,191,0.3)',
                              borderRadius: '12px',
                              textTransform: 'none',
                              '&:hover': { borderColor: '#2E9EBF', bgcolor: 'rgba(46,158,191,0.05)' }
                            }}
                          >
                            Submit First Deal
                          </Button>
                        </Box>
                      ) : (
                        <Stack spacing={2} sx={{ flexGrow: 1 }}>
                          {myDeals.slice(0, 5).map((deal) => (
                            <Paper
                              key={deal.id}
                              sx={{
                                p: 2.5,
                                bgcolor: 'rgba(255, 255, 255, 0.01)',
                                border: '1px solid rgba(255, 255, 255, 0.04)',
                                borderRadius: '1rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1.5,
                                transition: 'all 0.2s',
                                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(255, 255, 255, 0.08)' }
                              }}
                            >
                              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
                                <Box>
                                  <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 700 }}>
                                    {deal.title}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mt: 0.5 }}>
                                    Submitted {new Date(deal.createdAt).toLocaleDateString()}
                                  </Typography>
                                </Box>
                                <Chip
                                  label={deal.badgeText}
                                  size="small"
                                  sx={{
                                    bgcolor: `${deal.badgeColor}15`,
                                    color: deal.badgeColor,
                                    borderColor: `${deal.badgeColor}33`,
                                    border: '1px solid',
                                    fontWeight: 700
                                  }}
                                />
                              </Stack>

                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                                {deal.description}
                              </Typography>

                              <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1}>
                                <Chip
                                  size="small"
                                  label={deal.approvalStatus}
                                  color={
                                    deal.approvalStatus === 'Approved'
                                      ? 'success'
                                      : deal.approvalStatus === 'Pending'
                                      ? 'warning'
                                      : 'error'
                                  }
                                  variant="outlined"
                                  sx={{ fontWeight: 700 }}
                                />

                                {deal.rejectionReason && (
                                  <Typography variant="caption" sx={{ color: '#ef4444', fontStyle: 'italic' }}>
                                    Reason: {deal.rejectionReason}
                                  </Typography>
                                )}
                              </Stack>
                            </Paper>
                          ))}

                          <Box sx={{ mt: 'auto', pt: 2, display: 'flex', justifyContent: 'center' }}>
                            <Button
                              variant="outlined"
                              onClick={() => setDealModalOpen(true)}
                              startIcon={<AddIcon />}
                              sx={{
                                color: '#2E9EBF',
                                borderColor: 'rgba(46,158,191,0.3)',
                                borderRadius: '12px',
                                textTransform: 'none',
                                px: 4,
                                py: 1,
                                '&:hover': { borderColor: '#2E9EBF', bgcolor: 'rgba(46,158,191,0.05)' }
                              }}
                            >
                              Post Another Deal
                            </Button>
                          </Box>
                        </Stack>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Container>
        </PageLayout>
      </Box>

      {/* Profile Setup Modal */}
      <BusinessProfileSetupModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onCompleted={() => {
          setProfileModalOpen(false);
          refetchShop();
        }}
      />

      {/* Deal Form Dialog */}
      <DealFormDialog
        open={dealModalOpen}
        onClose={() => setDealModalOpen(false)}
        onSubmit={handleDealSubmit}
      />
    </Box>
  );
}