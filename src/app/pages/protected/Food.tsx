import ShopCard from "../../components/food/ShopCard";
import { useFoodShops } from "../../hooks/useFoodShop";
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

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";


const FOOD_CATEGORIES = [
  'All',
  'Restaurant',
  'Cafe',
  'Bakery',
  'Juice Bar',
  'Fast Food',
  'Other',
];

export default function FoodPage(){
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const {data: shops, isLoading, error} = useFoodShops();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <Typography sx={{ color: '#fff' }}>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <Typography sx={{ color: '#ef4444' }}>
          Failed to load shops
        </Typography>
      </Box>
    );
  }

  const filterShops = (shops ?? []).filter((shop) => {
    // category filter — skip if 'All' selected
    if (activeCategory !== 'All' && shop.category !== activeCategory) return false;

    // search filter
    if(searchQuery.trim()){
      const q = searchQuery.toLowerCase();
      if (!shop.name.toLowerCase().includes(q)) return false;
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

      <Box sx={{ flexGrow: 1, display:'flex', flexDirection:'column', minWidth: 0 }}>
        <Navbar />

        <PageLayout>
          <Box sx={{height:'100vh', overflowY:'auto', overflowX:'hidden', mt:'-64px', pt:'64px'}}>
            <Box sx={{px: { xs: 2, md: 4 }, py: { xs: 4, md: 5 }, pb:8, maxWidth:1400, mx:'auto' }}>

              {/* hero section  */}
              <Box
                sx={{
                  mb: 8,
                  px: { xs: 3, md: 6 },
                  py: { xs: 6, md: 8 },
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "20px",
                  overflow: "hidden",
                  gap: 4,
                }}>

                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 900,
                      color: "#fff",
                      fontSize: { xs: "2.3rem", md: "3.6rem" },
                      letterSpacing: "-0.03em",
                      mb: 2,
                    }}
                  >
                    Food{" "}
                    <Box component="span" sx={{ color: "#facc15" }}>
                      Near U
                    </Box>
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: "rgba(255,255,255,0.7)",
                      maxWidth: 600,
                      lineHeight: 1.8,
                      fontSize: { xs: "1rem", md: "1.08rem" },
                    }}
                  >
                    Discover the best food shops near Sabaragamuwa University.
                    From rice & curry to cafes and bakeries — all in one place.
                  </Typography>
                </Box>

                <Box
                  component="img"
                  src="https://www.truefoodkitchen.com/wp-content/uploads/2025/12/TrueFoodKitchenFall-01871-Edit_1200x800_2.jpg.webp"
                  alt="Food"
                  sx={{
                    flex: 1,
                    width: "100%",
                    maxWidth: 450,
                    borderRadius: "16px",
                    objectFit: "cover",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                  }}
                />
              </Box>

              {/*Search and Filter Section*/}
              <Box sx={{ mb: 4 }}>
                <Box
                  sx={{
                    display:'flex',
                    alignItems: { xs: "stretch", md: "center" },
                    justifyContent: "space-between",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 2,
                    mb: 3,
                  }}>

                  <Box>
                    <Typography variant="h5" sx={{color:'#fff', fontWeight:'800'}}>
                      Food Shops
                    </Typography>
                    <Typography variant="body2" sx={{ color:'rgba(255,255,255,0.5)'}}>
                      {filterShops.length} shop{filterShops.length !== 1 ? 's' : ''} found
                    </Typography>
                  </Box>

                  <TextField
                    size="small"
                    placeholder="Search shops..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                      minWidth: { xs: "100%", md: 280 },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "14px",
                        bgcolor: "rgba(255,255,255,0.03)",
                        color: "#fff",
                        "& fieldset": { borderColor: "rgba(255,255,255,0.08)" },
                        "&:hover fieldset": { borderColor: "#facc15" },
                        "&.Mui-focused fieldset": { borderColor: "#facc15" },
                      },
                      "& input::placeholder": {
                        color: "rgba(255,255,255,0.4)",
                        opacity: 1,
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{color:'rgba(255,255,255,0.5)', fontSize:20}}/>
                        </InputAdornment>
                      ),
                      endAdornment: searchQuery ? (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setSearchQuery("")}>
                            <CloseIcon sx={{ color: "rgba(255,255,255,0.5)", fontSize: 18 }} />
                          </IconButton>
                        </InputAdornment>
                      ) : null,
                    }}
                  />
                </Box>

                {/* category filter */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1.5,
                    flexWrap: { xs: 'nowrap', md: 'wrap' },
                    overflowX: { xs: 'auto', md: 'visible' },
                    pb: { xs: 1, md: 0 },
                    // hide scrollbar on mobile
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                  }}>

                  {FOOD_CATEGORIES.map((cat) => {
                    // is this the currently selected category?
                    const isActive = activeCategory === cat;

                    return (
                      <Box
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        sx={{
                          px: 2,
                          py: 0.8,
                          borderRadius: '20px',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',  // prevent text wrapping
                          flexShrink: 0,         // prevent shrinking on mobile
                          transition: 'all 0.2s ease',
                          fontWeight: isActive ? 700 : 500,
                          fontSize: '0.82rem',

                          
                          bgcolor: isActive
                            ? 'rgba(250, 204, 21, 0.2)'
                            : 'rgba(255,255,255,0.03)',
                          border: isActive
                            ? '1px solid rgba(250, 204, 21, 1)'
                            : '1px solid rgba(255,255,255,0.08)',
                          color: isActive
                            ? '#facc15'
                            : 'rgba(255,255,255,0.5)',

                          '&:hover': {
                            bgcolor: isActive
                              ? 'rgba(250, 204, 21, 0.25)'
                              : 'rgba(255,255,255,0.06)',
                            borderColor: isActive
                              ? 'rgba(250, 204, 21, 0.8)'
                              : 'rgba(255,255,255,0.15)',
                            color: isActive ? '#facc15' : '#fff',
                          },
                        }}>
                        {cat}
                      </Box>
                    );
                  })}
                </Box>
              </Box>

              {/* shop grid or empty state */}
              {filterShops.length > 0 ? (
                <Box
                  sx={{
                    display:'grid',
                    gridTemplateColumns:{
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)'
                    },
                    gap:{xs:2, md:2.5},
                    ml: 5,
                  }}>
                  {filterShops.map((shop) => (
                    <ShopCard key={shop.id} shop={shop} />
                  ))}
                </Box>
              ) : (
                // empty state when no shops match filters
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 10,
                    bgcolor: 'rgba(255,255,255,0.02)',
                    borderRadius: '24px',
                    border: '1px dashed rgba(255,255,255,0.08)',
                    mx: 5,
                  }}>
                  <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.4)', mb: 1 }}>
                    No shops found
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.3)' }}>
                    {activeCategory !== 'All'
                      ? `No ${activeCategory} shops available right now`
                      : 'Try a different search term'}
                  </Typography>
                </Box>
              )}

            </Box>
          </Box>
        </PageLayout>
      </Box>
    </Box>
  );
}