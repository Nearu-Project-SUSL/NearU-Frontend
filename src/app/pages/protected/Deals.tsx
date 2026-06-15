import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grow,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { toast } from "sonner";
import { Sidebar } from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import DealFormDialog from "../../components/deal/DealFormDialog";
import { useCreateDeal, useApprovedDeals } from "../../hooks/useDeals";
import type { DealResponseDto } from "../../../api/services/dealsApi";
import useAuth from "../../hooks/useAuth";

function statusColor(status: string) {
  if (status === "Approved") return "#34d399";
  if (status === "Rejected") return "#ef4444";
  return "#facc15";
}

function DealListCard({ deal }: { deal: DealResponseDto }) {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: "16px",
        bgcolor: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ color: "#2E9EBF", fontWeight: 700 }}>{deal.title}</Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>
            {deal.shopName} · {deal.shopType}
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", mt: 1 }}>
            {deal.description}
          </Typography>
        </Box>
        <Chip label={deal.approvalStatus} size="small" sx={{ bgcolor: statusColor(deal.approvalStatus), color: "#111", fontWeight: 700 }} />
      </Stack>
      {deal.rejectionReason && (
        <Typography variant="caption" sx={{ color: "#ef4444", mt: 1, display: "block" }}>
          Reason: {deal.rejectionReason}
        </Typography>
      )}
    </Box>
  );
}

export default function Deals() {
  const { auth } = useAuth();
  const [formOpen, setFormOpen] = useState(false);
  
  const { data: approvedDeals = [], isLoading: loadingApproved } = useApprovedDeals();
  const createDealMutation = useCreateDeal();

  const isBusinessOrAdmin = auth?.user?.roles?.includes("BusinessOwner") || auth?.user?.roles?.includes("Admin");

  const handleSubmit = async (formData: FormData) => {
    try {
      await createDealMutation.mutateAsync(formData);
      toast.success("Deal submitted! Waiting for admin approval.");

    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message || "Failed to submit deal");
      throw err;
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#050505" }}>
      <Sidebar activeSection="offers" />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <Box sx={{ p: { xs: 2, md: 4 }, overflowY: "auto" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <LocalOfferIcon sx={{ color: "#2E9EBF", fontSize: 32 }} />
              <Box>
                <Typography variant="h4" sx={{ color: "#fff", fontWeight: 800 }}>
                  Deals & Offers
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>
                  Submit shop deals or browse approved offers
                </Typography>
              </Box>
            </Box>
            {isBusinessOrAdmin && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setFormOpen(true)}
                sx={{ fontWeight: 700, borderRadius: "12px", color: "#111" }}
              >
                Submit Deal
              </Button>
            )}
          </Stack>

          <Typography variant="h6" sx={{ color: "#2E9EBF", fontWeight: 700, mb: 2 }}>
            Live Offers
          </Typography>
          {loadingApproved ? (
            <CircularProgress size={28} sx={{ color: "#2E9EBF" }} />
          ) : approvedDeals.length === 0 ? (
            <Typography sx={{ color: "rgba(255,255,255,0.4)" }}>
              No approved deals yet. Check back soon!
            </Typography>
          ) : (
            <Stack spacing={2}>
              {approvedDeals.map((deal, i) => (
                <Grow in key={deal.id} timeout={300 + i * 80}>
                  <Box><DealListCard deal={deal} /></Box>
                </Grow>
              ))}
            </Stack>
          )}
        </Box>
      </Box>

      <DealFormDialog open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit} />
    </Box>
  );
}
