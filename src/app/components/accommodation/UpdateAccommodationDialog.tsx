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
import type { Accommodation } from '../../pages/data/accommodations';

const ACCOMMODATION_TYPES = ['Boarding', 'Annex', 'Apartment'];

interface UpdateAccommodationDialogProps {
  accommodation: Accommodation | null;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    type: string;
    location: string;
    distanceKm: number;
    monthlyRent: number;
    availableBeds: number;
    contactPhone: string;
    description: string;
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

export default function UpdateAccommodationDialog({ accommodation, onClose, onSubmit }: UpdateAccommodationDialogProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Boarding');
  const [location, setLocation] = useState('');
  const [distanceKm, setDistanceKm] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [availableBeds, setAvailableBeds] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (accommodation) {
      setTitle(accommodation.title);
      setType(accommodation.type);
      setLocation(accommodation.location);
      setDistanceKm(accommodation.distanceKm.toString());
      setMonthlyRent(accommodation.monthlyRent.toString());
      setAvailableBeds(accommodation.availableBeds.toString());
      setContactPhone(accommodation.contactPhone);
      setDescription(accommodation.description);
      setPhoto(null);
      setPhotoPreview(null);
      setError('');
    }
  }, [accommodation]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !location.trim() || !monthlyRent || !contactPhone.trim()) {
      setError('Please fill in all required fields (Title, Location, Rent, Contact Phone)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit({
        title: title.trim(),
        type,
        location: location.trim(),
        distanceKm: Number(distanceKm) || 0,
        monthlyRent: Number(monthlyRent) || 0,
        availableBeds: Number(availableBeds) || 0,
        contactPhone: contactPhone.trim(),
        description: description.trim(),
        photo,
      });
      onClose();
    } catch {
      setError('Failed to update accommodation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={!!accommodation}
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
      {accommodation && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, pb: 0 }}>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
              Update Accommodation
            </Typography>
            <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#fff' } }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <DialogContent sx={{ p: 3 }}>
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
              {(photoPreview || accommodation.image) && (
                <Box
                  component="img"
                  src={photoPreview || accommodation.image}
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
                  bgcolor: photoPreview || accommodation.image ? 'rgba(0,0,0,0.5)' : 'transparent',
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

            <TextField
              fullWidth
              label="Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ ...inputStyles, mb: 2 }}
            />

            <TextField
              select
              fullWidth
              label="Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              sx={{ ...inputStyles, mb: 2 }}
            >
              {ACCOMMODATION_TYPES.map((t) => (
                <MuiMenuItem key={t} value={t} sx={{ bgcolor: '#111', color: '#fff', '&:hover': { bgcolor: '#222' } }}>
                  {t}
                </MuiMenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Location *"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              sx={{ ...inputStyles, mb: 2 }}
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                type="number"
                label="Distance (km)"
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value)}
                sx={inputStyles}
              />
              <TextField
                fullWidth
                type="number"
                label="Monthly Rent (LKR) *"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                sx={inputStyles}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                type="number"
                label="Available Beds"
                value={availableBeds}
                onChange={(e) => setAvailableBeds(e.target.value)}
                sx={inputStyles}
              />
              <TextField
                fullWidth
                label="Contact Phone *"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                sx={inputStyles}
              />
            </Box>

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
