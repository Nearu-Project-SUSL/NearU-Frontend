import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  Box,
  Typography,
  Grid,
  Card,
  Button,
  Chip,
  CircularProgress,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import TrainIcon from "@mui/icons-material/Train";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";

import { Sidebar } from "../../../components/layout/Sidebar";
import Navbar from "../../../components/layout/Navbar";
import { transportService } from "../../../../api/transportService";
import type { BusRoute, TrainRoute, TukTukDriver } from "../../../../types/transport";

type TransportType = "tuk" | "bus" | "train";

export default function Transport() {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPathSegment = location.pathname.split("/").pop() || "tuk";
  const type: TransportType = ["tuk", "bus", "train"].includes(currentPathSegment)
    ? (currentPathSegment as TransportType)
    : "tuk";

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      let res: any[] = [];
      if (type === "tuk") {
        res = await transportService.getTukTukDrivers();
      } else if (type === "bus") {
        res = await transportService.getBusRoutes();
      } else if (type === "train") {
        res = await transportService.getTrainRoutes();
      }
      setData(res || []);
    } catch (err: any) {
      console.error(`Failed to load ${type} data:`, err);
      setError("Could not load schedules. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [type]);

  const titles: Record<TransportType, string> = {
    tuk: "Tuk Tuk Drivers",
    bus: "Bus Schedules",
    train: "Train Schedules",
  };

  const subtitles: Record<TransportType, string> = {
    tuk: "Verified tuk-tuk drivers available around campus & town",
    bus: "Scheduled public and campus transit bus timetables",
    train: "Express & regional railway timetables and station routes",
  };

  const icons: Record<TransportType, React.ComponentType<any>> = {
    tuk: LocalTaxiIcon,
    bus: DirectionsBusIcon,
    train: TrainIcon,
  };

  const HeaderIcon = icons[type] || LocalTaxiIcon;

  // Filter items based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();

    return data.filter((item) => {
      if (type === "tuk") {
        const d = item as TukTukDriver;
        return (
          d.name?.toLowerCase().includes(term) ||
          d.plateNumber?.toLowerCase().includes(term) ||
          d.operatingArea?.toLowerCase().includes(term) ||
          d.phoneNumber?.toLowerCase().includes(term)
        );
      } else if (type === "bus") {
        const b = item as BusRoute;
        return (
          b.routeName?.toLowerCase().includes(term) ||
          b.startPoint?.toLowerCase().includes(term) ||
          b.endPoint?.toLowerCase().includes(term) ||
          b.busNumber?.toLowerCase().includes(term) ||
          b.departureTime?.toLowerCase().includes(term)
        );
      } else if (type === "train") {
        const t = item as TrainRoute;
        return (
          t.routeName?.toLowerCase().includes(term) ||
          t.startStation?.toLowerCase().includes(term) ||
          t.endStation?.toLowerCase().includes(term) ||
          t.trainName?.toLowerCase().includes(term) ||
          t.departureTime?.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [data, searchTerm, type]);

  return (
    <Box sx={{ display: "flex", bgcolor: "var(--bg-base)", minHeight: "100vh" }}>
      <Sidebar activeId="transport" />

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Navbar />

        <Box sx={{ p: { xs: 2.5, md: 5 }, maxWidth: 1200, mx: "auto", width: "100%" }}>
          {/* Back Button and Mode Switcher */}
          <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2, mb: 3 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/transport")}
              sx={{
                color: "#2E9EBF",
                fontWeight: 700,
                textTransform: "none",
                "&:hover": { bgcolor: "rgba(46, 158, 191, 0.1)" },
              }}
            >
              Back to Transport Options
            </Button>

            {/* Mode Switcher Tabs */}
            <Stack direction="row" spacing={1}>
              {[
                { id: "tuk", label: "Tuk Tuks", icon: LocalTaxiIcon },
                { id: "bus", label: "Buses", icon: DirectionsBusIcon },
                { id: "train", label: "Trains", icon: TrainIcon },
              ].map((tab) => {
                const TabIcon = tab.icon;
                const active = type === tab.id;
                return (
                  <Chip
                    key={tab.id}
                    icon={<TabIcon style={{ color: active ? "#fff" : "#2E9EBF" }} />}
                    label={tab.label}
                    onClick={() => navigate(`/transport/${tab.id}`)}
                    sx={{
                      cursor: "pointer",
                      fontWeight: 700,
                      bgcolor: active ? "#2E9EBF" : "rgba(46, 158, 191, 0.08)",
                      color: active ? "#fff" : "var(--text-primary)",
                      border: `1px solid ${active ? "#2E9EBF" : "rgba(46, 158, 191, 0.2)"}`,
                      "&:hover": {
                        bgcolor: active ? "#25829e" : "rgba(46, 158, 191, 0.16)",
                      },
                    }}
                  />
                );
              })}
            </Stack>
          </Box>

          {/* Header Title & Actions */}
          <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 2, mb: 4 }}>
            <Box>
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

            {/* Search and Refresh */}
            <Stack direction="row" spacing={1.5} sx={{ width: { xs: "100%", sm: "auto" } }}>
              <TextField
                size="small"
                placeholder={`Search ${type === "tuk" ? "drivers or areas" : "routes or stations"}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#2E9EBF", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  minWidth: { xs: "100%", sm: 260 },
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "var(--bg-surface)",
                    borderRadius: "14px",
                    color: "var(--text-primary)",
                    "& fieldset": { borderColor: "var(--nearu-border)" },
                    "&:hover fieldset": { borderColor: "#2E9EBF" },
                  },
                }}
              />

              <Tooltip title="Refresh schedules">
                <IconButton
                  onClick={fetchData}
                  sx={{
                    bgcolor: "var(--bg-surface)",
                    border: "1px solid var(--nearu-border)",
                    color: "#2E9EBF",
                    borderRadius: "12px",
                    "&:hover": { bgcolor: "rgba(46, 158, 191, 0.1)" },
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          {/* Content Loading & Error States */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
              <CircularProgress sx={{ color: "#2E9EBF" }} />
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: "center", py: 10, color: "#ef4444" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>{error}</Typography>
              <Button variant="outlined" onClick={fetchData} sx={{ color: "#2E9EBF", borderColor: "#2E9EBF" }}>
                Retry
              </Button>
            </Box>
          ) : filteredData.length === 0 ? (
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
                {searchTerm ? "No Matching Results" : "No Schedules Available"}
              </Typography>
              <Typography variant="body2" sx={{ color: "var(--text-secondary)", mt: 0.5 }}>
                {searchTerm
                  ? `No ${type} matching "${searchTerm}". Try another search term.`
                  : `No ${type} information found right now.`}
              </Typography>
            </Box>
          ) : type === "tuk" ? (
            /* Tuk Drivers Grid */
            <Grid container spacing={3}>
              {filteredData.map((driver: TukTukDriver) => (
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
              {filteredData.map((route: any) => (
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