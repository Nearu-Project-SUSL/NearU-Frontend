import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Card,
  CardActionArea,
  Typography,
  Box,
  IconButton,
  useTheme,
} from '@mui/material';
import { LocationOn as LocationIcon } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import type { ShopResponse } from '../../../api/foodapi';

interface ShopCardProps {
  shop: ShopResponse;
  onEdit?: (shop: ShopResponse) => void;
  onDelete?: (shop: ShopResponse) => void;
}

export default function ShopCard({ shop, onEdit, onDelete }: ShopCardProps) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  
  const accent = 'var(--nearu-accent)';
  const accentSubtle = 'var(--nearu-accent-subtle)';

  return (
    <Box
      sx={{ position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Card
        elevation={hovered ? 4 : 1}
        sx={{
          width: '100%',
          bgcolor: 'var(--bg-surface)',
          overflow: 'hidden',
          borderRadius: '24px',
          border: hovered
            ? `1px solid ${accent}`
            : `1px solid var(--nearu-border)`,
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
              src={shop.photoUrl || 'https://placehold.co/400x300/2E9EBF/FFFFFF?text=No+Image'}
              alt={shop.name}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <Box
              sx={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: '60%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent)',
              }}
            />
          </Box>

          {/* card body */}
          <Box sx={{ p: 2.5 }}>
            <Typography
              variant="h6"
              sx={{ color: 'var(--text-primary)', fontWeight: 700, mb: 0.5, fontSize: '1.1rem' }}
            >
              {shop.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationIcon sx={{ fontSize: 14, color: 'var(--text-secondary)' }} />
              <Typography
                variant="caption"
                sx={{
                  color: 'var(--text-secondary)',
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
                borderTop: `1px solid var(--nearu-border)`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {/* Category badge */}
              <Box
                sx={{
                  px: 1.5, py: 0.4,
                  borderRadius: '8px',
                  bgcolor: 'var(--nearu-accent-subtle)',
                  border: `1px solid var(--nearu-accent)`,
                }}
              >
                <Typography variant="caption" sx={{ color: 'var(--nearu-accent)', fontWeight: 700, fontSize: '0.7rem' }}>
                  {shop.category}
                </Typography>
              </Box>

              <Typography variant="caption" sx={{ color: 'var(--nearu-accent)', fontWeight: 700, fontSize: '0.78rem' }}>
                Tap to View Menu →
              </Typography>
            </Box>
          </Box>
        </CardActionArea>
      </Card>

      {/* action buttons */}
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
              onClick={(e) => { e.stopPropagation(); onEdit(shop); }}
              sx={{
                width: 30, height: 30,
                bgcolor: 'var(--nearu-accent-subtle)',
                border: `1px solid var(--nearu-accent)`,
                color: 'var(--nearu-accent)',
                backdropFilter: 'blur(8px)',
                '&:hover': { bgcolor: 'var(--nearu-accent)' },
              }}
            >
              <EditIcon sx={{ fontSize: 14 }} />
            </IconButton>
          )}
          {onDelete && (
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); onDelete(shop); }}
              sx={{
                width: 30, height: 30,
                bgcolor: 'rgba(239,68,68,0.2)',
                border: '1px solid rgba(239,68,68,0.4)',
                color: '#ef4444',
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