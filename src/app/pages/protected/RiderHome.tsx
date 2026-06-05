/**
 * RiderHome.tsx
 * Full Rider (Driver) dashboard implementing the complete ride lifecycle state machine.
 *
 * Real-time updates are driven by SignalR (useRideHub).
 * HTTP polling via TanStack Query serves as a fallback for nearby requests.
 *
 * States:
 *  OFFLINE          → Go Online toggle screen with stats
 *  ONLINE_IDLE      → Full-screen map, receiving requests via SignalR broadcast
 *  RIDE_REQUESTED   → RideRequestSheet bottom sheet (15s countdown)
 *  EN_ROUTE_PICKUP  → Map + RideStatusBar with "Arrived" button
 *  ARRIVED_WAITING  → OtpVerifySheet for OTP entry
 *  RIDE_IN_PROGRESS → Map + RideStatusBar with "Complete" button
 *  COMPLETING       → Spinner overlay — waiting for student confirmation via SignalR
 */

import { useCallback, useEffect } from 'react';
import { Box, Typography, useTheme, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'motion/react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import axios from 'axios';

// Layout
import { Sidebar } from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';

// Rider-specific components
import MapView from '../../components/rider/MapView';
import RideRequestSheet from '../../components/rider/RideRequestSheet';
import OtpVerifySheet from '../../components/rider/OtpVerifySheet';
import RideStatusBar from '../../components/rider/RideStatusBar';

// Store, hooks & services
import { useRiderStore } from '../../store/riderStore';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useHeartbeat } from '../../hooks/useHeartbeat';
import { useRideHub } from '../../hooks/useRideHub';
import riderService from '../../../api/riderService';
import useAuth from '../../hooks/useAuth';

// MUI Icons
import {
  PowerSettingsNew as PowerIcon,
  DirectionsBike as BikeIcon,
  Star as StarIcon,
  MonetizationOn as EarningsIcon,
  LocationSearching as LocationIcon,
  SignalWifi4Bar as SignalIcon,
  WifiOff as OfflineIcon,
  HourglassEmpty as PendingIcon,
  Block as BlockIcon,
  NotificationsActive as RequestIcon,
  Map as MapIcon,
  PinDrop as ArriveIcon,
  OfflinePin as CompleteIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';

// ─── Constants ────────────────────────────────────────────────────────────────
const RIDER_ACCENT = '#10b981';
const ACCENT_ALPHA = (a: number) => `rgba(16, 185, 129, ${a})`;
/** HTTP fallback polling interval (SignalR is primary). */
const NEARBY_FALLBACK_POLL_MS = 15_000;

// ─── Component ────────────────────────────────────────────────────────────────
export default function RiderHome() {
  const { auth, isAuthReady } = useAuth();
  const theme = useTheme();

  // ─── State machine ─────────────────────────────────────────────────────────
  const {
    rideStatus,
    activeRide,
    pendingRequest,
    riderCoords,
    otpError,
    goOnline,
    goOffline,
    setIncomingRequest,
    clearPendingRequest,
    acceptRequest,
    setArrived,
    startRide,
    setCompleting,
    finishRide,
    setRiderCoords,
    setOtpError,
  } = useRiderStore();

  // ─── SignalR hub ───────────────────────────────────────────────────────────
  // Wait for isAuthReady before connecting — ensures we use a fresh, non-expired
  // token so the SignalR handshake doesn't fail with "Handshake was canceled".
  const { isHubConnected } = useRideHub({
    accessToken: auth.accessToken,
    enabled: !!auth.accessToken && isAuthReady,
  });

  // ─── Geolocation tracking ──────────────────────────────────────────────────
  const isOnline = rideStatus !== 'OFFLINE';
  const { coords, permissionState } = useGeolocation(isOnline);

  useEffect(() => {
    if (coords) setRiderCoords(coords);
  }, [coords, setRiderCoords]);

  // ─── Heartbeat (active during EN_ROUTE / RIDE_IN_PROGRESS) ────────────────
  useHeartbeat({
    rideId: activeRide?.id ?? null,
    coords: riderCoords,
    enabled: rideStatus === 'EN_ROUTE_PICKUP' || rideStatus === 'RIDE_IN_PROGRESS',
    intervalMs: 10_000,
  });

  // ─── HTTP fallback: poll nearby requests when ONLINE_IDLE ──────────────────
  // Primary delivery is via SignalR push to OnlineRiders group.
  // This fallback ensures we catch requests if the hub reconnects mid-stream.
  const { data: nearbyRequests } = useQuery({
    queryKey: ['riderNearbyRequests'],
    queryFn: () =>
      riderCoords
        ? riderService.getNearbyRequests(riderCoords.latitude, riderCoords.longitude)
        : Promise.resolve([]),
    enabled: isAuthReady && rideStatus === 'ONLINE_IDLE' && !!riderCoords,
    refetchInterval: NEARBY_FALLBACK_POLL_MS,
    retry: false,
  });

  useEffect(() => {
    if (nearbyRequests && nearbyRequests.length > 0 && rideStatus === 'ONLINE_IDLE') {
      setIncomingRequest(nearbyRequests[0]);
    }
  }, [nearbyRequests, rideStatus, setIncomingRequest]);

  // ─── Resume active ride on page refresh ───────────────────────────────────
  useEffect(() => {
    if (!isAuthReady) return; // Wait for fresh token
    if (rideStatus === 'OFFLINE') return; // Don't check if offline

    riderService.getActiveRide().then((ride) => {
      if (ride && rideStatus === 'ONLINE_IDLE') {
        acceptRequest(ride);
        toast.info('Resumed your active ride.', { icon: '🛵' });
      }
    });
    // Run when auth becomes ready (skip on mount while startup refresh is in-flight)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthReady]);

  // ─── Rider approval status ─────────────────────────────────────────────────
  // Fetched once on mount to show pending/rejected states instead of
  // letting the rider click "Go Online" and get a confusing 400 error.
  const { data: riderStatusData, isLoading: isRiderStatusLoading } = useQuery({
    queryKey: ['riderStatusProfile'],
    queryFn: riderService.getRiderStatus,
    enabled: isAuthReady,
    staleTime: 30_000,
    retry: false,
  });

  const approvalStatus = riderStatusData?.approvalStatus ?? null;

  // ─── Rider stats ────────────────────────────────────────────────────────────
  const { data: stats } = useQuery({
    queryKey: ['riderStats'],
    queryFn: riderService.getStats,
    enabled: isAuthReady,
    staleTime: 60_000,
    retry: false,
    // getStats returns null on 404 (endpoint not yet deployed) — treat as empty
  });

  // ─── API mutations ─────────────────────────────────────────────────────────
  const toggleOnlineMutation = useMutation({
    mutationFn: (isOnlineParam: boolean) => riderService.setStatus(isOnlineParam),
    onSuccess: (_, isOnlineParam) => {
      if (isOnlineParam) {
        goOnline();
        // GoOnline() on the hub is handled by useRideHub watching rideStatus
        toast.success("You're online! Waiting for ride requests...", { icon: '🛵' });
      } else {
        goOffline();
        toast.info("You're now offline.", { icon: '💤' });
      }
    },
    onError: (err: unknown) => {
      // Surface the actual backend error message when available
      let message = 'Failed to update status. Check your connection.';
      if (axios.isAxiosError(err)) {
        const serverMsg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.response?.data?.title;
        if (serverMsg) message = serverMsg;
      }
      toast.error(message);
    },
  });

  const acceptMutation = useMutation({
    mutationFn: () => riderService.acceptRide(pendingRequest!.id),
    onSuccess: (ride) => {
      acceptRequest(ride);
      // JoinRideChannel is handled automatically by useRideHub watching activeRide
      toast.success('Ride accepted! Navigate to pickup.', { icon: '🗺️' });
    },
    onError: (error: any) => {
      console.error('Accept ride error:', error);
      const serverMsg = error.response?.data?.message || error.response?.data?.error || error.response?.data?.title;
      toast.error(serverMsg || 'Failed to accept ride. It may have been taken.');
      clearPendingRequest();
    },
  });

  const arriveMutation = useMutation({
    mutationFn: () => riderService.markArrived(activeRide!.id),
    onSuccess: () => {
      setArrived();
      toast.success("Marked as arrived! Ask for the OTP.", { icon: '📍' });
    },
    onError: () => toast.error('Failed to mark arrival.'),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (otp: string) => riderService.verifyOtp(activeRide!.id, otp),
    onSuccess: () => {
      startRide();
      setOtpError(null);
      toast.success("OTP verified! Ride started.", { icon: '✅' });
    },
    onError: () => {
      setOtpError('Invalid OTP. Please try again.');
    },
  });

  const completeMutation = useMutation({
    mutationFn: () => riderService.completeRide(activeRide!.id),
    onSuccess: () => {
      setCompleting();
      // finishRide() will be called when server pushes "RideConfirmed" via SignalR
      // (handled in useRideHub → onRideConfirmed callback)
    },
    onError: () => toast.error('Failed to complete ride. Try again.'),
  });

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleToggleOnline = useCallback(() => {
    if (permissionState === 'denied' && !isOnline) {
      toast.error('Please enable location access to go online.', { duration: 5000 });
      return;
    }
    toggleOnlineMutation.mutate(!isOnline);
  }, [isOnline, permissionState, toggleOnlineMutation]);

  const handleDeclineRequest = useCallback(() => {
    clearPendingRequest();
    toast.info('Ride request declined.');
  }, [clearPendingRequest]);

  const userName = auth?.user?.username || auth?.user?.email?.split('@')[0] || 'Rider';

  // ─── HUB connection status badge label ────────────────────────────────────
  const hubBadge = isHubConnected ? null : (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 5,
      padding: '4px 10px', borderRadius: 20, fontSize: 11,
      background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
      color: '#ef4444', fontWeight: 600,
    }}>
      <OfflineIcon style={{ fontSize: 12 }} />
      Hub disconnected
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  //  STATE 1: OFFLINE — Go Online screen
  // ─────────────────────────────────────────────────────────────────────────
  if (rideStatus === 'OFFLINE') {
    // ── Loading approval status ──────────────────────────────────────────
    if (isRiderStatusLoading) {
      return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
          <Sidebar activeSection="rider" />
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress sx={{ color: RIDER_ACCENT }} />
            </Box>
          </Box>
        </Box>
      );
    }

    // ── Pending approval ──────────────────────────────────────────────────
    if (approvalStatus === 'Pending') {
      return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
          <Sidebar activeSection="rider" />
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              p: 3,
              background: theme.palette.mode === 'dark'
                ? 'radial-gradient(ellipse at 50% 50%, rgba(245,158,11,0.04) 0%, transparent 70%)'
                : 'radial-gradient(ellipse at 50% 50%, rgba(245,158,11,0.02) 0%, transparent 70%)',
            }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ maxWidth: 420, width: '100%', textAlign: 'center' }}
              >
                <Box sx={{
                  p: 4,
                  borderRadius: '1.75rem',
                  backdropFilter: 'blur(20px)',
                  background: theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  boxShadow: theme.palette.mode === 'dark' 
                    ? '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(245, 158, 11, 0.05)'
                    : '0 20px 60px rgba(245, 158, 11, 0.05)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0, right: 0, width: 100, height: 100,
                    background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                  }
                }}>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ marginBottom: 20, position: 'relative', zIndex: 1 }}
                  >
                    <div style={{
                      width: 84, height: 84,
                      background: 'rgba(245,158,11,0.12)',
                      border: '2px solid rgba(245,158,11,0.3)',
                      borderRadius: '50%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 20px rgba(245,158,11,0.2)',
                    }}>
                      <PendingIcon style={{ color: '#f59e0b', fontSize: 42 }} />
                    </div>
                  </motion.div>
                  <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 800, mb: 1, position: 'relative', zIndex: 1 }}>
                    Application Under Review
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, fontSize: '0.925rem', lineHeight: 1.5, position: 'relative', zIndex: 1 }}>
                    Your rider application is pending admin approval. You'll be able to go online once approved.
                    Please check back later.
                  </Typography>
                  <Box sx={{
                    p: 1.5, 
                    borderRadius: '0.75rem',
                    background: 'rgba(245,158,11,0.08)',
                    border: '1px solid rgba(245,158,11,0.2)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    position: 'relative',
                    zIndex: 1,
                  }}>
                    <TimerIcon style={{ color: '#f59e0b', fontSize: 16 }} />
                    <Typography variant="caption" sx={{ color: '#f59e0b', fontWeight: 700 }}>
                      Status: Pending Approval
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Box>
          </Box>
        </Box>
      );
    }

    // ── Rejected / Suspended ──────────────────────────────────────────────
    if (approvalStatus === 'Rejected' || approvalStatus === 'Suspended') {
      const isSuspended = approvalStatus === 'Suspended';
      return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
          <Sidebar activeSection="rider" />
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              p: 3,
              background: theme.palette.mode === 'dark'
                ? 'radial-gradient(ellipse at 50% 50%, rgba(239,68,68,0.03) 0%, transparent 70%)'
                : 'radial-gradient(ellipse at 50% 50%, rgba(239,68,68,0.01) 0%, transparent 70%)',
            }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ maxWidth: 420, width: '100%', textAlign: 'center' }}
              >
                <Box sx={{
                  p: 4,
                  borderRadius: '1.75rem',
                  backdropFilter: 'blur(20px)',
                  background: theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  boxShadow: theme.palette.mode === 'dark' 
                    ? '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(239, 68, 68, 0.05)'
                    : '0 20px 60px rgba(239, 68, 68, 0.05)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0, right: 0, width: 100, height: 100,
                    background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)',
                    borderRadius: '50%',
                  }
                }}>
                  <div style={{
                    width: 84, height: 84,
                    background: 'rgba(239,68,68,0.12)',
                    border: '2px solid rgba(239,68,68,0.3)',
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    boxShadow: '0 0 20px rgba(239,68,68,0.2)',
                    position: 'relative',
                    zIndex: 1,
                  }}>
                    <BlockIcon style={{ color: '#ef4444', fontSize: 42 }} />
                  </div>
                  <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 800, mb: 1, position: 'relative', zIndex: 1 }}>
                    Account {approvalStatus}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, fontSize: '0.925rem', lineHeight: 1.5, position: 'relative', zIndex: 1 }}>
                    {isSuspended
                      ? 'Your rider account has been suspended. Please contact support for assistance.'
                      : 'Your rider application was not approved. Please contact support if you believe this is an error.'}
                  </Typography>
                  <Box sx={{
                    p: 1.5,
                    borderRadius: '0.75rem',
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    position: 'relative',
                    zIndex: 1,
                  }}>
                    <BlockIcon style={{ color: '#ef4444', fontSize: 16 }} />
                    <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 700 }}>
                      Status: {approvalStatus}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Box>
          </Box>
        </Box>
      );
    }

    // ── Approved (or status unknown) — show normal Go Online screen ───────
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Sidebar activeSection="rider" />
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 3,
              background: theme.palette.mode === 'dark'
                ? 'radial-gradient(ellipse at 50% 80%, rgba(16,185,129,0.08) 0%, transparent 65%)'
                : 'radial-gradient(ellipse at 50% 80%, rgba(16,185,129,0.04) 0%, transparent 65%)',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ maxWidth: 460, width: '100%' }}
            >
              {/* Stats row */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, mb: 4 }}>
                {[
                  { icon: <BikeIcon />, label: 'Total Rides', value: stats?.totalRides != null ? stats.totalRides.toString() : '—', color: RIDER_ACCENT, glow: 'rgba(16, 185, 129, 0.1)' },
                  { icon: <EarningsIcon />, label: "Today's Earnings", value: stats?.todayEarnings != null ? `Rs. ${stats.todayEarnings.toLocaleString()}` : '—', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.1)' },
                  { icon: <StarIcon />, label: 'Rating', value: stats?.rating != null ? stats.rating.toFixed(1) : '—', color: '#a78bfa', glow: 'rgba(168, 85, 247, 0.1)' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: `0 8px 32px ${stat.glow}`,
                      borderColor: stat.color
                    }}
                    transition={{ delay: i * 0.1 + 0.2, type: 'spring', stiffness: 300, damping: 20 }}
                    style={{
                      background: theme.palette.mode === 'dark' 
                        ? 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))' 
                        : 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(12px)',
                      border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'}`,
                      borderRadius: 20,
                      padding: '18px 14px',
                      textAlign: 'center',
                      cursor: 'default',
                      transition: 'border-color 0.25s ease',
                    }}
                  >
                    <div style={{ color: stat.color, marginBottom: 8, display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
                    <p style={{ color: theme.palette.text.primary, fontWeight: 900, fontSize: 18, margin: '0 0 4px', letterSpacing: '-0.02em', fontFamily: 'monospace' }}>
                      {stat.value}{stat.label === 'Rating' && stat.value !== '—' && <span style={{ fontSize: 13, color: '#f59e0b', marginLeft: 2 }}>★</span>}
                    </p>
                    <p style={{ color: '#9ca3af', fontSize: 11, fontWeight: 600, margin: 0, lineHeight: 1.3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</p>
                  </motion.div>
                ))}
              </Box>

              {/* Main card */}
              <Box
                sx={{
                  p: 4,
                  borderRadius: '2rem',
                  backdropFilter: 'blur(24px)',
                  background: theme.palette.mode === 'dark'
                    ? `linear-gradient(145deg, rgba(16,185,129,0.06), rgba(16,185,129,0.01))`
                    : 'rgba(255, 255, 255, 0.85)',
                  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.15)'}`,
                  textAlign: 'center',
                  boxShadow: theme.palette.mode === 'dark'
                    ? `0 30px 70px rgba(0,0,0,0.5), 0 0 50px ${ACCENT_ALPHA(0.04)}`
                    : `0 30px 70px ${ACCENT_ALPHA(0.04)}`,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0, right: 0, width: 140, height: 140,
                    background: `radial-gradient(circle, ${ACCENT_ALPHA(0.08)} 0%, transparent 70%)`,
                    borderRadius: '50%',
                    zIndex: 0
                  }
                }}
              >
                {/* Animated bike icon */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ marginBottom: 20, position: 'relative', zIndex: 1 }}
                >
                  <div style={{
                    width: 88, height: 88,
                    background: ACCENT_ALPHA(0.12),
                    border: `2px solid ${ACCENT_ALPHA(0.35)}`,
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 0 25px ${ACCENT_ALPHA(0.2)}`,
                  }}>
                    <BikeIcon style={{ color: RIDER_ACCENT, fontSize: 44 }} />
                  </div>
                </motion.div>

                <Typography variant="h4" sx={{ color: 'text.primary', fontWeight: 900, mb: 1.5, letterSpacing: '-0.02em', position: 'relative', zIndex: 1 }}>
                  Welcome back, {userName}!
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2, fontSize: '0.975rem', lineHeight: 1.5, position: 'relative', zIndex: 1 }}>
                  You are currently <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    padding: '2px 10px', 
                    borderRadius: '20px', 
                    background: 'rgba(239, 68, 68, 0.12)', 
                    border: '1px solid rgba(239, 68, 68, 0.25)', 
                    color: '#ef4444', 
                    fontWeight: 700, 
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    verticalAlign: 'middle',
                    marginLeft: '4px',
                    marginRight: '4px',
                  }}>offline</span>. Go online to accept ride requests.
                </Typography>

                {/* Hub status (only shown if disconnected) */}
                {hubBadge && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, position: 'relative', zIndex: 1 }}>
                    {hubBadge}
                  </Box>
                )}

                <Box sx={{ mb: 4 }} />

                {/* Go Online button */}
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: `0 12px 40px ${ACCENT_ALPHA(0.6)}` }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleToggleOnline}
                  disabled={toggleOnlineMutation.isPending}
                  style={{
                    padding: '18px 48px',
                    borderRadius: 18,
                    border: 'none',
                    background: toggleOnlineMutation.isPending
                      ? ACCENT_ALPHA(0.4)
                      : `linear-gradient(135deg, ${RIDER_ACCENT} 0%, #059669 100%)`,
                    color: 'white',
                    fontWeight: 800,
                    fontSize: 16,
                    cursor: toggleOnlineMutation.isPending ? 'not-allowed' : 'pointer',
                    boxShadow: `0 8px 30px ${ACCENT_ALPHA(0.4)}`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    transition: 'box-shadow 0.25s ease',
                    width: '100%',
                    justifyContent: 'center',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <PowerIcon style={{ fontSize: 20 }} />
                  {toggleOnlineMutation.isPending ? 'Going Online...' : 'Go Online'}
                </motion.button>

                {/* Location permission warning */}
                {permissionState === 'denied' && (
                  <Box sx={{
                    mt: 3, p: 2,
                    borderRadius: '0.75rem',
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    position: 'relative',
                    zIndex: 1,
                  }}>
                    <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                      <BlockIcon sx={{ fontSize: 16 }} />
                      Location permission required. Enable settings to go online.
                    </Typography>
                  </Box>
                )}
              </Box>
            </motion.div>
          </Box>
        </Box>
      </Box>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  STATES 2–7: ONLINE — Full-screen map view
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}>
      <Sidebar activeSection="rider" />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        <Navbar />

        {/* ── Floating status badge (top overlay) ── */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 64, md: 74 },
            left: { xs: 16, md: 280 },
            right: 16,
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexWrap: 'wrap',
          }}
        >
          {/* Status pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(14,14,14,0.92)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${ACCENT_ALPHA(0.3)}`,
              borderRadius: 14,
              padding: '10px 16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}
          >
            {/* Live pulse */}
            <div style={{ position: 'relative', width: 10, height: 10, flexShrink: 0 }}>
              <div style={{ 
                width: 10, height: 10, 
                borderRadius: '50%', 
                background: rideStatus === 'RIDE_REQUESTED' ? '#ef4444' : rideStatus === 'ARRIVED_WAITING' ? '#f59e0b' : RIDER_ACCENT 
              }} />
              <motion.div
                animate={{ scale: [1, 2.5, 1], opacity: [0.8, 0, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ 
                  position: 'absolute', inset: 0, borderRadius: '50%', 
                  background: rideStatus === 'RIDE_REQUESTED' ? '#ef4444' : rideStatus === 'ARRIVED_WAITING' ? '#f59e0b' : RIDER_ACCENT 
                }}
              />
            </div>
            {rideStatus === 'ONLINE_IDLE' && <SignalIcon style={{ color: RIDER_ACCENT, fontSize: 16 }} />}
            {rideStatus === 'RIDE_REQUESTED' && <RequestIcon style={{ color: '#ef4444', fontSize: 16 }} />}
            {rideStatus === 'EN_ROUTE_PICKUP' && <MapIcon style={{ color: '#2E9EBF', fontSize: 16 }} />}
            {rideStatus === 'ARRIVED_WAITING' && <TimerIcon style={{ color: '#f59e0b', fontSize: 16 }} />}
            {rideStatus === 'RIDE_IN_PROGRESS' && <BikeIcon style={{ color: RIDER_ACCENT, fontSize: 16 }} />}
            {rideStatus === 'COMPLETING' && <CompleteIcon style={{ color: RIDER_ACCENT, fontSize: 16 }} />}

            <span style={{ 
              color: 'white', 
              fontWeight: 800, 
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              {rideStatus === 'ONLINE_IDLE' ? 'Online • Looking for rides' :
               rideStatus === 'RIDE_REQUESTED' ? 'Incoming request' :
               rideStatus === 'EN_ROUTE_PICKUP' ? 'En route to pickup' :
               rideStatus === 'ARRIVED_WAITING' ? 'Waiting for OTP' :
               rideStatus === 'RIDE_IN_PROGRESS' ? 'Trip in progress' :
               'Completing ride'}
            </span>
          </motion.div>

          {/* Hub disconnected badge */}
          {hubBadge}

          {/* Go Offline button (only when idle) */}
          {rideStatus === 'ONLINE_IDLE' && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleToggleOnline}
              disabled={toggleOnlineMutation.isPending}
              style={{
                padding: '8px 14px',
                borderRadius: 14,
                border: '1px solid rgba(239,68,68,0.35)',
                background: 'rgba(239,68,68,0.1)',
                color: '#ef4444',
                fontWeight: 700,
                fontSize: 12,
                cursor: 'pointer',
                backdropFilter: 'blur(14px)',
                display: 'flex', alignItems: 'center', gap: 5,
                transition: 'all 0.2s ease',
              }}
            >
              <PowerIcon style={{ fontSize: 14 }} />
              Go Offline
            </motion.button>
          )}
        </Box>

        {/* ── Map fills remaining height ── */}
        <Box sx={{ flex: 1, position: 'relative' }}>
          <MapView
            riderCoords={riderCoords}
            pickupCoords={
              activeRide
                ? { lat: activeRide.pickupLat, lng: activeRide.pickupLng }
                : undefined
            }
            dropoffCoords={
              rideStatus === 'RIDE_IN_PROGRESS' && activeRide
                ? { lat: activeRide.dropoffLat, lng: activeRide.dropoffLng }
                : undefined
            }
            height="100%"
          />

          {/* GPS acquiring overlay */}
          <AnimatePresence>
            {!riderCoords && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{
                  position: 'absolute',
                  bottom: 24,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 1100,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 18px',
                  borderRadius: 30,
                  background: 'rgba(0,0,0,0.85)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  whiteSpace: 'nowrap',
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <LocationIcon style={{ color: RIDER_ACCENT, fontSize: 16 }} />
                </motion.div>
                <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: 12 }}>
                  Acquiring GPS signal...
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {/* ── Overlays / Bottom Sheets ── */}

        {/* Incoming ride request sheet */}
        <AnimatePresence>
          {rideStatus === 'RIDE_REQUESTED' && pendingRequest && (
            <RideRequestSheet
              request={pendingRequest}
              onAccept={() => acceptMutation.mutate()}
              onDecline={handleDeclineRequest}
              isAccepting={acceptMutation.isPending}
            />
          )}
        </AnimatePresence>

        {/* OTP verification sheet */}
        <AnimatePresence>
          {rideStatus === 'ARRIVED_WAITING' && (
            <OtpVerifySheet
              onVerify={(otp) => verifyOtpMutation.mutate(otp)}
              error={otpError}
              isVerifying={verifyOtpMutation.isPending}
            />
          )}
        </AnimatePresence>

        {/* Ride action bar */}
        <AnimatePresence>
          {(rideStatus === 'EN_ROUTE_PICKUP' ||
            rideStatus === 'RIDE_IN_PROGRESS' ||
            rideStatus === 'COMPLETING') && (
            <RideStatusBar
              rideStatus={rideStatus}
              activeRide={activeRide}
              onArrive={() => arriveMutation.mutate()}
              onComplete={() => completeMutation.mutate()}
              isLoading={arriveMutation.isPending || completeMutation.isPending}
            />
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}