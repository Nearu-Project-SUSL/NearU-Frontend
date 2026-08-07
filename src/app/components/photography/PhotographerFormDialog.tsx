import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import type { PhotographerResponseDto } from "../../../api/services/photographerApi";

interface PhotographerFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: PhotographerResponseDto | null;
  loading?: boolean;
}

export default function PhotographerFormDialog({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}: PhotographerFormDialogProps) {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [baseRatePerHour, setBaseRatePerHour] = useState<string>("");
  const [locationName, setLocationName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setBio(initialData.bio || "");
      setBaseRatePerHour(initialData.baseRatePerHour?.toString() || "");
      setLocationName(initialData.locationName || "");
      setPhone(initialData.phone || "");
      setEmail(initialData.email || "");
      setImagePreview(initialData.imageUrl || null);
    } else {
      setName("");
      setBio("");
      setBaseRatePerHour("");
      setLocationName("");
      setPhone("");
      setEmail("");
      setImageFile(null);
      setImagePreview(null);
    }
  }, [initialData, open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("Name", name);
    if (bio) formData.append("Bio", bio);
    formData.append("BaseRatePerHour", baseRatePerHour);
    formData.append("LocationName", locationName);
    formData.append("Phone", phone);
    if (email) formData.append("Email", email);
    if (imageFile) formData.append("Image", imageFile);

    await onSubmit(formData);
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      bgcolor: "rgba(46, 158, 191, 0.03)",
      borderRadius: "14px",
      "& fieldset": { borderColor: "var(--nearu-border)" },
      "&:hover fieldset": { borderColor: "#2E9EBF" },
      "&.Mui-focused fieldset": {
        borderColor: "#2E9EBF",
        boxShadow: "0 0 12px rgba(46, 158, 191, 0.15)",
      },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#2E9EBF" },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "var(--bg-base)",
          backgroundImage: "none",
          borderRadius: "24px",
          border: "1px solid var(--nearu-border)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <CameraAltIcon sx={{ color: "#2E9EBF", fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--text-primary)" }}>
            {initialData ? "Update Photographer Profile" : "Register Photographer Profile"}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "var(--text-secondary)" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 2 }}>
          {/* Image Upload Box */}
          <Box
            component="label"
            sx={{
              width: "100%",
              height: 140,
              borderRadius: "16px",
              border: "2px dashed var(--nearu-border)",
              bgcolor: "rgba(46, 158, 191, 0.03)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              overflow: "hidden",
              position: "relative",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "#2E9EBF",
                bgcolor: "rgba(46, 158, 191, 0.06)",
              },
            }}
          >
            <input type="file" accept="image/*" hidden onChange={handleFileChange} />
            {imagePreview ? (
              <Box
                component="img"
                src={imagePreview}
                alt="Preview"
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <>
                <CloudUploadIcon sx={{ fontSize: 36, color: "#2E9EBF", mb: 1 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: "var(--text-primary)" }}>
                  Click or drag photo to upload
                </Typography>
                <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>
                  PNG, JPG or WEBP (Max 5MB)
                </Typography>
              </>
            )}
          </Box>

          <TextField
            label="Photographer / Studio Name"
            required
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: "#2E9EBF" }} />
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />

          <TextField
            label="Base Rate Per Hour (LKR)"
            required
            fullWidth
            type="number"
            value={baseRatePerHour}
            onChange={(e) => setBaseRatePerHour(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoneyIcon sx={{ color: "#2E9EBF" }} />
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />

          <TextField
            label="Location / Campus"
            required
            fullWidth
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOnIcon sx={{ color: "#2E9EBF" }} />
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />

          <TextField
            label="Phone Number"
            required
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon sx={{ color: "#2E9EBF" }} />
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />

          <TextField
            label="Email Address (Optional)"
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: "#2E9EBF" }} />
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />

          <TextField
            label="Bio / Experience Description"
            multiline
            rows={3}
            fullWidth
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            sx={inputSx}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={onClose} disabled={loading} sx={{ color: "var(--text-secondary)" }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} /> : null}
            sx={{
              bgcolor: "#2E9EBF",
              color: "#fff",
              fontWeight: 700,
              borderRadius: "14px",
              px: 4,
              py: 1.2,
              "&:hover": { bgcolor: "#25829e" },
            }}
          >
            {initialData ? "Update Profile" : "Create Profile"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
