import ShopCard from "../../components/food/ShopCard";
import { foodShopsData } from "../../../data/foodMockData";
import Navbar from "../../components/layout/Navbar";
import { Sidebar } from "../../components/layout/Sidebar";
import { PageLayout } from "../../components/layout/PageLayout";

import {
  Box,
  Typography,
} from '@mui/material';

export default function FoodPage(){
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
                  mb:8,
                  display:'flex',
                  flexDirection:{xs:'column', md:'row'},
                  alignItems:'center',
                  bgcolor:'rgba(255, 255, 255, 0.02)',
                  borderRadius:'32px',
                  overflow:'hidden',
                  border:'1px solid rgba(255, 255, 255, 0.05)',
                  position:'relative'
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