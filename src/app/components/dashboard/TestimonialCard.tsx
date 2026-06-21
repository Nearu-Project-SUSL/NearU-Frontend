import { Grow, Card, Box, Avatar, Typography } from "@mui/material";
import { Star as StarIcon, StarBorder as StarBorderIcon } from "@mui/icons-material";

interface Testimonial {
  id: number;
  message: string;
  rating: number;
  createdAt: string;
  userName: string;
  userInitial: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? "s" : ""} ago`;
}

function getAvatarColor(initial: string | undefined): string {
  const colors = ["#2E9EBF", "#f97316", "#22d3ee", "#a78bfa", "#34d399", "#fb7185"];
  if (!initial) return colors[0];
  return colors[initial?.charCodeAt(0) % colors.length || 0];
}

export default function TestimonialCard({
  t,
  index
}: {
  t: Testimonial;
  index: number;
}) {
  const initial = t.userInitial || t.userName?.charAt(0)?.toUpperCase() || "?";
  const color = getAvatarColor(initial);

  return (
    <Grow in timeout={800 + index * 100}>
      <Card
        elevation={0}
        sx={{
          width: { xs: "100%", md: 320 },
          minWidth: { xs: 240, md: 320 },
          bgcolor: "var(--bg-surface)",
          borderRadius: "20px",
          p: 3,
          border: "1px solid var(--nearu-border)",
          transition: "border 0.3s ease",
          "&:hover": { border: "1px solid var(--nearu-accent)" }
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                border: `2px solid ${color}`,
                bgcolor: color,
                color: "#000",
                fontWeight: 800,
                fontSize: "1.1rem"
              }}
            >
              {initial}
            </Avatar>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ color: "var(--text-primary)", fontWeight: 700, lineHeight: 1.2 }}
              >
                {t.userName}
              </Typography>
              <Box sx={{ display: "flex", mt: 0.5 }}>
                {[1, 2, 3, 4, 5].map((i) =>
                  i <= t.rating ? (
                    <StarIcon key={i} sx={{ fontSize: "0.85rem", color: "var(--nearu-accent)" }} />
                  ) : (
                    <StarBorderIcon
                      key={i}
                      sx={{ fontSize: "0.85rem", color: "var(--text-secondary)", opacity: 0.3 }}
                    />
                  )
                )}
              </Box>
            </Box>
          </Box>
          <Typography variant="caption" sx={{ color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
            {timeAgo(t.createdAt)}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{ color: "var(--text-secondary)", lineHeight: 1.6, fontStyle: "italic" }}
        >
          "{t.message}"
        </Typography>
      </Card>
    </Grow>
  );
}
