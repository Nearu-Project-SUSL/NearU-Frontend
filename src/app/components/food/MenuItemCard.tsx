import { useState } from 'react';
import {
  Card,
  CardActionArea,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export interface MenuItem {
  id:string;
  foodShopId:string;
  name: string;
  description: string;
  price: number;
  photoUrl: string;
}

interface MenuItemCardProps {
  item: MenuItem;
  onClick: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
  onEdit: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, onClick, onDelete, onEdit }: MenuItemCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      sx={{ position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Card
        elevation={0}
        sx={{
          bgcolor: 'rgba(255,255,255,0.02)',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.05)',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: hovered ? '0 12px 30px rgba(0,0,0,0.3)' : 'none',
        }}
      >
        <CardActionArea
          onClick={() => onClick(item)}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
            height: { xs: 110, sm: 120 },
          }}
        >
          {/* image */}
          <Box
            sx={{
              width: { xs: 100, md: 120 },
              flexShrink: 0,
              overflow: 'hidden',
            }}
          >
            <Box
              component="img"
              src={item.photoUrl || 'https://via.placeholder.com/120x120?text=No+Image'}
              alt={item.name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.4s ease',
                transform: hovered ? 'scale(1.08)' : 'scale(1)',
              }}
              loading="lazy"
            />
          </Box>

          {/* item details */}
          <Box
            sx={{
              flex: 1,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              // add right padding so action buttons don't overlap text
              pr: { xs: 7, sm: 8 },
            }}
          >
            <Box>
              <Typography
                variant="body1"
                sx={{ color: '#fff', fontWeight: 700, mb: 0.5, fontSize: '1rem' }}
              >
                {item.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: '0.78rem',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {item.description}
              </Typography>
            </Box>

            <Typography
              variant="body2"
              sx={{ color: '#2E9EBF', fontWeight: 800, fontSize: '1rem' }}
            >
              Rs. {item.price.toLocaleString()}
            </Typography>
          </Box>
        </CardActionArea>
      </Card>

      <Box
        sx={{
          position:'absolute',
          top:8,
          right:8,
          display:'flex',
          flexDirection:'column',
          gap:'0.5',
          opacity:'opacity 0.2s ease',
          '@media (hover:none)': {opacity:1}, //always show on touch devices
        }}>

          <IconButton
            size='small'
            onClick={(e) => {
              e.stopPropagation(); //prevent card from clicking
              onEdit(item);
            }}
            sx={{
              width: 28,
              height: 28,
              bgcolor: 'rgba(59,130,246,0.15)',
              border: '1px solid rgba(59,130,246,0.3)',
              color: '#60a5fa',
              '&:hover': {
                bgcolor: 'rgba(59,130,246,0.3)',
              },
            }}
            >
              <EditIcon sx={{fontSize:14}} />

            </IconButton>

            <IconButton
              size='small'
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item)
              }}
              sx={{
                width: 28,
                height: 28,
                bgcolor: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#f87171',
                '&:hover': {
                  bgcolor: 'rgba(239,68,68,0.3)',
                },
              }}
              > 
                <DeleteIcon sx={{fontSize:14}} />

              </IconButton>
        </Box>
    </Box>

  );
}