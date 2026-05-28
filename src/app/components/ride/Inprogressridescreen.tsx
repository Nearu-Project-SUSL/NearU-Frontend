import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Avatar,
  Chip,
} from '@mui/material';

interface Props {
  riderName?: string;
  riderVehicle?: string;
  estimatedFare: number;
  dropoffLabel?: string;
  onRiderCompleted: () => void;
}

export function InProgressRideScreen({
  riderName = 'Your rider',
  riderVehicle,
  estimatedFare,
  dropoffLabel = 'Drop-off point',
  onRiderCompleted,
}: Props) {
  const initials = riderName
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

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
          label="● Ride in progress"
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
          border: '1px solid var(--nearu-border)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
          animation: 'slideUp 0.5s ease-out',
        }}
      >
        {/* TITLE */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            Your trip is ongoing
          </Typography>

          <Typography
            variant="caption"
            sx={{ color: 'var(--text-secondary)', mt: 0.5, display: 'block' }}
          >
            Live tracking active
          </Typography>
        </Box>

        {/* LIVE STATUS CARD */}
        <Box
          sx={{
            borderRadius: 4,
            p: 3,
            mb: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'var(--bg-elevated)',
            border: '1px solid var(--nearu-border)',
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
            Navigating to your destination
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
            border: '1px solid var(--nearu-border)',
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
              <Typography
                variant="caption"
                sx={{ color: 'var(--text-secondary)', display: 'block' }}
              >
                {riderVehicle}
              </Typography>
            )}
          </Box>
        </Paper>

        {/* TRIP INFO */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            p: 3,
            mb: 3,
            bgcolor: 'var(--bg-elevated)',
            border: '1px solid var(--nearu-border)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              pb: 1.5,
              borderBottom: '1px solid var(--nearu-border)',
            }}
          >
            <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
              Destination
            </Typography>

            <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--text-primary)' }}>
              {dropoffLabel}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              pt: 2,
              alignItems: 'center',
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500, color: 'var(--text-primary)' }}>
              Estimated fare
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 600, color: 'var(--nearu-accent)' }}>
              Rs. {estimatedFare.toFixed(2)}
            </Typography>
          </Box>
        </Paper>

        {/* LIVE STATUS */}
        <Box
          sx={{
            borderRadius: 3,
            p: 2,
            mb: 3,
            bgcolor: 'var(--bg-elevated)',
            border: '1px solid var(--nearu-border)',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'var(--text-secondary)',
              textAlign: 'center',
              display: 'block',
            }}
          >
            Waiting for rider to complete the trip…
          </Typography>
        </Box>

        {/* DEV ONLY */}
        <Button
          fullWidth
          onClick={onRiderCompleted}
          variant="outlined"
          sx={{
            py: 1.5,
            borderRadius: 2.5,
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--nearu-accent)',
            borderColor: 'var(--nearu-accent)',
            bgcolor: 'var(--nearu-accent-subtle)',
            textTransform: 'none',
            '&:hover': {
              bgcolor: 'var(--bg-elevated)',
            },
          }}
        >
          [Dev] Simulate rider completed →
        </Button>
      </Paper>
    </Box>
  );
}