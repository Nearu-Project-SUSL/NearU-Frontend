import { useState } from "react";
import { Link as RouterLink, useParams, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
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
	CircularProgress,
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
	IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PhoneIcon from "@mui/icons-material/Phone";
import PlaceIcon from "@mui/icons-material/Place";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from "@mui/icons-material/Star";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Sidebar } from "../../components/layout/Sidebar";
import { PageLayout } from "../../components/layout/PageLayout";

import { useAccommodation, useAccommodationItems } from "../../hooks/useAccommodation";
import useAuth from "../../hooks/useAuth";
import {
	updateAccommodation,
	deleteAccommodation,
	createAccommodationItem,
	updateAccommodationItem,
	deleteAccommodationItem,
	type AccommodationItem,
} from "../../../api/accommodationService";

import UpdateAccommodationDialog from "../../components/accommodation/UpdateAccommodationDialog";
import DeleteAccommodationDialog from "../../components/accommodation/DeleteAccommodationDialog";
import AddAccommodationItemDialog, { AddAccommodationItemFormData } from "../../components/accommodation/AddAccommodationItemDialog";
import UpdateAccommodationItemDialog, { UpdateAccommodationItemFormData } from "../../components/accommodation/UpdateAccommodationItemDialog";
import DeleteAccommodationItemDialog from "../../components/accommodation/DeleteAccommodationItemDialog";

export default function AccommodationDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const accentBlue = "#2e9ebf";
	const deepBlack = "#0b0b0b";

	const { data: accommodation, isLoading: loadingAcc, error: errorAcc } = useAccommodation(id || "");
	const { data: items = [], isLoading: loadingItems } = useAccommodationItems(id || "");
	const { auth } = useAuth();
	
	const canEdit = auth?.user?.roles?.includes('Admin') || auth?.user?.roles?.includes('Business');

	const [openEditAcc, setOpenEditAcc] = useState(false);
	const [openDeleteAcc, setOpenDeleteAcc] = useState(false);

	const [openAddItem, setOpenAddItem] = useState(false);
	const [itemToEdit, setItemToEdit] = useState<AccommodationItem | null>(null);
	const [itemToDelete, setItemToDelete] = useState<AccommodationItem | null>(null);

	const loading = loadingAcc || loadingItems;

	const handleUpdateAccommodation = async (data: any) => {
		if (!id) return;
		const formData = new FormData();
		formData.append("Name", data.title);
		formData.append("Address", data.location);
		formData.append("PhoneNumber", data.contactPhone);
		formData.append("Description", data.description || "");
		formData.append("Type", data.type || "");
		formData.append("DistanceKm", String(data.distanceKm ?? 0));
		formData.append("MonthlyRent", String(data.monthlyRent ?? 0));
		formData.append("AvailableBeds", String(data.availableBeds ?? 0));
		if (data.photo) formData.append("Photo", data.photo);

		await updateAccommodation(id, formData);
		await queryClient.invalidateQueries({ queryKey: ["accommodations", id] });
		await queryClient.invalidateQueries({ queryKey: ["accommodations"] });
		setOpenEditAcc(false);
	};

	const handleDeleteAccommodation = async () => {
		if (!id) return;
		await deleteAccommodation(id);
		await queryClient.invalidateQueries({ queryKey: ["accommodations"] });
		setOpenDeleteAcc(false);
		navigate("/accommodation");
	};

	const handleAddItem = async (data: AddAccommodationItemFormData) => {
		if (!id) return;
		const formData = new FormData();
		formData.append("Name", data.name);
		formData.append("Description", data.description);
		formData.append("Price", String(data.price));

		await createAccommodationItem(id, formData);
		await queryClient.invalidateQueries({ queryKey: ["accommodationItems", id] });
		setOpenAddItem(false);
	};

	const handleUpdateItem = async (data: UpdateAccommodationItemFormData) => {
		if (!id || !itemToEdit) return;
		const formData = new FormData();
		formData.append("Name", data.name);
		formData.append("Description", data.description);
		formData.append("Price", String(data.price));

		await updateAccommodationItem(id, itemToEdit.id, formData);
		await queryClient.invalidateQueries({ queryKey: ["accommodationItems", id] });
		setItemToEdit(null);
	};

	const handleDeleteItem = async () => {
		if (!id || !itemToDelete) return;
		await deleteAccommodationItem(id, itemToDelete.id);
		await queryClient.invalidateQueries({ queryKey: ["accommodationItems", id] });
		setItemToDelete(null);
	};

	if (loading) {
		return (
			<Box
				sx={{
					minHeight: "100vh",
					background: `radial-gradient(circle at top right, rgba(46, 158, 191, 0.14), transparent 45%), ${deepBlack}`,
				}}
			>
				<Sidebar activeSection="accommodation" />
				<PageLayout>
					<Container maxWidth="md" sx={{ py: 5 }}>
						<Card sx={{ borderRadius: 3, p: { xs: 3, md: 4 }, textAlign: "center", backgroundColor: "#121212", border: "1px solid rgba(46, 158, 191, 0.35)" }}>
							<Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
								<CircularProgress size={22} sx={{ color: accentBlue }} />
								<Typography variant="body1" sx={{ color: "#fff" }}>
									Loading accommodation details...
								</Typography>
							</Stack>
						</Card>
					</Container>
				</PageLayout>
			</Box>
		);
	}

	if (errorAcc || !accommodation) {
		return (
			<Box
				sx={{
					display: "flex",
					height: "100vh",
					overflow: "hidden",
					background: `radial-gradient(circle at top right, rgba(46, 158, 191, 0.14), transparent 45%), ${deepBlack}`,
				}}
			>
				<Sidebar activeSection="accommodation" />
				<Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
					<Navbar />
					<Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
						<Container maxWidth="md" sx={{ py: 5 }}>
							<Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
								Accommodation not found or an error occurred.
							</Alert>
							<Button
								component={RouterLink}
								to="/accommodation"
								variant="contained"
								startIcon={<ArrowBackIcon />}
								sx={{ backgroundColor: accentBlue, color: deepBlack, fontWeight: 800 }}
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
				background: `radial-gradient(circle at top right, rgba(46, 158, 191, 0.16), transparent 45%), ${deepBlack}`,
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
							<Typography sx={{ color: accentBlue }}>{accommodation.title}</Typography>
						</Breadcrumbs>

						<Card sx={{ borderRadius: 4, overflow: "hidden", border: "1px solid rgba(46, 158, 191, 0.35)", position: "relative" }}>
							<CardMedia
								component="img"
								image={accommodation.image}
								alt={accommodation.title}
								height="360"
								sx={{ height: { xs: 220, sm: 280, md: 360 } }}
							/>
							{canEdit && (
								<Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
									<IconButton
										sx={{ bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', '&:hover': { bgcolor: accentBlue, color: '#000' } }}
										onClick={() => setOpenEditAcc(true)}
									>
										<EditIcon />
									</IconButton>
									<IconButton
										sx={{ bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', '&:hover': { bgcolor: '#ef4444' } }}
										onClick={() => setOpenDeleteAcc(true)}
									>
										<DeleteIcon />
									</IconButton>
								</Box>
							)}
						</Card>

						<Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
							<Grid size={{ xs: 12, lg: 7 }}>
								<Card sx={{ borderRadius: 4, backgroundColor: "#121212", border: "1px solid rgba(46, 158, 191, 0.28)" }}>
									<CardContent>
										<Stack spacing={2}>
											<Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" useFlexGap>
												<Typography variant="h4" sx={{ fontWeight: 800, color: "#fff", fontSize: { xs: "1.6rem", sm: "2rem", md: "2.2rem" } }}>
													{accommodation.title}
												</Typography>
												<Chip label={accommodation.type} sx={{ backgroundColor: accentBlue, color: deepBlack, fontWeight: 700 }} />
											</Stack>

											<Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 0.75, sm: 2 }} color="rgba(255,255,255,0.75)" flexWrap="wrap" useFlexGap>
												<Stack direction="row" spacing={0.5} alignItems="center">
													<PlaceIcon fontSize="small" sx={{ color: accentBlue }} />
													<Typography variant="body2">{accommodation.location}</Typography>
												</Stack>
												<Typography variant="body2">{accommodation.distanceKm} km to campus</Typography>
											</Stack>

											<Stack direction="row" spacing={0.5} alignItems="center">
												<StarIcon sx={{ color: accentBlue, fontSize: 20 }} />
												<Typography variant="body2" sx={{ color: "#f3f3f3" }}>
													{accommodation.rating} ({accommodation.reviews} reviews)
												</Typography>
											</Stack>

											<Typography variant="body1" sx={{ color: "rgba(255,255,255,0.85)" }}>
												{accommodation.description}
											</Typography>

											<Divider />

											<Typography variant="h6" sx={{ fontWeight: 700, color: accentBlue }}>
												Amenities
											</Typography>
											<List dense>
												{accommodation.amenities?.map((amenity) => (
													<ListItem key={amenity} disableGutters>
														<ListItemIcon sx={{ minWidth: 32 }}>
															<CheckCircleIcon sx={{ color: accentBlue }} fontSize="small" />
														</ListItemIcon>
														<ListItemText primary={amenity} primaryTypographyProps={{ sx: { color: "#f2f2f2" } }} />
													</ListItem>
												))}
											</List>

											<Divider />

											<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
												<Typography variant="h6" sx={{ fontWeight: 700, color: accentBlue }}>
													Available Items
												</Typography>
												{canEdit && (
													<Button
														size="small"
														variant="outlined"
														startIcon={<AddIcon />}
														onClick={() => setOpenAddItem(true)}
														sx={{ borderColor: accentBlue, color: accentBlue, borderRadius: 2 }}
													>
														Add Item
													</Button>
												)}
											</Box>

											{items.length > 0 ? (
												<List dense>
													{items.map((item) => (
														<ListItem key={item.id} disableGutters secondaryAction={
															canEdit ? (
																<Box>
																	<IconButton edge="end" onClick={() => setItemToEdit(item)} sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: accentBlue } }}>
																		<EditIcon fontSize="small" />
																	</IconButton>
																	<IconButton edge="end" onClick={() => setItemToDelete(item)} sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#ef4444' } }}>
																		<DeleteIcon fontSize="small" />
																	</IconButton>
																</Box>
															) : null
														}>
															<ListItemText
																primary={`${item.name} - LKR ${item.price.toLocaleString()}`}
																secondary={item.description || "No description"}
																primaryTypographyProps={{ sx: { color: "#f2f2f2", fontWeight: 600 } }}
																secondaryTypographyProps={{ sx: { color: "rgba(255,255,255,0.66)" } }}
															/>
														</ListItem>
													))}
												</List>
											) : (
												<Typography variant="body2" sx={{ color: "rgba(255,255,255,0.72)" }}>
													No items are listed for this accommodation yet.
												</Typography>
											)}
										</Stack>
									</CardContent>
								</Card>
							</Grid>

							<Grid size={{ xs: 12, lg: 5 }}>
								<Card sx={{ borderRadius: 4, backgroundColor: "#121212", border: "1px solid rgba(46, 158, 191, 0.35)" }}>
									<CardContent>
										<Stack spacing={2}>
											<Typography variant="h5" sx={{ fontWeight: 800, color: accentBlue, fontSize: { xs: "1.3rem", sm: "1.5rem" } }}>
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
													backgroundColor: accentBlue,
													color: deepBlack,
													fontWeight: 800,
													"&:hover": { backgroundColor: "#2e9ebf" },
												}}
											>
												Call Owner
											</Button>
											<Button
												component={RouterLink}
												to="/accommodation"
												variant="outlined"
												startIcon={<ArrowBackIcon />}
												sx={{ borderColor: accentBlue, color: accentBlue, fontWeight: 700 }}
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

			{/* Dialogs */}
			<UpdateAccommodationDialog
				accommodation={openEditAcc ? accommodation : null}
				onClose={() => setOpenEditAcc(false)}
				onSubmit={handleUpdateAccommodation}
			/>
			<DeleteAccommodationDialog
				accommodation={openDeleteAcc ? accommodation : null}
				onClose={() => setOpenDeleteAcc(false)}
				onConfirm={handleDeleteAccommodation}
			/>
			<AddAccommodationItemDialog
				open={openAddItem}
				onClose={() => setOpenAddItem(false)}
				onSubmit={handleAddItem}
			/>
			<UpdateAccommodationItemDialog
				item={itemToEdit}
				onClose={() => setItemToEdit(null)}
				onSubmit={handleUpdateItem}
			/>
			<DeleteAccommodationItemDialog
				item={itemToDelete}
				onClose={() => setItemToDelete(null)}
				onConfirm={handleDeleteItem}
			/>
		</Box>
	);
}
