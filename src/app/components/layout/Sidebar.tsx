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
  Divider,
  Tooltip
} from '@mui/material';

// MUI Icons
import {
  Home as HomeIcon,
  Restaurant as FoodIcon,
  DirectionsBus as BusIcon,
  DirectionsBike as BikeIcon,
  Work as BriefcaseIcon,
  Business as BuildingIcon,
  CardGiftcard as GiftIcon,
  LocalOffer as TagIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
  Person as UserIcon,
  ChevronLeft as ChevronLeftIcon
} from '@mui/icons-material';

interface SidebarProps {
  activeSection?: string;
}

export function Sidebar({ activeSection }: SidebarProps) {
  const { isExpanded, toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  const navItems = [
    { icon: HomeIcon, label: 'Home', id: 'home', path: '/home' },
    { icon: FoodIcon, label: 'Food', id: 'food', path: '/food' },
    { icon: BusIcon, label: 'Transport', id: 'transport', path: '/transport' },
    { icon: BikeIcon, label: 'Rides', id: 'rides', path: '/rides' },
    { icon: BriefcaseIcon, label: 'Jobs', id: 'jobs', path: '/jobs' },
    { icon: BuildingIcon, label: 'Accommodation', id: 'accommodation', path: '/accommodation' },
    { icon: GiftIcon, label: 'Custom Gifts', id: 'gifts', path: '/gifts' },
    { icon: TagIcon, label: 'Deals and Offers', id: 'offers', path: '/deals' },
  ];

  const drawerWidth = 240;
  const collapsedWidth = 80;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isExpanded ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isExpanded ? drawerWidth : collapsedWidth,
          boxSizing: 'border-box',
          bgcolor: '#111827',
          backgroundImage: 'linear-gradient(to bottom, #111827, #000000)',
          borderRight: '2px solid rgba(250, 204, 21, 0.2)',
          transition: 'all 0.5s ease-in-out',
          overflowX: 'hidden',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: isExpanded ? 'space-between' : 'center', 
        px: 2, 
        height: 80, 
        borderBottom: '1px solid rgba(250, 204, 21, 0.2)' 
      }}>
        {isExpanded && (
          <Box sx={{ animation: 'fadeIn 0.3s' }}>
            <Typography variant="h6" sx={{ color: '#facc15', fontWeight: 'bold', lineHeight: 1 }}>NearU</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(250, 204, 21, 0.7)' }}>Uni Life Assistant</Typography>
          </Box>
        )}
        <IconButton 
          onClick={toggleSidebar}
          sx={{ 
            bgcolor: 'rgba(250, 204, 21, 0.1)', 
            color: '#facc15',
            '&:hover': { bgcolor: 'rgba(250, 204, 21, 0.2)' }
          }}
        >
          {isExpanded ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      {/* Navigation Items */}
      <List sx={{ px: 1.5, py: 2 }}>
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <ListItem key={item.id} disablePadding sx={{ display: 'block', mb: 0.5 }}>
              <Tooltip title={!isExpanded ? item.label : ""} placement="right">
                <ListItemButton
                  onClick={() => {
                    if (item.path) {
                      navigate(item.path);
                    }
                  }}
                  sx={{
                    minHeight: 48,
                    justifyContent: isExpanded ? 'flex-start' : 'center',
                    px: 2.5,
                    borderRadius: '0.75rem',
                    bgcolor: isActive ? 'rgba(250, 204, 21, 0.15)' : 'transparent',
                    color: isActive ? '#facc15' : 'rgba(250, 204, 21, 0.7)',
                    '&:hover': {
                      bgcolor: 'rgba(250, 204, 21, 0.1)',
                      color: '#facc15',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isExpanded ? 2 : 'auto',
                      justifyContent: 'center',
                      color: 'inherit',
                    }}
                  >
                    <item.icon />
                  </ListItemIcon>
                  {isExpanded && (
                    <ListItemText 
                      primary={item.label} 
                      sx={{ 
                        opacity: isExpanded ? 1 : 0,
                        '& .MuiTypography-root': { fontSize: '0.875rem', fontWeight: isActive ? 600 : 400 }
                      }} 
                    />
                  )}
                  {isActive && (
                    <Box sx={{ 
                      position: 'absolute', 
                      left: 0, 
                      top: '20%', 
                      height: '60%', 
                      width: 4, 
                      bgcolor: '#facc15', 
                      borderRadius: '0 4px 4px 0' 
                    }} />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      {/* User Account at bottom */}
      <Box sx={{ mt: 'auto', p: 2, pb: 4 }}>
        <ListItemButton
          component={Link}
          to="/profile"
          sx={{
            p: 1,
            borderRadius: '0.75rem',
            border: '1px solid rgba(250, 204, 21, 0.2)',
            bgcolor: activeSection === 'profile' ? 'rgba(250, 204, 21, 0.15)' : 'rgba(250, 204, 21, 0.05)',
            justifyContent: isExpanded ? 'flex-start' : 'center',
            '&:hover': { bgcolor: 'rgba(250, 204, 21, 0.1)', borderColor: 'rgba(250, 204, 21, 0.4)' },
          }}
        >
          <Avatar 
            sx={{ 
              width: 36, 
              height: 36, 
              bgcolor: '#facc15', 
              color: 'black',
              mr: isExpanded ? 1.5 : 0
            }}
          >
            <UserIcon fontSize="small" />
          </Avatar>
          {isExpanded && (
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'white', noWrap: true }}>
                Student Name
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(250, 204, 21, 0.6)', display: 'block' }}>
                View Profile
              </Typography>
            </Box>
          )}
        </ListItemButton>
      </Box>
    </Drawer>
  );
}