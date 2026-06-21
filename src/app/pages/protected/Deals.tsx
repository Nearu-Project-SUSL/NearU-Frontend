import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Grow,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StoreIcon from "@mui/icons-material/Store";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import { toast } from "sonner";
import { Sidebar } from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import DealFormDialog from "../../components/deal/DealFormDialog";
import { useCreateDeal, useApprovedDeals, useMyDeals } from "../../hooks/useDeals";
import type { DealResponseDto } from "../../../api/services/dealsApi";
import useAuth from "../../hooks/useAuth";

const defaultDealImageByType: Record<string, string> = {
  Food: "/food_deal.png",
  Gift: "/gift_service.png",
  Accommodation: "/accommodation_deal.png",
  Other: "/offer_service.png",
};

function statusColor(status: string) {
  if (status === "Approved") return "#10b981"; // green
  if (status === "Rejected") return "#ef4444"; // red
  return "#f59e0b"; // amber/yellow
}

// ─── Deal Detail Modal ────────────────────────────────────────────────────────
interface DealDetailModalProps {
  deal: DealResponseDto | null;
  open: boolean;
  onClose: () => void;
}

function DealDetailModal({ deal, open, onClose }: DealDetailModalProps) {
  if (!deal) return null;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Open validation";
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const imageUrl = deal.imageUrl || defaultDealImageByType[deal.shopType] || "/offer_service.png";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          bgcolor: "#0b0b0f",
          borderRadius: "28px",
          border: "1px solid rgba(255,255,255,0.08)",
          backgroundImage: "radial-gradient(circle at top right, rgba(46,158,191,0.06) 0%, transparent 60%)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.85)",
          overflow: "hidden"
        },
      }}
    >
      <Box sx={{ position: "relative", height: 260, width: "100%" }}>
        <CardMedia
          component="img"
          image={imageUrl}
          alt={deal.title}
          sx={{ height: "100%", width: "100%", objectFit: "cover" }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(11,11,15,1) 95%)",
          }}
        />
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            bgcolor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            color: "#fff",
            "&:hover": { bgcolor: "rgba(0,0,0,0.8)" }
          }}
        >
          <CloseIcon />
        </IconButton>
        <Chip
          label={deal.badgeText}
          sx={{
            position: "absolute",
            bottom: 20,
            left: 24,
            bgcolor: deal.badgeColor || "#ef4444",
            color: "#fff",
            fontWeight: 800,
            fontSize: "1rem",
            px: 1,
            py: 0.5,
            borderRadius: "10px",
            boxShadow: "0 8px 16px rgba(0,0,0,0.3)"
          }}
        />
      </Box>
      <DialogContent sx={{ p: 4, pt: 0 }}>
        <Stack spacing={2.5}>
          <Box>
            <Stack direction="row" alignItems="center" gap={1} mb={0.5}>
              <StoreIcon sx={{ color: "#2E9EBF", fontSize: 20 }} />
              <Typography variant="subtitle1" sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 700 }}>
                {deal.shopName}
              </Typography>
              <Chip
                label={deal.shopType}
                size="small"
                variant="outlined"
                sx={{
                  color: "#2E9EBF",
                  borderColor: "rgba(46,158,191,0.3)",
                  fontSize: "0.75rem",
                  ml: 1,
                  height: 20
                }}
              />
            </Stack>
            <Typography variant="h5" sx={{ color: "#fff", fontWeight: 800, letterSpacing: "-0.01em" }}>
              {deal.title}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.4)", mb: 0.75 }}>
              Offer Details
            </Typography>
            <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>
              {deal.description}
            </Typography>
          </Box>

          <Stack direction="row" gap={3} sx={{ py: 1.5, borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <Box>
              <Stack direction="row" alignItems="center" gap={1} mb={0.5}>
                <CalendarTodayIcon sx={{ color: "rgba(255,255,255,0.4)", fontSize: 16 }} />
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
                  Valid From
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600 }}>
                {formatDate(deal.validFrom)}
              </Typography>
            </Box>
            <Box>
              <Stack direction="row" alignItems="center" gap={1} mb={0.5}>
                <CalendarTodayIcon sx={{ color: "rgba(255,255,255,0.4)", fontSize: 16 }} />
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
                  Valid To
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: "#fff", fontWeight: 600 }}>
                {formatDate(deal.validTo)}
              </Typography>
            </Box>
          </Stack>

          {deal.rejectionReason && (
            <Box sx={{ p: 2, bgcolor: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "12px" }}>
              <Typography variant="caption" sx={{ color: "#ef4444", fontWeight: 700, display: "flex", alignItems: "center", gap: 0.5 }}>
                <InfoIcon sx={{ fontSize: 14 }} /> Rejection Reason
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mt: 0.5 }}>
                {deal.rejectionReason}
              </Typography>
            </Box>
          )}

          <Button
            variant="contained"
            fullWidth
            onClick={onClose}
            sx={{
              bgcolor: "#2E9EBF",
              color: "#050505",
              fontWeight: 700,
              borderRadius: "12px",
              py: 1.25,
              textTransform: "none",
              "&:hover": { bgcolor: "#1e82a0" }
            }}
          >
            Close Window
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

// ─── Deal Grid Card ───────────────────────────────────────────────────────────
interface DealCardComponentProps {
  deal: DealResponseDto;
  onSelect: (deal: DealResponseDto) => void;
  showStatus?: boolean;
}

function DealCardComponent({ deal, onSelect, showStatus = false }: DealCardComponentProps) {
  const [hovered, setHovered] = useState(false);
  const imageUrl = deal.imageUrl || defaultDealImageByType[deal.shopType] || "/offer_service.png";

  return (
    <Card
      elevation={0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(deal)}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "rgba(255,255,255,0.02)",
        borderRadius: "20px",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.06)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: hovered ? "translateY(-6px)" : "none",
        boxShadow: hovered ? "0 12px 30px rgba(46,158,191,0.12)" : "none",
        cursor: "pointer",
      }}
    >
      <Box sx={{ height: 160, position: "relative", overflow: "hidden" }}>
        <CardMedia
          component="img"
          image={imageUrl}
          alt={deal.title}
          sx={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease",
            transform: hovered ? "scale(1.06)" : "scale(1)"
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            bgcolor: deal.badgeColor || "#ef4444",
            color: "#fff",
            px: 1.25,
            py: 0.4,
            borderRadius: "8px",
            fontWeight: 800,
            fontSize: "0.75rem",
            zIndex: 2,
            boxShadow: "0 4px 10px rgba(0,0,0,0.35)"
          }}
        >
          {deal.badgeText}
        </Box>
        {showStatus && (
          <Chip
            label={deal.approvalStatus}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              bgcolor: statusColor(deal.approvalStatus),
              color: "#111",
              fontWeight: 800,
              fontSize: "0.7rem",
              zIndex: 2
            }}
          />
        )}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(11,11,15,0.95) 0%, transparent 80%)",
            zIndex: 1
          }}
        />
      </Box>
      <CardContent sx={{ p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Box>
          <Stack direction="row" alignItems="center" gap={0.5} mb={0.75}>
            <StoreIcon sx={{ color: "#2E9EBF", fontSize: 15 }} />
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.48)", fontWeight: 600 }}>
              {deal.shopName} · {deal.shopType}
            </Typography>
          </Stack>
          <Typography
            variant="h6"
            sx={{
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.05rem",
              lineHeight: 1.3,
              mb: 1,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {deal.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.85rem",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {deal.description}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

// ─── Main Deals & Offers Page ────────────────────────────────────────────────
export default function Deals() {
  const { auth } = useAuth();
  const [formOpen, setFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("live");
  const [selectedDeal, setSelectedDeal] = useState<DealResponseDto | null>(null);

  const { data: approvedDeals = [], isLoading: loadingApproved } = useApprovedDeals();
  const { data: myDeals = [], isLoading: loadingMyDeals } = useMyDeals();
  const createDealMutation = useCreateDeal();

  const isBusiness = auth?.user?.roles?.some((role: string) => ["BusinessOwner", "Business"].includes(role));
  const isAdmin = auth?.user?.roles?.some((role: string) => ["Admin", "SuperAdmin"].includes(role));
  const isBusinessOrAdmin = isBusiness || isAdmin;

  const handleSubmit = async (formData: FormData) => {
    try {
      await createDealMutation.mutateAsync(formData);
      toast.success("Deal application submitted! Awaiting admin review.");
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message || "Failed to submit deal application");
      throw err;
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#050505" }}>
      <Sidebar activeSection="offers" />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Navbar />
        <Box sx={{ p: { xs: 2.5, md: 5 }, overflowY: "auto", flexGrow: 1 }}>
          
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} gap={2} mb={4.5}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <LocalOfferIcon sx={{ color: "#2E9EBF", fontSize: 36 }} />
              <Box>
                <Typography variant="h4" sx={{ color: "#fff", fontWeight: 800, fontSize: { xs: "1.75rem", md: "2.25rem" }, letterSpacing: "-0.02em" }}>
                  Deals & Offers
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.48)", mt: 0.5 }}>
                  Exclusive savings, student discounts, and limited-time promotions
                </Typography>
              </Box>
            </Box>
            {isBusinessOrAdmin && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setFormOpen(true)}
                sx={{
                  fontWeight: 700,
                  borderRadius: "14px",
                  bgcolor: "#2E9EBF",
                  color: "#050505",
                  textTransform: "none",
                  px: 3,
                  py: 1.25,
                  boxShadow: "0 8px 24px rgba(46,158,191,0.15)",
                  "&:hover": { bgcolor: "#1e82a0" }
                }}
              >
                Submit New Deal
              </Button>
            )}
          </Stack>

          {isBusinessOrAdmin && (
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              sx={{
                mb: 4,
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                "& .MuiTabs-indicator": { bgcolor: "#2E9EBF" },
                "& .MuiTab-root": {
                  color: "rgba(255,255,255,0.4)",
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "0.95rem",
                  "&.Mui-selected": { color: "#2E9EBF" }
                }
              }}
            >
              <Tab label="Live Offers" value="live" />
              <Tab label="My Deal Applications" value="my" />
            </Tabs>
          )}

          {activeTab === "live" ? (
            <Box>
              <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.88)", fontWeight: 800, mb: 3 }}>
                Live Offers
              </Typography>
              {loadingApproved ? (
                <CircularProgress size={32} sx={{ color: "#2E9EBF" }} />
              ) : approvedDeals.length === 0 ? (
                <Typography sx={{ color: "rgba(255,255,255,0.36)" }}>
                  No approved deals yet. Check back soon!
                </Typography>
              ) : (
                <Grid container spacing={3}>
                  {approvedDeals.map((deal, i) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={deal.id}>
                      <Grow in timeout={300 + i * 80}>
                        <Box sx={{ height: "100%" }}>
                          <DealCardComponent deal={deal} onSelect={setSelectedDeal} />
                        </Box>
                      </Grow>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.88)", fontWeight: 800, mb: 3 }}>
                My Submissions
              </Typography>
              {loadingMyDeals ? (
                <CircularProgress size={32} sx={{ color: "#2E9EBF" }} />
              ) : myDeals.length === 0 ? (
                <Typography sx={{ color: "rgba(255,255,255,0.36)" }}>
                  You have not submitted any deals yet. Click "Submit New Deal" to apply.
                </Typography>
              ) : (
                <Grid container spacing={3}>
                  {myDeals.map((deal, i) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={deal.id}>
                      <Grow in timeout={300 + i * 80}>
                        <Box sx={{ height: "100%" }}>
                          <DealCardComponent deal={deal} onSelect={setSelectedDeal} showStatus />
                        </Box>
                      </Grow>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}

        </Box>
      </Box>

      <DealFormDialog open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} />
      <DealDetailModal open={selectedDeal !== null} deal={selectedDeal} onClose={() => setSelectedDeal(null)} />
    </Box>
  );
}
