import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Stack,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import TrainIcon from "@mui/icons-material/Train";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { Sidebar } from "../../../components/layout/Sidebar";
import Navbar from "../../../components/layout/Navbar";
import axiosPrivate from "../../../../api/axios";

type TransportType = "tuk" | "bus" | "train";

export default function Transport() {
  const location = useLocation();
  const navigate = useNavigate();

  const type = (location.pathname.split("/").pop() || "tuk") as TransportType;

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const endpoints: Record<TransportType, string> = {
      tuk: "/tuktukdrivers",
      bus: "/busroutes",
      train: "/trainroutes",
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosPrivate.get(endpoints[type] || "/tuktukdrivers");
        setData(res.data || []);
      } catch (err) {
        console.error(`Failed to load ${type} data:`, err);
        setError("Could not load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (["tuk", "bus", "train"].includes(type)) {
      fetchData();
    }
  }, [type]);

  const titles: Record<TransportType, string> = {
    tuk: "Tuk Tuk Drivers",
    bus: "Bus Schedules",
    train: "Train Routines",
  };

  const subtitles: Record<TransportType, string> = {
    tuk: "Verified tuk-tuk drivers available around campus",
    bus: "Scheduled public and campus bus services",
    train: "Inter-city railway connections & timetables",
  };

  const icons: Record<TransportType, React.ComponentType<any>> = {
    tuk: LocalTaxiIcon,
    bus: DirectionsBusIcon,
    train: TrainIcon,
  };

  const HeaderIcon = icons[type] || LocalTaxiIcon;

  return (
    <Box sx={{ display: "flex", bgcolor: "var(--bg-base)", minHeight: "100vh" }}>
      <Sidebar activeId="transport" />

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Navbar />

        <Box sx={{ p: { xs: 2.5, md: 5 }, maxWidth: 1200, mx: "auto", width: "100%" }}>
          {/* Back Button */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/transport")}
            sx={{
              color: "#2E9EBF",
              fontWeight: 700,
              textTransform: "none",
              mb: 3,
              "&:hover": { bgcolor: "rgba(46, 158, 191, 0.1)" },
            }}
          >
            Back to Transport Options
          </Button>

          {/* Header Title */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "var(--text-primary)",
                fontFamily: '"Outfit", "Inter", sans-serif',
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 0.5,
              }}
            >
              <HeaderIcon sx={{ color: "#2E9EBF", fontSize: 36 }} />
              {titles[type]}
            </Typography>
            <Typography variant="body2" sx={{ color: "var(--text-secondary)" }}>
              {subtitles[type]}
            </Typography>
          </Box>

          {/* Content Loading & Error States */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
              <CircularProgress sx={{ color: "#2E9EBF" }} />
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: "center", py: 10, color: "#ef4444" }}>
              <Typography variant="h6">{error}</Typography>
            </Box>
          ) : data.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 10,
                bgcolor: "var(--bg-surface)",
                borderRadius: "24px",
                border: "1px dashed var(--nearu-border)",
              }}
            >
              <HeaderIcon sx={{ fontSize: 56, color: "var(--text-disabled)", mb: 2 }} />
              <Typography variant="h6" sx={{ color: "var(--text-primary)", fontWeight: 700 }}>
                No Schedules Available
              </Typography>
              <Typography variant="body2" sx={{ color: "var(--text-secondary)", mt: 0.5 }}>
                No {type} information found right now.
              </Typography>
            </Box>
          ) : type === "tuk" ? (
            /* Tuk Drivers Grid */
            <Grid container spacing={3}>
              {data.map((driver) => (
                <Grid key={driver.id} size={{ xs: 12, sm: 6 }}>
                  <Card
                    elevation={0}
                    sx={{
                      bgcolor: "var(--bg-surface)",
                      borderRadius: "20px",
                      border: "1px solid var(--nearu-border)",
                      p: 2.5,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "#2E9EBF",
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--text-primary)" }}>
                          {driver.name}
                        </Typography>
                        {driver.plateNumber && (
                          <Chip
                            label={driver.plateNumber}
                            size="small"
                            sx={{
                              bgcolor: "rgba(46, 158, 191, 0.15)",
                              color: "#2E9EBF",
                              fontWeight: 800,
                              borderRadius: "8px",
                              mt: 0.5,
                            }}
                          />
                        )}
                      </Box>

                      {driver.phoneNumber && (
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<PhoneIcon fontSize="small" />}
                          component="a"
                          href={`tel:${driver.phoneNumber}`}
                          sx={{
                            bgcolor: "#2E9EBF",
                            color: "#fff",
                            fontWeight: 700,
                            borderRadius: "12px",
                            textTransform: "none",
                            "&:hover": { bgcolor: "#25829e" },
                          }}
                        >
                          Call
                        </Button>
                      )}
                    </Box>

                    {driver.operatingArea && (
                      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: "var(--text-secondary)", mb: 1 }}>
                        <LocationOnIcon sx={{ fontSize: 16, color: "#2E9EBF" }} />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {driver.operatingArea}
                        </Typography>
                      </Stack>
                    )}

                    {driver.notes && (
                      <Typography variant="body2" sx={{ color: "var(--text-secondary)", fontSize: "0.82rem", fontStyle: "italic" }}>
                        "{driver.notes}"
                      </Typography>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            /* Bus / Train Route List */
            <Stack spacing={2}>
              {data.map((route) => (
                <Card
                  key={route.id}
                  elevation={0}
                  sx={{
                    bgcolor: "var(--bg-surface)",
                    borderRadius: "20px",
                    border: "1px solid var(--nearu-border)",
                    p: 2.5,
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    gap: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "#2E9EBF",
                      transform: "translateY(-2px)",
                      boxShadow: "0 10px 28px rgba(0,0,0,0.3)",
                    },
                  }}
                >
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--text-primary)", mb: 0.5 }}>
                      {route.routeName}
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center" sx={{ color: "var(--text-secondary)", mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {type === "train" ? route.startStation : route.startPoint}
                      </Typography>
                      <ArrowForwardIcon sx={{ fontSize: 14, color: "#2E9EBF" }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {type === "train" ? route.endStation : route.endPoint}
                      </Typography>
                    </Stack>

                    {(route.busNumber || route.trainName) && (
                      <Chip
                        label={route.busNumber || route.trainName}
                        size="small"
                        sx={{
                          bgcolor: "rgba(46, 158, 191, 0.12)",
                          color: "#2E9EBF",
                          fontWeight: 700,
                          borderRadius: "8px",
                          mt: 0.5,
                        }}
                      />
                    )}

                    {route.notes && (
                      <Typography variant="caption" sx={{ color: "var(--text-secondary)", display: "block", mt: 1, fontStyle: "italic" }}>
                        {route.notes}
                      </Typography>
                    )}
                  </Box>

                  {/* Departure Time Tag */}
                  <Chip
                    icon={<AccessTimeIcon sx={{ color: "#2E9EBF !important" }} />}
                    label={
                      route.arrivalTime
                        ? `${route.departureTime} → ${route.arrivalTime}`
                        : route.departureTime
                    }
                    sx={{
                      bgcolor: "rgba(46, 158, 191, 0.15)",
                      color: "var(--text-primary)",
                      fontWeight: 800,
                      borderRadius: "12px",
                      px: 1,
                      py: 2.2,
                      fontSize: "0.9rem",
                      border: "1px solid rgba(46, 158, 191, 0.3)",
                    }}
                  />
                </Card>
              ))}
            </Stack>
          )}
        </Box>
      </Box>
    </Box>
  );
}