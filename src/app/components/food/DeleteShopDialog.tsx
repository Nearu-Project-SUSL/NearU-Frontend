import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { ShopResponse } from '../../../api/foodapi';

interface DeleteShopDialogProps {
  shop: ShopResponse | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteShopDialog({ shop, onClose, onConfirm }: DeleteShopDialogProps) {
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
      open={!!shop}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'var(--bg-surface)',
          borderRadius: '24px',
          border: '1px solid rgba(212, 24, 61, 0.2)',
          backgroundImage: 'none',
          m: 2,
        },
      }}
    >
      {shop && (
        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
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
            Delete Shop?
          </Typography>

          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1 }}>
            Are you sure you want to delete
          </Typography>

          <Typography variant="body1" sx={{ color: '#facc15', fontWeight: 700, mb: 1 }}>
            "{shop.name}"
          </Typography>

          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', display: 'block', mb: 3 }}>
            This will also delete all menu items. This cannot be undone.
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