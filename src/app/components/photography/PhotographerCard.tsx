import { useState } from "react";
import {
  Card,
  CardActionArea,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  Stack,
  useTheme,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import type { PhotographerResponseDto } from "../../../api/services/photographerApi";
import useAuth from "../../hooks/useAuth";

interface PhotographerCardProps {
  photographer: PhotographerResponseDto;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function PhotographerCard({
  photographer,
  onClick,
  onEdit,
  onDelete,
}: PhotographerCardProps) {
  const [hovered, setHovered] = useState(false);
  const theme = useTheme();
  const { user } = useAuth();
  const accent = "#2E9EBF";

  const isBusinessOwnerOrAdmin =
    user?.roles?.some((role: string) =>
      ["BusinessOwner", "Business", "Admin", "SuperAdmin"].includes(role)
    ) ?? false;

  const isOwnerOrAdmin =
    isBusinessOwnerOrAdmin &&
    (user?.roles?.some((role: string) => ["Admin", "SuperAdmin"].includes(role)) ||
      photographer.ownerId === user?.id);

  return (
    <Card
      elevation={0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        height: "100%",
        bgcolor: "var(--bg-surface)",
        borderRadius: "20px",
        position: "relative",
        overflow: "hidden",
        border: "1px solid var(--nearu-border)",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 16px 36px rgba(0, 0, 0, 0.4), 0 0 0 1px #2E9EBF"
          : "none",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardActionArea
        onClick={onClick}
        sx={{
          p: 2.5,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ width: "100%" }}>
          {/* Header Row: Profile Avatar / Image & Rate */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              mb: 2,
            }}
          >
            <Avatar
              src={photographer.imageUrl || undefined}
              alt={photographer.name}
              sx={{
                width: 64,
                height: 64,
                bgcolor: "rgba(46, 158, 191, 0.15)",
                border: "2px solid rgba(46, 158, 191, 0.3)",
                boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
              }}
            >
              <CameraAltIcon sx={{ fontSize: 32, color: accent }} />
            </Avatar>

            <Chip
              label={`LKR ${photographer.baseRatePerHour.toLocaleString()}/hr`}
              sx={{
                bgcolor: "rgba(46, 158, 191, 0.15)",
                color: accent,
                fontWeight: 700,
                fontSize: "0.82rem",
                borderRadius: "12px",
                border: "1px solid rgba(46, 158, 191, 0.3)",
              }}
            />
          </Box>

          {/* Name & Bio */}
          <Typography
            variant="h6"
            sx={{
              color: "var(--text-primary)",
              fontWeight: 800,
              fontSize: "1.15rem",
              mb: 0.5,
              fontFamily: '"Outfit", "Inter", sans-serif',
            }}
          >
            {photographer.name}
          </Typography>

          {photographer.bio && (
            <Typography
              variant="body2"
              sx={{
                color: "var(--text-secondary)",
                fontSize: "0.82rem",
                lineHeight: 1.45,
                mb: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {photographer.bio}
            </Typography>
          )}

          {/* Location tag */}
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: "var(--text-secondary)", mb: 1.5 }}>
            <LocationOnIcon sx={{ fontSize: 16, color: accent }} />
            <Typography variant="caption" sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
              {photographer.locationName}
            </Typography>
          </Stack>

          {/* Package Count Badge */}
          {photographer.packages && photographer.packages.length > 0 && (
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ bgcolor: "rgba(255, 255, 255, 0.03)", py: 0.5, px: 1.2, borderRadius: "10px", width: "fit-content" }}>
              <PhotoLibraryIcon sx={{ fontSize: 14, color: accent }} />
              <Typography variant="caption" sx={{ color: "var(--text-secondary)", fontWeight: 600, fontSize: "0.75rem" }}>
                {photographer.packages.length} {photographer.packages.length === 1 ? "Package" : "Packages"} Available
              </Typography>
            </Stack>
          )}
        </Box>
      </CardActionArea>

      {/* Action Footer: Phone / Email / Owner Controls */}
      <Box
        sx={{
          p: 1.5,
          px: 2.5,
          borderTop: "1px solid var(--nearu-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "rgba(0, 0, 0, 0.15)",
        }}
      >
        <Stack direction="row" spacing={1}>
          {photographer.phone && (
            <Tooltip title={photographer.phone}>
              <IconButton
                size="small"
                component="a"
                href={`tel:${photographer.phone}`}
                onClick={(e) => e.stopPropagation()}
                sx={{
                  color: accent,
                  bgcolor: "rgba(46, 158, 191, 0.1)",
                  "&:hover": { bgcolor: "rgba(46, 158, 191, 0.2)" },
                }}
              >
                <PhoneIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {photographer.email && (
            <Tooltip title={photographer.email}>
              <IconButton
                size="small"
                component="a"
                href={`mailto:${photographer.email}`}
                onClick={(e) => e.stopPropagation()}
                sx={{
                  color: accent,
                  bgcolor: "rgba(46, 158, 191, 0.1)",
                  "&:hover": { bgcolor: "rgba(46, 158, 191, 0.2)" },
                }}
              >
                <EmailIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>

        {isOwnerOrAdmin && (
          <Stack direction="row" spacing={0.5}>
            {onEdit && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                sx={{ color: "var(--text-secondary)", "&:hover": { color: accent } }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            {onDelete && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                sx={{ color: "var(--text-secondary)", "&:hover": { color: "#ef4444" } }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>
        )}
      </Box>
    </Card>
  );
}
