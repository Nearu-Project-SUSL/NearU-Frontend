import { useNavigate } from "react-router";
import {
  Box,
  Card,
  CardActionArea,
  Chip,
  Typography,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StorefrontIcon from "@mui/icons-material/Storefront";
import type { GiftShopResponseDto } from "../../../api/services/giftShopApi";

interface GiftCardProps {
  shop: GiftShopResponseDto;
}

export default function GiftCard({ shop }: GiftCardProps) {
  const navigate = useNavigate();
  const firstProducts = shop.products?.slice(0, 3) ?? [];

  return (
    <Card
      elevation={0}
      sx={{
        bgcolor: "rgba(255,255,255,0.02)",
        borderRadius: "24px",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.06)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          borderColor: "rgba(46, 158, 191, 0.35)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
          bgcolor: "rgba(46,158,191,0.03)",
        },
      }}
    >
      <CardActionArea onClick={() => navigate(`/gifts/${shop.id}`)}>
        <Box
          sx={{
            height: 220,
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
                "linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.15))",
            }}
          />
          <Box sx={{ position: "absolute", top: 14, right: 14 }}>
            <Chip
              icon={<StorefrontIcon />}
              label={`${shop.products?.length || 0} Products`}
              size="small"
              sx={{
                bgcolor: "rgba(12,12,12,0.75)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(6px)",
              }}
            />
          </Box>

          <Box sx={{ position: "absolute", left: 18, right: 18, bottom: 18 }}>
            <Typography
              variant="h6"
              sx={{ color: "#fff", fontWeight: 800, mb: 0.5 }}
            >
              {shop.name}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
              <LocationOnIcon sx={{ fontSize: 16, color: "#2E9EBF" }} />
              <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: "0.85rem" }}>
                {shop.locationName}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: 2.5 }}>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "0.9rem",
              minHeight: 46,
              mb: 2,
            }}
          >
            {shop.address}
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {firstProducts.length > 0 ? (
              firstProducts.map((product) => (
                <Chip
                  key={product.id}
                  icon={<LocalOfferIcon />}
                  label={`${product.name} - Rs. ${Number(product.price).toLocaleString()}`}
                  size="small"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.04)",
                    color: "rgba(255,255,255,0.72)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                />
              ))
            ) : (
              <Chip
                label="No products yet"
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.04)",
                  color: "rgba(255,255,255,0.5)",
                }}
              />
            )}
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
}