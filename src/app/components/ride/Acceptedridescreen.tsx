import { useState } from 'react';
import { RidesApi } from '../../../api/Ridesapi';
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Avatar,
  Rating,
  Chip,
  IconButton,
  CircularProgress,
} from '@mui/material';

import {
  Refresh as RefreshIcon,
  Star as StarIcon,
} from '@mui/icons-material';

interface Props {
  rideId: string;
  otp?: string;
  otpExpiresAt?: string;
  riderName?: string;
  riderVehicle?: string;
  riderRating?: number;
  distanceToPickupKm?: number;
  onRideStarted: () => void;
}

export function AcceptedRideScreen({
  rideId,
  otp,
  otpExpiresAt,
  riderName = 'Your rider',
  riderVehicle,
  riderRating,
  distanceToPickupKm,
  onRideStarted,
}: Props) {
  const [currentExpiry, setCurrentExpiry] = useState(otpExpiresAt);
  const [refreshing, setRefreshing] = useState(false);

  const initials = riderName
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const otpDigits = otp?.split('') ?? [];

  async function handleRefresh() {
    setRefreshing(true);
    try {
      const res = await RidesApi.refreshOtp(rideId);

      if (res.data.otpExpiresAt) {
        setCurrentExpiry(res.data.otpExpiresAt);
      }
    } catch {
      // ignore
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        bgcolor: 'var(--bg-base)',
        color: 'var(--text-primary)',
        animation: 'fadeIn 0.5s ease-out',
        position: 'relative',
      }}
    >
      {/* TOP STATUS */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Chip
          label="Rider on the way"
          sx={{
            bgcolor: 'var(--nearu-accent-subtle)',
            color: 'var(--nearu-accent)',
            fontWeight: 500,
            fontSize: '12px',
          }}
        />
      </Box>

      {/* MAIN CARD */}
      <Paper
        elevation={24}
        sx={{
          width: '100%',
          maxWidth: 550,
          borderRadius: 5,
          p: 4,
          bgcolor: 'var(--bg-surface)',
          backdropFilter: 'blur(24px)',
          border: '1px solid',
          borderColor: 'var(--nearu-border)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
          animation: 'slideUp 0.5s ease-out',
        }}
      >
        {/* TITLE */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            Your rider is coming
          </Typography>

          <Typography variant="caption" sx={{ color: 'var(--text-secondary)', mt: 0.5 }}>
            Verify OTP when the rider arrives
          </Typography>
        </Box>

        {/* STATUS CARD */}
        <Box
          sx={{
            borderRadius: 4,
            p: 3,
            mb: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'var(--bg-elevated)',
            border: '1px solid',
            borderColor: 'var(--nearu-border)',
          }}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              mb: 2,
              bgcolor: 'var(--nearu-accent)',
              boxShadow: '0 0 0 8px var(--nearu-accent-subtle)',
            }}
          />

          <Typography
            variant="body2"
            sx={{
              color: 'var(--text-secondary)',
              textAlign: 'center',
            }}
          >
            {distanceToPickupKm != null
              ? `Rider is ${distanceToPickupKm.toFixed(2)} km away`
              : 'Rider is approaching your pickup location'}
          </Typography>
        </Box>

        {/* RIDER CARD */}
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderRadius: 4,
            px: 2,
            py: 1.5,
            mb: 3,
            bgcolor: 'var(--bg-elevated)',
            border: '1px solid',
            borderColor: 'var(--nearu-border)',
          }}
        >
          <Avatar
            sx={{
              width: 44,
              height: 44,
              bgcolor: 'var(--nearu-accent-subtle)',
              border: '1px solid var(--nearu-accent)',
              color: 'var(--nearu-accent)',
              fontWeight: 600,
            }}
          >
            {initials}
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 500, color: 'var(--text-primary)' }}>
              {riderName}
            </Typography>

            {riderVehicle && (
              <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                {riderVehicle}
              </Typography>
            )}
          </Box>

          {riderRating != null && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--nearu-accent)' }}>
                {riderRating.toFixed(1)}
              </Typography>
              <StarIcon sx={{ fontSize: 16, color: 'var(--nearu-accent)' }} />
            </Stack>
          )}
        </Paper>

        {/* OTP CARD */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            p: 3,
            mb: 3,
            bgcolor: 'var(--bg-elevated)',
            border: '1px solid',
            borderColor: 'var(--nearu-border)',
            textAlign: 'center',
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              sx={{
                textTransform: 'uppercase',
                letterSpacing: 2,
                color: 'var(--text-secondary)',
              }}
            >
              Your OTP
            </Typography>

            <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
              Share only with your rider
            </Typography>
          </Box>

          {/* OTP BOXES */}
          <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ mb: 2.5 }}>
            {otpDigits.length === 4
              ? otpDigits.map((d, i) => (
                  <Paper
                    key={i}
                    sx={{
                      width: 56,
                      height: 64,
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 26,
                      fontWeight: 600,
                      bgcolor: 'var(--bg-surface)',
                      border: '1px solid var(--nearu-accent)',
                      color: 'var(--nearu-accent)',
                    }}
                  >
                    {d}
                  </Paper>
                ))
              : [0, 1, 2, 3].map(i => (
                  <Paper
                    key={i}
                    sx={{
                      width: 56,
                      height: 64,
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      bgcolor: 'var(--bg-elevated)',
                      border: '1px solid var(--nearu-border)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    •
                  </Paper>
                ))}
          </Stack>

          <Button
            fullWidth
            onClick={handleRefresh}
            disabled={refreshing}
            startIcon={<RefreshIcon />}
            sx={{
              py: 1,
              fontSize: '13px',
              color: 'var(--text-secondary)',
              textTransform: 'none',
              '&:hover': {
                bgcolor: 'var(--bg-elevated)',
              },
            }}
          >
            {refreshing ? 'Refreshing…' : 'Refresh OTP'}
          </Button>
        </Paper>

        {/* INFO */}
        <Box
          sx={{
            borderRadius: 3,
            p: 2,
            mb: 3,
            bgcolor: 'var(--bg-elevated)',
            border: '1px solid var(--nearu-border)',
          }}
        >
          <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
            Rider will use this OTP to start your ride. Tracking begins after verification.
          </Typography>
        </Box>

        {/* DEV BUTTON */}
        <Button
          fullWidth
          variant="text"
          onClick={onRideStarted}
          sx={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            textTransform: 'none',
            '&:hover': {
              bgcolor: 'var(--bg-elevated)',
            },
          }}
        >
          [Dev] Simulate ride started →
        </Button>
      </Paper>
    </Box>
  );
}