import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { MenuItem } from './MenuItemCard';
import { useState } from 'react';

interface DeleteMenuItemDialogProps {
  item: MenuItem | null;    // null = closed
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteMenuItemDialog({ item, onClose, onConfirm }: DeleteMenuItemDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

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
          border: '1px solid rgba(239,68,68,0.2)',
          backgroundImage: 'none',
          m: 2,
        },
      }}
    >
      {item && (
        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
          {/* red delete icon */}
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <DeleteIcon sx={{ color: '#f87171', fontSize: 28 }} />
          </Box>

          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
            Delete Menu Item?
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: 'rgba(255,255,255,0.5)', mb: 1, lineHeight: 1.6 }}
          >
            Are you sure you want to delete
          </Typography>

          {/* show item name so user knows exactly what they're deleting */}
          <Typography
            variant="body1"
            sx={{ color: '#facc15', fontWeight: 700, mb: 3 }}
          >
            "{item.name}"
          </Typography>

          <Typography
            variant="caption"
            sx={{ color: 'rgba(255,255,255,0.3)', display: 'block', mb: 3 }}
          >
            This action cannot be undone.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={onClose}
              disabled={loading}
              sx={{
                color: 'rgba(255,255,255,0.6)',
                borderColor: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                textTransform: 'none',
                '&:hover': { borderColor: 'rgba(255,255,255,0.3)' },
              }}
            >
              Cancel
            </Button>

            <Button
              fullWidth
              variant="contained"
              onClick={handleConfirm}
              disabled={loading}
              sx={{
                bgcolor: '#ef4444',
                color: '#fff',
                fontWeight: 700,
                borderRadius: '12px',
                textTransform: 'none',
                '&:hover': { bgcolor: '#dc2626' },
                '&.Mui-disabled': { bgcolor: 'rgba(239,68,68,0.3)' },
              }}
            >
              {loading ? 'Deleting...' : 'Yes, Delete'}
            </Button>
          </Box>
        </DialogContent>
      )}
    </Dialog>
  );
}