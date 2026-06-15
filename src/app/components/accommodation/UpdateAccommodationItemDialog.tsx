import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  IconButton,
  TextField,
  Button,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import type { AccommodationItem } from '../../../api/accommodationService';

export interface UpdateAccommodationItemFormData {
  name: string;
  description: string;
  price: number;
}

interface UpdateAccommodationItemDialogProps {
  item: AccommodationItem | null;
  onClose: () => void;
  onSubmit: (data: UpdateAccommodationItemFormData) => Promise<void>;
}

const inputStyles = {
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    borderRadius: '12px',
    bgcolor: 'rgba(255,255,255,0.03)',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(46, 158, 191,0.4)' },
    '&.Mui-focused fieldset': { borderColor: '#2e9ebf' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#2e9ebf' },
};

export default function UpdateAccommodationItemDialog({ item, onClose, onSubmit }: UpdateAccommodationItemDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description || '');
      setPrice(item.price.toString());
      setError('');
    }
  }, [item]);

  const handleSubmit = async () => {
    if (!name.trim() || !price) {
      setError('Please fill in all required fields (Name, Price)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        price: Number(price) || 0,
      });
      onClose();
    } catch {
      setError('Failed to update accommodation item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={!!item}
      onClose={onClose}
      maxWidth="sm"
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
      {item && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, pb: 0 }}>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
              Update Item
            </Typography>
            <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff' } }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <DialogContent sx={{ p: 3 }}>
            <TextField
              fullWidth
              label="Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ ...inputStyles, mb: 2 }}
            />

            <TextField
              fullWidth
              type="number"
              label="Price (LKR) *"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              sx={{ ...inputStyles, mb: 2 }}
            />

            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              sx={{ ...inputStyles, mb: 2 }}
            />

            {error && (
              <Typography variant="caption" sx={{ color: '#ef4444', display: 'block', mb: 2 }}>
                {error}
              </Typography>
            )}

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
                onClick={handleSubmit}
                disabled={loading}
                sx={{
                  bgcolor: '#2e9ebf',
                  color: '#000',
                  fontWeight: 700,
                  borderRadius: '12px',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#2e9ebf' },
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </DialogContent>
        </Box>
      )}
    </Dialog>
  );
}
