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
  } from '@mui/material';
import { useState } from "react";
import { XIcon, SearchIcon, SparkleIcon } from "lucide-react";

export default function FoodPage(){
  const [activeCategory, setActiveCategory] = useState('All');  
  const [searchQuery, setSearchQuery] = useState('');
  
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
            <Box sx={{px: { xs: 2, md: 4 }, py: { xs: 4, md: 5 }, pb:8, maxWidth:1400, mx:'auto' }}>
              
              {/*hero section */}
              <Box
                sx={{
                  mb: 8,
                  px: { xs: 3, md: 6 },
                  py: { xs: 5, md: 7 },
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}>

                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight:900,
                        color:'#fff',
                        fontSize:{xs:'2.3rem', md:'3.6rem'},
                        letterSpacing: '-0.03em',
                        mb:2
                      }}>
                        Food <Box component="span" sx={{color:"#facc15"}}>Near U</Box>
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        color: "rgba(255,255,255,0.65)",
                        maxWidth: 760,
                        mx: "auto",
                        lineHeight: 1.8,
                        fontSize: { xs: "1rem", md: "1.08rem" },
                      }}>
                        Discover the best food shops near Sabagagamuwa University. From rica & currey to cafes and bakeries  all in one place.
                    </Typography>
              </Box>
              
              {/*search section */}
                            
            </Box>


            <Box
              sx={{
                display:'grid',
                gridTemplateColumns:{ 
                  xs: '1fr', 
                  sm: 'repeat(2, 1fr)', 
                  md: 'repeat(3, 1fr)' },
                gap:{xs:2, md:2.5},
                alignItems:"center",
                ml:5,
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