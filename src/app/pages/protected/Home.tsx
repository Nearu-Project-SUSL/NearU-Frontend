import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import useAuth from '../../hooks/useAuth';
import { useNearUTheme } from '../../context/ThemeContext';

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
  Person as UserIcon,
} from '@mui/icons-material';

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
    label: 'Custom Gifts',
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

const hotDeals = [
  {
    id: 'deal1',
    image: '/food_deal.png',
    title: '50% Off on First Food Order',
    description: 'Get amazing discounts on your first order from any restaurant. Limited time offer!',
    badge: '50% OFF',
    badgeColor: '#ef4444',
  },
  {
    id: 'deal2',
    image: '/ride_deal.png',
    title: 'Free Ride Credits',
    description: 'Earn free ride credits worth Rs. 500 when you refer a friend to NearU Rides.',
    badge: 'FREE Rs. 500',
    badgeColor: '#ef4444',
  },
  {
    id: 'deal3',
    image: '/accommodation_deal.png',
    title: 'Student Housing Special',
    description: 'Find the perfect accommodation with exclusive student discounts and verified listings.',
    badge: '30% OFF',
    badgeColor: '#ef4444',
  },
];

const testimonials = [
  {
    id: 't1',
    name: 'Thimira',
    time: '2 days ago',
    image: 'https://i.pravatar.cc/150?img=11',
    text: 'NearU has completely transformed my university life! The food delivery is super fast and the student discounts are amazing. Highly recommended for all students!',
  },
  {
    id: 't2',
    name: 'Uvindu',
    time: '1 week ago',
    image: 'https://i.pravatar.cc/150?img=12',
    text: "Love the ride-sharing feature! It's so convenient for getting to campus and back. The drivers are friendly and the app is really easy to use. Great service overall!",
  },
  {
    id: 't3',
    name: 'Manjari',
    time: '3 weeks ago',
    image: 'https://i.pravatar.cc/150?img=5',
    text: 'Found my perfect accommodation through NearU Bodims. The verified listings gave me peace of mind and the booking process was seamless. Thank you NearU!',
  },
];

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

// ─── Service Card Component ───────────────────────────────────────────────────
function ServiceCard({ service, index }: { service: typeof services[0], index: number }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const theme = useTheme();
  const accent = theme.palette.primary.main;
  const accentAlpha = (a: number) => `rgba(46, 158, 191, ${a})`;

  return (
    <Grow in timeout={400 + index * 100}>
      <Card
        elevation={0}
        sx={{
          minWidth: { xs: 260, md: 300 },
          height: 280,
          bgcolor: theme.palette.background.paper,
          borderRadius: '24px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: hovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
          boxShadow: hovered ? '0 30px 60px rgba(0,0,0,0.3)' : 'none',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: hovered
              ? `linear-gradient(to bottom, ${accentAlpha(0.08)} 0%, transparent 100%)`
              : 'transparent',
            zIndex: 0,
            transition: 'background 0.4s ease',
          },
          '&::after': {
             content: '""',
             position: 'absolute',
             inset: 0,
             borderRadius: '24px',
             padding: '2px',
             background: hovered ? `linear-gradient(135deg, ${accentAlpha(0.4)}, ${accentAlpha(0.05)})` : accentAlpha(0.06),
             WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
             WebkitMaskComposite: 'xor',
             maskComposite: 'exclude',
             transition: 'background 0.4s ease',
          }
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <CardActionArea
          onClick={() => navigate(service.path)}
          sx={{ height: '100%', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', zIndex: 1 }}
        >
          {/* Top section: Placeholder image or Icon block */}
          <Box sx={{ width: '100%', height: 120, mb: 2, position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
             {service.iconImage ? (
                <Box sx={{ width: '100%', height: '100%', backgroundImage: `url(${service.iconImage})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: hovered ? 'brightness(1.1) contrast(1.1)' : 'grayscale(100%) contrast(1.2)', transition: 'all 0.4s ease' }} />
             ) : (
                <Box sx={{ width: '100%', height: '100%', bgcolor: accentAlpha(0.04), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <service.icon sx={{ fontSize: 48, color: hovered ? accent : theme.palette.text.disabled, transition: 'color 0.4s ease' }} />
                </Box>
             )}

             {/* Gradient Overlay bottom to top */}
             <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', background: `linear-gradient(to top, ${theme.palette.background.paper}, transparent)` }} />

             {/* Badge */}
             {service.badge && (
                <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: accent, color: '#111', px: 1.2, py: 0.3, borderRadius: '12px', fontWeight: 800, fontSize: '0.7rem', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                  {service.badge}
                </Box>
             )}
          </Box>

          <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 700, mb: 1, fontSize: '1.2rem', fontFamily: '"Outfit", "Inter", sans-serif' }}>
            {service.label}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontSize: '0.85rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {service.description}
          </Typography>
        </CardActionArea>
      </Card>
    </Grow>
  );
}

// ─── Deal Card Component ──────────────────────────────────────────────────────
function DealCard({ deal, index }: { deal: typeof hotDeals[0], index: number }) {
  const [hovered, setHovered] = useState(false);
  const theme = useTheme();
  const accent = theme.palette.primary.main;
  const accentAlpha = (a: number) => `rgba(46, 158, 191, ${a})`;

  return (
    <Grow in timeout={600 + index * 100}>
      <Card
        elevation={0}
        sx={{
          minWidth: { xs: 280, md: 340 },
          bgcolor: theme.palette.background.paper,
          borderRadius: '24px',
          overflow: 'hidden',
          border: `1px solid ${accentAlpha(0.2)}`,
          transition: 'all 0.3s ease',
          transform: hovered ? 'translateY(-5px)' : 'none',
          boxShadow: hovered ? `0 15px 35px ${accentAlpha(0.12)}` : 'none',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Box sx={{ height: 180, position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ width: '100%', height: '100%', backgroundImage: `url(${deal.image})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.5s ease', transform: hovered ? 'scale(1.05)' : 'scale(1)' }} />
          <Box sx={{ position: 'absolute', top: 16, right: 16, bgcolor: deal.badgeColor, color: 'text.primary', px: 1.5, py: 0.5, borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', zIndex: 2 }}>
            {deal.badge}
          </Box>
          <Box sx={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${theme.palette.background.paper}, transparent)`, zIndex: 1 }} />
        </Box>
        <Box sx={{ p: 3, pt: 1 }}>
          <Typography variant="h6" sx={{ color: accent, fontWeight: 700, mb: 1, fontSize: '1.1rem' }}>
            {deal.title}
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 3, fontSize: '0.85rem', lineHeight: 1.6, minHeight: 40 }}>
            {deal.description}
          </Typography>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              fontWeight: 700,
              borderRadius: '12px',
              py: 1.2,
              textTransform: 'none',
              fontSize: '0.95rem',
              color: '#111111',
            }}
          >
            Get Deal
          </Button>
        </Box>
      </Card>
    </Grow>
  )
}

// ─── Testimonial Card ─────────────────────────────────────────────────────────
function TestimonialCard({ t, index }: { t: typeof testimonials[0], index: number }) {
  const theme = useTheme();
  const accent = theme.palette.primary.main;
  const accentAlpha = (a: number) => `rgba(46, 158, 191, ${a})`;

  return (
    <Grow in timeout={800 + index * 100}>
      <Card
        elevation={0}
        sx={{
          minWidth: { xs: 240, md: 320 },
          bgcolor: theme.palette.background.paper,
          borderRadius: '20px',
          p: 3,
          border: `1px solid ${theme.palette.divider}`,
          transition: 'border 0.3s ease',
          '&:hover': { border: `1px solid ${accentAlpha(0.35)}` }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar src={t.image} sx={{ width: 48, height: 48, border: `2px solid ${accent}` }} />
              <Box>
                <Typography variant="subtitle1" sx={{ color: theme.palette.text.primary, fontWeight: 700, lineHeight: 1.2 }}>{t.name}</Typography>
                <Box sx={{ display: 'flex', color: accent, fontSize: '0.8rem', mt: 0.5 }}>
                  {[1,2,3,4,5].map(i => <StarIcon key={i} fontSize="inherit" />)}
                </Box>
              </Box>
           </Box>
           <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>{t.time}</Typography>
        </Box>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, lineHeight: 1.6, fontStyle: 'italic' }}>
          "{t.text}"
        </Typography>
      </Card>
    </Grow>
  )
}

// ─── Home Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const { auth } = useAuth();
  const [visible, setVisible] = useState(false);
  const theme = useTheme();
  const { isDark } = useNearUTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showAllServices, setShowAllServices] = useState(false);

  const accent = theme.palette.primary.main;
  const accentAlpha = (a: number) => `rgba(46, 158, 191, ${a})`;

  const { scrollRef: servicesRef, scroll: scrollServices } = useHorizontalScroll();
  const { scrollRef: dealsRef, scroll: scrollDeals } = useHorizontalScroll();
  const { scrollRef: testRef, scroll: scrollTest } = useHorizontalScroll();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const userName = auth?.user?.username || auth?.user?.email?.split('@')[0] || 'Student';

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'background.default', backgroundImage: `radial-gradient(circle at top right, ${accentAlpha(0.04)} 0%, transparent 40%)` }}>
      <Sidebar activeSection="home" />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        <Navbar />

        {/* Main Scroller wrapper */}
        <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <Box sx={{ px: { xs: 2.5, md: 5 }, py: { xs: 4, md: 5 }, pb: 8, maxWidth: 1400, mx: 'auto', width: '100%' }}>

              {/* ── Hero ─────────────────────────────────────────── */}
              <Fade in={visible} timeout={600}>
                <Box sx={{ mb: 6, position: 'relative' }}>
                  <Typography variant="h2" sx={{ fontWeight: 800, color: 'text.primary', fontSize: { xs: '2.5rem', md: '3.5rem' }, letterSpacing: '-0.03em', mb: 1 }}>
                    Hello <Box component="span" sx={{ color: accent }}>{userName}</Box>
                  </Typography>
                  <Typography variant="h5" sx={{ color: 'text.secondary', fontWeight: 500 }}>
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
                    <SparkleIcon sx={{ color: accent, fontSize: 24 }} />
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.01em' }}>
                      Explore Services
                    </Typography>
                  </Box>
                  <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                    <IconButton onClick={() => scrollServices('left')} sx={{ bgcolor: accentAlpha(0.06), color: 'text.primary', '&:hover': { bgcolor: accentAlpha(0.15) } }}>
                      <ChevronLeftIcon />
                    </IconButton>
                    <IconButton onClick={() => scrollServices('right')} sx={{ bgcolor: accentAlpha(0.06), color: 'text.primary', '&:hover': { bgcolor: accentAlpha(0.15) } }}>
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
                        color: accent,
                        borderColor: accentAlpha(0.4),
                        borderRadius: '12px',
                        px: 4,
                        py: 1.2,
                        fontWeight: 700,
                        textTransform: 'none',
                        '&:hover': { borderColor: accent, bgcolor: accentAlpha(0.08) }
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
                    <OffersIcon sx={{ color: accent, fontSize: 24 }} />
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: accent, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                        Hot Deals & Offers
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Limited time exclusive offers just for you
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                    <IconButton onClick={() => scrollDeals('left')} sx={{ bgcolor: accentAlpha(0.06), color: 'text.primary', '&:hover': { bgcolor: accentAlpha(0.15) } }}>
                      <ChevronLeftIcon />
                    </IconButton>
                    <IconButton onClick={() => scrollDeals('right')} sx={{ bgcolor: accentAlpha(0.06), color: 'text.primary', '&:hover': { bgcolor: accentAlpha(0.15) } }}>
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
                  {hotDeals.map((deal, i) => (
                    <Box key={deal.id} sx={{ width: { xs: '100%', md: 'auto' } }}>
                      <DealCard deal={deal} index={i} />
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* ── What Students Say ────────────────────────────────────── */}
              <Box sx={{ mb: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <UserIcon sx={{ color: accent, fontSize: 24 }} />
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: accent, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                        What Students Say
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Real experiences from our community members
                      </Typography>
                    </Box>
                  </Box>
                   <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                    <IconButton onClick={() => scrollTest('left')} sx={{ bgcolor: accentAlpha(0.06), color: 'text.primary', '&:hover': { bgcolor: accentAlpha(0.15) } }}>
                      <ChevronLeftIcon />
                    </IconButton>
                    <IconButton onClick={() => scrollTest('right')} sx={{ bgcolor: accentAlpha(0.06), color: 'text.primary', '&:hover': { bgcolor: accentAlpha(0.15) } }}>
                      <ChevronRightIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Box
                  ref={testRef}
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 3,
                    overflowX: { xs: 'visible', md: 'auto' },
                    pb: 2,
                    px: 1,
                    mx: -1,
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                    scrollBehavior: 'smooth',
                    scrollSnapType: { xs: 'none', md: 'x mandatory' },
                    '& > *': { scrollSnapAlign: { xs: 'none', md: 'start' } }
                  }}
                >
                  {testimonials.map((t, i) => (
                    <Box key={t.id} sx={{ width: { xs: '100%', md: 'auto' } }}>
                      <TestimonialCard t={t} index={i} />
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                   <Button variant="outlined" sx={{ color: accent, borderColor: accentAlpha(0.4), borderRadius: '12px', px: 4, py: 1.2, fontWeight: 700, '&:hover': { borderColor: accent, bgcolor: accentAlpha(0.08) } }}>
                     + Share Your Experience
                   </Button>
                </Box>

              </Box>

          </Box>
        </Box>
      </Box>
    </Box>
  );
}