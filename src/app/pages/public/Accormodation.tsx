import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Chip,
    CircularProgress,
    Container,xttg
    Grid,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PlaceIcon from "@mui/icons-material/Place";
import StarIcon from "@mui/icons-material/Star";
import HotelIcon from "@mui/icons-material/Hotel";
import { Sidebar } from "../../components/layout/Sidebar";
import { PageLayout } from "../../components/layout/PageLayout";
import accommodationService from "../../../api/accommodationService";
import type { Accommodation } from "../data/accommodations";

const accommodationTypes = ["All", "Boarding", "Annex", "Apartment"] as const;

export default function Accommodation() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [selectedType, setSelectedType] = useState<(typeof accommodationTypes)[number]>("All");
    const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const accentYellow = "#facc15";
    const deepBlack = "#0b0b0b";

    useEffect(() => {
        let isMounted = true;

        const loadAccommodations = async () => {
            try {
                const rows = await accommodationService.fetchAccommodations();

                if (isMounted) {
                    setAccommodations(rows);
                    setError("");
                }
            } catch {
                if (isMounted) {
                    setError("Unable to load accommodations right now. Please try again shortly.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadAccommodations();

        return () => {
            isMounted = false;
        };
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
    }, [query, selectedType]);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: `radial-gradient(circle at top right, rgba(250, 204, 21, 0.16), transparent 40%), ${deepBlack}`,
            }}
        >
            <Sidebar activeSection="accommodation" />
            <PageLayout>
                <Container maxWidth="xl" sx={{ py: { xs: 2.5, sm: 3.5, md: 5 } }}>
                    <Stack spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                        <Box>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 800,
                                    color: "#ffffff",
                                    fontSize: { xs: "1.65rem", sm: "2rem", md: "2.2rem" },
                                }}
                            >
                                Student Accommodation
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 1, color: "rgba(255,255,255,0.82)", maxWidth: 760 }}>
                                Verified places for students only. Browse by budget, location, and facilities.
                            </Typography>
                        </Box>

                        <Card
                            sx={{
                                borderRadius: 4,
                                p: { xs: 1.5, sm: 2, md: 3 },
                                backgroundColor: "#141414",
                                border: `1px solid ${accentYellow}`,
                            }}
                        >
                            <Stack spacing={2}>
                                <TextField
                                    fullWidth
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    placeholder="Search by place, area, or amenity"
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            backgroundColor: "#1f1f1f",
                                            color: "#fff",
                                            borderRadius: 2,
                                        },
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgba(250, 204, 21, 0.45)",
                                        },
                                        "& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: accentYellow,
                                        },
                                        "& .MuiSvgIcon-root": {
                                            color: accentYellow,
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                    {accommodationTypes.map((type) => (
                                        <Chip
                                            key={type}
                                            label={type}
                                            clickable
                                            sx={{
                                                fontWeight: 700,
                                                borderColor: accentYellow,
                                                backgroundColor: selectedType === type ? accentYellow : "transparent",
                                                color: selectedType === type ? deepBlack : accentYellow,
                                            }}
                                            onClick={() => setSelectedType(type)}
                                        />
                                    ))}
                                </Stack>
                            </Stack>
                        </Card>

                        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                            {loading && (
                                <Grid size={{ xs: 12 }}>
                                    <Card sx={{ borderRadius: 3, p: { xs: 3, md: 4 }, textAlign: "center", backgroundColor: "#121212", border: "1px solid rgba(250, 204, 21, 0.35)" }}>
                                        <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                                            <CircularProgress size={22} sx={{ color: accentYellow }} />
                                            <Typography variant="body1" sx={{ color: "#fff" }}>
                                                Loading accommodations...
                                            </Typography>
                                        </Stack>
                                    </Card>
                                </Grid>
                            )}

                            {!loading && error && (
                                <Grid size={{ xs: 12 }}>
                                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                                        {error}
                                    </Alert>
                                </Grid>
                            )}

                            {filteredAccommodations.map((item) => (
                                <Grid size={{ xs: 12, sm: 6, xl: 4 }} key={item.id}>
                                    <Card
                                        sx={{
                                            borderRadius: 4,
                                            height: "100%",
                                            backgroundColor: "#111111",
                                            border: "1px solid rgba(250, 204, 21, 0.25)",
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="220"
                                            image={item.image}
                                            alt={item.title}
                                            sx={{ height: { xs: 185, sm: 210, md: 220 } }}
                                        />
                                        <CardContent>
                                            <Stack spacing={1.5}>
                                                <Stack direction="row" justifyContent="space-between" alignItems="center" useFlexGap flexWrap="wrap">
                                                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff", fontSize: { xs: "1rem", sm: "1.12rem" } }}>
                                                        {item.title}
                                                    </Typography>
                                                    <Chip
                                                        icon={<HotelIcon sx={{ color: `${deepBlack} !important` }} />}
                                                        label={item.type}
                                                        size="small"
                                                        sx={{ backgroundColor: accentYellow, color: deepBlack, fontWeight: 700 }}
                                                    />
                                                </Stack>

                                                <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 0.5, sm: 2 }} color="rgba(255,255,255,0.72)">
                                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                                        <PlaceIcon fontSize="small" sx={{ color: accentYellow }} />
                                                        <Typography variant="body2">{item.location}</Typography>
                                                    </Stack>
                                                    <Typography variant="body2">{item.distanceKm} km to campus</Typography>
                                                </Stack>

                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <StarIcon sx={{ color: accentYellow, fontSize: 20 }} />
                                                    <Typography variant="body2" sx={{ color: "#f5f5f5" }}>
                                                        {item.rating} ({item.reviews} reviews)
                                                    </Typography>
                                                </Stack>

                                                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.78)" }}>
                                                    {item.description}
                                                </Typography>

                                                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                    {item.amenities.slice(0, 3).map((amenity) => (
                                                        <Chip
                                                            key={amenity}
                                                            label={amenity}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ borderColor: "rgba(250, 204, 21, 0.45)", color: "#f7f7f7" }}
                                                        />
                                                    ))}
                                                </Stack>

                                                <Typography variant="h6" sx={{ fontWeight: 800, color: accentYellow }}>
                                                    LKR {item.monthlyRent.toLocaleString()} / month
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)" }}>
                                                    {item.availableBeds} beds available now
                                                </Typography>
                                            </Stack>
                                        </CardContent>
                                        <CardActions sx={{ px: 2, pb: 2, pt: 0, mt: "auto" }}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: accentYellow,
                                                    color: deepBlack,
                                                    fontWeight: 800,
                                                    "&:hover": { backgroundColor: "#facc15" },
                                                }}
                                                onClick={() => navigate(`/accommodation/${item.id}`)}
                                            >
                                                View Details
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {!loading && filteredAccommodations.length === 0 && (
                            <Card sx={{ borderRadius: 3, p: { xs: 3, md: 4 }, textAlign: "center", backgroundColor: "#121212", border: "1px solid rgba(250, 204, 21, 0.35)" }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff" }}>
                                    No places found
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1, color: "rgba(255,255,255,0.72)" }}>
                                    Try another keyword or select a different accommodation type.
                                </Typography>
                            </Card>
                        )}
                    </Stack>
                </Container>
            </PageLayout>
        </Box>
    );
}
