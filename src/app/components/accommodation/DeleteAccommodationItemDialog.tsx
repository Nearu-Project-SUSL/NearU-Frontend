import { Dialog, DialogContent, Typography, Box, Button } from '@mui/material';
import { WarningAmber as WarningIcon } from '@mui/icons-material';
import type { AccommodationItem } from '../../../api/accommodationService';

interface DeleteAccommodationItemDialogProps {
  item: AccommodationItem | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteAccommodationItemDialog({
  item,
  onClose,
  onConfirm,
}: DeleteAccommodationItemDialogProps) {
  return (
    <Dialog
      open={!!item}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#0a0a0a',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.08)',
          backgroundImage: 'none',
          m: 2,
        },
      }}
    >
      <DialogContent sx={{ p: 4, textAlign: 'center' }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: 'rgba(239, 68, 68, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <WarningIcon sx={{ fontSize: 32, color: '#ef4444' }} />
        </Box>

        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
          Delete Item?
        </Typography>

        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 4 }}>
          Are you sure you want to delete <strong style={{ color: '#fff' }}>{item?.name}</strong>? This action cannot be undone.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={onClose}
            sx={{
              color: 'rgba(255,255,255,0.6)',
              borderColor: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { borderColor: 'rgba(255,255,255,0.3)' },
            }}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={onConfirm}
            sx={{
              bgcolor: '#ef4444',
              color: '#fff',
              fontWeight: 700,
              borderRadius: '12px',
              textTransform: 'none',
              '&:hover': { bgcolor: '#dc2626' },
            }}
          >
            Delete
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
