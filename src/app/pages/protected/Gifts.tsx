import { useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Fade,
  Grid,
  Grow,
  IconButton,
  Skeleton,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import AddIcon from "@mui/icons-material/Add";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import GiftCard from "../../components/gift/GiftCard";
import GiftShopFormDialog from "../../components/gift/GiftShopFormDialog";
import {
  createGiftShop,
  type GiftShopResponseDto,
} from "../../../api/services/giftShopApi";
import { useGiftShops } from "../../hooks/useGiftShop";
import { toast } from "sonner";

function useHorizontalScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const next =
      direction === "left"
        ? scrollLeft - clientWidth / 2
        : scrollLeft + clientWidth / 2;
    scrollRef.current.scrollTo({ left: next, behavior: "smooth" });
  };

  return { scrollRef, scroll };
}

/** Skeleton card shown while gift shops are loading */
function GiftCardSkeleton() {
  return (
    <Box
      sx={{
        borderRadius: "24px",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.06)",
        bgcolor: "rgba(255,255,255,0.02)",
      }}
    >
      <Skeleton variant="rectangular" height={220} sx={{ bgcolor: "rgba(255,255,255,0.04)" }} />
      <Box sx={{ p: 2.5 }}>
        <Skeleton variant="text" height={32} sx={{ bgcolor: "rgba(255,255,255,0.04)", mb: 1 }} />
        <Skeleton variant="text" height={20} width="60%" sx={{ bgcolor: "rgba(255,255,255,0.04)" }} />
      </Box>
    </Box>
  );
}

export default function Gifts() {
  // Local filter state — only committed to query on Search click
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [activeParams, setActiveParams] = useState<{ keyword?: string; location?: string }>({});
  const [createOpen, setCreateOpen] = useState(false);
  const { scrollRef, scroll } = useHorizontalScroll();
  const queryClient = useQueryClient();

  // ── TanStack Query: fetch all gift shops ────────────────────────────────
  const {
    data: shops = [],
    isLoading,
    isFetching,
    isError,
    error,
  } = useGiftShops(activeParams);

  // ── TanStack Mutation: create a new gift shop ───────────────────────────
  const createMutation = useMutation({
    mutationFn: (formData: FormData) => createGiftShop(formData),
    onSuccess: () => {
      // Invalidate the list so it refetches and shows the new shop
      queryClient.invalidateQueries({ queryKey: ["giftshops"] });
      setCreateOpen(false);
      toast.success("Gift shop created successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create gift shop");
    },
  });

  const featuredShops = useMemo(() => shops.slice(0, 5), [shops]);

  const handleSearch = () => {
    setActiveParams({
      keyword: keyword.trim() || undefined,
      location: location.trim() || undefined,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#050505",
        backgroundImage:
          "radial-gradient(circle at top left, rgba(46,158,191,0.03) 0%, transparent 50%)",
      }}
    >
      <Sidebar activeSection="gifts" />

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Navbar />

        <Box sx={{ height: "calc(100vh - 68px)", overflowY: "auto", overflowX: "hidden" }}>
          <Box sx={{ px: { xs: 2.5, md: 5 }, py: { xs: 4, md: 5 }, maxWidth: 1400, mx: "auto" }}>
            {/* ── Header ──────────────────────────────────────────────── */}
            <Fade in timeout={600}>
              <Box sx={{ mb: 7, textAlign: "center", position: "relative" }}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    bgcolor: "rgba(46, 158, 191, 0.1)",
                    color: "#2E9EBF",
                    px: 2,
                    py: 0.8,
                    borderRadius: "20px",
                    mb: 3,
                    border: "1px solid rgba(46, 158, 191, 0.2)",
                  }}
                >
                  <AutoAwesomeIcon sx={{ fontSize: 18 }} />
                  <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: "0.1em" }}>
                    HANDMADE • CUSTOMIZED • SPECIAL
                  </Typography>
                </Box>

                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    color: "#fff",
                    fontSize: { xs: "2.4rem", md: "3.8rem" },
                    letterSpacing: "-0.03em",
                    mb: 2,
                  }}
                >
                  <Box component="span" sx={{ color: "#2E9EBF" }}>
                    Gifts
                  </Box>
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    color: "rgba(255,255,255,0.5)",
                    maxWidth: 700,
                    mx: "auto",
                    fontWeight: 400,
                    lineHeight: 1.6,
                  }}
                >
                  Discover unique gift shops, explore creative products, and contact sellers
                  directly.
                </Typography>
              </Box>
            </Fade>

            {/* ── Search / Filter bar ─────────────────────────────────── */}
            <Box
              sx={{
                mb: 4,
                p: 2,
                borderRadius: "20px",
                bgcolor: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  fullWidth
                  label="Search gift shops"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  InputLabelProps={{ style: { color: "rgba(255,255,255,0.55)" } }}
                  sx={darkTextFieldSx}
                />
                <TextField
                  fullWidth
                  label="Filter by location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={handleKeyDown}
                  InputLabelProps={{ style: { color: "rgba(255,255,255,0.55)" } }}
                  sx={darkTextFieldSx}
                />
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  disabled={isFetching}
                  startIcon={isFetching ? <CircularProgress size={16} color="inherit" /> : null}
                  sx={primaryBtnSx}
                >
                  Search
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setCreateOpen(true)}
                  sx={secondaryBtnSx}
                  startIcon={<AddIcon />}
                >
                  Add Shop
                </Button>
              </Stack>
            </Box>

            {/* ── Error state ─────────────────────────────────────────── */}
            {isError && (
              <Alert
                severity="error"
                sx={{ mb: 4, borderRadius: "14px", bgcolor: "rgba(239,68,68,0.08)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}
              >
                {(error as any)?.response?.data?.message || "Failed to load gift shops. Please try again."}
              </Alert>
            )}

            {/* ── Featured shops (horizontal scroll) ──────────────────── */}
            <Box sx={{ mb: 8 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <CardGiftcardIcon sx={{ color: "#2E9EBF", fontSize: 28 }} />
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: "#fff" }}>
                      Featured Gift Shops
                    </Typography>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.45)" }}>
                      Popular and newly added shops
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1.5 }}>
                  <IconButton onClick={() => scroll("left")} sx={iconBtnSx}>
                    <ChevronLeftIcon />
                  </IconButton>
                  <IconButton onClick={() => scroll("right")} sx={iconBtnSx}>
                    <ChevronRightIcon />
                  </IconButton>
                </Box>
              </Box>

              <Box
                ref={scrollRef}
                sx={{
                  display: "flex",
                  gap: 3,
                  overflowX: "auto",
                  pb: 2,
                  scrollbarWidth: "none",
                  "&::-webkit-scrollbar": { display: "none" },
                }}
              >
                {isLoading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <Box key={i} sx={{ minWidth: { xs: "100%", sm: 360 }, flexShrink: 0 }}>
                        <GiftCardSkeleton />
                      </Box>
                    ))
                  : featuredShops.map((shop: GiftShopResponseDto, index: number) => (
                      <Box key={shop.id} sx={{ minWidth: { xs: "100%", sm: 360 }, flexShrink: 0 }}>
                        <Grow in timeout={400 + index * 80}>
                          <Box>
                            <GiftCard shop={shop} />
                          </Box>
                        </Grow>
                      </Box>
                    ))}
              </Box>
            </Box>

            {/* ── All shops grid ──────────────────────────────────────── */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h5" sx={{ color: "#fff", fontWeight: 800 }}>
                  All Gift Shops
                </Typography>
                {!isLoading && (
                  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
                    {shops.length} {shops.length === 1 ? "shop" : "shops"} found
                  </Typography>
                )}
              </Box>

              {isLoading ? (
                <Grid container spacing={3}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
                      <GiftCardSkeleton />
                    </Grid>
                  ))}
                </Grid>
              ) : shops.length === 0 ? (
                <Box
                  sx={{
                    p: 8,
                    borderRadius: "24px",
                    textAlign: "center",
                    bgcolor: "rgba(255,255,255,0.02)",
                    border: "1px dashed rgba(255,255,255,0.08)",
                  }}
                >
                  <CardGiftcardIcon sx={{ fontSize: 56, color: "rgba(255,255,255,0.1)", mb: 2 }} />
                  <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.4)", mb: 1 }}>
                    No gift shops found
                  </Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.25)" }}>
                    {activeParams.keyword || activeParams.location
                      ? "Try adjusting your search filters"
                      : "Be the first to add a gift shop!"}
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {shops.map((shop: GiftShopResponseDto) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={shop.id}>
                      <GiftCard shop={shop} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Create shop dialog ───────────────────────────────────────── */}
      <GiftShopFormDialog
        open={createOpen}
        mode="create"
        onClose={() => setCreateOpen(false)}
        onSubmit={async (formData) => {
          await createMutation.mutateAsync(formData);
        }}
      />
    </Box>
  );
}

// ── Shared style objects ──────────────────────────────────────────────────────

const darkTextFieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    borderRadius: "14px",
    "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
    "&:hover fieldset": { borderColor: "rgba(46,158,191,0.35)" },
    "&.Mui-focused fieldset": { borderColor: "#2E9EBF" },
  },
};

const primaryBtnSx = {
  bgcolor: "#2E9EBF",
  color: "#fff",
  fontWeight: 800,
  textTransform: "none",
  borderRadius: "12px",
  px: 3,
  whiteSpace: "nowrap",
  "&:hover": { bgcolor: "#1a7a9a" },
  "&:disabled": { bgcolor: "rgba(46,158,191,0.4)", color: "rgba(255,255,255,0.5)" },
};

const secondaryBtnSx = {
  color: "#fff",
  borderColor: "rgba(255,255,255,0.15)",
  textTransform: "none",
  borderRadius: "12px",
  px: 3,
  whiteSpace: "nowrap",
  "&:hover": {
    borderColor: "#2E9EBF",
    bgcolor: "rgba(46,158,191,0.05)",
  },
};

const iconBtnSx = {
  bgcolor: "rgba(255,255,255,0.03)",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.08)",
  "&:hover": {
    bgcolor: "rgba(46,158,191,0.15)",
    borderColor: "#2E9EBF",
  },
};