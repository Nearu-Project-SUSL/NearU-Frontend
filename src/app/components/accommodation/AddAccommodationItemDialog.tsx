import { useState } from 'react';
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

export interface AddAccommodationItemFormData {
  name: string;
  description: string;
  price: number;
}

interface AddAccommodationItemDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AddAccommodationItemFormData) => Promise<void>;
}

const inputStyles = {
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    borderRadius: '12px',
    bgcolor: 'rgba(255,255,255,0.03)',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(250,204,21,0.4)' },
    '&.Mui-focused fieldset': { borderColor: '#facc15' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#facc15' },
};

export default function AddAccommodationItemDialog({ open, onClose, onSubmit }: AddAccommodationItemDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    setName('');
    setDescription('');
    setPrice('');
    setError('');
    onClose();
  };

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
      handleClose();
    } catch {
      setError('Failed to add accommodation item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, pb: 0 }}>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
            Add Item
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff' } }}>
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
              onClick={handleClose}
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
                bgcolor: '#facc15',
                color: '#000',
                fontWeight: 700,
                borderRadius: '12px',
                textTransform: 'none',
                '&:hover': { bgcolor: '#eab308' },
              }}
            >
              {loading ? 'Adding...' : 'Add Item'}
            </Button>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
}
