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

import type { ShopResponse } from '../../../api/foodapi';

interface ShopCardProps{
  shop: ShopResponse;
}

export default function ShopCard({shop}: ShopCardProps) {
  const [hovered, setHovered] = useState(false); //track hover state for animation

  const navigate = useNavigate(); //go to shop detail page

  return(
    <Card
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    sx={{
      minWidth: { xs: '100%', sm: 320 },
      maxWidth: { sm: 360 },
      bgcolor: 'rgba(255,255,255,0.02)',
      overflow: 'hidden',
      borderRadius:"24px",

      border:hovered
        ? "1px solid rgba(250, 204, 21, 0.9)"
        : "1px solid rgba(255,255,255,0.08)",

      borderShadow:hovered
      ? "0 0 0 1px rgba(250,204,21,0.15), 0 12px 30px rgba(0,0,0,0.35)"
      : "none",

      transition:'all 0.25s ease',
      
      "&:hover": {
      transform: "translateY(-4px)",
      },

    }}>

      <CardActionArea
        onClick={() => navigate(`/food/${shop.id}`)}
        sx={{display:'flex', flexDirection:'column', alignItems:'stretch'}}>

          <Box sx={{position:'relative', height:180, overflow:'hidden'}}>
             <Box 
              component= "img"
              src={shop.photoUrl || "https://via.placeholder.com/400x300?text=No+Image"}
              alt={shop.name}
              sx={{
                width:'100%',
                height:'100%',
                objectFit:'cover',
              }}
              />
                <Box 
                  sx={{
                    position:'absolute',
                    bottom:0,
                    left:0,
                    right:0,
                    height:'60%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'
                  }}/>
              </Box>

              <Box sx={{p:2.5}}>

                <Typography
                  variant='h6'
                  sx={{
                    color:'#fff',
                    fontWeight:700,
                    mb:0.5,
                    fontSize:'1.1rem'
                  }}>
                    {shop.name}

                  </Typography>

                    <Box sx={{ display:'flex', alignItems:'center', gap:1}}>
                      <LocationIcon sx={{fontSize:14, color: 'rgba(255,255,255,0.3)'}} />
                      <Typography
                        variant='caption'
                        sx={{color:'rgba(255,255,255,0.5)', fontSize:'0.78rem'}}>
                          {shop.address}

                        </Typography>
                    </Box>

                    <Box
                      sx={{
                        mt:2,
                        pt:2,
                        borderTop:'1px solid rgba(255,255,255,0.05)',
                        display:'flex',
                        justifyContent:'space-between',
                        alignItems:'center'
                      }}>
                        <Box
                          sx={{
                            bottom:12,
                            left:12,
                            px:1.5,
                            py:0.4,
                            borderRadius:'8px',
                            bgcolor: 'rgba(59,130,246,0.15)',
                            border: '1px solid rgba(59,130,246,0.3)',
                          }}>
                            <Typography
                              variant='caption'
                              sx={{
                                color:'#60a5fa',
                                fontWeight:700,
                                fontSize:'0.7rem'
                              }}>
                                {shop.category}
                              </Typography>
                            
                        </Box>

                            <Typography
                              variant='caption'
                              sx={{color:'#facc15', fontWeight:700, fontSize:'0.78rem'}}>
                              View Menu

                            </Typography>
                      </Box>
            </Box>

      </CardActionArea>
      
    </Card>
  );
}