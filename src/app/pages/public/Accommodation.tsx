import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Grid,
    InputAdornment,
    Stack,
    TextField,
    Typography,
    Fade,
    Grow,
    IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PlaceIcon from "@mui/icons-material/Place";
import StarIcon from "@mui/icons-material/Star";
import HotelIcon from "@mui/icons-material/Hotel";
import BedIcon from "@mui/icons-material/KingBed";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AddIcon from "@mui/icons-material/Add";
import { Sidebar } from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { useAccommodations } from "../../hooks/useAccommodation";
import { createAccommodation } from "../../../api/accommodationService";
import AddAccommodationDialog, { AddAccommodationFormData } from "../../components/accommodation/AddAccommodationDialog";
import { useTheme } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import type { Accommodation } from "../data/accommodations";
import { motion, AnimatePresence } from "motion/react";

const accommodationTypes = ["All", "Boarding", "Annex", "Apartment"] as const;

// ─── Lazy Image Component ─────────────────────────────────────────────────────
function LazyImage({ src, alt, height }: { src: string; alt: string; height: number }) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
        <Box sx={{ position: "relative", height, overflow: "hidden", bgcolor: "rgba(255, 255, 255, 0.02)", borderRadius: "16px 16px 0 0" }}>
            <AnimatePresence>
                {!loaded && !error && (
                    <Box
                        component={motion.div}
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        sx={{
                            position: "absolute",
                            inset: 0,
                            bgcolor: "rgba(10, 10, 20, 0.5)",
                            backdropFilter: "blur(12px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 1,
                            overflow: "hidden",
                            "&::after": {
                                content: '""',
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)",
                                transform: "translateX(-100%)",
                                animation: "shimmer 1.8s infinite"
                            }
                        }}
                    >
                        <HotelIcon sx={{ fontSize: 32, color: "rgba(255,255,255,0.15)", animation: "pulse 1.5s infinite ease-in-out" }} />
                    </Box>
                )}
            </AnimatePresence>

            {!error ? (
                <Box
                    component={motion.img}
                    src={src}
                    alt={alt}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 0.98 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    onLoad={() => setLoaded(true)}
                    onError={() => setError(true)}
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        transition: "transform 0.5s ease",
                        "&:hover": { transform: "scale(1.05)" },
                    }}
                />
            ) : (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", bgcolor: "#0a0a14" }}>
                    <HotelIcon sx={{ fontSize: 48, color: "rgba(255,255,255,0.1)" }} />
                </Box>
            )}
        </Box>
    );
}

// ─── Accommodation Card Skeleton ──────────────────────────────────────────────
function AccommodationSkeleton() {
    return (
        <Card
            sx={{
                borderRadius: "20px",
                height: "100%",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--nearu-border)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                position: "relative",
                "&::after": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)",
                    transform: "translateX(-100%)",
                    animation: "shimmer 1.8s infinite"
                }
            }}
        >
            <Box sx={{ height: 220, bgcolor: "rgba(255,255,255,0.03)", animation: "pulse 1.5s infinite ease-in-out" }} />
            <CardContent>
                <Stack spacing={1.5}>
                    <Box sx={{ height: 28, width: "70%", bgcolor: "rgba(255,255,255,0.03)", borderRadius: "4px", animation: "pulse 1.5s infinite ease-in-out" }} />
                    <Box sx={{ height: 20, width: "50%", bgcolor: "rgba(255,255,255,0.02)", borderRadius: "4px", animation: "pulse 1.5s infinite ease-in-out" }} />
                    <Box sx={{ height: 20, width: "40%", bgcolor: "rgba(255,255,255,0.02)", borderRadius: "4px", animation: "pulse 1.5s infinite ease-in-out" }} />
                    <Stack direction="row" spacing={1}>
                        <Box sx={{ height: 24, width: 72, bgcolor: "rgba(255,255,255,0.03)", borderRadius: "10px", animation: "pulse 1.5s infinite ease-in-out" }} />
                        <Box sx={{ height: 24, width: 72, bgcolor: "rgba(255,255,255,0.03)", borderRadius: "10px", animation: "pulse 1.5s infinite ease-in-out" }} />
                        <Box sx={{ height: 24, width: 72, bgcolor: "rgba(255,255,255,0.03)", borderRadius: "10px", animation: "pulse 1.5s infinite ease-in-out" }} />
                    </Stack>
                    <Box sx={{ height: 28, width: "35%", bgcolor: "rgba(255,255,255,0.03)", borderRadius: "4px", animation: "pulse 1.5s infinite ease-in-out" }} />
                </Stack>
            </CardContent>
            <Box sx={{ px: 2, pb: 2, mt: "auto" }}>
                <Box sx={{ height: 42, bgcolor: "rgba(255,255,255,0.03)", borderRadius: "12px", animation: "pulse 1.5s infinite ease-in-out" }} />
            </Box>
        </Card>
    );
}

// ─── Accommodation Card ───────────────────────────────────────────────────────
function AccommodationCard({
    item,
    index,
}: {
    item: any;
    index: number;
}) {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(false);
    const theme = useTheme();
    const accent = theme.palette.primary.main;
    const accentAlpha = (a: number) => `rgba(46, 158, 191, ${a})`;

    return (
        <Grow in timeout={400 + index * 100}>
            <Card
                elevation={0}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                sx={{
                    borderRadius: "20px",
                    height: "100%",
                    backgroundColor: "var(--bg-surface)",
                    border: "1px solid var(--nearu-border)",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    transition: "all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    transform: hovered ? "translateY(-6px)" : "translateY(0)",
                    boxShadow: hovered ? "0 24px 48px rgba(0,0,0,0.3)" : "none",
                    "&:hover": {
                        borderColor: "var(--nearu-accent)",
                        backgroundColor: "var(--nearu-accent-subtle)",
                    },
                }}
            >
                {/* Image with lazy loading */}
                <LazyImage src={item.image} alt={item.title} height={220} />

                <CardContent sx={{ flex: 1, pb: 0 }}>
                    <Stack spacing={1.5}>
                        {/* Title + Type Badge */}
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1}>
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 700, color: "#fff", fontSize: { xs: "1rem", sm: "1.1rem" }, lineHeight: 1.3, flex: 1 }}
                            >
                                {item.title}
                            </Typography>
                            <Chip
                                icon={<HotelIcon sx={{ color: `#fff !important`, fontSize: "14px !important" }} />}
                                label={item.type}
                                size="small"
                                sx={{ backgroundColor: accent, color: '#fff', fontWeight: 700, fontSize: "0.72rem" }}
                            />
                        </Stack>

                        {/* Location & Distance */}
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 0.5, sm: 1.5 }} color={theme.palette.text.secondary}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <PlaceIcon fontSize="small" sx={{ color: accent, fontSize: 15 }} />
                                <Typography variant="caption" sx={{ fontWeight: 500 }}>{item.location}</Typography>
                            </Stack>
                            <Typography variant="caption">{item.distanceKm} km to campus</Typography>
                        </Stack>

                        {/* Rating */}
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <StarIcon sx={{ color: accent, fontSize: 17 }} />
                            <Typography variant="caption" sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
                                {item.rating}
                            </Typography>
                            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                ({item.reviews} reviews)
                            </Typography>
                        </Stack>

                        {/* Description */}
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.secondary,
                                fontSize: "0.82rem",
                                lineHeight: 1.6,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                            }}
                        >
                            {item.description}
                        </Typography>

                        {/* Amenity chips */}
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {item.amenities && item.amenities.slice(0, 3).map((amenity: string) => (
                                <Chip
                                    key={amenity}
                                    label={amenity}
                                    size="small"
                                    variant="outlined"
                                    sx={{ borderColor: accentAlpha(0.3), color: theme.palette.text.secondary, fontSize: "0.68rem" }}
                                />
                            ))}
                        </Stack>

                        {/* Price */}
                        <Typography variant="h6" sx={{ fontWeight: 800, color: accent, fontSize: "1.05rem" }}>
                            LKR {item.monthlyRent?.toLocaleString() || 0} / month
                        </Typography>

                        {/* Available beds */}
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <BedIcon sx={{ fontSize: 15, color: "#22c55e" }} />
                            <Typography variant="caption" sx={{ color: "#22c55e", fontWeight: 600 }}>
                                {item.availableBeds} beds available
                            </Typography>
                        </Stack>
                    </Stack>
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2, pt: 1.5, mt: "auto" }}>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={() => navigate(`/accommodation/${item.id}`)}
                        sx={{
                            backgroundColor: hovered ? accent : accentAlpha(0.1),
                            color: '#fff',
                            fontWeight: 800,
                            borderRadius: "12px",
                            py: 1.2,
                            textTransform: "none",
                            fontSize: "0.9rem",
                            border: `1px solid ${accentAlpha(0.35)}`,
                            transition: "all 0.3s ease",
                            "&:hover": { backgroundColor: accent, color: '#fff', boxShadow: `0 0 20px ${accentAlpha(0.3)}` },
                        }}
                    >
                        View Details
                    </Button>
                </CardActions>
            </Card>
        </Grow>
    );
}

// ─── Main Accommodation Page ──────────────────────────────────────────────────
export default function Accommodation() {
    const [query, setQuery] = useState("");
    const [selectedType, setSelectedType] = useState<(typeof accommodationTypes)[number]>("All");
    const [visible, setVisible] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const theme = useTheme();
    const accent = theme.palette.primary.main;
    const accentAlpha = (a: number) => `rgba(46, 158, 191, ${a})`;

    const queryClient = useQueryClient();
    const { data: accommodations = [], isLoading: loading, error } = useAccommodations();
    const { auth } = useAuth();
    
    const canAddAccommodation = auth?.user?.roles?.includes('Admin') || auth?.user?.roles?.includes('Business');

    useEffect(() => {
        const t = setTimeout(() => {
            setVisible(true);
        }, 100);
        return () => clearTimeout(t);
    }, []);

    const filteredAccommodations = useMemo(() => {
        return accommodations.filter((item: Accommodation) => {
            const matchesType = selectedType === "All" || item.type === selectedType;
            const q = query.trim().toLowerCase();
            const matchesQuery =
                q.length === 0 ||
                item.title.toLowerCase().includes(q) ||
                item.location.toLowerCase().includes(q) ||
                item.amenities.some((amenity: string) => amenity.toLowerCase().includes(q));
            return matchesType && matchesQuery;
        });
    }, [accommodations, query, selectedType]);

    const handleAddAccommodation = async (data: AddAccommodationFormData) => {
        const formData = new FormData();
        formData.append("Name", data.title);
        formData.append("Address", data.location);
        formData.append("PhoneNumber", data.contactPhone);
        formData.append("Description", data.description || "");
        formData.append("Type", data.type);
        formData.append("DistanceKm", String(data.distanceKm ?? 0));
        formData.append("MonthlyRent", String(data.monthlyRent ?? 0));
        formData.append("AvailableBeds", String(data.availableBeds ?? 0));
        if (data.photo) {
            formData.append("Photo", data.photo);
        }

        await createAccommodation(formData);
        await queryClient.invalidateQueries({ queryKey: ['accommodations'] });
        setOpenAddDialog(false);
    };

    return (
        <Box
            sx={{
                display: "flex",
                height: "100vh",
                overflow: "hidden",
                bgcolor: "var(--bg-base)",
                backgroundImage: `radial-gradient(circle at top right, var(--nearu-accent-subtle) 0%, transparent 40%)`,
            }}
        >
            <Sidebar activeSection="accommodation" />

            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
                <Navbar />

                {/* Scrollable content */}
                <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
                    <Box sx={{ px: { xs: 2.5, md: 5 }, py: { xs: 4, md: 5 }, pb: 8, maxWidth: 1400, mx: "auto", width: "100%" }}>

                        {/* ── Hero Header ─────────────────────────────────── */}
                        <Fade in={visible} timeout={600}>
                            <Box sx={{ mb: 6, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2 }}>
                                <Box>
                                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                                        <AutoAwesomeIcon sx={{ color: accent, fontSize: 22 }} />
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                fontWeight: 800,
                                                color: theme.palette.text.primary,
                                                fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.6rem" },
                                                letterSpacing: "-0.02em",
                                            }}
                                        >
                                            Student{" "}
                                            <Box component="span" sx={{ color: accent }}>
                                                Accommodation
                                            </Box>
                                        </Typography>
                                    </Stack>
                                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary, maxWidth: 680, fontSize: "1rem", lineHeight: 1.6 }}>
                                        Verified, student-friendly places near your campus. Browse by type, budget, and amenities.
                                    </Typography>
                                </Box>
                                {canAddAccommodation && (
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={() => setOpenAddDialog(true)}
                                        sx={{
                                            backgroundColor: accent,
                                            color: '#fff',
                                            fontWeight: 800,
                                            borderRadius: 2,
                                            textTransform: "none",
                                            "&:hover": { backgroundColor: '#1a7a9a' },
                                        }}
                                    >
                                        Add Place
                                    </Button>
                                )}
                            </Box>
                        </Fade>

                        {/* ── Search & Filter Bar ──────────────────────── */}
                        <Fade in={visible} timeout={700}>
                            <Box
                                sx={{
                                    mb: 6,
                                    p: { xs: 2, md: 3 },
                                    borderRadius: "20px",
                                    bgcolor: "var(--bg-surface)",
                                    border: "1px solid var(--nearu-border)",
                                    backdropFilter: "blur(10px)",
                                }}
                            >
                                <Stack spacing={2}>
                                    <TextField
                                        fullWidth
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Search by place, area, or amenity..."
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                color: "var(--text-primary)",
                                                borderRadius: "12px",
                                                bgcolor: "rgba(255,255,255,0.02)",
                                                "& fieldset": { borderColor: "var(--nearu-border)" },
                                                "&:hover fieldset": { borderColor: "var(--nearu-accent)" },
                                                "&.Mui-focused fieldset": { borderColor: "var(--nearu-accent)", borderWidth: "1px" },
                                            },
                                            "& .MuiInputBase-input::placeholder": { color: "var(--text-secondary)" },
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon sx={{ color: theme.palette.text.secondary, fontSize: 20 }} />
                                                </InputAdornment>
                                            ),
                                            endAdornment: query ? (
                                                <InputAdornment position="end">
                                                    <IconButton size="small" onClick={() => setQuery("")} sx={{ color: theme.palette.text.secondary, p: 0.3 }}>
                                                        <CloseIcon sx={{ fontSize: 16 }} />
                                                    </IconButton>
                                                </InputAdornment>
                                            ) : null,
                                        }}
                                    />

                                    {/* Type filter chips */}
                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                        {accommodationTypes.map((type) => (
                                            <Chip
                                                key={type}
                                                label={type}
                                                clickable
                                                onClick={() => setSelectedType(type)}
                                                sx={{
                                                    fontWeight: 700,
                                                    fontSize: "0.82rem",
                                                    borderRadius: "10px",
                                                    border: "1px solid",
                                                    borderColor: selectedType === type ? "var(--nearu-accent)" : "var(--nearu-border)",
                                                    backgroundColor: selectedType === type ? "var(--nearu-accent)" : "rgba(255,255,255,0.02)",
                                                    color: selectedType === type ? '#fff' : "var(--text-secondary)",
                                                    transition: "all 0.2s ease",
                                                    "&:hover": {
                                                        backgroundColor: selectedType === type ? "var(--nearu-accent)" : "var(--nearu-accent-subtle)",
                                                        borderColor: "var(--nearu-accent)",
                                                        color: selectedType === type ? '#fff' : "var(--nearu-accent)",
                                                    },
                                                }}
                                            />
                                        ))}

                                        {/* Result count */}
                                        {!loading && (
                                            <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
                                                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                                    {filteredAccommodations.length} place{filteredAccommodations.length !== 1 ? "s" : ""} found
                                                </Typography>
                                            </Box>
                                        )}
                                    </Stack>
                                </Stack>
                            </Box>
                        </Fade>

                        {/* ── Cards Grid ───────────────────────────────── */}
                        {loading ? (
                            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <Grid size={{ xs: 12, sm: 6, xl: 4 }} key={i}>
                                        <AccommodationSkeleton />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : filteredAccommodations.length > 0 ? (
                            <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                                {filteredAccommodations.map((item: Accommodation, index: number) => (
                                    <Grid size={{ xs: 12, sm: 6, xl: 4 }} key={item.id}>
                                        <AccommodationCard item={item} index={index} />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Fade in timeout={300}>
                                <Box
                                    sx={{
                                        textAlign: "center",
                                        py: 10,
                                        borderRadius: "24px",
                                        bgcolor: "rgba(255,255,255,0.02)",
                                        border: "1px dashed rgba(255,255,255,0.08)",
                                    }}
                                >
                                    <HotelIcon sx={{ fontSize: 48, color: "rgba(255,255,255,0.1)", mb: 2 }} />
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: "rgba(255,255,255,0.6)", mb: 1 }}>
                                        {error ? "Unable to load accommodations" : "No places found"}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.3)" }}>
                                        {error ? "There was an error fetching data from the server." : "Try a different keyword or select another accommodation type."}
                                    </Typography>
                                </Box>
                            </Fade>
                        )}

                    </Box>
                </Box>
            </Box>
            <AddAccommodationDialog
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                onSubmit={handleAddAccommodation}
            />
        </Box>
    );
}
