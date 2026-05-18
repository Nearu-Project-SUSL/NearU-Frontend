import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Fade,
  Grid,
  Grow,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import AddIcon from "@mui/icons-material/Add";
import { Sidebar } from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import GiftCard from "../../components/gift/GiftCard";
import GiftDetailsDialog from "../../components/gift/GiftDetailsDialog";
import GiftShopFormDialog from "../../components/gift/GiftShopFormDialog";
import {
  createGiftShop,
  getGiftShops,
  type GiftShopResponseDto,
} from "../../../api/services/giftShopApi";

function useHorizontalScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const next = direction === "left" ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
    scrollRef.current.scrollTo({ left: next, behavior: "smooth" });
  };

  return { scrollRef, scroll };
}

export default function Gifts() {
  const [shops, setShops] = useState<GiftShopResponseDto[]>([]);
  const [selectedShop, setSelectedShop] = useState<GiftShopResponseDto | null>(null);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [visible, setVisible] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const { scrollRef, scroll } = useHorizontalScroll();

  const fetchGiftShops = async () => {
    const data = await getGiftShops({
      keyword: keyword || undefined,
      location: location || undefined,
    });
    setShops(data);
  };

  useEffect(() => {
    fetchGiftShops();
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const featuredShops = useMemo(() => shops.slice(0, 5), [shops]);

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
            <Fade in={visible} timeout={600}>
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
                   <Box component="span" sx={{ color: "#2E9EBF" }}>Gifts</Box>
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
                  Discover unique gift shops, explore creative products, and contact sellers directly.
                </Typography>
              </Box>
            </Fade>

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
                  InputLabelProps={{ style: { color: "rgba(255,255,255,0.55)" } }}
                  sx={darkTextFieldSx}
                />
                <TextField
                  fullWidth
                  label="Filter by location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  InputLabelProps={{ style: { color: "rgba(255,255,255,0.55)" } }}
                  sx={darkTextFieldSx}
                />
                <Button variant="contained" onClick={fetchGiftShops} sx={primaryBtnSx}>
                  Search
                </Button>
              {/* {false && ( */}
  <Button
    variant="outlined"
    onClick={() => setCreateOpen(true)}
    sx={secondaryBtnSx}
    startIcon={<AddIcon />}
  >
    Add Shop
  </Button>
{/* )} */}
              </Stack>
            </Box>

            <Box sx={{ mb: 8 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
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
                {featuredShops.map((shop, index) => (
                  <Box key={shop.id} sx={{ minWidth: { xs: "100%", sm: 360 } }}>
                    <Grow in timeout={400 + index * 80}>
                      <Box>
                        <GiftCard shop={shop} onClick={() => setSelectedShop(shop)} />
                      </Box>
                    </Grow>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box>
              <Typography variant="h5" sx={{ color: "#fff", fontWeight: 800, mb: 3 }}>
                All Gift Shops
              </Typography>

              <Grid container spacing={3}>
                {shops.map((shop) => (
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={shop.id}>
                    <GiftCard shop={shop} onClick={() => setSelectedShop(shop)} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>

      <GiftDetailsDialog
        open={!!selectedShop}
        shop={selectedShop}
        onClose={() => setSelectedShop(null)}
        onRefresh={fetchGiftShops}
      />

      <GiftShopFormDialog
        open={createOpen}
        mode="create"
        onClose={() => setCreateOpen(false)}
        onSubmit={async (formData) => {
          await createGiftShop(formData);
          await fetchGiftShops();
        }}
      />
    </Box>
  );
}

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
  "&:hover": { bgcolor: "#1a7a9a" },
};

const secondaryBtnSx = {
  color: "#fff",
  borderColor: "rgba(255,255,255,0.15)",
  textTransform: "none",
  borderRadius: "12px",
  px: 3,
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