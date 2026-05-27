import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  IconButton,
  TextField,
  Button,
} from '@mui/material';
import { Close as CloseIcon, PhotoCamera as CameraIcon } from '@mui/icons-material';
import type { MenuItem } from './MenuItemCard';

interface UpdateMenuItemDialogProps {
  item: MenuItem | null;       // null = dialog closed
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    price: number;
    photo: File | null;
  }) => Promise<void>;
}

const inputStyles = {
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    borderRadius: '12px',
    bgcolor: 'rgba(255,255,255,0.03)',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(46,158,191,0.4)' },
    '&.Mui-focused fieldset': { borderColor: '#2E9EBF' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#2E9EBF' },
};

export default function UpdateMenuItemDialog({ item, onClose, onSubmit }: UpdateMenuItemDialogProps) {
  // pre-fill form with existing item data
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // when item changes (dialog opens) fill form with current values
  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description || '');
      setPrice(String(item.price));
      setPhoto(null);
      setPhotoPreview(null);
      setError('');
    }
  }, [item]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhoto(file);
    // create a local URL to preview the selected image
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Price must be a valid number greater than 0');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        price: priceNum,
        photo,
      });
      onClose();
    } catch (err) {
      setError('Failed to update item. Please try again.');
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
          {/* header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 3,
              pb: 0,
            }}
          >
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
              Update Menu Item
            </Typography>
            <IconButton
              onClick={onClose}
              sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff' } }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <DialogContent sx={{ p: 3 }}>
            {/* photo section */}
            <Box
              sx={{
                position: 'relative',
                height: 180,
                borderRadius: '16px',
                overflow: 'hidden',
                mb: 3,
                bgcolor: 'rgba(255,255,255,0.03)',
                border: '1px dashed rgba(255,255,255,0.1)',
                cursor: 'pointer',
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              {/* show new preview or existing photo */}
              {(photoPreview || item.photoUrl) && (
                <Box
                  component="img"
                  src={photoPreview || item.photoUrl}
                  alt="preview"
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}

              {/* overlay with camera icon */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: photoPreview || item.photoUrl
                    ? 'rgba(0,0,0,0.5)'
                    : 'transparent',
                  transition: 'all 0.2s ease',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
                }}
              >
                <CameraIcon sx={{ color: '#2E9EBF', fontSize: 32, mb: 1 }} />
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {photoPreview ? 'Change photo' : 'Click to change photo'}
                </Typography>
              </Box>

              {/* hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlePhotoChange}
              />
            </Box>

            {/* name field — pre-filled */}
            <TextField
              fullWidth
              label="Item Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ ...inputStyles, mb: 2 }}
            />

            {/* description field — pre-filled */}
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              sx={{ ...inputStyles, mb: 2 }}
            />

            {/* price field — pre-filled */}
            <TextField
              fullWidth
              label="Price (Rs.)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              inputProps={{ min: 0, step: 0.01 }}
              sx={{ 
                ...inputStyles, 
                mb: 2,
                '& input[type=number]': {
                MozAppearance: 'textfield', // Firefox
                },
                '& input[type=number]::-webkit-outer-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0,
                },
                '& input[type=number]::-webkit-inner-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0,
                }, 
              }}
            />

            {/* error message */}
            {error && (
              <Typography
                variant="caption"
                sx={{ color: '#ef4444', display: 'block', mb: 2 }}
              >
                {error}
              </Typography>
            )}

            {/* action buttons */}
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
                  bgcolor: '#2E9EBF',
                  color: '#fff',
                  fontWeight: 700,
                  borderRadius: '12px',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#1a7a9a' },
                  '&.Mui-disabled': { bgcolor: 'rgba(46,158,191,0.3)' },
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