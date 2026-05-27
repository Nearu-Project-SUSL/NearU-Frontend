import { Link, useNavigate } from 'react-router';
import { useSidebar } from '../../context/SidebarContext';
import useAuth from '../../hooks/useAuth';
import { useNearUTheme } from '../../context/ThemeContext';

// MUI Components
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  IconButton,
  Avatar,
  Tooltip,
  useTheme,
} from '@mui/material';

// MUI Icons
import {
  Home as HomeIcon,
  Restaurant as FoodIcon,
  DirectionsBus as TransportIcon,
  DirectionsBike as BikeIcon,
  Work as JobsIcon,
  Business as AccommodationIcon,
  CardGiftcard as GiftIcon,
  LocalOffer as OffersIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
  Person as UserIcon,
  AdminPanelSettings as AdminIcon,
  Storefront as StoreIcon,
} from '@mui/icons-material';

interface SidebarProps {
  activeSection?: string;
}

const DRAWER_WIDTH = 252;
const COLLAPSED_WIDTH = 68;

export { DRAWER_WIDTH, COLLAPSED_WIDTH };

export function Sidebar({ activeSection }: SidebarProps) {
  const { isExpanded, toggleSidebar, isMobileOpen, toggleMobileSidebar } = useSidebar();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { isDark } = useNearUTheme();
  const theme = useTheme();

  const userName = auth?.user?.username || auth?.user?.email?.split('@')[0] || 'Student';
  const accent = theme.palette.primary.main;           // #2E9EBF
  const accentAlpha = (a: number) => `rgba(46, 158, 191, ${a})`;

  const drawerBg = isDark ? '#0e0e0e' : '#ffffff';
  const drawerBorder = accentAlpha(0.12);
  const textMuted = theme.palette.text.secondary;
  const textPrimary = theme.palette.text.primary;

  const isAdmin = auth?.user?.roles?.some((role: string) => ['Admin', 'SuperAdmin'].includes(role));
  const isRider = auth?.user?.roles?.some((role: string) => ['Rider'].includes(role));
  const isBusinessOwner = auth?.user?.roles?.some((role: string) => ['BusinessOwner', 'Business'].includes(role));

  const navItems = [
    { icon: HomeIcon,          label: 'Home',             id: 'home',          path: '/home' },
    ...(isAdmin ? [{ icon: AdminIcon, label: 'Admin Console', id: 'admin', path: '/admin-home' }] : []),
    ...(isRider ? [{ icon: BikeIcon, label: 'Rider Console', id: 'rider', path: '/rider-home' }] : []),
    ...(isBusinessOwner ? [{ icon: StoreIcon, label: 'Business Console', id: 'business', path: '/business-owner-home' }] : []),
    { icon: FoodIcon,          label: 'Food',             id: 'food',          path: '/food' },
    { icon: TransportIcon,     label: 'Transport',        id: 'transport',     path: '/transport' },
    { icon: BikeIcon,          label: 'Rides',            id: 'rides',         path: '/rides' },
    { icon: JobsIcon,          label: 'Jobs',             id: 'jobs',          path: '/jobs' },
    { icon: AccommodationIcon, label: 'Accommodation',    id: 'accommodation', path: '/accommodation' },
    { icon: GiftIcon,          label: 'Gifts',     id: 'gifts',         path: '/gifts' },
    { icon: OffersIcon,        label: 'Deals and Offers', id: 'offers',        path: '/deals' },
  ];

  const renderDrawerContent = (expanded: boolean) => (
    <>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: expanded ? 'space-between' : 'center',
            px: expanded ? 2.5 : 1,
            height: 70,
            borderBottom: `1px solid ${accentAlpha(0.1)}`,
            flexShrink: 0,
          }}
        >
          {expanded && (
            <Box sx={{ opacity: expanded ? 1 : 0, transition: 'opacity 0.2s ease' }}>
              <Typography
                variant="h6"
                sx={{ color: accent, fontWeight: 800, fontStyle: 'italic', lineHeight: 1.1, fontSize: '1.1rem' }}
              >
                NearU
              </Typography>
              <Typography variant="caption" sx={{ color: accentAlpha(0.55), fontSize: '0.65rem' }}>
                Uni Life Assistant
              </Typography>
            </Box>
          )}
          <IconButton
            onClick={toggleSidebar}
            size="small"
            sx={{
              display: { xs: 'none', md: 'inline-flex' },
              color: accentAlpha(0.7),
              bgcolor: accentAlpha(0.07),
              borderRadius: '9px',
              width: 34, height: 34,
              '&:hover': { bgcolor: accentAlpha(0.15), color: accent },
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
          >
            {isExpanded ? <CloseIcon sx={{ fontSize: 16 }} /> : <MenuIcon sx={{ fontSize: 18 }} />}
          </IconButton>
          {/* Mobile close button inside the sliding drawer */}
          <IconButton
            onClick={toggleMobileSidebar}
            size="small"
            sx={{
              display: { xs: 'inline-flex', md: 'none' },
              color: accentAlpha(0.7),
              bgcolor: accentAlpha(0.07),
              borderRadius: '9px',
              width: 34, height: 34,
              '&:hover': { bgcolor: accentAlpha(0.15), color: accent },
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        {/* Nav Items */}
        <List sx={{ px: 1, pt: 1.5, pb: 1, flex: 1 }}>
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <ListItem key={item.id} disablePadding sx={{ display: 'block', mb: 0.5 }}>
                <Tooltip title={!expanded ? item.label : ''} placement="right" arrow>
                  <ListItemButton
                    onClick={() => {
                        navigate(item.path);
                        if (isMobileOpen) toggleMobileSidebar();
                    }}
                    sx={{
                      minHeight: 44,
                      justifyContent: expanded ? 'flex-start' : 'center',
                      px: expanded ? 1.75 : 1.25,
                      borderRadius: '11px',
                      bgcolor: isActive ? accentAlpha(0.12) : 'transparent',
                      color: isActive ? accent : textMuted,
                      borderLeft: isActive ? `3px solid ${accent}` : '3px solid transparent',
                      '&:hover': {
                        bgcolor: isActive ? accentAlpha(0.18) : accentAlpha(0.05),
                        color: isActive ? accent : textPrimary,
                      },
                      transition: 'all 0.18s ease',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: expanded ? 1.5 : 'auto',
                        color: 'inherit',
                        transition: 'margin 0.28s ease',
                      }}
                    >
                      <item.icon sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      sx={{
                        opacity: expanded ? 1 : 0,
                        width: expanded ? 'auto' : 0,
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        transition: 'opacity 0.2s ease, width 0.28s ease',
                        '& .MuiTypography-root': {
                          fontSize: '0.865rem',
                          fontWeight: isActive ? 700 : 500,
                        },
                      }}
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>

        {/* User at bottom */}
        <Box sx={{ p: 1, pb: 2, mt: 'auto' }}>
          <ListItemButton
            component={Link}
            to="/profile"
            onClick={() => { if (isMobileOpen) toggleMobileSidebar(); }}
            sx={{
              py: 1.25,
              px: expanded ? 2 : 1.25,
              borderRadius: '11px',
              border: `1px solid ${accentAlpha(0.15)}`,
              bgcolor: accentAlpha(0.04),
              justifyContent: expanded ? 'flex-start' : 'center',
              alignItems: 'center',
              '&:hover': { bgcolor: accentAlpha(0.1), borderColor: accentAlpha(0.3) },
              transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <Avatar
              src={auth?.user?.profilePictureUrl}
              sx={{ 
                width: 32, 
                height: 32, 
                bgcolor: accent, 
                color: '#111', 
                mr: expanded ? 1.5 : 0, 
                transition: 'margin 0.28s cubic-bezier(0.4, 0, 0.2, 1)', 
                flexShrink: 0 
              }}
            >
              {!auth?.user?.profilePictureUrl && <UserIcon sx={{ fontSize: 17 }} />}
            </Avatar>
            <Box
              sx={{
                opacity: expanded ? 1 : 0,
                width: expanded ? 'auto' : 0,
                minWidth: 0,
                flex: expanded ? 1 : 0,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'opacity 0.28s ease, width 0.28s ease, flex 0.28s ease',
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 700, 
                  color: textPrimary, 
                  fontSize: '0.82rem',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {userName}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: accentAlpha(0.6), 
                  fontSize: '0.68rem',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                View Profile
              </Typography>
            </Box>
          </ListItemButton>
        </Box>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { md: isExpanded ? DRAWER_WIDTH : COLLAPSED_WIDTH },
        flexShrink: { md: 0 },
        transition: 'width 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
      }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={isMobileOpen}
        onClose={toggleMobileSidebar}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: drawerBg,
            borderRight: `1px solid ${drawerBorder}`,
            overflowX: 'hidden',
            overflowY: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            transition: 'background-color 0.25s ease',
          },
        }}
      >
        {renderDrawerContent(true)}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: isExpanded ? DRAWER_WIDTH : COLLAPSED_WIDTH,
            boxSizing: 'border-box',
            bgcolor: drawerBg,
            borderRight: `1px solid ${drawerBorder}`,
            transition: 'width 0.28s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.25s ease',
            overflowX: 'hidden',
            overflowY: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          },
        }}
      >
        {renderDrawerContent(isExpanded)}
      </Drawer>
    </Box>
  );
}