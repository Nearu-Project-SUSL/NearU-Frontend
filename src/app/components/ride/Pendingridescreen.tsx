import { useEffect, useState } from 'react';
import { RidesApi } from '../../../api/Ridesapi';
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Chip,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  CircularProgress,
  alpha,
} from '@mui/material';
import {
  Check as CheckIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

interface Props {
  rideId: string;
  onAccepted: (otpExpiresAt?: string) => void;
  onCancel: () => void;
}

const STEPS = [
  {
    label: 'Request submitted',
    description: 'Broadcasted to nearby riders',
    state: 'done',
  },
  {
    label: 'Rider accepts',
    description: 'Waiting for a rider to pick up your request',
    state: 'active',
  },
  {
    label: 'Rider verifies OTP',
    description: 'You will receive an OTP once accepted',
    state: 'pending',
  },
  {
    label: 'Ride in progress',
    description: 'Track your rider live on the map',
    state: 'pending',
  },
];

export function PendingRideScreen({ rideId, onAccepted, onCancel }: Props) {
  const [cancelling, setCancelling] = useState(false);
  const [dots, setDots] = useState('');

  // Animated ellipsis for "Searching" text
  useEffect(() => {
    const id = setInterval(
      () => setDots(d => (d.length >= 3 ? '' : d + '.')),
      500,
    );
    return () => clearInterval(id);
  }, []);

  async function handleCancel() {
    setCancelling(true);
    try {
      await RidesApi.cancelRide(rideId);
    } catch {
      // proceed regardless
    } finally {
      onCancel();
    }
  }

  const activeStep = 1;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        bgcolor: '#0b0b0b',
        color: 'var(--text-primary)',
        animation: 'fadeIn 0.5s ease-out',
        position: 'relative',
      }}
    >
      {/* TOP STATUS */}
      <Box sx={{ position: 'absolute', top: 20, display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Chip
          label={`Finding a rider${dots}`}
          sx={{
            bgcolor: alpha('#efab3a', 0.12),
            color: '#efab3a',
            fontWeight: 500,
            fontSize: '12px',
          }}
        />
      </Box>

      {/* MAIN POPUP */}
      <Paper
        elevation={24}
        sx={{
          width: '100%',
          maxWidth: 550,
          borderRadius: 5,
          p: 4,
          bgcolor: alpha('#121212', 0.96),
          backdropFilter: 'blur(24px)',
          border: '1px solid',
          borderColor: alpha('#fff', 0.08),
          boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
          animation: 'slideUp 0.5s ease-out',
        }}
      >
        {/* TITLE */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Waiting for a rider
          </Typography>
          <Typography variant="caption" sx={{ color: alpha('#fff', 0.5), mt: 0.5 }}>
            We’re matching you with the nearest available rider
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
            bgcolor: alpha('#fff', 0.04),
            border: '1px solid',
            borderColor: alpha('#fff', 0.06),
          }}
        >
          <Box
             sx={{
               width: 12,
               height: 12,
               borderRadius: '50%',
               mb: 1.5,
               bgcolor: 'var(--nearu-accent)',
               boxShadow: `0 0 10px var(--nearu-accent)`,
               animation: 'pulse 1.5s infinite',
             }}
          />
          <Typography variant="body2" sx={{ color: alpha('#fff', 0.6), textAlign: 'center' }}>
            Searching nearby riders{dots}
          </Typography>
        </Box>

        {/* PROGRESS STEPS */}
        <Box
          sx={{
            borderRadius: 4,
            p: 3,
            mb: 3,
            border: '1px solid',
            bgcolor: alpha('#fff', 0.03),
            borderColor: alpha('#fff', 0.08),
          }}
        >
          <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 2, mb: 2, color: alpha('#fff', 0.5) }}>
            Ride progress
          </Typography>

          <Stepper activeStep={activeStep} orientation="vertical" sx={{ 
            '& .MuiStepConnector-line': { borderColor: alpha('#fff', 0.1) },
          }}>
            {STEPS.map((step, index) => (
              <Step key={step.label} active={index <= activeStep} completed={index < activeStep}>
                <StepLabel
                  StepIconComponent={({ active, completed }) => (
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        border: '1px solid',
                        bgcolor: completed ? alpha('#63c34a', 0.15) : active ? alpha('#2e9ebf', 0.15) : alpha('#fff', 0.03),
                        color: completed ? '#63c34a' : active ? '#2e9ebf' : alpha('#fff', 0.4),
                        borderColor: completed ? alpha('#63c34a', 0.3) : active ? '#2e9ebf' : alpha('#fff', 0.08),
                      }}
                    >
                      {completed ? <CheckIcon sx={{ fontSize: 14 }} /> : index + 1}
                    </Box>
                  )}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500, color: index <= activeStep ? 'white' : alpha('#fff', 0.4) }}>
                    {step.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: alpha('#fff', 0.4) }}>
                    {step.description}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* RIDER ID */}
        <Box
          sx={{
            borderRadius: 3,
            px: 2,
            py: 1,
            mb: 3,
            fontSize: '12px',
            bgcolor: alpha('#fff', 0.03),
            border: '1px solid',
            borderColor: alpha('#fff', 0.06),
            color: alpha('#fff', 0.6),
          }}
        >
          Ride ID:{" "}
          <Box component="span" sx={{ color: 'var(--nearu-accent)', fontFamily: 'monospace' }}>
            {rideId.slice(0, 8)}…
          </Box>
        </Box>

        {/* ACTIONS */}
        <Stack spacing={2}>
          <Button
            fullWidth
            onClick={handleCancel}
            disabled={cancelling}
            variant="outlined"
            sx={{
              py: 1.5,
              borderRadius: 3,
              fontSize: '14px',
              fontWeight: 500,
              color: '#e84c6e',
              borderColor: alpha('#e84c6e', 0.25),
              bgcolor: alpha('#e84c6e', 0.12),
              '&:hover': {
                bgcolor: alpha('#e84c6e', 0.2),
                borderColor: alpha('#e84c6e', 0.4),
              },
              textTransform: 'none',
            }}
          >
            {cancelling ? <CircularProgress size={20} color="inherit" /> : 'Cancel request'}
          </Button>

          {/* DEV ONLY */}
          <Button
            fullWidth
            variant="text"
            onClick={() => onAccepted(new Date(Date.now() + 10 * 60 * 1000).toISOString())}
            sx={{
              fontSize: '13px',
              color: alpha('#fff', 0.4),
              textTransform: 'none',
              '&:hover': { bgcolor: alpha('#fff', 0.05) }
            }}
          >
            [Dev] Simulate rider accepted →
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}