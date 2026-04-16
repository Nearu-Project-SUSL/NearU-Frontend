import { Link } from 'react-router';
import useAuth from '../../hooks/useAuth';
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
  Tooltip,
} from '@mui/material';

// MUI Icons
import {
  Notifications as BellIcon,
  School as GraduationCapIcon,
  LocationOn as LocationIcon,
  AutoAwesome as SparkleIcon,
  Person as UserIcon,
} from '@mui/icons-material';

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function Navbar() {
  const { auth } = useAuth();
  const { isExpanded } = useSidebar();

  const userName = auth?.user?.username || auth?.user?.email?.split('@')[0] || 'Student';
  const greeting = getTimeGreeting();

  return (
    <AppBar
      position="sticky"
      sx={{
        width: '100%',
        bgcolor: 'rgba(14, 14, 14, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(250, 204, 21, 0.12)',
        boxShadow: 'none',
        zIndex: 10,
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 }, minHeight: '68px !important', gap: 2 }}>
        {/* Left: Avatar + Greeting */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          {/* Logo icon */}
          <Box
            sx={{
              width: 48,
              height: 48,
              bgcolor: '#facc15',
              backgroundImage: 'linear-gradient(135deg, #fde68a 0%, #facc15 50%, #ca8a04 100%)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(250, 204, 21, 0.35)',
              flexShrink: 0,
            }}
          >
            <GraduationCapIcon sx={{ color: '#1a0a00', fontSize: 26 }} />
          </Box>

          {/* Greeting text */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Typography
                variant="h6"
                sx={{ color: '#fff', fontWeight: 600, fontSize: '1.05rem', lineHeight: 1.2 }}
              >
                {greeting},{' '}
                <Box component="span" sx={{ color: '#facc15', fontWeight: 700 }}>
                  {userName}
                </Box>
              </Typography>
              <SparkleIcon sx={{ color: '#facc15', fontSize: 18 }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
              <LocationIcon sx={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                Sabaragamuwa University
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right: Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Notifications">
            <IconButton
              sx={{
                color: 'rgba(255,255,255,0.55)',
                borderRadius: '10px',
                '&:hover': { color: '#facc15', bgcolor: 'rgba(250, 204, 21, 0.08)' },
              }}
            >
              <Badge
                badgeContent={3}
                sx={{
                  '& .MuiBadge-badge': {
                    bgcolor: '#facc15',
                    color: '#000',
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    minWidth: 17,
                    height: 17,
                  },
                }}
              >
                <BellIcon sx={{ fontSize: 22 }} />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Profile">
            <IconButton
              component={Link}
              to="/profile"
              sx={{
                p: 0.5,
                '&:hover': { opacity: 0.85 },
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: '#facc15',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                }}
              >
                <UserIcon fontSize="small" />
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}