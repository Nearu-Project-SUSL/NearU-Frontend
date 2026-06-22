import { useState } from "react";
import { Grow, Card, Box, Typography, Button } from "@mui/material";
import LazyImage from "../ui/LazyImage";
import PlaceIcon from "@mui/icons-material/Place";

interface HomeDealCardProps {
  id: string;
  image: string;
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
  shopAddress?: string | null;
}

export default function DealCard({
  deal,
  index,
  onViewAll
}: {
  deal: HomeDealCardProps;
  index: number;
  onViewAll?: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Grow in timeout={600 + index * 100}>
      <Card
        elevation={0}
        sx={{
          minWidth: { xs: 280, md: 340 },
          bgcolor: "var(--bg-surface)",
          borderRadius: "24px",
          overflow: "hidden",
          border: `1px solid var(--nearu-border)`,
          transition: "all 0.3s ease",
          transform: hovered ? "translateY(-5px)" : "none",
          boxShadow: hovered ? `0 15px 35px var(--nearu-accent-subtle)` : "none",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Box sx={{ height: 180, position: "relative", overflow: "hidden" }}>
          <LazyImage
            src={deal.image}
            alt={deal.title}
            className="w-full h-full"
            style={{
              transition: "transform 0.5s ease",
              transform: hovered ? "scale(1.05)" : "scale(1)"
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              bgcolor: deal.badgeColor,
              color: "#fff",
              px: 1.5,
              py: 0.5,
              borderRadius: "8px",
              fontWeight: 800,
              fontSize: "0.8rem",
              zIndex: 2
            }}
          >
            {deal.badge}
          </Box>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(to top, var(--bg-surface), transparent)`,
              zIndex: 1
            }}
          />
        </Box>
        <Box sx={{ p: 3, pt: 1 }}>
          {deal.shopAddress && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.75 }}>
              <PlaceIcon sx={{ color: "var(--text-secondary)", fontSize: 13 }} />
              <Typography variant="caption" sx={{ color: "var(--text-secondary)", fontWeight: 500 }}>
                {deal.shopAddress}
              </Typography>
            </Box>
          )}
          <Typography
            variant="h6"
            sx={{ color: "var(--nearu-accent)", fontWeight: 700, mb: 1, fontSize: "1.1rem" }}
          >
            {deal.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "var(--text-secondary)",
              mb: 3,
              fontSize: "0.85rem",
              lineHeight: 1.6,
              minHeight: 40
            }}
          >
            {deal.description}
          </Typography>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={onViewAll}
            sx={{
              fontWeight: 700,
              borderRadius: "12px",
              py: 1.2,
              textTransform: "none",
              fontSize: "0.95rem",
              color: "#111111",
            }}
          >
            Get Deal
          </Button>
        </Box>
      </Card>
    </Grow>
  );
}
