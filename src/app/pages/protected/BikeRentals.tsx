import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Chip,
  Grid,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Stack,
  InputAdornment,
} from "@mui/material";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import ElectricBikeIcon from "@mui/icons-material/ElectricBike";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import KeyIcon from "@mui/icons-material/Key";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SparklesIcon from "@mui/icons-material/AutoAwesome";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router";

import { Sidebar } from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import LazyImage from "../../components/ui/LazyImage";

export default function BikeRentals() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleNotifyMe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setSnackbarOpen(true);
  };

  const featureHighlights = [
    {
      icon: ElectricBikeIcon,
      title: "Smart E-Bikes",
      description: "Eco-friendly electric bicycles for effortless campus commutes.",
    },
    {
      icon: KeyIcon,
      title: "App Unlock",
      description: "Instantly unlock bikes directly from your smartphone.",
    },
    {
      icon: GpsFixedIcon,
      title: "Campus Hubs",
      description: "Convenient pick-up and drop-off stations across campus.",
    },
  ];

  return (
    <Box sx={{ display: "flex", bgcolor: "var(--bg-base)", minHeight: "100vh" }}>
      <Sidebar activeId="rides" />

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Navbar />

        <Box sx={{ p: { xs: 2.5, md: 5 }, maxWidth: 1200, mx: "auto", width: "100%" }}>
          {/* Back Button */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/home")}
            sx={{
              color: "#2E9EBF",
              fontWeight: 700,
              textTransform: "none",
              mb: 3,
              "&:hover": { bgcolor: "rgba(46, 158, 191, 0.1)" },
            }}
          >
            Back to Home
          </Button>

          {/* Hero Banner Container */}
          <Card
            elevation={0}
            sx={{
              bgcolor: "var(--bg-surface)",
              borderRadius: "32px",
              border: "1px solid var(--nearu-border)",
              position: "relative",
              overflow: "hidden",
              p: { xs: 3, md: 6 },
              mb: 6,
              background:
                "radial-gradient(circle at top right, rgba(46, 158, 191, 0.12) 0%, var(--bg-surface) 70%)",
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.4)",
            }}
          >
            <Grid container spacing={4} alignItems="center">
              {/* Text Left Column */}
              <Grid size={{ xs: 12, md: 7 }}>
                <Box>
                  <Chip
                    icon={<SparklesIcon sx={{ fontSize: 16, color: "#2E9EBF !important" }} />}
                    label="COMING SOON"
                    sx={{
                      bgcolor: "rgba(46, 158, 191, 0.15)",
                      color: "#2E9EBF",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      fontSize: "0.8rem",
                      px: 1,
                      py: 2,
                      borderRadius: "14px",
                      border: "1px solid rgba(46, 158, 191, 0.3)",
                      mb: 2.5,
                    }}
                  />

                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 900,
                      color: "var(--text-primary)",
                      fontFamily: '"Outfit", "Inter", sans-serif',
                      fontSize: { xs: "2.2rem", md: "3.2rem" },
                      lineHeight: 1.15,
                      letterSpacing: "-0.02em",
                      mb: 2,
                    }}
                  >
                    Campus Bike Rentals <br />
                    <Box component="span" sx={{ color: "#2E9EBF" }}>
                      Are On The Way
                    </Box>
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: "var(--text-secondary)",
                      fontSize: "1.05rem",
                      lineHeight: 1.6,
                      mb: 4,
                      maxWidth: 540,
                    }}
                  >
                    We are crafting an eco-friendly e-bike rental service designed specifically for university students. Get ready to zoom around campus with instant app unlock, flexible hourly rates, and dedicated charging hubs.
                  </Typography>

                  {/* Interactive Subscribe Form */}
                  <Box
                    component="form"
                    onSubmit={handleNotifyMe}
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 1.5,
                      maxWidth: 480,
                    }}
                  >
                    <TextField
                      placeholder="Enter your student email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={subscribed}
                      required
                      type="email"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <NotificationsActiveIcon sx={{ color: "#2E9EBF" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "rgba(0, 0, 0, 0.3)",
                          borderRadius: "16px",
                          "& fieldset": { borderColor: "var(--nearu-border)" },
                          "&:hover fieldset": { borderColor: "#2E9EBF" },
                          "&.Mui-focused fieldset": { borderColor: "#2E9EBF" },
                        },
                      }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={subscribed}
                      sx={{
                        bgcolor: "#2E9EBF",
                        color: "#fff",
                        fontWeight: 800,
                        borderRadius: "16px",
                        px: 4,
                        py: 1.8,
                        whiteSpace: "nowrap",
                        textTransform: "none",
                        fontSize: "0.95rem",
                        boxShadow: "0 8px 24px rgba(46, 158, 191, 0.3)",
                        "&:hover": { bgcolor: "#25829e" },
                      }}
                    >
                      {subscribed ? "Subscribed!" : "Notify Me"}
                    </Button>
                  </Box>
                </Box>
              </Grid>

              {/* Graphic Image Right Column */}
              <Grid size={{ xs: 12, md: 5 }}>
                <Box
                  sx={{
                    width: "100%",
                    height: { xs: 260, md: 360 },
                    borderRadius: "24px",
                    overflow: "hidden",
                    position: "relative",
                    border: "1px solid rgba(46, 158, 191, 0.3)",
                    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <LazyImage
                    src="/bikes_card.png"
                    alt="Campus Bike Rentals"
                    className="w-full h-full object-cover"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(5,5,5,0.7) 0%, transparent 60%)",
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Card>

          {/* Feature Highlight Cards */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: "var(--text-primary)",
              mb: 3,
              fontFamily: '"Outfit", "Inter", sans-serif',
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <DirectionsBikeIcon sx={{ color: "#2E9EBF" }} />
            What To Expect
          </Typography>

          <Grid container spacing={3}>
            {featureHighlights.map((feat, index) => (
              <Grid key={index} size={{ xs: 12, sm: 4 }}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    bgcolor: "var(--bg-surface)",
                    borderRadius: "20px",
                    border: "1px solid var(--nearu-border)",
                    p: 3,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "#2E9EBF",
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 30px rgba(0, 0, 0, 0.3)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: "16px",
                      bgcolor: "rgba(46, 158, 191, 0.12)",
                      border: "1px solid rgba(46, 158, 191, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <feat.icon sx={{ color: "#2E9EBF", fontSize: 28 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--text-primary)", mb: 1 }}>
                    {feat.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    {feat.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success" sx={{ width: "100%", borderRadius: "14px", fontWeight: 700 }}>
          You're on the VIP list! We will notify you as soon as Bike Rentals launch.
        </Alert>
      </Snackbar>
    </Box>
  );
}
