import { Link as RouterLink, useParams } from "react-router";
import Navbar from "../../components/layout/Navbar";
import {
	Alert,
	Box,
	Breadcrumbs,
	Button,
	Card,
	CardContent,
	CardMedia,
	Chip,
	Container,
	Divider,
	Grid,
	Link,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Stack,
	Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceIcon from "@mui/icons-material/Place";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from "@mui/icons-material/Star";
import { Sidebar } from "../../components/layout/Sidebar";
import { accommodations } from "../data/accommodations";

export default function AccommodationDetail() {
	const { id } = useParams();
	const accommodation = accommodations.find((item) => item.id === id);
	const accentYellow = "#facc15";
	const deepBlack = "#0b0b0b";

	if (!accommodation) {
	return (
		<Box
			sx={{
				display: "flex",
				height: "100vh",
				overflow: "hidden",
				background: `radial-gradient(circle at top right, rgba(250, 204, 21, 0.14), transparent 45%), ${deepBlack}`,
			}}
		>
			<Sidebar activeSection="accommodation" />
			<Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
				<Navbar />
				<Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
					<Container maxWidth="md" sx={{ py: 5 }}>
						<Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
							Accommodation not found.
						</Alert>
						<Button
							component={RouterLink}
							to="/accommodation"
							variant="contained"
							startIcon={<ArrowBackIcon />}
							sx={{ backgroundColor: accentYellow, color: deepBlack, fontWeight: 800 }}
						>
							Back to Accommodation List
						</Button>
					</Container>
				</Box>
			</Box>
		</Box>
	);
	}

	return (
		<Box
			sx={{
				display: "flex",
				height: "100vh",
				overflow: "hidden",
				background: `radial-gradient(circle at top right, rgba(250, 204, 21, 0.16), transparent 45%), ${deepBlack}`,
			}}
		>
			<Sidebar activeSection="accommodation" />
			<Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
				<Navbar />
				<Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
				<Container maxWidth="xl" sx={{ py: { xs: 2.5, sm: 3.5, md: 5 } }}>
					<Stack spacing={{ xs: 2, sm: 2.5, md: 3 }}>
						<Breadcrumbs sx={{ color: "rgba(255,255,255,0.8)" }}>
							<Link component={RouterLink} underline="hover" color="inherit" to="/home">
								Home
							</Link>
							<Link component={RouterLink} underline="hover" color="inherit" to="/accommodation">
								Accommodation
							</Link>
							<Typography sx={{ color: accentYellow }}>{accommodation.title}</Typography>
						</Breadcrumbs>

						<Card sx={{ borderRadius: 4, overflow: "hidden", border: "1px solid rgba(250, 204, 21, 0.35)" }}>
							<CardMedia
								component="img"
								image={accommodation.image}
								alt={accommodation.title}
								height="360"
								sx={{ height: { xs: 220, sm: 280, md: 360 } }}
							/>
						</Card>

						<Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
							<Grid size={{ xs: 12, lg: 7 }}>
								<Card sx={{ borderRadius: 4, backgroundColor: "#121212", border: "1px solid rgba(250, 204, 21, 0.28)" }}>
									<CardContent>
										<Stack spacing={2}>
											<Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" useFlexGap>
												<Typography variant="h4" sx={{ fontWeight: 800, color: "#fff", fontSize: { xs: "1.6rem", sm: "2rem", md: "2.2rem" } }}>
													{accommodation.title}
												</Typography>
												<Chip label={accommodation.type} sx={{ backgroundColor: accentYellow, color: deepBlack, fontWeight: 700 }} />
											</Stack>

											<Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 0.75, sm: 2 }} color="rgba(255,255,255,0.75)" flexWrap="wrap" useFlexGap>
												<Stack direction="row" spacing={0.5} alignItems="center">
													<PlaceIcon fontSize="small" sx={{ color: accentYellow }} />
													<Typography variant="body2">{accommodation.location}</Typography>
												</Stack>
												<Typography variant="body2">{accommodation.distanceKm} km to campus</Typography>
											</Stack>

											<Stack direction="row" spacing={0.5} alignItems="center">
												<StarIcon sx={{ color: accentYellow, fontSize: 20 }} />
												<Typography variant="body2" sx={{ color: "#f3f3f3" }}>
													{accommodation.rating} ({accommodation.reviews} reviews)
												</Typography>
											</Stack>

											<Typography variant="body1" sx={{ color: "rgba(255,255,255,0.85)" }}>
												{accommodation.description}
											</Typography>

											<Divider />

											<Typography variant="h6" sx={{ fontWeight: 700, color: accentYellow }}>
												Amenities
											</Typography>
											<List dense>
												{accommodation.amenities.map((amenity) => (
													<ListItem key={amenity} disableGutters>
														<ListItemIcon sx={{ minWidth: 32 }}>
															<CheckCircleIcon sx={{ color: accentYellow }} fontSize="small" />
														</ListItemIcon>
														<ListItemText primary={amenity} primaryTypographyProps={{ sx: { color: "#f2f2f2" } }} />
													</ListItem>
												))}
											</List>
										</Stack>
									</CardContent>
								</Card>
							</Grid>

							<Grid size={{ xs: 12, lg: 5 }}>
								<Card sx={{ borderRadius: 4, backgroundColor: "#121212", border: "1px solid rgba(250, 204, 21, 0.35)" }}>
									<CardContent>
										<Stack spacing={2}>
											<Typography variant="h5" sx={{ fontWeight: 800, color: accentYellow, fontSize: { xs: "1.3rem", sm: "1.5rem" } }}>
												LKR {accommodation.monthlyRent.toLocaleString()} / month
											</Typography>
											<Typography variant="body2" sx={{ color: "rgba(255,255,255,0.74)" }}>
												{accommodation.availableBeds} beds available now
											</Typography>
											<Typography variant="body2" sx={{ color: "rgba(255,255,255,0.74)" }}>
												Available for: Students
											</Typography>
											<Divider />
											<Button
												variant="contained"
												startIcon={<PhoneIcon />}
												component="a"
												href={`tel:${accommodation.contactPhone}`}
												sx={{
													backgroundColor: accentYellow,
													color: deepBlack,
													fontWeight: 800,
													"&:hover": { backgroundColor: "#facc15" },
												}}
											>
												Call Owner
											</Button>
											<Button
												component={RouterLink}
												to="/accommodation"
												variant="outlined"
												startIcon={<ArrowBackIcon />}
												sx={{ borderColor: accentYellow, color: accentYellow, fontWeight: 700 }}
											>
												Back to List
											</Button>
										</Stack>
									</CardContent>
								</Card>
							</Grid>
						</Grid>
					</Stack>
				</Container>
				</Box>
			</Box>
		</Box>
	);
}
