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
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "sonner";

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      toast.error("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }
    setImage(file);
  };

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
      borderRadius: "14px",
      backgroundColor: "rgba(255,255,255,0.02)",
      "& fieldset": { 
        borderColor: "rgba(255,255,255,0.12)", 
        transition: "all 0.23s ease",
      },
      "&:hover fieldset": { 
        borderColor: "rgba(255,255,255,0.25)", 
      },
      "&.Mui-focused fieldset": { 
        borderColor: "#2E9EBF", 
        boxShadow: "0 0 0 3px rgba(46,158,191,0.15)",
      },
    },
    "& .MuiInputLabel-root": { 
      color: "rgba(255,255,255,0.5)",
      transition: "all 0.23s ease",
      "&.Mui-focused": { color: "#2E9EBF" }
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          bgcolor: "#0b0b0f",
          borderRadius: "28px",
          border: "1px solid rgba(255,255,255,0.08)",
          backgroundImage: "radial-gradient(circle at top right, rgba(46,158,191,0.08) 0%, transparent 60%)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.8)",
          p: 1.5,
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pr: 2, pt: 1 }}>
        <DialogTitle sx={{ color: "#fff", fontWeight: 800, fontSize: "1.4rem", pb: 0 }}>
          Submit Deal / Offer
        </DialogTitle>
        <IconButton onClick={onClose} sx={{ color: "rgba(255,255,255,0.4)", "&:hover": { color: "#fff" }, mt: 1 }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ pt: 1.5 }}>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.48)", mb: 3.5, lineHeight: 1.5 }}>
          Fill in the details below to submit a deal or offer. It will be reviewed by our admin team before being displayed publicly.
        </Typography>
        <Stack spacing={2.5}>
          <TextField label="Shop Name" required value={shopName} onChange={(e) => setShopName(e.target.value)} fullWidth sx={fieldSx} />
          
          <TextField select label="Shop Type" value={shopType} onChange={(e) => setShopType(e.target.value)} fullWidth sx={fieldSx}>
            {SHOP_TYPES.map((t) => (
              <MenuItem key={t} value={t} sx={{ color: "#fff", bgcolor: "#0b0b0f", "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }}>
                {t}
              </MenuItem>
            ))}
          </TextField>

          <TextField label="Deal Title" required value={title} onChange={(e) => setTitle(e.target.value)} fullWidth sx={fieldSx} />
          
          <TextField label="Description" required multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} fullWidth sx={fieldSx} />
          
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField label="Badge Text (e.g. 50% OFF)" required value={badgeText} onChange={(e) => setBadgeText(e.target.value)} fullWidth sx={fieldSx} />
            <TextField label="Badge Color (Hex)" value={badgeColor} onChange={(e) => setBadgeColor(e.target.value)} fullWidth sx={fieldSx} placeholder="#ef4444" />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField label="Valid From" type="date" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} sx={fieldSx} />
            <TextField label="Valid To" type="date" value={validTo} onChange={(e) => setValidTo(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} sx={fieldSx} />
          </Box>

          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
            sx={{
              color: "#2E9EBF",
              borderColor: "rgba(46,158,191,0.3)",
              borderRadius: "14px",
              py: 2,
              borderStyle: "dashed",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
              transition: "all 0.2s ease",
              backgroundColor: "rgba(46,158,191,0.02)",
              "&:hover": {
                borderColor: "#2E9EBF",
                backgroundColor: "rgba(46,158,191,0.06)",
                boxShadow: "0 0 12px rgba(46,158,191,0.1)",
              },
            }}
          >
            {image ? `${image.name} (${(image.size / (1024 * 1024)).toFixed(1)}MB)` : "Upload Deal Image (max 5MB)"}
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={saving || !shopName || !title || !description || !badgeText}
            sx={{
              fontWeight: 700,
              borderRadius: "14px",
              py: 1.5,
              mt: 1,
              bgcolor: "#2E9EBF",
              color: "#050505",
              textTransform: "none",
              fontSize: "1rem",
              boxShadow: "0 8px 24px rgba(46,158,191,0.2)",
              "&:hover": {
                bgcolor: "#1e82a0",
                boxShadow: "0 12px 30px rgba(46,158,191,0.3)",
              },
              "&.Mui-disabled": {
                bgcolor: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.25)",
              },
            }}
          >
            {saving ? "Submitting Application..." : "Submit for Approval"}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
