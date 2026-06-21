import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  CardMedia,
} from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "sonner";
import { Sidebar } from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { PageLayout } from "../../components/layout/PageLayout";
import { useAdminDeals, useApproveDeal, useRejectDeal } from "../../hooks/useDeals";
import type { DealResponseDto } from "../../../api/services/dealsApi";

const STATUSES = ["Pending", "Approved", "Rejected"];

const defaultDealImageByType: Record<string, string> = {
  Food: "/food_deal.png",
  Gift: "/gift_service.png",
  Accommodation: "/accommodation_deal.png",
  Other: "/offer_service.png",
};

interface AdminDealCardProps {
  deal: DealResponseDto;
  onApprove: (id: string) => void;
  onRejectClick: (id: string) => void;
  loading: boolean;
}

function AdminDealCard({
  deal,
  onApprove,
  onRejectClick,
  loading,
}: AdminDealCardProps) {
  const imageUrl = deal.imageUrl || defaultDealImageByType[deal.shopType] || "/offer_service.png";

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Open validity";
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: "20px",
        bgcolor: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 3,
        transition: "all 0.2s ease",
        "&:hover": {
          bgcolor: "rgba(255,255,255,0.04)",
          borderColor: "rgba(255,255,255,0.12)"
        }
      }}
    >
      {/* Deal Image Section */}
      <Box
        sx={{
          width: { xs: "100%", md: 180 },
          height: 120,
          borderRadius: "12px",
          overflow: "hidden",
          position: "relative",
          flexShrink: 0
        }}
      >
        <CardMedia
          component="img"
          image={imageUrl}
          alt={deal.title}
          sx={{ height: "100%", width: "100%", objectFit: "cover" }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            bgcolor: deal.badgeColor || "#ef4444",
            color: "#fff",
            px: 1,
            py: 0.25,
            borderRadius: "6px",
            fontWeight: 800,
            fontSize: "0.68rem"
          }}
        >
          {deal.badgeText}
        </Box>
      </Box>

      {/* Deal Details Section */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2} mb={0.75}>
            <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700, fontSize: "1.1rem", lineHeight: 1.3 }}>
              {deal.title}
            </Typography>
            <Chip
              label={deal.approvalStatus}
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: "0.7rem",
                bgcolor:
                  deal.approvalStatus === "Approved" ? "rgba(16,185,129,0.1)" :
                  deal.approvalStatus === "Pending" ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)",
                color:
                  deal.approvalStatus === "Approved" ? "#10b981" :
                  deal.approvalStatus === "Pending" ? "#f59e0b" : "#ef4444",
                border: "1px solid currentColor"
              }}
            />
          </Stack>

          <Stack direction="row" flexWrap="wrap" gap={2} mb={1.25} sx={{ color: "rgba(255,255,255,0.48)" }}>
            <Stack direction="row" alignItems="center" gap={0.5}>
              <StoreIcon sx={{ fontSize: 16, color: "#2E9EBF" }} />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {deal.shopName} · {deal.shopType}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap={0.5}>
              <PersonIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                Submitted by {deal.submittedByName}
              </Typography>
            </Stack>
          </Stack>

          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mb: 2 }}>
            {deal.description}
          </Typography>
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} gap={2} pt={1.5} sx={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <Stack direction="row" alignItems="center" gap={1} sx={{ color: "rgba(255,255,255,0.4)" }}>
            <CalendarTodayIcon sx={{ fontSize: 14 }} />
            <Typography variant="caption" sx={{ fontWeight: 500 }}>
              Validity: {formatDate(deal.validFrom)} – {formatDate(deal.validTo)}
            </Typography>
          </Stack>

          {deal.approvalStatus === "Pending" && (
            <Stack direction="row" spacing={1.5}>
              <Button
                variant="contained"
                size="small"
                startIcon={<CheckCircleIcon />}
                disabled={loading}
                onClick={() => onApprove(deal.id)}
                sx={{
                  bgcolor: "#10b981",
                  color: "#000",
                  fontWeight: 700,
                  borderRadius: "10px",
                  textTransform: "none",
                  px: 2.5,
                  py: 0.75,
                  "&:hover": { bgcolor: "#059669" }
                }}
              >
                Approve
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<CancelIcon />}
                disabled={loading}
                onClick={() => onRejectClick(deal.id)}
                sx={{
                  borderColor: "rgba(239,68,68,0.5)",
                  color: "#ef4444",
                  fontWeight: 700,
                  borderRadius: "10px",
                  textTransform: "none",
                  px: 2.5,
                  py: 0.75,
                  "&:hover": {
                    borderColor: "#ef4444",
                    bgcolor: "rgba(239,68,68,0.05)"
                  }
                }}
              >
                Reject
              </Button>
            </Stack>
          )}
        </Stack>

        {deal.rejectionReason && (
          <Box sx={{ mt: 2, p: 1.5, bgcolor: "rgba(239,68,68,0.03)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: "8px" }}>
            <Typography variant="caption" sx={{ color: "#ef4444", fontWeight: 700, display: "block" }}>
              Rejection Reason: {deal.rejectionReason}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default function AdminDeals() {
  const [status, setStatus] = useState("Pending");
  const { data, isLoading, refetch } = useAdminDeals(status);
  const approveMutation = useApproveDeal();
  const rejectMutation = useRejectDeal();

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [dealToReject, setDealToReject] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");

  const deals = data?.deals ?? [];
  const busy = approveMutation.isPending || rejectMutation.isPending;

  const handleApprove = async (id: string) => {
    try {
      await approveMutation.mutateAsync(id);
      toast.success("Deal approved — it will now show on the home page.");
      refetch();
    } catch {
      toast.error("Failed to approve deal");
    }
  };

  const handleRejectClick = (id: string) => {
    setDealToReject(id);
    setRejectionReasonInput("");
    setRejectDialogOpen(true);
  };

  const confirmReject = async () => {
    if (!dealToReject) return;
    try {
      await rejectMutation.mutateAsync({
        dealId: dealToReject,
        reason: rejectionReasonInput.trim() || "Does not meet community guidelines"
      });
      toast.success("Deal rejected.");
      setRejectDialogOpen(false);
      setRejectionReasonInput("");
      setDealToReject(null);
      refetch();
    } catch {
      toast.error("Failed to reject deal");
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Sidebar activeSection="admin" />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <PageLayout>
          <Box sx={{ mb: 4.5 }}>
            <Typography variant="h4" sx={{ color: "#ef4444", fontWeight: 800, mb: 1 }}>
              Manage Deals & Offers
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.48)" }}>
              Review shop applications, inspect deal details, and approve them for the home page.
            </Typography>
          </Box>

          <Tabs
            value={status}
            onChange={(_, v) => setStatus(v)}
            sx={{
              mb: 4,
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              "& .MuiTabs-indicator": { bgcolor: "#ef4444" },
              "& .MuiTab-root": {
                color: "rgba(255,255,255,0.4)",
                fontWeight: 600,
                textTransform: "none",
                fontSize: "0.95rem",
                "&.Mui-selected": { color: "#ef4444" }
              }
            }}
          >
            {STATUSES.map((s) => (
              <Tab key={s} label={s} value={s} />
            ))}
          </Tabs>

          {isLoading ? (
            <CircularProgress sx={{ color: "#ef4444" }} />
          ) : deals.length === 0 ? (
            <Typography sx={{ color: "rgba(255,255,255,0.36)" }}>No {status.toLowerCase()} deals.</Typography>
          ) : (
            <Stack spacing={3}>
              {deals.map((deal) => (
                <AdminDealCard
                  key={deal.id}
                  deal={deal}
                  onApprove={handleApprove}
                  onRejectClick={handleRejectClick}
                  loading={busy}
                />
              ))}
            </Stack>
          )}
        </PageLayout>
      </Box>

      {/* Custom Rejection Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: "#0b0b0f",
            borderRadius: "24px",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.85)",
            p: 1.5,
          }
        }}
      >
        <DialogTitle sx={{ color: "#fff", fontWeight: 800, fontSize: "1.3rem" }}>
          Reject Deal Application
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.48)", mb: 3 }}>
            Please state why this application is being rejected. The business owner will see this feedback in their submissions list.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Rejection Reason"
            value={rejectionReasonInput}
            onChange={(e) => setRejectionReasonInput(e.target.value)}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                borderRadius: "14px",
                backgroundColor: "rgba(255,255,255,0.02)",
                "& fieldset": { borderColor: "rgba(255,255,255,0.12)", transition: "all 0.2s" },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.25)" },
                "&.Mui-focused fieldset": { borderColor: "#ef4444" }
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255,255,255,0.5)",
                "&.Mui-focused": { color: "#ef4444" }
              }
            }}
          />
          <Stack direction="row" spacing={2} mt={3} justifyContent="flex-end">
            <Button
              onClick={() => setRejectDialogOpen(false)}
              sx={{ color: "rgba(255,255,255,0.4)", textTransform: "none", fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={confirmReject}
              disabled={!rejectionReasonInput.trim()}
              sx={{
                bgcolor: "#ef4444",
                color: "#fff",
                fontWeight: 700,
                borderRadius: "12px",
                px: 3,
                textTransform: "none",
                "&:hover": { bgcolor: "#dc2626" },
                "&.Mui-disabled": {
                  bgcolor: "rgba(255,255,255,0.05)",
                  color: "rgba(255,255,255,0.25)",
                }
              }}
            >
              Confirm Rejection
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
