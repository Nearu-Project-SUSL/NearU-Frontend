import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { toast } from "sonner";
import { Sidebar } from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";
import { PageLayout } from "../../components/layout/PageLayout";
import { useAdminDeals, useApproveDeal, useRejectDeal } from "../../hooks/useDeals";
import type { DealResponseDto } from "../../../api/services/dealsApi";

const STATUSES = ["Pending", "Approved", "Rejected"];

function AdminDealCard({
  deal,
  onApprove,
  onReject,
  loading,
}: {
  deal: DealResponseDto;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  loading: boolean;
}) {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: "16px",
        bgcolor: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
        <Typography sx={{ color: "#fff", fontWeight: 700 }}>{deal.title}</Typography>
        <Chip label={deal.approvalStatus} size="small" sx={{ fontWeight: 700 }} />
      </Stack>
      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)" }}>
        {deal.shopName} · {deal.shopType} · by {deal.submittedByName}
      </Typography>
      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", my: 1.5 }}>
        {deal.description}
      </Typography>
      <Typography variant="caption" sx={{ color: "#2E9EBF" }}>
        Badge: {deal.badgeText}
      </Typography>
      {deal.approvalStatus === "Pending" && (
        <Stack direction="row" spacing={1} mt={2}>
          <Button
            variant="contained"
            size="small"
            disabled={loading}
            onClick={() => onApprove(deal.id)}
            sx={{ bgcolor: "#34d399", color: "#111", fontWeight: 700 }}
          >
            Approve
          </Button>
          <Button
            variant="outlined"
            size="small"
            disabled={loading}
            onClick={() => onReject(deal.id)}
            sx={{ borderColor: "#ef4444", color: "#ef4444" }}
          >
            Reject
          </Button>
        </Stack>
      )}
    </Box>
  );
}

export default function AdminDeals() {
  const [status, setStatus] = useState("Pending");
  const { data, isLoading, refetch } = useAdminDeals(status);
  const approveMutation = useApproveDeal();
  const rejectMutation = useRejectDeal();

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

  const handleReject = async (id: string) => {
    try {
      await rejectMutation.mutateAsync({ dealId: id, reason: "Does not meet guidelines" });
      toast.success("Deal rejected.");
      refetch();
    } catch {
      toast.error("Failed to reject deal");
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Sidebar activeSection="home" />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <PageLayout>
          <Typography variant="h4" sx={{ color: "#ef4444", fontWeight: 800, mb: 1 }}>
            Manage Deals & Offers
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", mb: 3 }}>
            Review shop submissions and approve them for the home page.
          </Typography>

          <Tabs
            value={status}
            onChange={(_, v) => setStatus(v)}
            sx={{ mb: 3, "& .MuiTab-root": { color: "rgba(255,255,255,0.5)" }, "& .Mui-selected": { color: "#ef4444" } }}
          >
            {STATUSES.map((s) => (
              <Tab key={s} label={s} value={s} />
            ))}
          </Tabs>

          {isLoading ? (
            <CircularProgress sx={{ color: "#ef4444" }} />
          ) : deals.length === 0 ? (
            <Typography sx={{ color: "rgba(255,255,255,0.4)" }}>No {status.toLowerCase()} deals.</Typography>
          ) : (
            <Stack spacing={2}>
              {deals.map((deal) => (
                <AdminDealCard
                  key={deal.id}
                  deal={deal}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  loading={busy}
                />
              ))}
            </Stack>
          )}
        </PageLayout>
      </Box>
    </Box>
  );
}
