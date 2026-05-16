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
          bgcolor: "#0a0a0a",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.08)",
        },
      }}
    >
      <DialogTitle sx={{ color: "#fff", fontWeight: 800 }}>
        {mode === "create" ? "Add Product" : "Edit Product"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            InputLabelProps={{ style: { color: "rgba(255,255,255,0.55)" } }}
            sx={darkTextFieldSx}
          />

          <TextField
            label="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
            type="number"
            InputLabelProps={{ style: { color: "rgba(255,255,255,0.55)" } }}
            sx={darkTextFieldSx}
          />

          <Box>
            <Typography sx={{ color: "rgba(255,255,255,0.7)", mb: 1 }}>
              Product Photo
            </Typography>
            <input
              type="file"
              accept="image/*"
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
              label={<Typography sx={{ color: "#fff" }}>Active</Typography>}
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
    color: "#fff",
    borderRadius: "14px",
    "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
    "&:hover fieldset": { borderColor: "rgba(250,204,21,0.35)" },
    "&.Mui-focused fieldset": { borderColor: "#facc15" },
  },
};

const primaryBtnSx = {
  bgcolor: "#facc15",
  color: "#000",
  fontWeight: 800,
  textTransform: "none",
  borderRadius: "12px",
  "&:hover": { bgcolor: "#eab308" },
};

const secondaryBtnSx = {
  color: "#fff",
  borderColor: "rgba(255,255,255,0.15)",
  textTransform: "none",
  borderRadius: "12px",
  "&:hover": {
    borderColor: "#facc15",
    bgcolor: "rgba(250,204,21,0.05)",
  },
};