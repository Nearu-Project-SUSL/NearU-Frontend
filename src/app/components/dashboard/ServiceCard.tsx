import { useState } from "react";
import { useNavigate } from "react-router";
import { Grow, Card, CardActionArea, Box, Typography, useTheme } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LazyImage from "../ui/LazyImage";

interface ServiceProps {
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  description: string;
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
    <Grow in timeout={300 + index * 60}>
      <Card
        elevation={0}
        sx={{
          height: "100%",
          minHeight: 250,
          bgcolor: "var(--bg-surface)",
          borderRadius: "22px",
          position: "relative",
          overflow: "hidden",
          border: "1px solid var(--nearu-border)",
          transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
          boxShadow: hovered
            ? "0 20px 40px rgba(0, 0, 0, 0.45), 0 0 0 1px var(--nearu-accent)"
            : "none",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: hovered
              ? `radial-gradient(circle at top right, ${accentAlpha(0.15)} 0%, transparent 70%)`
              : "transparent",
            zIndex: 0,
            transition: "background 0.3s ease",
          },
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <CardActionArea
          onClick={() => navigate(service.path)}
          sx={{
            height: "100%",
            p: 2.5,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            zIndex: 1,
          }}
        >
          {/* Top Banner Image / Graphic Container */}
          <Box
            sx={{
              width: "100%",
              height: 135,
              borderRadius: "16px",
              position: "relative",
              overflow: "hidden",
              bgcolor: accentAlpha(0.04),
              mb: 2,
              border: hovered
                ? `1px solid ${accentAlpha(0.3)}`
                : "1px solid rgba(255, 255, 255, 0.06)",
              transition: "border-color 0.3s ease",
            }}
          >
            {service.iconImage ? (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <LazyImage
                  src={service.iconImage}
                  alt={service.label}
                  className="w-full h-full"
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                    transform: hovered ? "scale(1.08)" : "scale(1)",
                    transition: "transform 0.4s ease",
                  }}
                />
                {/* Gradient vignette overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(15,23,42,0.7) 0%, transparent 60%)",
                  }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  bgcolor: accentAlpha(0.08),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <service.icon
                  sx={{
                    fontSize: 44,
                    color: hovered ? accent : "var(--text-secondary)",
                    transition: "all 0.3s ease",
                    transform: hovered ? "scale(1.1)" : "scale(1)",
                  }}
                />
              </Box>
            )}

            {/* Hover Action Arrow Badge in Image Banner */}
            <Box
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: hovered ? accent : "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                boxShadow: hovered ? "0 4px 12px rgba(46, 158, 191, 0.4)" : "none",
              }}
            >
              <ChevronRightIcon
                sx={{
                  fontSize: 20,
                  color: hovered ? "#000" : "#fff",
                  transform: hovered ? "translateX(1px)" : "translateX(0)",
                  transition: "all 0.3s ease",
                }}
              />
            </Box>
          </Box>

          {/* Content: Title & Description */}
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="h6"
              sx={{
                color: "var(--text-primary)",
                fontWeight: 700,
                fontSize: "1.15rem",
                mb: 0.8,
                lineHeight: 1.3,
                fontFamily: '"Outfit", "Inter", sans-serif',
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
                overflow: "hidden",
              }}
            >
              {service.description}
            </Typography>
          </Box>
        </CardActionArea>
      </Card>
    </Grow>
  );
}
