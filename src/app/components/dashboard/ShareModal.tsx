import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  Box,
  Typography,
  IconButton,
  DialogContent,
  TextField,
  Alert,
  Button,
  CircularProgress
} from "@mui/material";
import {
  Close as CloseIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Send as SendIcon
} from "@mui/icons-material";
import { axiosPrivate } from "../../../api/axios";

export default function ShareModal({
  open,
  onClose,
  onSubmitted,
  token
}: {
  open: boolean;
  onClose: () => void;
  onSubmitted: () => void;
  token: string;
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    setRating(0);
    setHoverRating(0);
    setMessage("");
    setError("");
    onClose();
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    if (message.trim() === "") {
      setError("Please enter your experience");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axiosPrivate.post(
        "/testimonials",
        { message: message.trim(), rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      handleClose();
      onSubmitted();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "var(--bg-surface)",
          border: "1px solid var(--nearu-border)",
          borderRadius: "24px",
          p: 1,
          backgroundImage: "none"
        }
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyBox: "space-between", pb: 1 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--nearu-accent)" }}>
            Share Your Experience
          </Typography>
          <Typography variant="body2" sx={{ color: "var(--text-secondary)", mt: 0.3 }}>
            Help other students by sharing your story
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{ color: "var(--text-secondary)", "&:hover": { color: "var(--text-primary)" } }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {/* star rating */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", mb: 1.5, fontWeight: 600 }}>
            How would you rate your experience?
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <IconButton
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                sx={{
                  p: 0.5,
                  transition: "transform 0.15s ease",
                  transform: (hoverRating || rating) >= star ? "scale(1.2)" : "scale(1)"
                }}
              >
                {(hoverRating || rating) >= star ? (
                  <StarIcon sx={{ fontSize: 36, color: "var(--nearu-accent)" }} />
                ) : (
                  <StarBorderIcon sx={{ fontSize: 36, color: "var(--nearu-border)" }} />
                )}
              </IconButton>
            ))}
            {rating > 0 && (
              <Typography
                sx={{ color: "var(--text-secondary)", alignSelf: "center", ml: 1, fontSize: "0.85rem" }}
              >
                {["", "Poor", "Fair", "Good", "Great", "Excellent!"][rating]}
              </Typography>
            )}
          </Box>
        </Box>

        {/*message */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", mb: 1.5, fontWeight: 600 }}>
            Your experience
          </Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder="Tell us about your experience with NearU..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            inputProps={{ maxLength: 500 }}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "var(--text-primary)",
                borderRadius: "14px",
                bgcolor: "rgba(255,255,255,0.03)",
                "& fieldset": { borderColor: "var(--nearu-border)" },
                "&:hover fieldset": { borderColor: "rgba(46, 158, 191, 0.3)" },
                "&.Mui-focused fieldset": { borderColor: "var(--nearu-accent)" }
              },
              "& .MuiInputBase-input::placeholder": { color: "var(--text-secondary)", opacity: 0.5 }
            }}
          />
          <Typography
            variant="caption"
            sx={{ color: "var(--text-secondary)", opacity: 0.5, display: "block", textAlign: "right", mt: 0.5 }}
          >
            {message.length}/500
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              bgcolor: "rgba(239,68,68,0.1)",
              color: "#fca5a5",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "12px",
              "& .MuiAlert-icon": { color: "#fca5a5" }
            }}
          >
            {error}
          </Alert>
        )}

        <Button
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
          endIcon={loading ? <CircularProgress size={18} sx={{ color: "#000" }} /> : <SendIcon />}
          sx={{
            bgcolor: "var(--nearu-accent)",
            color: "#000",
            fontWeight: 800,
            borderRadius: "14px",
            py: 1.5,
            fontSize: "1rem",
            textTransform: "none",
            backgroundImage: "linear-gradient(135deg, var(--nearu-accent), #1e608a)",
            "&:hover": { backgroundImage: "linear-gradient(135deg, #3da5d9, var(--nearu-accent))" },
            "&:disabled": { bgcolor: "var(--nearu-accent-subtle)", color: "rgba(0,0,0,0.4)" }
          }}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
