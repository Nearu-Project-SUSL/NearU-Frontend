import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import type {
  GiftProductResponseDto,
  GiftShopResponseDto,
} from  "../../../api/services/giftShopApi";
import {
  addGiftProduct,
  deleteGiftProduct,
  deleteGiftShop,
  getGiftShopById,
  updateGiftProduct,
  updateGiftShop,
} from  "../../../api/services/giftShopApi";
import GiftShopFormDialog from "./GiftShopFormDialog";
import GiftProductFormDialog from "./GiftProductFormDialog";

interface GiftDetailsDialogProps {
  open: boolean;
  shop: GiftShopResponseDto | null;
  onClose: () => void;
  onRefresh: () => Promise<void>;
}

export default function GiftDetailsDialog({
  open,
  shop,
  onClose,
  onRefresh,
}: GiftDetailsDialogProps) {
  const [loading, setLoading] = useState(false);
  const [shopFormOpen, setShopFormOpen] = useState(false);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [productEditFormOpen, setProductEditFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<GiftProductResponseDto | null>(null);

  const products = useMemo(() => shop?.products || [], [shop]);

  if (!shop) return null;

  const refreshCurrentAndParent = async () => {
    await getGiftShopById(shop.id);
    await onRefresh();
  };

  const handleDeleteShop = async () => {
    if (!window.confirm("Delete this gift shop?")) return;
    setLoading(true);
    try {
      await deleteGiftShop(shop.id);
      await onRefresh();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Delete this product?")) return;
    setLoading(true);
    try {
      await deleteGiftProduct(productId);
      await refreshCurrentAndParent();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "#0a0a0a",
            borderRadius: { xs: 0, md: "28px" },
            border: "1px solid rgba(255,255,255,0.08)",
            m: { xs: 0, md: 2 },
          },
        }}
      >
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              height: { xs: 220, md: 280 },
              backgroundImage: `url(${shop.imageUrl || "https://images.unsplash.com/photo-1513475382585-d06e58bcb0ff?q=80&w=1200&auto=format&fit=crop"})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(10,10,10,1), rgba(10,10,10,0.15))",
              }}
            />
            <IconButton
              onClick={onClose}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                bgcolor: "rgba(0,0,0,0.5)",
                color: "#fff",
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <DialogContent sx={{ mt: -8, position: "relative", zIndex: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                flexWrap: "wrap",
                mb: 3,
              }}
            >
              <Box>
                <Typography variant="h4" sx={{ color: "#fff", fontWeight: 800 }}>
                  {shop.name}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                  <LocationOnIcon sx={{ color: "#facc15", fontSize: 18 }} />
                  <Typography sx={{ color: "rgba(255,255,255,0.75)" }}>
                    {shop.locationName}
                  </Typography>
                  <Chip
                    label={shop.isActive ? "Active" : "Inactive"}
                    size="small"
                    sx={{
                      bgcolor: shop.isActive
                        ? "rgba(34,197,94,0.15)"
                        : "rgba(239,68,68,0.15)",
                      color: shop.isActive ? "#4ade80" : "#f87171",
                    }}
                  />
                </Stack>
              </Box>
{false && (
              <Stack direction="row" spacing={1.5} flexWrap="wrap">
                <Button
                  startIcon={<EditIcon />}
                  variant="outlined"
                  sx={secondaryBtnSx}
                  onClick={() => setShopFormOpen(true)}
                >
                  Edit Shop
                </Button>
                <Button
                  startIcon={<DeleteOutlineIcon />}
                  variant="outlined"
                  sx={dangerBtnSx}
                  disabled={loading}
                  onClick={handleDeleteShop}
                >
                  Delete Shop
                </Button>
              </Stack>)}
            </Box>

            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: "20px",
                    bgcolor: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <Typography sx={{ color: "#fff", fontWeight: 700, mb: 2 }}>
                    Shop Details
                  </Typography>

                  <Stack spacing={1.8}>
                    <Typography sx={{ color: "rgba(255,255,255,0.65)" }}>
                      {shop.address}
                    </Typography>

                    <Button
                      startIcon={<PhoneIcon />}
                      href={`tel:${shop.phone}`}
                      sx={contactBtnSx}
                    >
                      {shop.phone}
                    </Button>

                    {shop.email && (
                      <Button
                        startIcon={<EmailIcon />}
                        href={`mailto:${shop.email}`}
                        sx={contactBtnSx}
                      >
                        {shop.email}
                      </Button>
                    )}
                  </Stack>
                </Box>
              </Grid>

              <Grid item xs={12} md={8}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: "1.2rem" }}>
                    Products
                  </Typography>{false && (
                  <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    sx={primaryBtnSx}
                    onClick={() => setProductFormOpen(true)}
                  >
                    Add Product
                  </Button>)}
                </Box>

                <Grid container spacing={2}>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <Grid item xs={12} sm={6} key={product.id}>
                        <Box
                          sx={{
                            borderRadius: "18px",
                            overflow: "hidden",
                            border: "1px solid rgba(255,255,255,0.06)",
                            bgcolor: "rgba(255,255,255,0.03)",
                          }}
                        >
                          <Box
                            sx={{
                              height: 180,
                              backgroundImage: `url(${product.photoUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop"})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          />
                          <Box sx={{ p: 2 }}>
                            <Typography sx={{ color: "#fff", fontWeight: 700, mb: 0.6 }}>
                              {product.name}
                            </Typography>
                            <Typography sx={{ color: "#facc15", fontWeight: 800, mb: 1.5 }}>
                              Rs. {Number(product.price).toLocaleString()}
                            </Typography>

                            <Stack direction="row" spacing={1}>
                              <Button
                                size="small"
                                startIcon={<EditIcon />}
                                variant="outlined"
                                sx={secondaryBtnSx}
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setProductEditFormOpen(true);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                size="small"
                                startIcon={<DeleteOutlineIcon />}
                                variant="outlined"
                                sx={dangerBtnSx}
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                Delete
                              </Button>
                            </Stack>
                          </Box>
                        </Box>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          p: 4,
                          borderRadius: "18px",
                          textAlign: "center",
                          bgcolor: "rgba(255,255,255,0.02)",
                          border: "1px dashed rgba(255,255,255,0.08)",
                        }}
                      >
                        <Typography sx={{ color: "rgba(255,255,255,0.5)" }}>
                          No products added yet.
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
        </Box>
      </Dialog>

      <GiftShopFormDialog
        open={shopFormOpen}
        mode="edit"
        initialData={shop}
        onClose={() => setShopFormOpen(false)}
        onSubmit={async (formData) => {
          await updateGiftShop(shop.id, formData);
          await refreshCurrentAndParent();
        }}
      />

      <GiftProductFormDialog
        open={productFormOpen}
        mode="create"
        onClose={() => setProductFormOpen(false)}
        onSubmit={async (formData) => {
          await addGiftProduct(shop.id, formData);
          await refreshCurrentAndParent();
        }}
      />

      <GiftProductFormDialog
        open={productEditFormOpen}
        mode="edit"
        initialData={selectedProduct}
        onClose={() => {
          setProductEditFormOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={async (formData) => {
          if (!selectedProduct) return;
          await updateGiftProduct(selectedProduct.id, formData);
          await refreshCurrentAndParent();
        }}
      />
    </>
  );
}

const primaryBtnSx = {
  bgcolor: "#facc15",
  color: "#000",
  fontWeight: 800,
  textTransform: "none",
  borderRadius: "12px",
  "&:hover": { bgcolor: "#eab308" },
};

const secondaryBtnSx = {
  color: "#fff",
  borderColor: "rgba(255,255,255,0.15)",
  textTransform: "none",
  borderRadius: "12px",
  "&:hover": {
    borderColor: "#facc15",
    bgcolor: "rgba(250,204,21,0.05)",
  },
};

const dangerBtnSx = {
  color: "#f87171",
  borderColor: "rgba(248,113,113,0.35)",
  textTransform: "none",
  borderRadius: "12px",
  "&:hover": {
    borderColor: "#ef4444",
    bgcolor: "rgba(239,68,68,0.06)",
  },
};

const contactBtnSx = {
  justifyContent: "flex-start",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.08)",
  bgcolor: "rgba(255,255,255,0.03)",
  textTransform: "none",
  borderRadius: "12px",
  "&:hover": {
    bgcolor: "rgba(250,204,21,0.06)",
    borderColor: "rgba(250,204,21,0.35)",
  },
};