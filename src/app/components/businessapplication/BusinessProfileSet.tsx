import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, Button, TextField, FormControl,
  InputLabel, Select, MenuItem, Stepper, Step, StepLabel,
  CircularProgress, Paper, Chip, Avatar, IconButton,
  LinearProgress
} from '@mui/material';
import {
  Store as StoreIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as PendingIcon,
  Cancel as RejectedIcon,
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  Restaurant as FoodIcon,
  ArrowForward as NextIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';
import { toast } from 'sonner';
import businessService, { BusinessStatus } from '../../../api/businessService';

interface Props {
  open: boolean;
  onClose: () => void;
  onCompleted: () => void; // called when profile is successfully created
}

const FOOD_CATEGORIES = ['Restaurant', 'Cafe', 'Bakery', 'Fast Food', 'Street Food', 'Other'];

export default function BusinessProfileSetupModal({ open, onClose, onCompleted }: Props) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [status, setStatus] = useState<BusinessStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    phoneNumber: '',
    category: 'Restaurant',
    photo: null as File | null
  });

  // Step 0 = checking status, 1 = fill form, 2 = success

  useEffect(() => {
    if (!open) return;
    setLoadingStatus(true);
    setStep(0);

    businessService.getStatus()
      .then(data => {
        setStatus(data);
        // Pre-fill name from application
        setForm(prev => ({ ...prev, name: data.businessName }));
      })
      .catch(() => {
        toast.error('Could not load your business status.');
      })
      .finally(() => setLoadingStatus(false));
  }, [open]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm(prev => ({ ...prev, photo: file }));
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error('Shop name is required.');
      return;
    }

    setSubmitting(true);
    try {
      await businessService.createFoodShop({
        name: form.name,
        description: form.description,
        address: form.address,
        phoneNumber: form.phoneNumber,
        category: form.category,
        photo: form.photo ?? undefined
      });
      setStep(2);
      toast.success('Food shop profile created!');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to create food shop.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStatusBadge = () => {
    if (!status) return null;
    const config = {
      Approved: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: <CheckCircleIcon />, label: 'Approved' },
      Pending:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  icon: <PendingIcon />,     label: 'Pending Review' },
      Rejected: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   icon: <RejectedIcon />,    label: 'Rejected' }
    }[status.status];

    return (
      <Chip
        icon={config.icon}
        label={config.label}
        sx={{ color: config.color, bgcolor: config.bg, border: `1px solid ${config.color}`, fontWeight: 700 }}
      />
    );
  };

  return (
    <Dialog
      open={open}
      onClose={step === 2 ? onCompleted : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, #0d0e12 0%, #111827 100%)',
          border: '1px solid rgba(46, 158, 191, 0.2)',
          borderRadius: '1.5rem',
          color: 'white'
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: 'rgba(46,158,191,0.15)', border: '1px solid rgba(46,158,191,0.3)' }}>
            <StoreIcon sx={{ color: '#2E9EBF' }} />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
              Business Profile Setup
            </Typography>
            <Typography variant="caption" sx={{ color: 'gray' }}>
              Complete your profile to start listing
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={step === 2 ? onCompleted : onClose} sx={{ color: 'gray' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Loading */}
        {loadingStatus && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, gap: 2 }}>
            <CircularProgress sx={{ color: '#2E9EBF' }} />
            <Typography sx={{ color: 'gray' }}>Checking your application status...</Typography>
          </Box>
        )}

        {/* Status: Pending */}
        {!loadingStatus && status?.status === 'Pending' && (
          <Paper sx={{ p: 4, bgcolor: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '1rem', textAlign: 'center' }}>
            <PendingIcon sx={{ fontSize: 56, color: '#f59e0b', mb: 2 }} />
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
              Application Under Review
            </Typography>
            <Typography sx={{ color: 'gray', mb: 3 }}>
              Your application for <strong style={{ color: 'white' }}>{status.businessName}</strong> is being reviewed by our admin team. You'll be able to set up your profile once approved.
            </Typography>
            {renderStatusBadge()}
          </Paper>
        )}

        {/* Status: Rejected */}
        {!loadingStatus && status?.status === 'Rejected' && (
          <Paper sx={{ p: 4, bgcolor: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '1rem', textAlign: 'center' }}>
            <RejectedIcon sx={{ fontSize: 56, color: '#ef4444', mb: 2 }} />
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
              Application Rejected
            </Typography>
            <Typography sx={{ color: 'gray', mb: 3 }}>
              Unfortunately your application was not approved. Please contact support for more information.
            </Typography>
            {renderStatusBadge()}
          </Paper>
        )}

        {/* Status: Approved — Show Form */}
        {!loadingStatus && status?.status === 'Approved' && step !== 2 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Approved badge */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ color: 'gray', fontSize: 14 }}>
                Application: <strong style={{ color: 'white' }}>{status.businessName}</strong>
              </Typography>
              {renderStatusBadge()}
            </Box>

            <Box sx={{ borderBottom: '1px solid rgba(255,255,255,0.08)', my: 1 }} />

            {/* Food Shop Form */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <FoodIcon sx={{ color: '#2E9EBF' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'white' }}>
                Food Shop Details
              </Typography>
            </Box>

            <TextField
              fullWidth label="Shop Name" required
              value={form.name}
              onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
              sx={fieldSx}
            />

            <FormControl fullWidth sx={fieldSx}>
              <InputLabel sx={{ color: 'gray' }}>Category</InputLabel>
              <Select
                value={form.category}
                label="Category"
                onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                sx={{ color: 'white' }}
              >
                {FOOD_CATEGORIES.map(c => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth label="Description" multiline rows={2}
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              sx={fieldSx}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth label="Address (optional)"
                value={form.address}
                onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))}
                sx={fieldSx}
                helperText="Leave blank to use registration address"
                FormHelperTextProps={{ sx: { color: 'gray' } }}
              />
              <TextField
                fullWidth label="Phone (optional)"
                value={form.phoneNumber}
                onChange={e => setForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                sx={fieldSx}
              />
            </Box>

            {/* Photo Upload */}
            <Box>
              <input
                type="file" accept="image/*" id="shop-photo"
                style={{ display: 'none' }}
                onChange={handlePhotoChange}
              />
              <label htmlFor="shop-photo">
                <Paper
                  component="span"
                  sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: 1.5, p: 2, cursor: 'pointer',
                    border: '2px dashed rgba(46,158,191,0.3)',
                    borderRadius: '1rem',
                    bgcolor: 'rgba(46,158,191,0.03)',
                    '&:hover': { borderColor: '#2E9EBF', bgcolor: 'rgba(46,158,191,0.07)' },
                    transition: 'all 0.2s'
                  }}
                >
                  {photoPreview ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <img src={photoPreview} alt="preview" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
                      <Typography sx={{ color: '#2E9EBF', fontWeight: 600 }}>Photo selected — click to change</Typography>
                    </Box>
                  ) : (
                    <>
                      <UploadIcon sx={{ color: '#2E9EBF' }} />
                      <Typography sx={{ color: 'gray' }}>Upload shop photo <span style={{ color: '#2E9EBF' }}>(optional)</span></Typography>
                    </>
                  )}
                </Paper>
              </label>
            </Box>
          </Box>
        )}

        {/* Step 2: Success */}
        {step === 2 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 72, color: '#10b981', mb: 2 }} />
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
              You're all set!
            </Typography>
            <Typography sx={{ color: 'gray', mb: 3 }}>
              Your food shop profile is live. You can now manage your menu and listings.
            </Typography>
            <Button
              variant="contained"
              onClick={onCompleted}
              sx={{ bgcolor: '#10b981', color: 'white', borderRadius: '0.75rem', px: 4 }}
            >
              Go to Dashboard
            </Button>
          </Box>
        )}
      </DialogContent>

      {/* Footer Actions */}
      {!loadingStatus && status?.status === 'Approved' && step !== 2 && (
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} sx={{ color: 'gray' }}>
            Later
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting || !form.name.trim()}
            startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <NextIcon />}
            sx={{
              bgcolor: '#2E9EBF', color: 'black', fontWeight: 700,
              borderRadius: '0.75rem', px: 4,
              '&:hover': { bgcolor: '#1a7a9a' }
            }}
          >
            {submitting ? 'Creating...' : 'Create Shop Profile'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

// Shared field styles
const fieldSx = {
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(46,158,191,0.4)' },
    '&.Mui-focused fieldset': { borderColor: '#2E9EBF' }
  },
  '& .MuiInputLabel-root': { color: 'gray' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#2E9EBF' }
};