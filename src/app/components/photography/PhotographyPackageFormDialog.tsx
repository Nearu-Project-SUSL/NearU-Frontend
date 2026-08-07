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
  FormControlLabel,
  Switch,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LabelIcon from "@mui/icons-material/Label";
import type { PhotographyPackageResponseDto } from "../../../api/services/photographerApi";

interface PhotographyPackageFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; price: number; description?: string; isActive?: boolean }) => Promise<void>;
  initialData?: PhotographyPackageResponseDto | null;
  loading?: boolean;
}

export default function PhotographyPackageFormDialog({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}: PhotographyPackageFormDialogProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setPrice(initialData.price?.toString() || "");
      setDescription(initialData.description || "");
      setIsActive(initialData.isActive ?? true);
    } else {
      setName("");
      setPrice("");
      setDescription("");
      setIsActive(true);
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name,
      price: parseFloat(price) || 0,
      description,
      isActive,
    });
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
      maxWidth="xs"
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
          <PhotoLibraryIcon sx={{ color: "#2E9EBF", fontSize: 26 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--text-primary)" }}>
            {initialData ? "Update Package" : "Add Photography Package"}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "var(--text-secondary)" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 2 }}>
          <TextField
            label="Package Name (e.g., Portrait / Event)"
            required
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LabelIcon sx={{ color: "#2E9EBF" }} />
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />

          <TextField
            label="Price (LKR)"
            required
            fullWidth
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
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
            label="Package Details / Deliverables"
            multiline
            rows={3}
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., 2 Hour session, 25 edited photos, high-res download..."
            sx={inputSx}
          />

          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": { color: "#2E9EBF" },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#2E9EBF" },
                }}
              />
            }
            label="Available / Active Package"
            sx={{ color: "var(--text-primary)" }}
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
            {initialData ? "Save Changes" : "Add Package"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
