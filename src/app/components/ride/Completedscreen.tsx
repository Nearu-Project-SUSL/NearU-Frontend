import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Rating,
  TextField,
  Divider,
  Chip,
  alpha,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  ReceiptLong as ReceiptIcon,
  Star as StarIcon,
} from '@mui/icons-material';

interface Props {
  fare: number;
  onDone: (rating: number, feedback: string) => void;
}

export function CompletedScreen({ fare, onDone }: Props) {
  const [rating, setRating]     = useState<number | null>(5);
  const [feedback, setFeedback] = useState('');

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
      }}
    >
      <Paper
        elevation={24}
        sx={{
          width: '100%',
          maxWidth: 500,
          borderRadius: 5,
          p: 4,
          bgcolor: alpha('#121212', 0.96),
          backdropFilter: 'blur(24px)',
          border: '1px solid',
          borderColor: alpha('#fff', 0.08),
          boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
          animation: 'slideUp 0.5s ease-out',
          textAlign: 'center',
        }}
      >
        {/* SUCCESS ICON */}
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: alpha('#63c34a', 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            border: '2px solid',
            borderColor: alpha('#63c34a', 0.2),
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 44, color: '#63c34a' }} />
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Ride Completed!
        </Typography>
        <Typography variant="body2" sx={{ color: alpha('#fff', 0.5), mb: 4 }}>
          Thank you for riding with NearU. We hope you had a safe and pleasant journey.
        </Typography>

        {/* RECEIPT CARD */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            p: 3,
            mb: 4,
            bgcolor: alpha('#fff', 0.03),
            border: '1px solid',
            borderColor: alpha('#fff', 0.08),
            textAlign: 'left',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <ReceiptIcon sx={{ fontSize: 18, color: 'var(--nearu-accent)' }} />
            <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.5, color: alpha('#fff', 0.5) }}>
              Payment Receipt
            </Typography>
          </Stack>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: alpha('#fff', 0.6) }}>Ride Fare</Typography>
            <Typography variant="body2">Rs. {fare.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2" sx={{ color: alpha('#fff', 0.6) }}>Platform Fee</Typography>
            <Typography variant="body2">Included</Typography>
          </Box>

          <Divider sx={{ my: 1.5, borderColor: alpha('#fff', 0.1) }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Total Paid</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--nearu-accent)' }}>
              Rs. {fare.toFixed(2)}
            </Typography>
          </Box>
        </Paper>

        {/* RATING SECTION */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
            How was your rider?
          </Typography>
          <Rating
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            size="large"
            emptyIcon={<StarIcon style={{ color: alpha('#fff', 0.1) }} fontSize="inherit" />}
            sx={{
              '& .MuiRating-iconFilled': { color: '#efab3a' },
              '& .MuiRating-iconHover': { color: '#efab3a' },
            }}
          />
        </Box>

        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder="Leave a comment for your rider (optional)..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          variant="outlined"
          sx={{
            mb: 4,
            '& .MuiOutlinedInput-root': {
              bgcolor: alpha('#fff', 0.02),
              borderRadius: 3,
              color: 'white',
              fontSize: '14px',
              '& fieldset': { borderColor: alpha('#fff', 0.12) },
              '&:hover fieldset': { borderColor: alpha('#fff', 0.2) },
              '&.Mui-focused fieldset': { borderColor: 'var(--nearu-accent)' },
            },
          }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={() => onDone(rating || 5, feedback)}
          sx={{
            py: 2,
            borderRadius: 4,
            fontWeight: 700,
            fontSize: '16px',
            bgcolor: 'var(--nearu-accent)',
            boxShadow: '0 8px 30px rgba(46, 158, 191, 0.4)',
            '&:hover': {
              bgcolor: 'var(--nearu-accent)',
              opacity: 0.9,
            },
            textTransform: 'none',
          }}
        >
          Complete & Back to Home
        </Button>
      </Paper>
    </Box>
  );
}