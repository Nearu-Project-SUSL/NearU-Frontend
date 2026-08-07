import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Card,
  CardContent,
  Chip,
  Avatar,
  Stack,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { Sidebar } from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import useAuth from "../../hooks/useAuth";
import { usePhotographers } from "../../hooks/usePhotographer";
import PhotographerCard from "../../components/photography/PhotographerCard";
import PhotographerFormDialog from "../../components/photography/PhotographerFormDialog";
import PhotographyPackageFormDialog from "../../components/photography/PhotographyPackageFormDialog";
import {
  createPhotographer,
  updatePhotographer,
  deletePhotographer,
  addPhotographyPackage,
  updatePhotographyPackage,
  deletePhotographyPackage,
  type PhotographerResponseDto,
  type PhotographyPackageResponseDto,
} from "../../../api/services/photographerApi";

export default function Photography() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Modals & Active Selections
  const [selectedPhotographer, setSelectedPhotographer] = useState<PhotographerResponseDto | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [editingPhotographer, setEditingPhotographer] = useState<PhotographerResponseDto | null>(null);

  const [packageDialogOpen, setPackageDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PhotographyPackageResponseDto | null>(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const isBusinessOwner =
    user?.roles?.some((role: string) =>
      ["BusinessOwner", "Business", "Admin", "SuperAdmin"].includes(role)
    ) ?? false;

  const { data: photographers = [], isLoading, refetch } = usePhotographers({ keyword: searchTerm });

  // Photographer CRUD
  const handleSaveProfile = async (formData: FormData) => {
    try {
      setActionLoading(true);
      if (editingPhotographer) {
        await updatePhotographer(editingPhotographer.id, formData);
        setSnackbar({ open: true, message: "Photographer profile updated successfully!", severity: "success" });
      } else {
        await createPhotographer(formData);
        setSnackbar({ open: true, message: "Photographer profile registered successfully!", severity: "success" });
      }
      setProfileDialogOpen(false);
      setEditingPhotographer(null);
      refetch();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.message || "Failed to save photographer profile.",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProfile = async (photographer: PhotographerResponseDto) => {
    if (!window.confirm(`Are you sure you want to delete profile "${photographer.name}"?`)) return;
    try {
      setActionLoading(true);
      await deletePhotographer(photographer.id);
      setSnackbar({ open: true, message: "Photographer profile deleted.", severity: "success" });
      if (selectedPhotographer?.id === photographer.id) {
        setSelectedPhotographer(null);
      }
      refetch();
    } catch (err: any) {
      setSnackbar({ open: true, message: "Failed to delete photographer profile.", severity: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  // Package CRUD
  const handleSavePackage = async (data: { name: string; price: number; description?: string; isActive?: boolean }) => {
    if (!selectedPhotographer) return;
    try {
      setActionLoading(true);
      if (editingPackage) {
        await updatePhotographyPackage(editingPackage.id, data);
        setSnackbar({ open: true, message: "Package updated successfully!", severity: "success" });
      } else {
        await addPhotographyPackage(selectedPhotographer.id, data);
        setSnackbar({ open: true, message: "Package added successfully!", severity: "success" });
      }
      setPackageDialogOpen(false);
      setEditingPackage(null);
      refetch();

      // Update selected photographer modal state
      const updatedList = await refetch();
      if (updatedList.data) {
        const fresh = updatedList.data.find((p) => p.id === selectedPhotographer.id);
        if (fresh) setSelectedPhotographer(fresh);
      }
    } catch (err: any) {
      setSnackbar({ open: true, message: "Failed to save package.", severity: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePackage = async (packageId: string) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    try {
      setActionLoading(true);
      await deletePhotographyPackage(packageId);
      setSnackbar({ open: true, message: "Package deleted.", severity: "success" });
      refetch();

      if (selectedPhotographer) {
        setSelectedPhotographer((prev) =>
          prev
            ? {
                ...prev,
                packages: prev.packages.filter((pkg) => pkg.id !== packageId),
              }
            : null
        );
      }
    } catch (err: any) {
      setSnackbar({ open: true, message: "Failed to delete package.", severity: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "var(--bg-base)", minHeight: "100vh" }}>
      <Sidebar activeId="photography" />

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Navbar />

        <Box sx={{ p: { xs: 2.5, md: 4 }, maxWidth: 1400, mx: "auto", width: "100%" }}>
          {/* Header Banner */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              gap: 2,
              mb: 4,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  fontFamily: '"Outfit", "Inter", sans-serif',
                  letterSpacing: "-0.02em",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <CameraAltIcon sx={{ color: "#2E9EBF", fontSize: 36 }} />
                Campus Photography
              </Typography>
              <Typography variant="body2" sx={{ color: "var(--text-secondary)", mt: 0.5 }}>
                Book student photographers, graduation portraits, event shoots & media packages
              </Typography>
            </Box>

            {isBusinessOwner && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setEditingPhotographer(null);
                  setProfileDialogOpen(true);
                }}
                sx={{
                  bgcolor: "#2E9EBF",
                  color: "#fff",
                  fontWeight: 700,
                  borderRadius: "14px",
                  px: 3,
                  py: 1.2,
                  textTransform: "none",
                  boxShadow: "0 8px 20px rgba(46, 158, 191, 0.25)",
                  "&:hover": { bgcolor: "#25829e" },
                }}
              >
                Register Photographer Profile
              </Button>
            )}
          </Box>

          {/* Search Filter Bar */}
          <Box sx={{ mb: 4 }}>
            <TextField
              placeholder="Search photographers by name, location or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#2E9EBF" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "var(--bg-surface)",
                  borderRadius: "16px",
                  "& fieldset": { borderColor: "var(--nearu-border)" },
                  "&:hover fieldset": { borderColor: "#2E9EBF" },
                  "&.Mui-focused fieldset": { borderColor: "#2E9EBF" },
                },
              }}
            />
          </Box>

          {/* Photographers Grid */}
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress sx={{ color: "#2E9EBF" }} />
            </Box>
          ) : photographers.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 10,
                px: 2,
                bgcolor: "var(--bg-surface)",
                borderRadius: "24px",
                border: "1px dashed var(--nearu-border)",
              }}
            >
              <CameraAltIcon sx={{ fontSize: 56, color: "var(--text-disabled)", mb: 2 }} />
              <Typography variant="h6" sx={{ color: "var(--text-primary)", fontWeight: 700 }}>
                No Photographers Found
              </Typography>
              <Typography variant="body2" sx={{ color: "var(--text-secondary)", mt: 1, maxWidth: 450, mx: "auto" }}>
                {searchTerm
                  ? `No photographer matches "${searchTerm}". Try a different keyword.`
                  : "Be the first to register a photographer profile for campus events and portraits!"}
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {photographers.map((photographer) => (
                <Grid key={photographer.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <PhotographerCard
                    photographer={photographer}
                    onClick={() => setSelectedPhotographer(photographer)}
                    onEdit={() => {
                      setEditingPhotographer(photographer);
                      setProfileDialogOpen(true);
                    }}
                    onDelete={() => handleDeleteProfile(photographer)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>

      {/* Photographer Profile Dialog (Create / Edit) */}
      <PhotographerFormDialog
        open={profileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
        onSubmit={handleSaveProfile}
        initialData={editingPhotographer}
        loading={actionLoading}
      />

      {/* Photography Package Dialog (Create / Edit) */}
      <PhotographyPackageFormDialog
        open={packageDialogOpen}
        onClose={() => setPackageDialogOpen(false)}
        onSubmit={handleSavePackage}
        initialData={editingPackage}
        loading={actionLoading}
      />

      {/* Photographer Details & Package View Modal */}
      <Dialog
        open={Boolean(selectedPhotographer)}
        onClose={() => setSelectedPhotographer(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "var(--bg-base)",
            backgroundImage: "none",
            borderRadius: "24px",
            border: "1px solid var(--nearu-border)",
          },
        }}
      >
        {selectedPhotographer && (
          <>
            <DialogTitle
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                pb: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={selectedPhotographer.imageUrl || undefined}
                  alt={selectedPhotographer.name}
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: "rgba(46, 158, 191, 0.15)",
                    border: "2px solid #2E9EBF",
                  }}
                >
                  <CameraAltIcon sx={{ color: "#2E9EBF" }} />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--text-primary)" }}>
                    {selectedPhotographer.name}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocationOnIcon sx={{ fontSize: 16, color: "#2E9EBF" }} />
                    <Typography variant="caption" sx={{ color: "var(--text-secondary)", fontWeight: 600 }}>
                      {selectedPhotographer.locationName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#2E9EBF", fontWeight: 700 }}>
                      • LKR {selectedPhotographer.baseRatePerHour.toLocaleString()}/hr
                    </Typography>
                  </Stack>
                </Box>
              </Box>
              <IconButton onClick={() => setSelectedPhotographer(null)} sx={{ color: "var(--text-secondary)" }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
              {/* Bio Section */}
              {selectedPhotographer.bio && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: "var(--text-secondary)", fontWeight: 700, mb: 0.5 }}>
                    About Photographer
                  </Typography>
                  <Typography variant="body2" sx={{ color: "var(--text-primary)", lineHeight: 1.6 }}>
                    {selectedPhotographer.bio}
                  </Typography>
                </Box>
              )}

              {/* Contact Bar */}
              <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                {selectedPhotographer.phone && (
                  <Button
                    variant="outlined"
                    startIcon={<PhoneIcon />}
                    component="a"
                    href={`tel:${selectedPhotographer.phone}`}
                    sx={{
                      borderColor: "#2E9EBF",
                      color: "#2E9EBF",
                      borderRadius: "12px",
                      fontWeight: 700,
                      textTransform: "none",
                      "&:hover": { bgcolor: "rgba(46, 158, 191, 0.1)", borderColor: "#2E9EBF" },
                    }}
                  >
                    Call {selectedPhotographer.phone}
                  </Button>
                )}
                {selectedPhotographer.email && (
                  <Button
                    variant="outlined"
                    startIcon={<EmailIcon />}
                    component="a"
                    href={`mailto:${selectedPhotographer.email}`}
                    sx={{
                      borderColor: "var(--nearu-border)",
                      color: "var(--text-primary)",
                      borderRadius: "12px",
                      fontWeight: 700,
                      textTransform: "none",
                      "&:hover": { borderColor: "#2E9EBF" },
                    }}
                  >
                    Send Email
                  </Button>
                )}
              </Stack>

              <Divider sx={{ borderColor: "var(--nearu-border)", mb: 3 }} />

              {/* Photography Packages Section */}
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PhotoLibraryIcon sx={{ color: "#2E9EBF" }} />
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--text-primary)" }}>
                    Photography Packages
                  </Typography>
                </Box>

                {(user?.roles?.includes("Admin") ||
                  user?.roles?.includes("SuperAdmin") ||
                  selectedPhotographer.ownerId === user?.id) && (
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setEditingPackage(null);
                      setPackageDialogOpen(true);
                    }}
                    sx={{
                      color: "#2E9EBF",
                      fontWeight: 700,
                      textTransform: "none",
                      "&:hover": { bgcolor: "rgba(46, 158, 191, 0.1)" },
                    }}
                  >
                    Add Package
                  </Button>
                )}
              </Box>

              {selectedPhotographer.packages.length === 0 ? (
                <Typography variant="body2" sx={{ color: "var(--text-secondary)", italic: true, py: 2 }}>
                  No photography packages uploaded yet. Contact photographer directly for custom quotes.
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {selectedPhotographer.packages.map((pkg) => (
                    <Grid key={pkg.id} size={{ xs: 12, sm: 6 }}>
                      <Card
                        elevation={0}
                        sx={{
                          bgcolor: "var(--bg-surface)",
                          borderRadius: "16px",
                          border: "1px solid var(--nearu-border)",
                          height: "100%",
                        }}
                      >
                        <CardContent sx={{ p: 2.5 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "var(--text-primary)" }}>
                              {pkg.name}
                            </Typography>
                            <Chip
                              label={`LKR ${pkg.price.toLocaleString()}`}
                              size="small"
                              sx={{
                                bgcolor: "rgba(46, 158, 191, 0.15)",
                                color: "#2E9EBF",
                                fontWeight: 800,
                                borderRadius: "8px",
                              }}
                            />
                          </Box>

                          {pkg.description && (
                            <Typography variant="body2" sx={{ color: "var(--text-secondary)", fontSize: "0.82rem", lineHeight: 1.45, mb: 1.5 }}>
                              {pkg.description}
                            </Typography>
                          )}

                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <CheckCircleIcon sx={{ fontSize: 14, color: "#10b981" }} />
                              <Typography variant="caption" sx={{ color: "#10b981", fontWeight: 700 }}>
                                Active Package
                              </Typography>
                            </Stack>

                            {(user?.roles?.includes("Admin") ||
                              user?.roles?.includes("SuperAdmin") ||
                              selectedPhotographer.ownerId === user?.id) && (
                              <Stack direction="row" spacing={0.5}>
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setEditingPackage(pkg);
                                    setPackageDialogOpen(true);
                                  }}
                                  sx={{ color: "var(--text-secondary)" }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeletePackage(pkg.id)}
                                  sx={{ color: "#ef4444" }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Stack>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
              <Button onClick={() => setSelectedPhotographer(null)} sx={{ color: "var(--text-secondary)" }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%", borderRadius: "12px" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
