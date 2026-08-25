import { useState } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { GiftProduct } from "./GiftProductCard";

interface DeleteGiftProductDialogProps {
  item: GiftProduct | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteGiftProductDialog({
  item,
  onClose,
  onConfirm,
}: DeleteGiftProductDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={!!item}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "var(--bg-surface)",
          borderRadius: "24px",
          border: "1px solid rgba(239,68,68,0.2)",
          backgroundImage: "none",
          m: 2,
        },
      }}
    >
      {item && (
        <DialogContent sx={{ p: 4, textAlign: "center" }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              bgcolor: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
            }}
          >
            <DeleteIcon sx={{ color: "#f87171", fontSize: 28 }} />
          </Box>

          <Typography variant="h6" sx={{ color: "var(--text-primary)", fontWeight: 700, mb: 1 }}>
            Delete Product?
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "var(--text-secondary)", mb: 1, lineHeight: 1.6 }}
          >
            Are you sure you want to delete
          </Typography>

          <Typography
            variant="body1"
            sx={{ color: "#2E9EBF", fontWeight: 700, mb: 3 }}
          >
            &quot;{item.name}&quot;
          </Typography>

          <Typography
            variant="caption"
            sx={{ color: "var(--text-secondary)", display: "block", mb: 3 }}
          >
            This action cannot be undone.
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={onClose}
              disabled={loading}
              sx={{
                color: "var(--text-primary)",
                borderColor: "var(--nearu-border)",
                borderRadius: "12px",
                textTransform: "none",
                "&:hover": { borderColor: "#2E9EBF", bgcolor: "var(--nearu-accent-subtle)" },
              }}
            >
              Cancel
            </Button>

            <Button
              fullWidth
              variant="contained"
              onClick={handleConfirm}
              disabled={loading}
              sx={{
                bgcolor: "#ef4444",
                color: "#fff",
                fontWeight: 700,
                borderRadius: "12px",
                textTransform: "none",
                "&:hover": { bgcolor: "#dc2626" },
                "&.Mui-disabled": { bgcolor: "rgba(239,68,68,0.3)" },
              }}
            >
              {loading ? "Deleting..." : "Yes, Delete"}
            </Button>
          </Box>
        </DialogContent>
      )}
    </Dialog>
  );
}
