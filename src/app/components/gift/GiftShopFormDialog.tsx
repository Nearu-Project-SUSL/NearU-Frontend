import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Switch,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import type { GiftShopResponseDto } from "../../../api/services/giftShopApi";

interface GiftShopFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  initialData?: GiftShopResponseDto | null;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function GiftShopFormDialog({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
}: GiftShopFormDialogProps) {
  const [name, setName] = useState("");
  const [locationName, setLocationName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setName(initialData?.name || "");
      setLocationName(initialData?.locationName || "");
      setPhone(initialData?.phone || "");
      setEmail(initialData?.email || "");
      setAddress(initialData?.address || "");
      setIsActive(initialData?.isActive ?? true);
      setImage(null);
      setErrors({});
    }
  }, [open, initialData]);

  const handleSubmit = async () => {
    // Validate required fields
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Shop name is required";
    if (!locationName.trim()) newErrors.locationName = "Location name is required";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const formData = new FormData();
    formData.append("Name", name.trim());
    formData.append("LocationName", locationName.trim());
    formData.append("Phone", phone.trim());
    formData.append("Email", email.trim());
    formData.append("Address", address.trim());

    if (mode === "edit") {
      formData.append("IsActive", String(isActive));
    }

    if (image) {
      formData.append("Image", image);
    }

    setSaving(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      // Error is already handled by the parent (toast), just stop saving
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          bgcolor: "#0a0a0a",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.08)",
        },
      }}
    >
      <DialogTitle sx={{ color: "#fff", fontWeight: 800 }}>
        {mode === "create" ? "Create Gift Shop" : "Edit Gift Shop"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Shop Name"
            value={name}
            onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
            InputLabelProps={{ style: { color: "rgba(255,255,255,0.55)" } }}
            sx={darkTextFieldSx}
          />

          <TextField
            label="Location Name"
            value={locationName}
            onChange={(e) => { setLocationName(e.target.value); setErrors((p) => ({ ...p, locationName: "" })); }}
            fullWidth
            error={!!errors.locationName}
            helperText={errors.locationName}
            InputLabelProps={{ style: { color: "rgba(255,255,255,0.55)" } }}
            sx={darkTextFieldSx}
          />

          <TextField
            label="Phone"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: "" })); }}
            fullWidth
            error={!!errors.phone}
            helperText={errors.phone}
            InputLabelProps={{ style: { color: "rgba(255,255,255,0.55)" } }}
            sx={darkTextFieldSx}
          />

          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            InputLabelProps={{ style: { color: "rgba(255,255,255,0.55)" } }}
            sx={darkTextFieldSx}
          />

          <TextField
            label="Address"
            value={address}
            onChange={(e) => { setAddress(e.target.value); setErrors((p) => ({ ...p, address: "" })); }}
            fullWidth
            multiline
            rows={3}
            error={!!errors.address}
            helperText={errors.address}
            InputLabelProps={{ style: { color: "rgba(255,255,255,0.55)" } }}
            sx={darkTextFieldSx}
          />

          <Box>
            <Typography sx={{ color: "rgba(255,255,255,0.7)", mb: 1 }}>
              Shop Image
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </Box>

          {mode === "edit" && (
            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
              }
              label={<Typography sx={{ color: "#fff" }}>Active</Typography>}
            />
          )}

          <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ pt: 1 }}>
            <Button
              onClick={onClose}
              variant="outlined"
              sx={secondaryBtnSx}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={saving}
              sx={primaryBtnSx}
            >
              {saving ? "Saving..." : mode === "create" ? "Create" : "Update"}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

const darkTextFieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    borderRadius: "14px",
    "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
    "&:hover fieldset": { borderColor: "rgba(46,158,191,0.35)" },
    "&.Mui-focused fieldset": { borderColor: "#2E9EBF" },
  },
};

const primaryBtnSx = {
  bgcolor: "#2E9EBF",
  color: "#fff",
  fontWeight: 800,
  textTransform: "none",
  borderRadius: "12px",
  "&:hover": { bgcolor: "#1a7a9a" },
};

const secondaryBtnSx = {
  color: "#fff",
  borderColor: "rgba(255,255,255,0.15)",
  textTransform: "none",
  borderRadius: "12px",
  "&:hover": {
    borderColor: "#2E9EBF",
    bgcolor: "rgba(46,158,191,0.05)",
  },
};