import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  Button,
  Chip,
  Stack,
  useTheme,
} from "@mui/material";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import TrainIcon from "@mui/icons-material/Train";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SecurityIcon from "@mui/icons-material/Security";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SavingsIcon from "@mui/icons-material/Savings";
import { useNavigate } from "react-router";

import { Sidebar } from "../../../components/layout/Sidebar";
import Navbar from "../../../components/layout/Navbar";
import LazyImage from "../../../components/ui/LazyImage";

export default function TransportSelection() {
  const navigate = useNavigate();
  const theme = useTheme();
  const accent = "#2E9EBF";

  const transportOptions = [
    {
      id: "tuk",
      title: "Tuk Rides",
      subtitle: "Local Tuk-Tuk Drivers",
      description: "Quick & reliable three-wheeler rides around campus and local spots.",
      image: "/tuktuk_card.png",
      buttonText: "View Drivers",
      icon: LocalTaxiIcon,
      route: "/transport/tuk",
    },
    {
      id: "bus",
      title: "Bus Routine",
      subtitle: "Campus & City Buses",
      description: "Schedules and departure times for public bus services.",
      image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
      buttonText: "View Timetables",
      icon: DirectionsBusIcon,
      route: "/transport/bus",
    },
    {
      id: "train",
      title: "Train Routine",
      subtitle: "Express Rail Schedules",
      description: "Inter-city railway connections for weekend student travel.",
      image: "https://images.unsplash.com/photo-1546412414-8035e1776c9a?auto=format&fit=crop&w=800&q=80",
      buttonText: "View Schedules",
      icon: TrainIcon,
      route: "/transport/train",
    },
  ];

  return (
    <Box sx={{ display: "flex", bgcolor: "var(--bg-base)", minHeight: "100vh" }}>
      <Sidebar activeId="transport" />

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Navbar />

        <Box sx={{ p: { xs: 2.5, md: 5 }, maxWidth: 1280, mx: "auto", width: "100%" }}>
          {/* Hero Header */}
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Chip
              label="CAMPUS & REGIONAL TRAVEL"
              sx={{
                bgcolor: "rgba(46, 158, 191, 0.15)",
                color: accent,
                fontWeight: 800,
                letterSpacing: "0.08em",
                fontSize: "0.78rem",
                borderRadius: "12px",
                border: "1px solid rgba(46, 158, 191, 0.3)",
                mb: 2,
              }}
            />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: "var(--text-primary)",
                fontFamily: '"Outfit", "Inter", sans-serif',
                fontSize: { xs: "2rem", md: "3rem" },
                letterSpacing: "-0.02em",
                mb: 1.5,
              }}
            >
              Where Do You Want To{" "}
              <Box component="span" sx={{ color: accent }}>
                Go Today?
              </Box>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "var(--text-secondary)",
                fontSize: "1.05rem",
                maxWidth: 620,
                mx: "auto",
              }}
            >
              Explore verified tuk-tuk drivers, public bus schedules, and inter-city train timetables all in one place.
            </Typography>
          </Box>

          {/* Transport Selection Grid */}
          <Grid container spacing={3.5} sx={{ mb: 6 }}>
            {transportOptions.map((option) => (
              <Grid key={option.id} size={{ xs: 12, md: 4 }}>
                <TransportOptionCard option={option} onSelect={() => navigate(option.route)} />
              </Grid>
            ))}
          </Grid>

          {/* Features Banner */}
          <Box
            sx={{
              bgcolor: "var(--bg-surface)",
              borderRadius: "24px",
              border: "1px solid var(--nearu-border)",
              p: { xs: 3, md: 4 },
              background:
                "radial-gradient(circle at top right, rgba(46, 158, 191, 0.08) 0%, var(--bg-surface) 80%)",
            }}
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "14px",
                      bgcolor: "rgba(46, 158, 191, 0.15)",
                      border: "1px solid rgba(46, 158, 191, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <SecurityIcon sx={{ color: accent, fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "var(--text-primary)" }}>
                      Verified Drivers
                    </Typography>
                    <Typography variant="body2" sx={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}>
                      Safe and reliable contact numbers for campus travel
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "14px",
                      bgcolor: "rgba(46, 158, 191, 0.15)",
                      border: "1px solid rgba(46, 158, 191, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <AccessTimeIcon sx={{ color: accent, fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "var(--text-primary)" }}>
                      Real-time Schedules
                    </Typography>
                    <Typography variant="body2" sx={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}>
                      Accurate departure and arrival timetables
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "14px",
                      bgcolor: "rgba(46, 158, 191, 0.15)",
                      border: "1px solid rgba(46, 158, 191, 0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <SavingsIcon sx={{ color: accent, fontSize: 24 }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "var(--text-primary)" }}>
                      Student Friendly
                    </Typography>
                    <Typography variant="body2" sx={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}>
                      Affordable options for every daily budget
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function TransportOptionCard({
  option,
  onSelect,
}: {
  option: {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    buttonText: string;
    icon: React.ComponentType<any>;
  };
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const accent = "#2E9EBF";
  const OptionIcon = option.icon;

  return (
    <Card
      elevation={0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        height: "100%",
        minHeight: 360,
        bgcolor: "var(--bg-surface)",
        borderRadius: "24px",
        position: "relative",
        overflow: "hidden",
        border: "1px solid var(--nearu-border)",
        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 20px 40px rgba(0, 0, 0, 0.45), 0 0 0 1px #2E9EBF"
          : "none",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardActionArea
        onClick={onSelect}
        sx={{
          height: "100%",
          p: 2.5,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          zIndex: 1,
        }}
      >
        {/* Top Image Banner (180px) */}
        <Box
          sx={{
            width: "100%",
            height: 180,
            borderRadius: "18px",
            position: "relative",
            overflow: "hidden",
            bgcolor: "rgba(46, 158, 191, 0.06)",
            mb: 2.5,
            border: hovered
              ? "1px solid rgba(46, 158, 191, 0.4)"
              : "1px solid rgba(255, 255, 255, 0.08)",
            transition: "all 0.3s ease",
          }}
        >
          <LazyImage
            src={option.image}
            alt={option.title}
            className="w-full h-full object-cover"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: hovered ? "scale(1.08)" : "scale(1)",
              transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(10,15,25,0.7) 0%, transparent 60%)",
            }}
          />

          {/* Icon Badge Overlay */}
          <Box
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              width: 40,
              height: 40,
              borderRadius: "12px",
              bgcolor: "rgba(0, 0, 0, 0.55)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <OptionIcon sx={{ color: accent, fontSize: 22 }} />
          </Box>
        </Box>

        {/* Content Section */}
        <Box sx={{ width: "100%", mb: 2 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: "var(--text-primary)",
              fontSize: "1.3rem",
              mb: 0.5,
              fontFamily: '"Outfit", "Inter", sans-serif',
            }}
          >
            {option.title}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: accent,
              fontWeight: 700,
              fontSize: "0.8rem",
              display: "block",
              mb: 1,
            }}
          >
            {option.subtitle}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "var(--text-secondary)",
              fontSize: "0.85rem",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {option.description}
          </Typography>
        </Box>

        {/* Action Button */}
        <Button
          fullWidth
          variant="contained"
          endIcon={
            <ArrowForwardIcon
              sx={{
                fontSize: 18,
                transform: hovered ? "translateX(4px)" : "translateX(0)",
                transition: "transform 0.3s ease",
              }}
            />
          }
          sx={{
            bgcolor: hovered ? accent : "rgba(46, 158, 191, 0.12)",
            color: hovered ? "#000" : accent,
            fontWeight: 800,
            borderRadius: "14px",
            py: 1.2,
            textTransform: "none",
            fontSize: "0.9rem",
            boxShadow: hovered ? "0 6px 20px rgba(46, 158, 191, 0.35)" : "none",
            transition: "all 0.3s ease",
          }}
        >
          {option.buttonText}
        </Button>
      </CardActionArea>
    </Card>
  );
}