import { Box } from "@mui/material";

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
        gap: 3,
        width: "100%",
        py: 2
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Box
          key={index}
          sx={{
            height: 380,
            bgcolor: "var(--bg-surface)",
            borderRadius: "24px",
            border: "1px solid var(--nearu-border)",
            p: 3,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)",
              transform: "translateX(-100%)",
              animation: "shimmer 1.8s infinite"
            }
          }}
        >
          {/* Image shimmer */}
          <Box
            sx={{
              width: "100%",
              height: 180,
              bgcolor: "rgba(255, 255, 255, 0.03)",
              borderRadius: "16px",
              mb: 3,
              animation: "pulse 1.5s infinite ease-in-out"
            }}
          />

          {/* Title shimmer */}
          <Box
            sx={{
              height: 24,
              width: "60%",
              bgcolor: "rgba(255, 255, 255, 0.03)",
              borderRadius: "4px",
              mb: 1.5,
              animation: "pulse 1.5s infinite ease-in-out",
              animationDelay: "0.15s"
            }}
          />

          {/* Description line 1 shimmer */}
          <Box
            sx={{
              height: 16,
              width: "90%",
              bgcolor: "rgba(255, 255, 255, 0.02)",
              borderRadius: "4px",
              mb: 1,
              animation: "pulse 1.5s infinite ease-in-out",
              animationDelay: "0.3s"
            }}
          />

          {/* Description line 2 shimmer */}
          <Box
            sx={{
              height: 16,
              width: "75%",
              bgcolor: "rgba(255, 255, 255, 0.02)",
              borderRadius: "4px",
              mt: "auto",
              mb: 1,
              animation: "pulse 1.5s infinite ease-in-out",
              animationDelay: "0.45s"
            }}
          />

          {/* Button shimmer */}
          <Box
            sx={{
              height: 44,
              width: "100%",
              bgcolor: "rgba(255, 255, 255, 0.03)",
              borderRadius: "12px",
              animation: "pulse 1.5s infinite ease-in-out",
              animationDelay: "0.6s"
            }}
          />
        </Box>
      ))}

      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.3;
          }
        }
      `}</style>
    </Box>
  );
}

export function ListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", py: 2 }}>
      {Array.from({ length: count }).map((_, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2.5,
            p: 2.5,
            bgcolor: "var(--bg-surface)",
            borderRadius: "20px",
            border: "1px solid var(--nearu-border)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Avatar circle */}
          <Box
            sx={{
              width: 54,
              height: 54,
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.03)",
              flexShrink: 0,
              animation: "pulse 1.5s infinite ease-in-out"
            }}
          />

          {/* Text block */}
          <Box sx={{ flexGrow: 1, spaceY: 1.5 }}>
            <Box
              sx={{
                height: 20,
                width: "40%",
                bgcolor: "rgba(255, 255, 255, 0.03)",
                borderRadius: "4px",
                mb: 1,
                animation: "pulse 1.5s infinite ease-in-out",
                animationDelay: "0.1s"
              }}
            />
            <Box
              sx={{
                height: 14,
                width: "80%",
                bgcolor: "rgba(255, 255, 255, 0.02)",
                borderRadius: "4px",
                animation: "pulse 1.5s infinite ease-in-out",
                animationDelay: "0.2s"
              }}
            />
          </Box>

          {/* Action indicator */}
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              bgcolor: "rgba(255,255,255,0.03)",
              animation: "pulse 1.5s infinite ease-in-out",
              animationDelay: "0.3s"
            }}
          />
        </Box>
      ))}
    </Box>
  );
}
