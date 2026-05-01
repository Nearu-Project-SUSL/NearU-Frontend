import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Card,
  CardActionArea,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { LocationOn as LocationIcon } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import type { ShopResponse } from '../../../api/foodapi';

interface ShopCardProps {
  shop: ShopResponse;
  onEdit?: (shop: ShopResponse) => void;    // optional — only show if provided
  onDelete?: (shop: ShopResponse) => void;  // optional — only show if provided
}

export default function ShopCard({ shop, onEdit, onDelete }: ShopCardProps) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <Box
      sx={{ position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Card
        sx={{
          width: '100%',
          bgcolor: 'rgba(255,255,255,0.02)',
          overflow: 'hidden',
          borderRadius: '24px',
          border: hovered
            ? '1px solid rgba(250, 204, 21, 0.9)'
            : '1px solid rgba(255,255,255,0.08)',
          transition: 'all 0.25s ease',
          '&:hover': { transform: 'translateY(-4px)' },
        }}
      >
        <CardActionArea
          onClick={() => navigate(`/food/${shop.id}`)}
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
        >
          {/* cover photo */}
          <Box sx={{ position: 'relative', height: { xs: 160, sm: 180 }, overflow: 'hidden' }}>
            <Box
              component="img"
              src={shop.photoUrl || 'https://placehold.co/400x300/1a1a1a/FFFFFF?text=No+Image'}
              alt={shop.name}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <Box
              sx={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: '60%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
              }}
            />
          </Box>

          {/* card body */}
          <Box sx={{ p: 2.5 }}>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 0.5, fontSize: '1.1rem' }}>
              {shop.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }} />
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '0.78rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {shop.address}
              </Typography>
            </Box>

            <Box
              sx={{
                mt: 2, pt: 2,
                borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  px: 1.5, py: 0.4,
                  borderRadius: '8px',
                  bgcolor: 'rgba(59,130,246,0.15)',
                  border: '1px solid rgba(59,130,246,0.3)',
                }}
              >
                <Typography variant="caption" sx={{ color: '#60a5fa', fontWeight: 700, fontSize: '0.7rem' }}>
                  {shop.category}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#facc15', fontWeight: 700, fontSize: '0.78rem' }}>
                Tap to View Menu
              </Typography>
            </Box>
          </Box>
        </CardActionArea>
      </Card>

      {/* action buttons — only show if handlers provided */}
      {(onEdit || onDelete) && (
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            display: 'flex',
            gap: 0.5,
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.2s ease',
            '@media (hover: none)': { opacity: 1 },
          }}
        >
          {onEdit && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(shop);
              }}
              sx={{
                width: 30,
                height: 30,
                bgcolor: 'rgba(59,130,246,0.2)',
                border: '1px solid rgba(59,130,246,0.4)',
                color: '#60a5fa',
                backdropFilter: 'blur(8px)',
                '&:hover': { bgcolor: 'rgba(59,130,246,0.4)' },
              }}
            >
              <EditIcon sx={{ fontSize: 14 }} />
            </IconButton>
          )}

          {onDelete && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(shop);
              }}
              sx={{
                width: 30,
                height: 30,
                bgcolor: 'rgba(239,68,68,0.2)',
                border: '1px solid rgba(239,68,68,0.4)',
                color: '#f87171',
                backdropFilter: 'blur(8px)',
                '&:hover': { bgcolor: 'rgba(239,68,68,0.4)' },
              }}
            >
              <DeleteIcon sx={{ fontSize: 14 }} />
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  );
}