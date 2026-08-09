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
import type { GiftProductResponseDto } from  "../../../api/services/giftShopApi";

interface GiftProductFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  initialData?: GiftProductResponseDto | null;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function GiftProductFormDialog({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
}: GiftProductFormDialogProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [photo, setPhoto] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initialData?.name || "");
      setPrice(initialData ? String(initialData.price) : "");
      setIsActive(initialData?.isActive ?? true);
      setPhoto(null);
    }
  }, [open, initialData]);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Price", price);

    if (mode === "edit") {
      formData.append("IsActive", String(isActive));
    }

    if (photo) {
      formData.append("Photo", photo);
    }

    setSaving(true);
    try {
      await onSubmit(formData);
      onClose();
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
          bgcolor: "var(--bg-surface)",
          borderRadius: "24px",
          border: "1px solid var(--nearu-border)",
        },
      }}
    >
      <DialogTitle sx={{ color: "var(--text-primary)", fontWeight: 800 }}>
        {mode === "create" ? "Add Product" : "Edit Product"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            InputLabelProps={{ style: { color: "var(--text-secondary)" } }}
            sx={darkTextFieldSx}
          />

          <TextField
            label="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
            type="number"
            InputLabelProps={{ style: { color: "var(--text-secondary)" } }}
            sx={darkTextFieldSx}
          />

          <Box>
            <Typography sx={{ color: "var(--text-secondary)", mb: 1 }}>
              Product Photo
            </Typography>
            <input
              type="file"
              accept="image/*"
              style={{ color: "var(--text-primary)" }}
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
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
              label={<Typography sx={{ color: "var(--text-primary)" }}>Active</Typography>}
            />
          )}

          <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ pt: 1 }}>
            <Button onClick={onClose} variant="outlined" sx={secondaryBtnSx}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={saving}
              sx={primaryBtnSx}
            >
              {saving ? "Saving..." : mode === "create" ? "Add Product" : "Update Product"}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

const darkTextFieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "var(--text-primary)",
    borderRadius: "14px",
    "& fieldset": { borderColor: "var(--nearu-border)" },
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
  color: "var(--text-primary)",
  borderColor: "var(--nearu-border)",
  textTransform: "none",
  borderRadius: "12px",
  "&:hover": {
    borderColor: "#2E9EBF",
    bgcolor: "var(--nearu-accent-subtle)",
  },
};