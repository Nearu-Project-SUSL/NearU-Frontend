import { useState } from "react";
import { useNavigate } from "react-router";
import { Grow, Card, CardActionArea, Box, Typography, useTheme } from "@mui/material";

import LazyImage from "../ui/LazyImage";

interface ServiceProps {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  description: string;
  badge?: string;
  path: string;
  iconImage?: string;
}

export default function ServiceCard({
  service,
  index
}: {
  service: ServiceProps;
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
        sx={{
          minWidth: { xs: 260, md: 300 },
          height: 280,
          bgcolor: "var(--bg-surface)",
          borderRadius: "24px",
          position: "relative",
          overflow: "hidden",
          transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          transform: hovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
          boxShadow: hovered ? "0 30px 60px rgba(0,0,0,0.3)" : "none",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: hovered
              ? `linear-gradient(to bottom, ${accentAlpha(0.08)} 0%, transparent 100%)`
              : "transparent",
            zIndex: 0,
            transition: "background 0.4s ease",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            borderRadius: "24px",
            padding: "2px",
            background: hovered
              ? `linear-gradient(135deg, var(--nearu-accent), var(--nearu-accent-subtle))`
              : "var(--nearu-border)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            transition: "background 0.4s ease",
          }
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <CardActionArea
          onClick={() => navigate(service.path)}
          sx={{
            height: "100%",
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            zIndex: 1
          }}
        >
          {/* Top section: Placeholder image or Icon block */}
          <Box sx={{ width: "100%", height: 120, mb: 2, position: "relative", borderRadius: "16px", overflow: "hidden" }}>
            {service.iconImage ? (
              <LazyImage
                src={service.iconImage}
                alt={service.label}
                className="w-full h-full"
                style={{
                  filter: hovered
                    ? "brightness(1.1) contrast(1.1)"
                    : "grayscale(100%) contrast(1.2)",
                  transition: "all 0.4s ease"
                }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  bgcolor: accentAlpha(0.04),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <service.icon
                  sx={{
                    fontSize: 48,
                    color: hovered ? accent : theme.palette.text.disabled,
                    transition: "color 0.4s ease"
                  }}
                />
              </Box>
            )}

            {/* Gradient Overlay bottom to top */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "60%",
                background: `linear-gradient(to top, var(--bg-surface), transparent)`
              }}
            />

            {/* Badge */}
            {service.badge && (
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  bgcolor: accent,
                  color: "#111",
                  px: 1.2,
                  py: 0.3,
                  borderRadius: "12px",
                  fontWeight: 800,
                  fontSize: "0.7rem",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
                }}
              >
                {service.badge}
              </Box>
            )}
          </Box>

          <Typography
            variant="h6"
            sx={{
              color: "var(--text-primary)",
              fontWeight: 700,
              mb: 1,
              fontSize: "1.2rem",
              fontFamily: '"Outfit", "Inter", sans-serif'
            }}
          >
            {service.label}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "var(--text-secondary)",
              fontSize: "0.85rem",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden"
            }}
          >
            {service.description}
          </Typography>
        </CardActionArea>
      </Card>
    </Grow>
  );
}
