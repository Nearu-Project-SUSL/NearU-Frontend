import {useState} from 'react';

import {
  Card,
  CardActionArea,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import type { MenuItem } from '../../../data/foodMockData';

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({item}: MenuItemCardProps) {
  const [hovered, setHovered] = useState(false);

  return(
    <Card>
      <CardActionArea>
        <Typography variant="h6">{item.name}</Typography>
        <Typography variant="body2">${item.price.toFixed(2)}</Typography>
      </CardActionArea>
    </Card>
  );
}