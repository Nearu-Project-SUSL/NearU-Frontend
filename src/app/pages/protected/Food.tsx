import ShopCard from "../../components/food/ShopCard";
import { foodShopsData } from "../../../data/foodMockData";
import Navbar from "../../components/layout/Navbar";
import { Sidebar } from "../../components/layout/Sidebar";
import { PageLayout } from "../../components/layout/PageLayout";

import {
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  colors,
} from '@mui/material';
import { Carousel } from "../../components/ui/carousel";
import { useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon, SparkleIcon } from "lucide-react";

export default function FoodPage(){
  const [activeCategory, setActiveCategory] = useState('All');  
  const [searchQuery, setSearchQuery] = useState('');

  const carouselRef = useRef<HTMLDivElement>(null); 

  const scrollCarousel = (direction: 'left' | 'right' ) =>{
    if (carouselRef.current){
      const amount = carouselRef.current.clientWidth /2;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior:'smooth'
      });
    }
  };
  
  const categories = ['All', ...new Set(foodShopsData.map((s) => s.category))]; //.. means convert set back to array

  const filterShops = foodShopsData.filter((shop) => {
    
    //category filter
    if (activeCategory != 'All' && shop.category != activeCategory) return false;

    //search filter - check name 
    if(searchQuery.trim()){
      const q = searchQuery.toLowerCase();
      const matchName = shop.name.toLowerCase().includes(q);

      if (!matchName) return false;
    }
    
    return true;
});

  return (
    <Box
      sx={{
        display:'flex',
        minHeight:'100vh',
        bgcolor:'#050505',
        backgroundImage:'radial-gradient(circle at top right, rgba(250,204,21,0.03) 0%, transparent 50%)',
      }}>

      <Sidebar activeSection="food" />

      <Box sx={{ flexGrow: 1 ,display:'flex', flexDirection:'column', minWidth: 0 }}>
        <Navbar />

        <PageLayout>
          <Box sx={{height:'100vh', overflowY:'auto', overflowX:'hidden', mt:'-64px', pt:'64px'}}>
            <Box sx={{px: { xs: 2.5, md: 5 }, py: { xs: 4, md: 5 }, pb:8, maxWidth:1400, mx:'auto' }}>
              <Box
                sx={{
                  mb: 8,
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: 'center',
                  bgcolor: 'rgba(255,255,255,0.02)',
                  borderRadius: '32px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.05)',
                  position: 'relative',
                }}>
                  <Box sx={{p: { xs: 4, md: 5 }, flex:1, zIndex:1 }}>
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight:800,
                        color:'#fff',
                        fontSize:{xs:'2.2rem', md:'3.2rem'},
                        letterSpacing: '-0.03em',
                        mb:2
                      }}>
                        Food Near U
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        color:'rgba(255,255,255,0.6)',
                        maxWidth:520,
                        mb:4,
                        lineHeight:1.7,
                        fontSize:'1.05rem'
                      }}>
                        Discover the best food shops near Sabagagamuwa University. From rica & currey to cafes and bakeries - all in one place.
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display:'flex',
                      alignItems:'center',
                      gap:1,
                      px:2,
                      py:1,
                      borderRadius:'12px',
                      bgcolor:'rgba(255,255,255,0.03)',
                      border:'1px solid rgba(255,255,255,0.08)'
                    }}>

                      <Typography variant="caption" sx={{color: 'rgba(255,255,255,0.5)', fontWeight:600, fontSize:'1rem'}}>
                        {foodShopsData.length} Total Shops

                      </Typography>
                  </Box>
              </Box>
            </Box>
            
            <Box
              sx={{
                display:'flex',
                alignItems:'center',
                justifyContent:'space-between',
                mb:4
              }}>
              <Box sx={{display:'flex', gap:1.5}}>
                <IconButton
                  onClick={() => scrollCarousel('left')}
                  sx={{
                    bgcolor:'rgba(255,255,255,0.03)',
                    color:'#fff',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                  <ChevronLeftIcon />
                </IconButton>

                  <IconButton
                    onClick={() => scrollCarousel('right')}
                    sx={{
                      bgcolor:'rgba(255,255,255,0.03)',
                      color:'#fff',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}>

                    <ChevronRightIcon />
                  </IconButton>
              </Box>
            </Box>

            <Box>
              <Box
                sx={{
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'space-between',
                  flexWrap:'wrap',
                  gap:3,
                  mb:4
                }}>
                  <Box sx={{display:'flex', alignItems:'center', gap:2}}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: 'rgba(255,255,255,0.03)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent:'center'
                      }}>

                      <SparkleIcon color='rgba(255,255,255,0.4)' size={20} />
                    </Box>

                      <Box>
                        <Typography variant="h5" sx={{fontWeight:800, color:'#fff'}}>
                          All Shops
                        </Typography>

                        <Typography variant="caption" sx={{color:'rgba(255,255,255,0.4)'}}>
                          {filterShops.length} result{filterShops.length != 1 ? 's' : ''} 

                        </Typography>
                      </Box>
                  </Box>

                  {/*fileter controls*/ }
                  <Box sx={{ display:'flex', gap:2, flexWrap:'wrap', alignItems:'center'}}>
                  
                      <TextField
                        size="small"
                        placeholder="Search shops"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                          startAdornment:(
                            <InputAdornment position="start">
                              <SearchIcon sx={{color: 'rgba(255,255,255,0.3)', width:18}} />  
                            </InputAdornment>
                          ),
                          endAdornment: searchQuery ? (
                            <InputAdornment position='end'>
                              <IconButton
                                size="small"
                                onClick={() => setSearchQuery('')}
                                >
                                
                                </IconButton>
                            </InputAdornment>
                          ) : null
                        }} sx={{ minWidth:220}}></TextField>

                  </Box>      

                </Box>
            </Box>
            <Box
              sx={{
                display:'flex',
                flexWrap:'wrap',
                gap:8,
                justifyContent:'flex-start',
                mr:8,
                ml:8
              }}>
              {foodShopsData.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
            </Box>
            

          </Box>
        </PageLayout>

      </Box>
    </Box>
  );
}