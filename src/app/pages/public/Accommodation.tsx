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
    Skeleton,
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
import CloseIcon from "@mui/icons-material/Close";
import BedIcon from "@mui/icons-material/KingBed";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AddIcon from "@mui/icons-material/Add";
import { Sidebar } from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { useAccommodations } from "../../hooks/useAccommodation";
import { createAccommodation } from "../../../api/accommodationService";
import AddAccommodationDialog, { AddAccommodationFormData } from "../../components/accommodation/AddAccommodationDialog";

const accentYellow = "#facc15";
const deepBlack = "#050505";

const accommodationTypes = ["All", "Boarding", "Annex", "Apartment"] as const;

// ─── Lazy Image Component ─────────────────────────────────────────────────────
function LazyImage({ src, alt, height }: { src: string; alt: string; height: number }) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    return (
        <Box sx={{ position: "relative", height, overflow: "hidden", bgcolor: "#111", borderRadius: "16px 16px 0 0" }}>
            {!loaded && !error && (
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={height}
                    animation="wave"
                    sx={{ bgcolor: "rgba(255,255,255,0.05)", position: "absolute", inset: 0 }}
                />
            )}
            <Box
                component="img"
                src={src}
                alt={alt}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                onError={() => setError(true)}
                sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    opacity: loaded ? 1 : 0,
                    transition: "opacity 0.4s ease, transform 0.5s ease",
                    transform: loaded ? "scale(1)" : "scale(1.03)",
                    "&:hover": { transform: "scale(1.05)" },
                }}
            />
            {error && (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", bgcolor: "#111" }}>
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
                backgroundColor: "#111111",
                border: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >
            <Skeleton variant="rectangular" height={220} animation="wave" sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
            <CardContent>
                <Stack spacing={1.5}>
                    <Skeleton variant="text" width="70%" height={28} sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
                    <Skeleton variant="text" width="50%" height={20} sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
                    <Skeleton variant="text" width="40%" height={20} sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
                    <Stack direction="row" spacing={1}>
                        <Skeleton variant="rounded" width={72} height={24} sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
                        <Skeleton variant="rounded" width={72} height={24} sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
                        <Skeleton variant="rounded" width={72} height={24} sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
                    </Stack>
                    <Skeleton variant="text" width="35%" height={28} sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
                </Stack>
            </CardContent>
            <Box sx={{ px: 2, pb: 2, mt: "auto" }}>
                <Skeleton variant="rounded" height={42} sx={{ bgcolor: "rgba(255,255,255,0.05)", borderRadius: "12px" }} />
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

    return (
        <Grow in timeout={400 + index * 100}>
            <Card
                elevation={0}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                sx={{
                    borderRadius: "20px",
                    height: "100%",
                    backgroundColor: "#111111",
                    border: "1px solid rgba(255,255,255,0.05)",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    transition: "all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    transform: hovered ? "translateY(-6px)" : "translateY(0)",
                    boxShadow: hovered ? "0 24px 48px rgba(0,0,0,0.5)" : "none",
                    "&:hover": {
                        borderColor: "rgba(250, 204, 21, 0.3)",
                        backgroundColor: "rgba(250,204,21,0.02)",
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
                                icon={<HotelIcon sx={{ color: `${deepBlack} !important`, fontSize: "14px !important" }} />}
                                label={item.type}
                                size="small"
                                sx={{ backgroundColor: accentYellow, color: deepBlack, fontWeight: 700, fontSize: "0.72rem" }}
                            />
                        </Stack>

                        {/* Location & Distance */}
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 0.5, sm: 1.5 }} color="rgba(255,255,255,0.6)">
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <PlaceIcon fontSize="small" sx={{ color: accentYellow, fontSize: 15 }} />
                                <Typography variant="caption" sx={{ fontWeight: 500 }}>{item.location}</Typography>
                            </Stack>
                            <Typography variant="caption">{item.distanceKm} km to campus</Typography>
                        </Stack>

                        {/* Rating */}
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <StarIcon sx={{ color: accentYellow, fontSize: 17 }} />
                            <Typography variant="caption" sx={{ color: "#f5f5f5", fontWeight: 600 }}>
                                {item.rating}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
                                ({item.reviews} reviews)
                            </Typography>
                        </Stack>

                        {/* Description */}
                        <Typography
                            variant="body2"
                            sx={{
                                color: "rgba(255,255,255,0.6)",
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
                                    sx={{ borderColor: "rgba(250, 204, 21, 0.3)", color: "rgba(255,255,255,0.7)", fontSize: "0.68rem" }}
                                />
                            ))}
                        </Stack>

                        {/* Price */}
                        <Typography variant="h6" sx={{ fontWeight: 800, color: accentYellow, fontSize: "1.05rem" }}>
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
                            backgroundColor: hovered ? accentYellow : "rgba(250,204,21,0.1)",
                            color: hovered ? deepBlack : accentYellow,
                            fontWeight: 800,
                            borderRadius: "12px",
                            py: 1.2,
                            textTransform: "none",
                            fontSize: "0.9rem",
                            border: `1px solid rgba(250,204,21,0.3)`,
                            transition: "all 0.3s ease",
                            "&:hover": { backgroundColor: accentYellow, color: deepBlack, boxShadow: "0 0 20px rgba(250,204,21,0.3)" },
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

    const queryClient = useQueryClient();
    const { data: accommodations = [], isLoading: loading, error } = useAccommodations();

    useEffect(() => {
        const t = setTimeout(() => {
            setVisible(true);
        }, 100);
        return () => clearTimeout(t);
    }, []);

    const filteredAccommodations = useMemo(() => {
        return accommodations.filter((item) => {
            const matchesType = selectedType === "All" || item.type === selectedType;
            const q = query.trim().toLowerCase();
            const matchesQuery =
                q.length === 0 ||
                item.title.toLowerCase().includes(q) ||
                item.location.toLowerCase().includes(q) ||
                item.amenities.some((amenity) => amenity.toLowerCase().includes(q));
            return matchesType && matchesQuery;
        });
    }, [accommodations, query, selectedType]);

    const handleAddAccommodation = async (data: AddAccommodationFormData) => {
        const formData = new FormData();
        formData.append("Name", data.title);
        formData.append("Address", data.location);
        formData.append("PhoneNumber", data.contactPhone);
        formData.append("Description", data.description || "");
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
                bgcolor: deepBlack,
                backgroundImage: "radial-gradient(circle at top right, rgba(250, 204, 21, 0.04), transparent 45%)",
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
                                        <AutoAwesomeIcon sx={{ color: accentYellow, fontSize: 22 }} />
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                fontWeight: 800,
                                                color: "#ffffff",
                                                fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.6rem" },
                                                letterSpacing: "-0.02em",
                                            }}
                                        >
                                            Student{" "}
                                            <Box component="span" sx={{ color: accentYellow }}>
                                                Accommodation
                                            </Box>
                                        </Typography>
                                    </Stack>
                                    <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.55)", maxWidth: 680, fontSize: "1rem", lineHeight: 1.6 }}>
                                        Verified, student-friendly places near your campus. Browse by type, budget, and amenities.
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => setOpenAddDialog(true)}
                                    sx={{
                                        backgroundColor: accentYellow,
                                        color: deepBlack,
                                        fontWeight: 800,
                                        borderRadius: 2,
                                        textTransform: "none",
                                        "&:hover": { backgroundColor: "#eab308" },
                                    }}
                                >
                                    Add Place
                                </Button>
                            </Box>
                        </Fade>

                        {/* ── Search & Filter Bar ──────────────────────── */}
                        <Fade in={visible} timeout={700}>
                            <Box
                                sx={{
                                    mb: 6,
                                    p: { xs: 2, md: 3 },
                                    borderRadius: "20px",
                                    bgcolor: "rgba(255,255,255,0.02)",
                                    border: "1px solid rgba(250, 204, 21, 0.15)",
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
                                                color: "#fff",
                                                borderRadius: "12px",
                                                bgcolor: "rgba(255,255,255,0.03)",
                                                "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                                                "&:hover fieldset": { borderColor: "rgba(250, 204, 21, 0.4)" },
                                                "&.Mui-focused fieldset": { borderColor: accentYellow, borderWidth: "1px" },
                                            },
                                            "& .MuiInputBase-input::placeholder": { color: "rgba(255,255,255,0.3)" },
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon sx={{ color: "rgba(255,255,255,0.4)", fontSize: 20 }} />
                                                </InputAdornment>
                                            ),
                                            endAdornment: query ? (
                                                <InputAdornment position="end">
                                                    <IconButton size="small" onClick={() => setQuery("")} sx={{ color: "rgba(255,255,255,0.3)", p: 0.3 }}>
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
                                                    borderColor: selectedType === type ? accentYellow : "rgba(255,255,255,0.12)",
                                                    backgroundColor: selectedType === type ? accentYellow : "rgba(255,255,255,0.04)",
                                                    color: selectedType === type ? deepBlack : "rgba(255,255,255,0.6)",
                                                    transition: "all 0.2s ease",
                                                    "&:hover": {
                                                        backgroundColor: selectedType === type ? accentYellow : "rgba(250,204,21,0.1)",
                                                        borderColor: accentYellow,
                                                        color: selectedType === type ? deepBlack : accentYellow,
                                                    },
                                                }}
                                            />
                                        ))}

                                        {/* Result count */}
                                        {!loading && (
                                            <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
                                                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
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
                                {filteredAccommodations.map((item, index) => (
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
