import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Stack,
  Divider,
  Chip,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CardGiftcard as GiftIcon,
} from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { PageLayout } from "../../components/layout/PageLayout";
import GiftProductCard, { type GiftProduct } from "../../components/gift/GiftProductCard";
import GiftProductFormDialog from "../../components/gift/GiftProductFormDialog";
import DeleteGiftProductDialog from "../../components/gift/DeleteGiftProductDialog";
import {
  addGiftProduct,
  updateGiftProduct,
  deleteGiftProduct,
  type GiftProductResponseDto,
} from "../../../api/services/giftShopApi";
import { useGiftShop } from "../../hooks/useGiftShop";

export default function GiftShopDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: shop, isLoading, error } = useGiftShop(id ?? "");

  const [openAddProduct, setOpenAddProduct] = useState(false);
  const [productToEdit, setProductToEdit] = useState<GiftProductResponseDto | null>(null);
  const [productToDelete, setProductToDelete] = useState<GiftProduct | null>(null);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <Typography sx={{ color: "#fff" }}>Loading...</Typography>
      </Box>
    );
  }

  if (error || !shop) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#050505" }}>
        <Sidebar activeSection="gifts" />
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h5" sx={{ color: "#fff", mb: 2 }}>
              Gift shop not found
            </Typography>
            <IconButton onClick={() => navigate("/gifts")} sx={{ color: "#2E9EBF" }}>
              <BackIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    );
  }

  const products = shop.products ?? [];

  const invalidateShop = async () => {
    if (!id) return;
    await queryClient.invalidateQueries({ queryKey: ["giftshop", id] });
    await queryClient.invalidateQueries({ queryKey: ["giftshops"] });
  };

  const handleAddProduct = async (formData: FormData) => {
    if (!id) return;
    await addGiftProduct(id, formData);
    await invalidateShop();
    setOpenAddProduct(false);
  };

  const handleUpdateProduct = async (formData: FormData) => {
    if (!productToEdit) return;
    await updateGiftProduct(productToEdit.id, formData);
    await invalidateShop();
    setProductToEdit(null);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    await deleteGiftProduct(productToDelete.id);
    await invalidateShop();
    setProductToDelete(null);
  };

  const toGiftProduct = (p: GiftProductResponseDto): GiftProduct => ({
    id: p.id,
    giftShopId: p.giftShopId,
    name: p.name,
    price: p.price,
    photoUrl: p.photoUrl ?? "",
    isActive: p.isActive,
  });

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#050505",
      }}
    >
      <Sidebar activeSection="gifts" />

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Navbar />

        <PageLayout>
          <Box
            sx={{
              overflowY: "auto",
              overflowX: "hidden",
              mt: "-64px",
              pt: "64px",
            }}
          >
            <Box
              sx={{
                position: "relative",
                height: { xs: 240, md: 380 },
                overflow: "hidden",
              }}
            >
              <Box
                component="img"
                src={
                  shop.imageUrl ||
                  "https://images.unsplash.com/photo-1513475382585-d06e58bcb0ff?q=80&w=1200&auto=format&fit=crop"
                }
                alt={shop.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "70%",
                  background: "linear-gradient(to top, #050505, transparent)",
                }}
              />

              <IconButton
                onClick={() => navigate("/gifts")}
                sx={{
                  position: "absolute",
                  top: { xs: 70, md: 80 },
                  left: 24,
                  bgcolor: "rgba(255, 255, 255, 0.5)",
                  color: "#fff",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                }}
              >
                <BackIcon />
              </IconButton>

              <Box
                sx={{
                  position: "absolute",
                  bottom: 32,
                  left: { xs: 24, md: 48 },
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: { xs: "1.8rem", md: "2.8rem" },
                    letterSpacing: "-0.02rem",
                    textShadow: "0 2px 20px rgba(0,0,0,0.8)",
                  }}
                >
                  {shop.name}
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
              </Box>
            </Box>

            <Box
              sx={{
                px: { xs: 2.5, md: 5 },
                py: 5,
                maxWidth: 1400,
                mx: "auto",
                width: "100%",
              }}
            >
              <Grid container spacing={{ xs: 3, md: 5 }}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        mb: 4,
                        flexWrap: "wrap",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <GiftIcon sx={{ color: "#2E9EBF", fontSize: 24 }} />
                        <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700 }}>
                          Products
                        </Typography>
                      </Box>

                      <Box
                        component="button"
                        onClick={() => setOpenAddProduct(true)}
                        style={{
                          background: "#2E9EBF",
                          color: "#fff",
                          border: "none",
                          borderRadius: "999px",
                          padding: "10px 18px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Add Product
                      </Box>
                    </Box>

                    {products.length > 0 ? (
                      <Grid container spacing={2.5}>
                        {products.map((product) => (
                          <Grid size={{ xs: 12, sm: 6 }} key={product.id}>
                            <GiftProductCard
                              item={toGiftProduct(product)}
                              onEdit={() => setProductToEdit(product)}
                              onDelete={(item) => setProductToDelete(item)}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
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
                          No products yet. Add your first gift item.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }} sx={{ mt: { xs: 0, md: 8 } }}>
                  <Box
                    sx={{
                      position: "sticky",
                      top: 80,
                      bgcolor: "rgba(255,255,255,0.02)",
                      borderRadius: "24px",
                      p: 3.5,
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "#fff", fontWeight: 700, mb: 3 }}
                    >
                      Shop Info
                    </Typography>

                    <Stack spacing={3}>
                      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                        <LocationIcon sx={{ color: "#2E9EBF", mt: 0.3, flexShrink: 0 }} />
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "rgba(255,255,255,0.4)",
                              display: "block",
                              mb: 0.3,
                            }}
                          >
                            Location
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "#fff", fontWeight: 600, lineHeight: 1.5 }}
                          >
                            {shop.locationName}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgba(255,255,255,0.55)",
                              mt: 0.5,
                              lineHeight: 1.5,
                            }}
                          >
                            {shop.address}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />

                      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                        <PhoneIcon sx={{ color: "#22c55e", mt: 0.3, flexShrink: 0 }} />
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "rgba(255,255,255,0.4)",
                              display: "block",
                              mb: 0.3,
                            }}
                          >
                            Phone
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "#fff", fontWeight: 600 }}
                          >
                            {shop.phone}
                          </Typography>
                        </Box>
                      </Box>

                      {shop.email && (
                        <>
                          <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />
                          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                            <EmailIcon sx={{ color: "#a78bfa", mt: 0.3, flexShrink: 0 }} />
                            <Box>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "rgba(255,255,255,0.4)",
                                  display: "block",
                                  mb: 0.3,
                                }}
                              >
                                Email
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "#fff", fontWeight: 600 }}
                              >
                                {shop.email}
                              </Typography>
                            </Box>
                          </Box>
                        </>
                      )}
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </PageLayout>
      </Box>

      <GiftProductFormDialog
        open={openAddProduct}
        mode="create"
        onClose={() => setOpenAddProduct(false)}
        onSubmit={handleAddProduct}
      />

      <GiftProductFormDialog
        open={!!productToEdit}
        mode="edit"
        initialData={productToEdit}
        onClose={() => setProductToEdit(null)}
        onSubmit={handleUpdateProduct}
      />

      <DeleteGiftProductDialog
        item={productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDeleteProduct}
      />
    </Box>
  );
}
