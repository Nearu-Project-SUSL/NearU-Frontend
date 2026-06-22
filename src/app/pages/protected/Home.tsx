import { useState, useEffect, useRef, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { Sidebar } from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import useAuth from '../../hooks/useAuth';
import { useNearUTheme } from '../../context/ThemeContext';
import { useApprovedDeals } from '../../hooks/useDeals';
import ServiceCard from '../../components/dashboard/ServiceCard';
import DealCard from '../../components/dashboard/DealCard';
import TestimonialCard from '../../components/dashboard/TestimonialCard';
import ShareModal from '../../components/dashboard/ShareModal';
import axios from '../../../api/axios';
import { axiosPrivate } from '../../../api/axios';

import {
  Box,
  Typography,
  Card,
  CardActionArea,
  Avatar,
  Fade,
  Grow,
  IconButton,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';

import {
  Restaurant as FoodIcon,
  DirectionsBus as TransportIcon,
  DirectionsBike as RidesIcon,
  Work as JobsIcon,
  Business as AccommodationIcon,
  CardGiftcard as GiftIcon,
  LocalOffer as OffersIcon,
  AutoAwesome as SparkleIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Person as UserIcon,
  Close as CloseIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { set } from 'date-fns';


interface Testimonial{
  id: number;
  message: string;
  rating: number;
  createdAt: string;
  userName: string;
  userInitial: string;
}

// ─── Service Card Data ───────────────────────────────────────────────────────
const services = [
  {
    id: 'food',
    icon: FoodIcon,
    label: 'Food Delivery',
    description: 'Order from nearby restaurants with exclusive student discounts.',
    badge: '50+',
    path: '/food',
    iconImage: '/food_deal.png',
  },
  {
    id: 'transport',
    icon: TransportIcon,
    label: 'Uni Rides',
    description: 'Quick and affordable transportation around campus and city.',
    badge: '12',
    path: '/transport',
    iconImage: '/ride_deal.png',
  },
  {
    id: 'accommodation',
    icon: AccommodationIcon,
    label: 'Accommodation',
    description: 'Browse verified student rooms and boarding houses.',
    badge: '30+',
    path: '/accommodation',
    iconImage: '/accommodation_deal.png',
  },
  {
    id: 'rides',
    icon: RidesIcon,
    label: 'Bike Rentals',
    description: 'Eco-friendly bike rentals for short campus commutes.',
    badge: '8',
    path: '/rides',
    iconImage: '/bike_service.png',
  },
  {
    id: 'jobs',
    icon: JobsIcon,
    label: 'Part-time Jobs',
    description: 'Find part-time and internship opportunities near you.',
    badge: '20+',
    path: '/jobs',
    iconImage: '/job_service.png',
  },
  {
    id: 'gifts',
    icon: GiftIcon,
    label: 'Gifts',
    description: 'Send personalised gifts to friends and loved ones.',
    badge: '15+',
    path: '/gifts',
    iconImage: '/gift_service.png',
  },
  {
    id: 'offers',
    icon: OffersIcon,
    label: 'Deals & Offers',
    description: 'Exclusive discounts and promotions for students.',
    badge: '40+',
    path: '/deals',
    iconImage: '/offer_service.png',
  },
];

const defaultDealImageByType: Record<string, string> = {
  Food: '/food_deal.png',
  Gift: '/gift_service.png',
  Accommodation: '/accommodation_deal.png',
  Other: '/offer_service.png',
};



function timeAgo(dateStr: string): string{
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? 's' : ''} ago`;
}

function getAvatarColor(initial: string  | undefined): string{
  const colors = ['#2E9EBF', '#f97316', '#22d3ee', '#a78bfa', '#34d399', '#fb7185'];
  if(!initial) return colors[0];

  return colors[initial?.charCodeAt(0) % colors.length || 0];
}

// ─── Custom Carousel Hook ─────────────────────────────────────────────────────
function useHorizontalScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return { scrollRef, scroll };
}

// ─── Home Deal Card Props Interface ───────────────────────────────────────────
interface HomeDealCardProps {
  id: string;
  image: string;
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
}


// ─── Home Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const theme = useTheme();
  const { isDark } = useNearUTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showAllServices, setShowAllServices] = useState(false);
  const { data: approvedDeals = [], isLoading: dealsLoading } = useApprovedDeals();
  const accent = theme.palette.primary.main;
  const accentAlpha = (a: number) => `rgba(46, 158, 191, ${a})`;
  const { scrollRef: servicesRef, scroll: scrollServices } = useHorizontalScroll();
  const { scrollRef: dealsRef, scroll: scrollDeals } = useHorizontalScroll();

  //testimonial state
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const autoRotateRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const homeDeals: HomeDealCardProps[] = approvedDeals.map((d: any) => ({
    id: d.id,
    image: d.imageUrl || defaultDealImageByType[d.shopType] || '/offer_service.png',
    title: d.title,
    description: d.description,
    badge: d.badgeText,
    badgeColor: d.badgeColor || '#ef4444',
  }));


  const CARDS_PER_PAGE = 3;
  const totalPages = Math.ceil(testimonials.length / CARDS_PER_PAGE);
  const visibleTestimonials = testimonials.slice(currentPage * CARDS_PER_PAGE, currentPage * CARDS_PER_PAGE + CARDS_PER_PAGE);
  

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  //fetch testimonial from API
  const fetchTestimonials = useCallback(async ()=> {
    try{
      const res = await axios.get('/testimonials');
      setTestimonials(res.data);
    } catch{
      //silently fail - page still works
    } finally{
      setTestimonialsLoading(false);
    }
  }, []);

  useEffect(() => { fetchTestimonials(); }, [fetchTestimonials]);

  //Auto rotate every 15 sec
  useEffect(() => {
    if (testimonials.length <= CARDS_PER_PAGE) return;
    autoRotateRef.current = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 15000);
    return () => {if (autoRotateRef.current) clearInterval(autoRotateRef.current);};
  }, [testimonials.length, totalPages]);

  const goToPage = (page: number) =>{
    //reset time when manual navigation
    if (autoRotateRef.current) clearInterval(autoRotateRef.current);
    setCurrentPage(page);
    autoRotateRef.current = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 15000);
  };

  const handleShareClick = () => {
    if(!auth?.accessToken){
      navigate('/login');
      return;
    }
    setModalOpen(true);
  }

  const handleSubmitted = () => {
    setSnackbar({open: true, message: 'Thank you! your experience has been shared.', severity: 'success'});
    fetchTestimonials(); //refresh list
    setCurrentPage(0);
  }

  const userName = auth?.user?.username || auth?.user?.email?.split('@')[0] || 'Student';

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'var(--bg-base)', backgroundImage: `radial-gradient(circle at top right, var(--nearu-accent-subtle) 0%, transparent 40%)` }}>
      <Sidebar activeSection="home" />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Navbar />

        {/* Main Scroller wrapper */}
        <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <Box sx={{ px: { xs: 2.5, md: 5 }, py: { xs: 4, md: 5 }, pb: 8, maxWidth: 1400, mx: 'auto', width: '100%' }}>

              {/* ── Hero ─────────────────────────────────────────── */}
              <Fade in={visible} timeout={600}>
                <Box sx={{ mb: 6, position: 'relative' }}>
                  <Typography variant="h2" sx={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: { xs: '2.5rem', md: '3.5rem' }, letterSpacing: '-0.03em', mb: 1 }}>
                    Hello <Box component="span" sx={{ color: 'var(--nearu-accent)' }}>{userName}</Box>
                  </Typography>
                  <Typography variant="h5" sx={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                    What would you like to do today?
                  </Typography>
                  <style>{`
                    @keyframes wave {
                      0% { transform: rotate( 0.0deg) }
                      10% { transform: rotate(14.0deg) }
                      20% { transform: rotate(-8.0deg) }
                      30% { transform: rotate(14.0deg) }
                      40% { transform: rotate(-4.0deg) }
                      50% { transform: rotate(10.0deg) }
                      60% { transform: rotate( 0.0deg) }
                      100% { transform: rotate( 0.0deg) }
                    }
                  `}</style>
                </Box>
              </Fade>

              {/* ── Explore Services (Carousel) ──────────────────────────── */}
              <Box sx={{ mb: 8 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <SparkleIcon sx={{ color: 'var(--nearu-accent)', fontSize: 24 }} />
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                      Explore Services
                    </Typography>
                  </Box>
                  <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                    <IconButton onClick={() => scrollServices('left')} sx={{ bgcolor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--nearu-border)', '&:hover': { bgcolor: 'var(--nearu-accent-subtle)' } }}>
                      <ChevronLeftIcon />
                    </IconButton>
                    <IconButton onClick={() => scrollServices('right')} sx={{ bgcolor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--nearu-border)', '&:hover': { bgcolor: 'var(--nearu-accent-subtle)' } }}>
                      <ChevronRightIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Box
                  ref={servicesRef}
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 3,
                    overflowX: { xs: 'visible', md: 'auto' },
                    pb: { xs: 2, md: 4 },
                    px: 1,
                    mx: -1,
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                    scrollBehavior: 'smooth',
                    scrollSnapType: { xs: 'none', md: 'x mandatory' },
                    '& > *': { scrollSnapAlign: { xs: 'none', md: 'start' } }
                  }}
                >
                  {(isMobile && !showAllServices ? services.slice(0, 3) : services).map((service, i) => (
                    <Box key={service.id} sx={{ width: { xs: '100%', md: 'auto' } }}>
                      <ServiceCard service={service} index={i} />
                    </Box>
                  ))}
                </Box>

                {isMobile && services.length > 3 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                    <Button
                      variant="outlined"
                      onClick={() => setShowAllServices(!showAllServices)}
                      sx={{
                        color: 'var(--nearu-accent)',
                        borderColor: 'var(--nearu-border)',
                        borderRadius: '12px',
                        px: 4,
                        py: 1.2,
                        fontWeight: 700,
                        textTransform: 'none',
                        '&:hover': { borderColor: 'var(--nearu-accent)', bgcolor: 'var(--nearu-accent-subtle)' }
                      }}
                    >
                      {showAllServices ? 'Show Less' : `View All Services (${services.length})`}
                    </Button>
                  </Box>
                )}
              </Box>

              {/* ── Hot Deals & Offers (Carousel) ───────────────────────── */}
              <Box sx={{ mb: 8 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <OffersIcon sx={{ color: 'var(--nearu-accent)', fontSize: 24 }} />
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: 'var(--nearu-accent)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                        Hot Deals & Offers
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                        Limited time exclusive offers just for you
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                    <IconButton onClick={() => scrollDeals('left')} sx={{ bgcolor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--nearu-border)', '&:hover': { bgcolor: 'var(--nearu-accent-subtle)' } }}>
                      <ChevronLeftIcon />
                    </IconButton>
                    <IconButton onClick={() => scrollDeals('right')} sx={{ bgcolor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--nearu-border)', '&:hover': { bgcolor: 'var(--nearu-accent-subtle)' } }}>
                      <ChevronRightIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Box
                  ref={dealsRef}
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 3,
                    overflowX: { xs: 'visible', md: 'auto' },
                    pb: 4,
                    px: 1,
                    mx: -1,
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                    scrollBehavior: 'smooth',
                    scrollSnapType: { xs: 'none', md: 'x mandatory' },
                    '& > *': { scrollSnapAlign: { xs: 'none', md: 'start' } }
                  }}
                >
                  {dealsLoading && (
                    <Typography sx={{ color: 'text.secondary', px: 2 }}>Loading deals...</Typography>
                  )}
                  {!dealsLoading && homeDeals.length === 0 && (
                    <Typography sx={{ color: 'text.secondary', px: 2 }}>
                      No live deals yet. Check back soon or visit Deals & Offers.
                    </Typography>
                  )}
                  {homeDeals.map((deal, i) => (
                    <Box key={deal.id} sx={{ width: { xs: '100%', md: 'auto' } }}>
                      <DealCard deal={deal} index={i} onViewAll={() => navigate('/deals')} />
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* ── What Students Say ────────────────────────────────────── */}
              <Box sx={{ mb: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <UserIcon sx={{ color: 'var(--nearu-accent)', fontSize: 24 }} />
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: 'var(--nearu-accent)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                        What Students Say
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                        Real experiences from our community members
                      </Typography>
                    </Box>
                  </Box>
                
                {/*page navigation arrows only if more than 3 testimonials */}
                {testimonials.length > CARDS_PER_PAGE && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          onClick={() => goToPage((currentPage - 1 + totalPages) % totalPages)}
                          sx={{ bgcolor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--nearu-border)', '&:hover': { bgcolor: 'var(--nearu-accent-subtle)' } }}
                        >
                          <ChevronLeftIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => goToPage((currentPage + 1) % totalPages)}
                          sx={{ bgcolor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--nearu-border)', '&:hover': { bgcolor: 'var(--nearu-accent-subtle)' } }}
                        >
                      <ChevronRightIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>

              {/*testimonial cards*/}
              {testimonialsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                  <CircularProgress sx={{ color: 'var(--nearu-accent)' }} />
                </Box>
              ) : testimonials.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6, color: 'var(--text-secondary)', opacity: 0.5 }}>
                  <Typography variant="body1">No testimonials yet. Be the first to share!</Typography>
                </Box>
              ) : (
                <Fade in key={currentPage} timeout={500}>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                    {visibleTestimonials.map((t, i) => (
                      <TestimonialCard key={t.id} t={t} index={i} />
                    ))}
                  </Box>
                </Fade>
              )}

              {/*page dots*/}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 3 }}>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Box
                      key={i}
                      onClick={() => goToPage(i)}
                      sx={{
                        width: i === currentPage ? 24 : 8,
                        height: 8,
                        borderRadius: '4px',
                        bgcolor: i === currentPage ? 'var(--nearu-accent)' : 'var(--nearu-border)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': { bgcolor: i === currentPage ? 'var(--nearu-accent)' : 'var(--text-secondary)' },
                      }}
                    />
                  ))}
                </Box>
              )}

               <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={handleShareClick}
                  sx={{ color: 'var(--nearu-accent)', borderColor: 'var(--nearu-border)', borderRadius: '12px', px: 4, py: 1.2, fontWeight: 700, textTransform: 'none', '&:hover': { borderColor: 'var(--nearu-accent)', bgcolor: 'var(--nearu-accent-subtle)' } }}
                >
                  + Share Your Experience
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/*share model*/}
      <ShareModal 
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmitted={handleSubmitted}
        token={auth?.accessToken || ''}  
      />


      {/*Success Snackbar*/}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ borderRadius: '12px', fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}