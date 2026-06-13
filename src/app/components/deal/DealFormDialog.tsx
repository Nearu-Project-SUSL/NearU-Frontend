import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const SHOP_TYPES = ["Food", "Gift", "Accommodation", "Other"];

interface DealFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function DealFormDialog({ open, onClose, onSubmit }: DealFormDialogProps) {
  const [shopName, setShopName] = useState("");
  const [shopType, setShopType] = useState("Food");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [badgeText, setBadgeText] = useState("");
  const [badgeColor, setBadgeColor] = useState("#ef4444");
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setShopName("");
      setShopType("Food");
      setTitle("");
      setDescription("");
      setBadgeText("");
      setBadgeColor("#ef4444");
      setValidFrom("");
      setValidTo("");
      setImage(null);
    }
  }, [open]);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("ShopName", shopName);
    formData.append("ShopType", shopType);
    formData.append("Title", title);
    formData.append("Description", description);
    formData.append("BadgeText", badgeText);
    formData.append("BadgeColor", badgeColor);
    if (validFrom) formData.append("ValidFrom", new Date(validFrom).toISOString());
    if (validTo) formData.append("ValidTo", new Date(validTo).toISOString());
    if (image) formData.append("Image", image);

    setSaving(true);
    try {
      await onSubmit(formData);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      color: "#fff",
      "& fieldset": { borderColor: "rgba(255,255,255,0.15)" },
    },
    "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.6)" },
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
      <DialogTitle sx={{ color: "#fff", fontWeight: 800 }}>Submit Deal / Offer</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", mb: 2 }}>
          Your deal will be reviewed by an admin before it appears on the home page.
        </Typography>
        <Stack spacing={2}>
          <TextField label="Shop Name" required value={shopName} onChange={(e) => setShopName(e.target.value)} fullWidth sx={fieldSx} />
          <TextField select label="Shop Type" value={shopType} onChange={(e) => setShopType(e.target.value)} fullWidth sx={fieldSx}>
            {SHOP_TYPES.map((t) => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </TextField>
          <TextField label="Deal Title" required value={title} onChange={(e) => setTitle(e.target.value)} fullWidth sx={fieldSx} />
          <TextField label="Description" required multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} fullWidth sx={fieldSx} />
          <TextField label="Badge Text (e.g. 50% OFF)" required value={badgeText} onChange={(e) => setBadgeText(e.target.value)} fullWidth sx={fieldSx} />
          <TextField label="Badge Color" value={badgeColor} onChange={(e) => setBadgeColor(e.target.value)} fullWidth sx={fieldSx} placeholder="#ef4444" />
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField label="Valid From" type="date" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} sx={fieldSx} />
            <TextField label="Valid To" type="date" value={validTo} onChange={(e) => setValidTo(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} sx={fieldSx} />
          </Box>
          <Button variant="outlined" component="label" sx={{ color: "#2E9EBF", borderColor: "rgba(46,158,191,0.4)" }}>
            {image ? image.name : "Upload Deal Image"}
            <input type="file" hidden accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={saving || !shopName || !title || !description || !badgeText}
            sx={{ fontWeight: 700, borderRadius: "12px", color: "#111" }}
          >
            {saving ? "Submitting..." : "Submit for Approval"}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
