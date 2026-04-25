import { useState } from 'react';
import {
  Card,
  CardActionArea,
  Typography,
  Box,
} from '@mui/material';
import type { MenuItem } from '../../../../data/foodMockData';

interface MenuItemCardProps {
  item: MenuItem;
  onClick: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, onClick }: MenuItemCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      elevation={0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
          height: 120,
        }}
      >
        {/*image */}
        <Box
          sx={{
            width: 120,
            flexShrink: 0,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src={item.photoUrl}
            alt={item.name}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
              transform: hovered ? 'scale(1.08)' : 'scale(1)',
            }}
          />
        </Box>
        
        {/*item details */}
        <Box
          sx={{
            flex: 1,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography
              variant="body1"
              sx={{ color: '#fff', fontWeight: 700, mb: 0.5, fontSize: '0.95rem' }}
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

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography
              variant="body2"
              sx={{ color: '#facc15', fontWeight: 800, fontSize: '1rem' }}
            >
              Rs. {item.price.toLocaleString()} {/*format the price with commas like 1,000 */}
            </Typography>

            <Typography
              variant="caption"
              sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}
            >
              Tap for details
            </Typography>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
}