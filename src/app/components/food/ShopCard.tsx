import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Card,
  CardActionArea,
  Avatar,
  Chip,
  Typography,
  Box,
  Stack,
  Grow,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  AccessTime as TimeIcon,
  FiberManualRecord as DotIcon,
} from '@mui/icons-material';
import type { FoodShop } from '../../../data/foodMockData';

// interface ShopCardProps{
//   shop: FoodShop;
//   index: number;
// }

export default function ShopCard() {
  const [hovered, setHovered] = useState(false); //track hover state for animation

  const navigate = useNavigate(); //go to shop detail page

  return(
    <Card>
      
    </Card>
  );
}