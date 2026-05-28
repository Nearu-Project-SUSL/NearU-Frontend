import { useNavigate } from 'react-router';
import { useState, useEffect, useCallback } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { Sidebar } from '../../components/layout/Sidebar';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  CircularProgress,
  Tabs,
  Tab,
  Chip,
  Avatar,
  Fade,
  useTheme,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  DirectionsBike as BikeIcon,
  HourglassEmpty as PendingIcon,
  CheckCircle as CheckIcon,
  Cancel as RejectIcon,
  Block as SuspendIcon,
  TrendingUp as TrendIcon,
  CheckCircleOutline as ActiveIcon,
  People as UsersIcon,
  OnlinePrediction as OnlineIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import useAuth from '../../hooks/useAuth';
import Navbar from '../../components/layout/Navbar';
import adminService, { AdminStats, AdminRider } from '../../../api/adminService';
import { rideHub } from '../../services/rideHubService';
import { toast } from 'sonner';
import { useNearUTheme } from '../../context/ThemeContext';

export default function AdminHome() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const { isDark } = useNearUTheme();
  const theme = useTheme();
  
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [riders, setRiders] = useState<AdminRider[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingRiders, setLoadingRiders] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  const accent = theme.palette.primary.main;
  const accentAlpha = (a: number) => `rgba(46, 158, 191, ${a})`;

  // Fetch Dashboard Stats
  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const data = await adminService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
      toast.error('Failed to update stats panel.');
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Fetch Rider List
  const fetchRiders = useCallback(async (statusFilter?: string) => {
    setLoadingRiders(true);
    try {
      // If statusFilter is 'All', do not pass status to backend
      const apiFilter = statusFilter === 'All' ? undefined : statusFilter;
      const data = await adminService.getRiders(apiFilter, 1, 50);
      setRiders(data.riders || []);
    } catch (error) {
      console.error('Failed to fetch riders list:', error);
      toast.error('Failed to load riders list.');
    } finally {
      setLoadingRiders(false);
    }
  }, []);

  // Refresh All Data
  const refreshAll = useCallback(() => {
    fetchStats();
    fetchRiders(currentTab);
  }, [fetchStats, fetchRiders, currentTab]);

  // Handle Tab Change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
    fetchRiders(newValue);
  };

  // Perform Rider Status Change Actions
  const handleStatusChange = async (riderId: string, action: 'approve' | 'reject' | 'suspend') => {
    setActionInProgress(riderId);
    const toastId = toast.loading(`Performing action on rider...`);
    try {
      if (action === 'approve') {
        await adminService.approveRider(riderId);
        toast.success('Rider application approved successfully!', { id: toastId });
      } else if (action === 'reject') {
        await adminService.rejectRider(riderId);
        toast.success('Rider application rejected successfully.', { id: toastId });
      } else if (action === 'suspend') {
        await adminService.suspendRider(riderId);
        toast.warning('Rider account has been suspended.', { id: toastId });
      }
      refreshAll();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || `Failed to ${action} rider.`;
      toast.error(errorMsg, { id: toastId });
    } finally {
      setActionInProgress(null);
    }
  };

  // Toggle Rider Service Tier
  const handleTierChange = async (riderId: string, newTier: 'Standard' | 'Premium') => {
    setActionInProgress(`${riderId}-tier`);
    const toastId = toast.loading(`Updating rider tier to ${newTier}...`);
    try {
      await adminService.setRiderTier(riderId, newTier);
      toast.success(`Rider tier successfully updated to ${newTier}!`, { id: toastId });
      refreshAll();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || `Failed to update rider tier.`;
      toast.error(errorMsg, { id: toastId });
    } finally {
      setActionInProgress(null);
    }
  };

  // SignalR Lifecycle Setup for live notifications
  useEffect(() => {
    const setupHub = async () => {
      const token = localStorage.getItem('auth_accessToken') || auth?.accessToken;
      if (!token) return;

      try {
        await rideHub.connect(token);
        
        // Listen to live Rider registration event
        rideHub.setCallbacks({
          onNewRiderApplication: (payload: any) => {
            // Play sound/vibe & show toast
            toast.info(`🔔 New Rider Application: ${payload.name} (${payload.email}) is waiting for approval!`, {
              duration: 8000,
              action: {
                label: 'Refresh Dashboard',
                onClick: () => refreshAll()
              }
            });
            // Update stats immediately
            setStats(prev => {
              if (!prev) return null;
              return {
                ...prev,
                pendingApprovals: prev.pendingApprovals + 1
              };
            });
            // Refresh list dynamically
            fetchRiders(currentTab);
          }
        });
      } catch (err) {
        console.warn('SignalR connection failed for admin dashboard:', err);
      }
    };

    setupHub();

    return () => {
      // Disconnect or clear callbacks on unmount to avoid memory leaks
      rideHub.clearCallbacks();
    };
  }, [auth?.accessToken, refreshAll, fetchRiders, currentTab]);

  // Initial Data Fetch
  useEffect(() => {
    refreshAll();
  }, []);

  // Filter riders based on name or email search term
  const filteredRiders = riders.filter(rider => 
    rider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rider.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <Sidebar activeSection="admin" />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <PageLayout>
          <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            
            {/* Upper Header Welcome banner */}
            <Fade in timeout={800}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
                    NearU Command Center
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Welcome back, <span style={{ color: accent, fontWeight: 700 }}>{auth?.user?.username || 'Admin'}</span>. Real-time platform management.
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/admin/deals')}
                    sx={{ 
                      fontWeight: 700, 
                      borderRadius: '12px', 
                      bgcolor: '#ef4444', 
                      color: '#fff',
                      textTransform: 'none',
                      px: 3,
                      py: 1.2,
                      '&:hover': { bgcolor: '#dc2626' }
                    }}
                  >
                    Review Deals & Offers
                  </Button>
                  <Tooltip title="Force Refresh Dashboard">
                    <IconButton 
                      onClick={refreshAll} 
                      disabled={loadingStats || loadingRiders}
                      sx={{ 
                        bgcolor: accentAlpha(0.1), 
                        color: accent,
                        border: `1px solid ${accentAlpha(0.2)}`,
                        p: 1.5,
                        '&:hover': { bgcolor: accentAlpha(0.2) } 
                      }}
                    >
                      {loadingStats || loadingRiders ? <CircularProgress size={24} color="inherit" /> : <RefreshIcon />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Fade>

            {/* Statistics Row */}
            <Grid container spacing={3} sx={{ mb: 5 }}>
              {[
                { 
                  title: 'Pending Approvals', 
                  count: stats?.pendingApprovals ?? 0, 
                  icon: PendingIcon, 
                  color: (stats?.pendingApprovals ?? 0) > 0 ? '#ef4444' : '#9ca3af',
                  glow: (stats?.pendingApprovals ?? 0) > 0 ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                  desc: 'Riders waiting for verification'
                },
                { 
                  title: 'Online Riders', 
                  count: stats?.onlineRiders ?? 0, 
                  icon: OnlineIcon, 
                  color: '#10b981',
                  glow: 'rgba(16, 185, 129, 0.1)',
                  desc: `Out of ${stats?.totalRiders ?? 0} total riders`
                },
                { 
                  title: 'Active Rides', 
                  count: stats?.activeRides ?? 0, 
                  icon: ActiveIcon, 
                  color: '#2E9EBF',
                  glow: 'rgba(46, 158, 191, 0.1)',
                  desc: 'Rides currently in progress'
                },
                { 
                  title: 'Total Rides', 
                  count: stats?.totalRides ?? 0, 
                  icon: TrendIcon, 
                  color: '#a855f7',
                  glow: 'rgba(168, 85, 247, 0.1)',
                  desc: 'All-time rides completed'
                }
              ].map((stat, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                  <Paper 
                    sx={{ 
                      ...glassStyles, 
                      p: 3, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0, right: 0, width: 80, height: 80,
                        background: `radial-gradient(circle, ${stat.glow} 0%, transparent 70%)`,
                        borderRadius: '50%',
                        zIndex: 0
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, zIndex: 1 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>{stat.title}</Typography>
                      <Avatar sx={{ bgcolor: stat.glow, border: `1px solid ${stat.color}`, color: stat.color, width: 42, height: 42 }}>
                        <stat.icon />
                      </Avatar>
                    </Box>
                    <Box sx={{ zIndex: 1 }}>
                      {loadingStats ? (
                        <CircularProgress size={24} sx={{ color: accent }} />
                      ) : (
                        <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5, letterSpacing: -1 }}>
                          {stat.count}
                        </Typography>
                      )}
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{stat.desc}</Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Riders Approvals Workspace Panel */}
            <Paper sx={{ ...glassStyles, p: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    Rider Applications
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Review, approve, reject or suspend rider accounts on NearU.
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' }, width: { xs: '100%', md: 'auto' } }}>
                  <TextField
                    placeholder="Search name or email..."
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      width: { xs: '100%', sm: 220 },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '0.8rem',
                        bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                        '& fieldset': { borderColor: accentAlpha(0.2) },
                        '&:hover fieldset': { borderColor: accentAlpha(0.4) },
                        '&.Mui-focused fieldset': { borderColor: accent }
                      }
                    }}
                  />

                  {/* Visual Filtering Tabs */}
                  <Tabs 
                    value={currentTab} 
                    onChange={handleTabChange} 
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                      '& .MuiTabs-indicator': { bgcolor: accent },
                      '& .MuiTab-root': { color: 'text.secondary', fontWeight: 600 },
                      '& .MuiTab-root.Mui-selected': { color: accent }
                    }}
                  >
                    {['All', 'Pending', 'Approved', 'Suspended', 'Rejected'].map((tab) => (
                      <Tab key={tab} label={tab} value={tab} />
                    ))}
                  </Tabs>
                </Box>
              </Box>

              {/* Table Data */}
              <TableContainer sx={{ border: `1px solid ${accentAlpha(0.1)}`, borderRadius: '1rem', overflow: 'hidden' }}>
                <Table>
                  <TableHead sx={{ bgcolor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.02)' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Rider Info</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Email Address</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Tier</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Availability</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="center">Review / Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loadingRiders ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                          <CircularProgress sx={{ color: accent }} />
                          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>Loading applicants list...</Typography>
                        </TableCell>
                      </TableRow>
                    ) : filteredRiders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                          <PendingIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                          <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700 }}>No Riders Found</Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {searchTerm ? `No results match your search query: "${searchTerm}"` : `There are no applications matching the "${currentTab}" filter at this time.`}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRiders.map((rider) => (
                        <TableRow 
                          key={rider.riderId}
                          sx={{ 
                            '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' },
                            transition: 'all 0.2s'
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ bgcolor: accentAlpha(0.1), color: accent }}>
                                <BikeIcon />
                              </Avatar>
                              <Box>
                                <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>{rider.name}</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>ID: {rider.riderId.substring(0, 8)}...</Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: 'text.secondary', fontWeight: 500 }}>{rider.email}</TableCell>
                          <TableCell>
                            <Chip 
                              label={rider.approvalStatus} 
                              size="small"
                              sx={{ 
                                fontWeight: 700,
                                bgcolor: 
                                  rider.approvalStatus === 'Approved' ? 'rgba(16, 185, 129, 0.1)' :
                                  rider.approvalStatus === 'Pending' ? 'rgba(245, 158, 11, 0.1)' :
                                  rider.approvalStatus === 'Suspended' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(156, 163, 175, 0.15)',
                                color: 
                                  rider.approvalStatus === 'Approved' ? '#10b981' :
                                  rider.approvalStatus === 'Pending' ? '#f59e0b' :
                                  rider.approvalStatus === 'Suspended' ? '#ef4444' : '#9ca3af',
                                border: '1px solid currentColor'
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Tooltip title={`Click to change to ${rider.riderTier === 'Premium' ? 'Standard' : 'Premium'}`}>
                              <Chip 
                                label={actionInProgress === `${rider.riderId}-tier` ? 'Updating...' : rider.riderTier} 
                                size="small"
                                variant="outlined"
                                onClick={() => handleTierChange(rider.riderId, rider.riderTier === 'Premium' ? 'Standard' : 'Premium')}
                                disabled={actionInProgress !== null}
                                sx={{ 
                                  fontWeight: 600,
                                  cursor: actionInProgress !== null ? 'default' : 'pointer',
                                  borderColor: rider.riderTier === 'Premium' ? '#a855f7' : '#9ca3af',
                                  color: rider.riderTier === 'Premium' ? '#a855f7' : 'text.secondary',
                                  '&:hover': {
                                    bgcolor: rider.riderTier === 'Premium' ? 'rgba(168, 85, 247, 0.08)' : 'rgba(156, 163, 175, 0.08)',
                                  }
                                }}
                              />
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box 
                                sx={{ 
                                  width: 8, height: 8, borderRadius: '50%', 
                                  bgcolor: rider.isOnline ? '#10b981' : 'text.disabled',
                                  boxShadow: rider.isOnline ? '0 0 8px #10b981' : 'none'
                                }} 
                              />
                              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                                {rider.isOnline ? 'Online' : 'Offline'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                              {/* Approve Button */}
                              {(rider.approvalStatus === 'Pending' || rider.approvalStatus === 'Rejected' || rider.approvalStatus === 'Suspended') && (
                                <Tooltip title="Approve Application">
                                  <IconButton 
                                    color="success" 
                                    disabled={actionInProgress !== null}
                                    onClick={() => handleStatusChange(rider.riderId, 'approve')}
                                    sx={{ 
                                      bgcolor: 'rgba(16, 185, 129, 0.08)',
                                      '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.15)' } 
                                    }}
                                  >
                                    {actionInProgress === rider.riderId ? <CircularProgress size={20} color="inherit" /> : <CheckIcon />}
                                  </IconButton>
                                </Tooltip>
                              )}

                              {/* Reject Button */}
                              {rider.approvalStatus === 'Pending' && (
                                <Tooltip title="Reject Application">
                                  <IconButton 
                                    color="error" 
                                    disabled={actionInProgress !== null}
                                    onClick={() => handleStatusChange(rider.riderId, 'reject')}
                                    sx={{ 
                                      bgcolor: 'rgba(239, 68, 68, 0.08)',
                                      '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.15)' } 
                                    }}
                                  >
                                    {actionInProgress === rider.riderId ? <CircularProgress size={20} color="inherit" /> : <RejectIcon />}
                                  </IconButton>
                                </Tooltip>
                              )}

                              {/* Suspend Button */}
                              {rider.approvalStatus === 'Approved' && (
                                <Tooltip title="Suspend Rider Account">
                                  <IconButton 
                                    color="warning" 
                                    disabled={actionInProgress !== null}
                                    onClick={() => handleStatusChange(rider.riderId, 'suspend')}
                                    sx={{ 
                                      bgcolor: 'rgba(245, 158, 11, 0.08)',
                                      '&:hover': { bgcolor: 'rgba(245, 158, 11, 0.15)' } 
                                    }}
                                  >
                                    {actionInProgress === rider.riderId ? <CircularProgress size={20} color="inherit" /> : <SuspendIcon />}
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

          </Container>
        </PageLayout>
      </Box>
    </Box>
  );
}