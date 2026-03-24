import { Link, useNavigate } from 'react-router';
import { useSidebar } from '../../context/SidebarContext';

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
  Tooltip
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
} from '@mui/icons-material';

interface SidebarProps {
  activeSection?: string;
}

const DRAWER_WIDTH = 252;
const COLLAPSED_WIDTH = 68;

export { DRAWER_WIDTH, COLLAPSED_WIDTH };

export function Sidebar({ activeSection }: SidebarProps) {
  const { isExpanded, toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  const navItems = [
    { icon: HomeIcon,          label: 'Home',             id: 'home',          path: '/home' },
    { icon: FoodIcon,          label: 'Food',             id: 'food',          path: '/food' },
    { icon: TransportIcon,     label: 'Transport',        id: 'transport',     path: '/transport' },
    { icon: BikeIcon,          label: 'Rides',            id: 'rides',         path: '/rides' },
    { icon: JobsIcon,          label: 'Jobs',             id: 'jobs',          path: '/jobs' },
    { icon: AccommodationIcon, label: 'Accommodation',    id: 'accommodation', path: '/accommodation' },
    { icon: GiftIcon,          label: 'Custom Gifts',     id: 'gifts',         path: '/gifts' },
    { icon: OffersIcon,        label: 'Deals and Offers', id: 'offers',        path: '/deals' },
  ];

  return (
    <Box
      component="nav"
      sx={{
        width: isExpanded ? DRAWER_WIDTH : COLLAPSED_WIDTH,
        flexShrink: 0,
        transition: 'width 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
      }}
    >
      <Drawer
        variant="permanent"
        sx={{
          '& .MuiDrawer-paper': {
            width: isExpanded ? DRAWER_WIDTH : COLLAPSED_WIDTH,
            boxSizing: 'border-box',
            bgcolor: '#0c0c0c',
            borderRight: '1px solid rgba(250, 204, 21, 0.1)',
            transition: 'width 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
            overflowX: 'hidden',
            overflowY: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isExpanded ? 'space-between' : 'center',
            px: isExpanded ? 2.5 : 1,
            height: 70,
            borderBottom: '1px solid rgba(250, 204, 21, 0.08)',
            flexShrink: 0,
          }}
        >
          {isExpanded && (
            <Box sx={{ opacity: isExpanded ? 1 : 0, transition: 'opacity 0.2s ease' }}>
              <Typography
                variant="h6"
                sx={{ color: '#facc15', fontWeight: 800, fontStyle: 'italic', lineHeight: 1.1, fontSize: '1.1rem' }}
              >
                NearU
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(250, 204, 21, 0.45)', fontSize: '0.65rem' }}>
                Uni Life Assistant
              </Typography>
            </Box>
          )}
          <IconButton
            onClick={toggleSidebar}
            size="small"
            sx={{
              color: 'rgba(250, 204, 21, 0.6)',
              bgcolor: 'rgba(250, 204, 21, 0.07)',
              borderRadius: '9px',
              width: 34, height: 34,
              '&:hover': { bgcolor: 'rgba(250, 204, 21, 0.14)', color: '#facc15' },
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
          >
            {isExpanded ? <CloseIcon sx={{ fontSize: 16 }} /> : <MenuIcon sx={{ fontSize: 18 }} />}
          </IconButton>
        </Box>

        {/* Nav Items */}
        <List sx={{ px: 1, pt: 1.5, pb: 1, flex: 1 }}>
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <ListItem key={item.id} disablePadding sx={{ display: 'block', mb: 0.5 }}>
                <Tooltip title={!isExpanded ? item.label : ''} placement="right" arrow>
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    sx={{
                      minHeight: 44,
                      justifyContent: isExpanded ? 'flex-start' : 'center',
                      px: isExpanded ? 1.75 : 1.25,
                      borderRadius: '11px',
                      bgcolor: isActive ? 'rgba(250, 204, 21, 0.13)' : 'transparent',
                      color: isActive ? '#facc15' : 'rgba(255,255,255,0.4)',
                      borderLeft: isActive ? '3px solid #facc15' : '3px solid transparent',
                      '&:hover': {
                        bgcolor: isActive ? 'rgba(250, 204, 21, 0.17)' : 'rgba(255,255,255,0.04)',
                        color: isActive ? '#facc15' : 'rgba(255,255,255,0.75)',
                      },
                      transition: 'all 0.18s ease',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: isExpanded ? 1.5 : 'auto',
                        color: 'inherit',
                        transition: 'margin 0.28s ease',
                      }}
                    >
                      <item.icon sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      sx={{
                        opacity: isExpanded ? 1 : 0,
                        width: isExpanded ? 'auto' : 0,
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
            sx={{
              p: 1.25,
              borderRadius: '11px',
              border: '1px solid rgba(250, 204, 21, 0.12)',
              bgcolor: 'rgba(250, 204, 21, 0.04)',
              justifyContent: isExpanded ? 'flex-start' : 'center',
              '&:hover': { bgcolor: 'rgba(250, 204, 21, 0.09)', borderColor: 'rgba(250, 204, 21, 0.25)' },
              transition: 'all 0.18s ease',
            }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#facc15', color: '#000', mr: isExpanded ? 1.25 : 0, transition: 'margin 0.28s ease', flexShrink: 0 }}>
              <UserIcon sx={{ fontSize: 17 }} />
            </Avatar>
            <Box
              sx={{
                opacity: isExpanded ? 1 : 0,
                width: isExpanded ? 'auto' : 0,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                transition: 'opacity 0.2s ease, width 0.28s ease',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#fff', fontSize: '0.82rem' }}>
                Student Name
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(250, 204, 21, 0.5)', fontSize: '0.68rem' }}>
                View Profile
              </Typography>
            </Box>
          </ListItemButton>
        </Box>
      </Drawer>
    </Box>
  );
}