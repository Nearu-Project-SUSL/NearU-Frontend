import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  IconButton,
  TextField,
  Button,
  MenuItem as MuiMenuItem,
} from '@mui/material';
import { Close as CloseIcon, PhotoCamera as CameraIcon } from '@mui/icons-material';
import type { ShopResponse } from '../../../api/foodapi';

const FOOD_CATEGORIES = [
  'Restaurant', 'Cafe', 'Bakery',
  'Juice Bar', 'Fast Food', 'Other',
];

interface UpdateShopDialogProps {
  shop: ShopResponse | null;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    address: string;
    phoneNumber: string;
    category: string;
    photo: File | null;
  }) => Promise<void>;
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
  '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.4)' },
};

export default function UpdateShopDialog({ shop, onClose, onSubmit }: UpdateShopDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [category, setCategory] = useState('Other');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // pre-fill with existing shop data when dialog opens
  useEffect(() => {
    if (shop) {
      setName(shop.name);
      setDescription(shop.description || '');
      setAddress(shop.address || '');
      setPhoneNumber(shop.phoneNumber || '');
      setCategory(shop.category || 'Other');
      setPhoto(null);
      setPhotoPreview(null);
      setError('');
    }
  }, [shop]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Shop name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        address: address.trim(),
        phoneNumber: phoneNumber.trim(),
        category,
        photo,
      });
      onClose();
    } catch {
      setError('Failed to update shop. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={!!shop}
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
      {shop && (
        <Box>
          {/* header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, pb: 0 }}>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
              Update Shop
            </Typography>
            <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff' } }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <DialogContent sx={{ p: 3 }}>
            {/* photo */}
            <Box
              sx={{
                position: 'relative',
                height: 160,
                borderRadius: '16px',
                overflow: 'hidden',
                mb: 3,
                bgcolor: 'rgba(255,255,255,0.03)',
                border: '1px dashed rgba(255,255,255,0.1)',
                cursor: 'pointer',
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              {(photoPreview || shop.photoUrl) && (
                <Box
                  component="img"
                  src={photoPreview || shop.photoUrl || ''}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: photoPreview || shop.photoUrl ? 'rgba(0,0,0,0.5)' : 'transparent',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' },
                }}
              >
                <CameraIcon sx={{ color: '#facc15', fontSize: 28, mb: 0.5 }} />
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Click to change photo
                </Typography>
              </Box>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlePhotoChange}
              />
            </Box>

            {/* name */}
            <TextField
              fullWidth
              label="Shop Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ ...inputStyles, mb: 2 }}
            />

            {/* description */}
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={2}
              sx={{ ...inputStyles, mb: 2 }}
            />

            {/* address */}
            <TextField
              fullWidth
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              sx={{ ...inputStyles, mb: 2 }}
            />

            {/* phone */}
            <TextField
              fullWidth
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              sx={{ ...inputStyles, mb: 2 }}
            />

            {/* category dropdown */}
            <TextField
              select
              fullWidth
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={{ ...inputStyles, mb: 2 }}
            >
              {FOOD_CATEGORIES.map((cat) => (
                <MuiMenuItem
                  key={cat}
                  value={cat}
                  sx={{ bgcolor: '#111', color: '#fff', '&:hover': { bgcolor: '#222' } }}
                >
                  {cat}
                </MuiMenuItem>
              ))}
            </TextField>

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
                  bgcolor: '#facc15',
                  color: '#000',
                  fontWeight: 700,
                  borderRadius: '12px',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#eab308' },
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