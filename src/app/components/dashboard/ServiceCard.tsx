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
          width: "100%",
          aspectRatio: "1 / 1",
          bgcolor: "var(--bg-surface)",
          borderRadius: "24px",
          position: "relative",
          overflow: "hidden",
          border: "1px solid var(--nearu-border)",
          transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: hovered ? "translateY(-6px) scale(1.01)" : "translateY(0) scale(1)",
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
            width: "100%",
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            zIndex: 1,
          }}
        >
          {/* Top Square Banner Image Box (approx 58% height) */}
          <Box
            sx={{
              width: "100%",
              height: "58%",
              borderRadius: "16px",
              position: "relative",
              overflow: "hidden",
              bgcolor: accentAlpha(0.06),
              border: hovered
                ? `1px solid ${accentAlpha(0.35)}`
                : "1px solid rgba(255, 255, 255, 0.08)",
              transition: "all 0.3s ease",
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
                    transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(10,15,25,0.65) 0%, transparent 60%)",
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
                    fontSize: 40,
                    color: hovered ? accent : "var(--text-secondary)",
                    transition: "all 0.3s ease",
                    transform: hovered ? "scale(1.1)" : "scale(1)",
                  }}
                />
              </Box>
            )}

            {/* Hover Action Badge */}
            <Box
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 30,
                height: 30,
                borderRadius: "50%",
                bgcolor: hovered ? accent : "rgba(0, 0, 0, 0.55)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
                boxShadow: hovered ? "0 4px 14px rgba(46, 158, 191, 0.45)" : "none",
              }}
            >
              <ChevronRightIcon
                sx={{
                  fontSize: 18,
                  color: hovered ? "#000" : "#fff",
                  transform: hovered ? "translateX(1px)" : "translateX(0)",
                  transition: "all 0.3s ease",
                }}
              />
            </Box>
          </Box>

          {/* Bottom Info: Title & Description */}
          <Box sx={{ width: "100%", pt: 0.5 }}>
            <Typography
              variant="h6"
              sx={{
                color: "var(--text-primary)",
                fontWeight: 700,
                fontSize: "1.05rem",
                mb: 0.4,
                lineHeight: 1.25,
                fontFamily: '"Outfit", "Inter", sans-serif',
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {service.label}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "var(--text-secondary)",
                fontSize: "0.78rem",
                lineHeight: 1.35,
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
