import ShopCard from "../../components/food/ShopCard";
import { useFoodShops } from "../../hooks/useFoodShop";
import Navbar from "../../components/layout/Navbar";
import { Sidebar } from "../../components/layout/Sidebar";
import { PageLayout } from "../../components/layout/PageLayout";
import useAuth from "../../hooks/useAuth";

import {
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Button
} from '@mui/material';
import { useTheme } from '@mui/material';
import { useState } from "react";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import UpdateShopDialog from '../../components/food/UpdateShopDialog';
import DeleteShopDialog from '../../components/food/DeleteShopDialog';
import { deleteShop, updateShop } from '../../../api/foodapi';
import { useQueryClient } from '@tanstack/react-query';
import type { ShopResponse } from '../../../api/foodapi';
import { Container, Paper, Grid } from '@mui/material';
import BusinessProfileSetupModal from '../../components/businessapplication/BusinessProfileSet'; 



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

  const [currentPage, setCurrentPage] = useState(1);

  const {auth} = useAuth();
  const currentUserId = auth?.user?.id;

  const {data, isLoading, error} = useFoodShops({   //pas params to hook from there to API
    page: currentPage,
    pageSize: 9,
    category: activeCategory,
    search: searchQuery, 
  });

  const queryClient = useQueryClient();
  const [shopToEdit, setShopToEdit] = useState<ShopResponse | null>(null);
  const [shopToDelete, setShopToDelete] = useState<ShopResponse | null>(null);

  //when category change reset to page 1 
  const handleCategoryChange = (cat : string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }

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

  const shops = data?.items??[]; //data  is the pagedshopresponse from backend
  const totalPages = data?.totalPages ?? 1;
  const totalCount = data?.totalCount ?? 0;

  const getPageNumbers =() =>{
    const pages:(number | '...')[] = []; //hold numbers or ...

    if (totalPages <=7){
      for (let i =1; i <= totalPages; i++){
        pages.push(i)
      }
    } else {
      //always show page 1
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...'); //add dots if far from start
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...'); // add ... if far from end
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const handleUpdateShop =async (data:{
    name:string;
    description: string;
    address: string;
    phoneNumber: string;
    category: string;
    photo: File | null;
  }) => {
    if(!shopToEdit) return;

    await updateShop(shopToEdit.id, data);
    //refresh shop list
    await queryClient.invalidateQueries({queryKey: ['foodshops']});
    setShopToEdit(null);
  };

  const handleDeleteShop = async () => {
    if(!shopToDelete) return;

    await deleteShop(shopToDelete.id);
    //refresh shop list
    await queryClient.invalidateQueries({queryKey: ['foodshops']});
    setShopToDelete(null);
  }

  const theme = useTheme();
  const accent = theme.palette.primary.main;
  const accentAlpha = (a: number) => `rgba(46, 158, 191, ${a})`;

  return (
    <Box
      sx={{
        display:'flex',
        height:'100vh',           
        overflow:'hidden',        
        bgcolor:'background.default',
        backgroundImage:`radial-gradient(circle at top right, ${accentAlpha(0.04)} 0%, transparent 50%)`,
      }}>

      <Sidebar activeSection="food" />

      <Box sx={{ flexGrow: 1, display:'flex', flexDirection:'column', minWidth: 0 , overflow:'hidden'}}>
        <Navbar />

        <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <Box sx={{px: { xs: 2, md: 4 }, py: { xs: 4, md: 5 }, pb:8, maxWidth:1400, mx:'auto' }}>

              {/* Buiness owner welcome */}
              <Container sx={{ mt: 0, mb: 4 }}>
                <Paper 
                  sx={{ 
                    p: { xs: 3, md: 5 }, 
                    display: 'flex', 
                    flexDirection: 'column',
                    bgcolor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '1.5rem',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Typography variant="h3" sx={{ color: '#3b82f6', fontWeight: 'bold', mb: 2 }}>
                    Welcome, {auth?.user?.username || 'Owner'}!
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#9ca3af', mb: 4 }}>
                    You are logged in as a Business Owner.
                  </Typography>
                </Paper>
              </Container>

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
                      color: theme.palette.text.primary,
                      fontSize: { xs: "2.3rem", md: "3.6rem" },
                      letterSpacing: "-0.03em",
                      mb: 2,
                    }}
                  >
                    Food{" "}
                    <Box component="span" sx={{ color: accent }}>
                      Near U
                    </Box>
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.secondary,
                      maxWidth: 600,
                      lineHeight: 1.8,
                      fontSize: { xs: "1rem", md: "1.08rem" },
                    }}
                  >
                    Discover the best food shops near Sabaragamuwa University.
                    From rice & curry to cafes and bakeries,  all in one place.
                  </Typography>
                </Box>

                <Box
                  component="img"
                  src="https://www.truefoodkitchen.com/wp-content/uploads/2025/12/TrueFoodKitchenFall-01871-Edit_1200x800_2.jpg.webp"
                  sx={{
                    display: { xs: 'none', md: 'block' },
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
                    <Typography variant="h5" sx={{color: theme.palette.text.primary, fontWeight:'800'}}>
                      Food Shops
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary}}>
                      {totalCount} shop{totalCount !== 1 ? 's' : ''} found
                      {totalPages > 1 && `. page ${currentPage} of ${totalPages}`}
                    </Typography>
                  </Box>

                  <TextField
                    size="small"
                    placeholder="Search shops..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    sx={{
                      minWidth: { xs: "100%", md: 280 },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "14px",
                        bgcolor: accentAlpha(0.04),
                        color: theme.palette.text.primary,
                        "& fieldset": { borderColor: theme.palette.divider },
                        "&:hover fieldset": { borderColor: accent },
                        "&.Mui-focused fieldset": { borderColor: accent },
                      },
                      "& input::placeholder": {
                        color: theme.palette.text.secondary,
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
                          <IconButton size="small" onClick={() => handleSearchChange("")}>
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
                        onClick={() => handleCategoryChange(cat)}
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
                            ? accentAlpha(0.15)
                            : accentAlpha(0.03),
                          border: isActive
                            ? `1px solid ${accent}`
                            : `1px solid ${theme.palette.divider}`,
                          color: isActive
                            ? accent
                            : theme.palette.text.secondary,

                          '&:hover': {
                            bgcolor: isActive
                              ? accentAlpha(0.2)
                              : accentAlpha(0.06),
                            borderColor: accent,
                            color: accent,
                          },
                        }}>
                        {cat}
                      </Box>
                    );
                  })}
                </Box>
              </Box>

              {/* shop grid or empty state */}
              {shops.length > 0 ? (
                <Box
                  sx={{
                    display:'grid',
                    gridTemplateColumns:{
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)'
                    },
                    gap:{xs:2, md:2.5},
                    px:{xs:2, md:0} // no side margin
                  }}>
                  {shops.map((shop) => (
                    <ShopCard 
                    key={shop.id} 
                    shop={shop}
                    onEdit={shop.ownerId === currentUserId ? (s) => setShopToEdit(s) : undefined}
                    onDelete={shop.ownerId === currentUserId ? (s) => setShopToDelete(s) : undefined}
                    />
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
                    mx: {xs:0, md:5},
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

              {/*pagination only show if more than 1 page */}
              {totalPages > 0 && (
                <Box
                  sx={{
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    gap:1,
                    mt:6,
                  }}>

                  {/*previous button*/}
                  <IconButton
                    onClick={() => setCurrentPage(p => p -1)}
                    disabled={currentPage === 1}
                    sx={{
                      color: currentPage === 1 ? 'rgba(255,255,255,0.2)' : '#fff',
                      bgcolor: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '50px',
                      '&:hover': {
                        bgcolor: currentPage === 1 ? 'transparent' : 'rgba(255,255,255,0.08)',
                      },
                      '&.Mui-disabled': {
                        color: 'rgba(255,255,255,0.2)',
                      }
                    }}>
                      <ChevronLeftIcon />
                    </IconButton>

                    {/*page number buttons*/}
                    {getPageNumbers().map((pageNum, index) => {
                      if (pageNum === '...'){
                        return(
                          <Typography
                            key={`dots-${index}`}
                            sx={{color: 'rgba(255,255,255,0.3)', px:1}}>
                              ...
                            </Typography>
                        );
                      }

                      const isCurrentPage = pageNum === currentPage;
                      return(
                        <Box
                          key={pageNum}
                          onClick={()=> setCurrentPage(pageNum as number)}
                          sx={{
                            width: 38,
                            height: 38,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: isCurrentPage ? 700 : 400,
                            transition: 'all 0.2s ease',

                            bgcolor: isCurrentPage
                              ? accent
                              : accentAlpha(0.03),
                            color: isCurrentPage
                              ? '#fff'
                              : theme.palette.text.secondary,
                            border: isCurrentPage
                              ? 'none'
                              : `1px solid ${theme.palette.divider}`,

                            '&:hover': {
                              bgcolor: isCurrentPage
                                ? accent
                                : accentAlpha(0.08),
                              color: '#fff',
                            },
                          }}>
                            {pageNum}

                          </Box>
                      );

                    })}

                    {/*next button*/}
                    <IconButton
                      onClick={() => setCurrentPage(p => p + 1)}
                      disabled={currentPage === totalPages}
                      sx={{
                        color: currentPage === totalPages ? 'rgba(255,255,255,0.2)' : '#fff',
                        bgcolor: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '50px',
                        '&:hover': {
                          bgcolor: currentPage === totalPages ? 'transparent' : 'rgba(255,255,255,0.08)',
                        },
                        '&.Mui-disabled': {
                          color: 'rgba(255,255,255,0.2)',
                        }
                      }}>
                      <ChevronRightIcon />
                    </IconButton>
                  
                </Box>
              )}

          </Box>
        </Box>
      </Box>

      <UpdateShopDialog
        shop={shopToEdit}
        onClose={() => setShopToEdit(null)}
        onSubmit={handleUpdateShop}
      />

      <DeleteShopDialog
        shop={shopToDelete}
        onClose={() => setShopToDelete(null)}
        onConfirm={handleDeleteShop}
      />
    </Box>
  );
}