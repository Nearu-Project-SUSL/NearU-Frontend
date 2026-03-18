import { Link } from 'react-router';
import { useSidebar } from '../../context/SidebarContext';

// MUI Components
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Box,
  Avatar,
  Tooltip
} from '@mui/material';

// MUI Icons
import {
  Menu as MenuIcon,
  Notifications as BellIcon,
  Person as UserIcon,
  School as GraduationCapIcon
} from '@mui/icons-material';

export default function Navbar() {
  const { toggleSidebar } = useSidebar();

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        width: '100%',
        bgcolor: 'rgba(17, 24, 39, 0.8)', 
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(250, 204, 21, 0.2)',
        boxShadow: 'none',
        zIndex: 10
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
        {/* Left: Menu and Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            onClick={toggleSidebar}
            sx={{ 
              bgcolor: 'rgba(250, 204, 21, 0.1)', 
              color: '#facc15',
              '&:hover': { bgcolor: 'rgba(250, 204, 21, 0.2)' },
              borderRadius: '0.75rem'
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box 
            component={Link} 
            to="/home" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              textDecoration: 'none',
              '&:hover .logo-icon': { transform: 'scale(1.05)' }
            }}
          >
            <Box 
              className="logo-icon"
              sx={{ 
                width: 40, 
                height: 40, 
                bgcolor: '#facc15',
                backgroundImage: 'linear-gradient(to bottom right, #facc15, #eab308)',
                borderRadius: '0.75rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 4px 6px -1px rgba(250, 204, 21, 0.3)',
                transition: 'transform 0.3s'
              }}
            >
              <GraduationCapIcon sx={{ color: 'black' }} />
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', lineHeight: 1 }}>
                Near<Box component="span" sx={{ color: '#facc15' }}>U</Box>
              </Typography>
              <Typography variant="caption" sx={{ color: '#9ca3af' }}>Your Campus. Your Community.</Typography>
            </Box>
          </Box>
        </Box>

        {/* Right: Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          <Tooltip title="Notifications">
            <IconButton sx={{ bgcolor: 'rgba(55, 65, 81, 0.5)', color: '#d1d5db', borderRadius: '0.75rem' }}>
              <Badge badgeContent={3} color="error">
                <BellIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Profile">
            <IconButton 
              component={Link}
              to="/profile"
              sx={{ 
                bgcolor: '#facc15', 
                color: 'black',
                '&:hover': { bgcolor: '#eab308', transform: 'scale(1.05)' },
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(250, 204, 21, 0.3)',
                transition: 'all 0.3s'
              }}
            >
              <UserIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}