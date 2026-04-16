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

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

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


                {/*main content*/}
                <Box sx={{px:{xs:2.5, md:5}, py:5, maxWidth:'1400', mx:'auto', width:'100%'  }}>
                  

                  <Box sx={{mb:6}}>
                    <Typography 
                      variant='h6'
                      sx={{
                        color:'#fff',
                        fontWeight:700,
                        mb:2
                      }}>
                        About

                      </Typography>

                      <Typography
                        variant='body1'
                        sx={{ color:'rgba(255,255,255,0.6)', lineHeight:1.8}}>
                          {shop.description}

                        </Typography>
                  </Box>


                  <Grid container spacing={5}>

                    <Grid size={{xs:12, md:8}}>
                      {/*menu section*/}
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                          <MenuIcon sx={{ color: '#facc15', fontSize: 24 }} />
                          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
                            Menu
                          </Typography>
                        </Box>

                        {shop.menuItems.length > 0 && (
                          <Grid container spacing={2.5} sx={{ mb: 4 }}>
                            {shop.menuItems.map((item) => (
                              <Grid size={{ xs: 12, sm: 6 }}>
                                <MenuItemCard
                                  item={item}
                                  onClick={(item) => setSelectedItem(item)}
                                />
                              </Grid>
                            ))}
                          </Grid>
                        )}
                      </Box>
                    </Grid>

                   
                    <Grid size={{ xs: 12, md: 4 }} sx={{ mt: { xs: 0, md: 8 } }}>
                       {/*shop info */}
                      <Box
                        sx={{
                          position: 'sticky',
                          top: 80,
                          bgcolor: 'rgba(255,255,255,0.02)',
                          borderRadius: '24px',
                          p: 3.5,
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ color: '#fff', fontWeight: 700, mb: 3 }}
                        >
                          Shop Info
                        </Typography>

                        <Stack spacing={3}>
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                            <LocationIcon sx={{ color: '#3b82f6', mt: 0.3, flexShrink: 0 }} />
                            <Box>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: 'rgba(255,255,255,0.4)',
                                  display: 'block',
                                  mb: 0.3,
                                }}
                              >
                                Address
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: '#fff', fontWeight: 600, lineHeight: 1.5 }}
                              >
                                {shop.address}
                              </Typography>
                            </Box>
                          </Box>


                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                            <TimeIcon sx={{ color: '#facc15', mt: 0.3, flexShrink: 0 }} />
                            <Box>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: 'rgba(255,255,255,0.4)',
                                  display: 'block',
                                  mb: 0.3,
                                }}
                              >
                                Opening Hours
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: '#fff', fontWeight: 600 }}
                              >
                                {shop.openingHours}
                              </Typography>
                            </Box>
                          </Box>

                          <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />

                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                            <PhoneIcon sx={{ color: '#22c55e', mt: 0.3, flexShrink: 0 }} />
                            <Box>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: 'rgba(255,255,255,0.4)',
                                  display: 'block',
                                  mb: 0.3,
                                }}
                              >
                                Phone
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: '#fff',
                                  fontWeight: 600,
                                }}
                              >
                                {shop.phoneNumber}
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>
                      </Box>
                    </Grid>
                  </Grid>
                  
                

                  
                
                </Box>
          </PageLayout>
        </Box>
        

        {/* Menu Item Dialog */}
        <MenuItemDialog 
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      </Box>
  );
}