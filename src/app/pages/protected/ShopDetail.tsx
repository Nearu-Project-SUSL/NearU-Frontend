// src/pages/food/ShopDetailPage.tsx
// Full page for a single shop
// Shows cover photo, shop info, and menu items grid
// Menu item click opens MenuItemDialog

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Stack,
  Divider,
  Chip,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  AccessTime as TimeIcon,
  FiberManualRecord as DotIcon,
  RestaurantMenu as MenuIcon,
} from '@mui/icons-material';
import { Sidebar } from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import { PageLayout } from '../../components/layout/PageLayout';
import MenuItemCard from '../../components/food/MenuItemCard';
import MenuItemDialog from '../../components/food/MenuItemDialog';
import { foodShopsData } from '../../../data/foodMockData';
import type { MenuItem } from '../../../data/foodMockData';

export default function ShopDetailPage() {

  const {id} =  useParams<{id: string}>(); //useparam to extract url para and say id will be a string

  const navigate = useNavigate(); //to move between pages

  const shop = foodShopsData.find((s) => s.id === id);

  if(!shop){
    return(
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#050505' }}>
        <Sidebar activeSection="food" />
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ color: '#fff', mb: 2 }}>Shop not found</Typography>
            <IconButton onClick={() => navigate('/food')} sx={{ color: '#facc15' }}>
              <BackIcon /> Back to Food
            </IconButton>
          </Box>
        </Box>
      </Box>
    );
  }


  return(
    <Box
      sx={{
        display:'flex',
        minHeight:'100vh',
        bgcolor:'#050505'
      }}>
        <Sidebar activeSection='food' />

        <Box sx={{flexGrow:1, display:'flex', flexDirection:'column', minWidth:0}}>
          <Navbar />

          <PageLayout>
            <Box
              sx={{
                height:'100vh',
                overflowY:'auto',
                overflowX:'hidden',
                mt:'-64px',
                pt:'64px'
              }}>

                {/*coverphoto*/}
                <Box
                  sx={{ position:'relative', height:{xs:240, md:380}, overflow:'hidden' }}>

                    <Box
                      component="img"
                      src={shop.photoUrl}
                      alt={shop.name}
                      sx={{
                        width:'100%',
                        height:'100%',
                        objectFit:'cover',
                      }} />

                      <Box
                        sx={{
                          position:'absolute',
                          bottom:'0',
                          left:'0',
                          right:'0',
                          height:'70%',
                          background:'linear-gradient(to top, #050505, transparent)',
                        }} />

                        <IconButton
                          onClick={() => navigate('/food')}
                          sx={{
                            position:'absolute',
                            top:80,
                            left:24,
                            bgcolor:'rgba(255, 255, 255, 0.5)',
                            color:'#fff',
                            border:'1px solid rgba(255, 255, 255, 0.1)',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                          }}>
                            <BackIcon />

                          </IconButton>

                          <Box
                            sx={{
                              position:'absolute',
                              bottom:32,
                              left:{xs:24, md:48},
                            }}>
                              <Typography
                                variant='h3'
                                sx={{
                                  color:'#fff',
                                  fontWeight:'800',
                                  fontSize:{xs:'1.8rem', md:'2.8rem'},
                                  letterSpacing:'-0.02rem',
                                  textShadow:'0 2px 20px rgba(0,0,0,0.8)'
                                }}>
                                {shop.name}

                                </Typography>

                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                  {shop.category}
                                </Typography>

                            </Box>
                  </Box>
              </Box>
          </PageLayout>
        </Box>

      </Box>
  );
}