
import { Link } from 'react-router';
import useAuth from '../../hooks/useAuth';
import { useSidebar } from '../../context/SidebarContext';
import { useNearUTheme } from '../../context/ThemeContext';

// MUI Components
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Box,
  Avatar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';

// MUI Icons
import {
  Notifications as BellIcon,
  Person as UserIcon,
  Work as WorkIcon,
  Menu as MenuIcon,
  WbSunny as SunIcon,
  NightlightRound as MoonIcon,
} from '@mui/icons-material';

export default function Navbar() {
  const { auth } = useAuth();
  const { isExpanded, toggleMobileSidebar } = useSidebar();
  const { isDark, toggleTheme } = useNearUTheme();
  const theme = useTheme();

  const accent = theme.palette.primary.main;          // #2E9EBF
  const accentAlpha = (a: number) => `rgba(46, 158, 191, ${a})`;

  return (
    <AppBar
      position="sticky"
      sx={{
        width: '100%',
        bgcolor: isDark ? 'rgba(17, 17, 17, 0.75)' : 'rgba(245, 245, 242, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${accentAlpha(0.15)}`,
        boxShadow: isDark ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 4px 20px rgba(0,0,0,0.08)',
        zIndex: 10,
        transition: 'background-color 0.25s ease, box-shadow 0.25s ease',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 }, minHeight: '64px !important', gap: 2 }}>

        {/* Left: Logo wordmark */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
          {/* Hamburger Menu (Mobile Only) */}
          <IconButton
            onClick={toggleMobileSidebar}
            edge="start"
            sx={{
              display: { xs: 'flex', md: 'none' },
              color: theme.palette.text.secondary,
              mr: 1,
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            sx={{
              width: 34,
              height: 34,
              bgcolor: accent,
              backgroundImage: `linear-gradient(135deg, ${accentAlpha(0.8)} 0%, ${accent} 60%, #008e76 100%)`,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 14px ${accentAlpha(0.35)}`,
              flexShrink: 0,
            }}
          >
            <WorkIcon sx={{ color: '#111111', fontSize: 18 }} />
          </Box>
          <Typography
            sx={{
              color: accent,
              fontWeight: 800,
              fontStyle: 'italic',
              fontSize: '1.15rem',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            NearU
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Right: Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>

          {/* Theme Toggle */}
          <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton
              onClick={toggleTheme}
              id="theme-toggle-btn"
              aria-label="Toggle theme"
              sx={{
                color: theme.palette.text.secondary,
                borderRadius: '10px',
                transition: 'color 0.2s ease',
                '&:hover': { color: accent, bgcolor: accentAlpha(0.08) },
              }}
            >
              {isDark ? <SunIcon sx={{ fontSize: 20 }} /> : <MoonIcon sx={{ fontSize: 20 }} />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              sx={{
                color: theme.palette.text.secondary,
                borderRadius: '10px',
                '&:hover': { color: accent, bgcolor: accentAlpha(0.08) },
              }}
            >
              <Badge
                badgeContent={3}
                sx={{
                  '& .MuiBadge-badge': {
                    bgcolor: accent,
                    color: '#111111',
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    minWidth: 17,
                    height: 17,
                  },
                }}
              >
                <BellIcon sx={{ fontSize: 21 }} />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Profile */}
          <Tooltip title="Profile">
            <IconButton
              component={Link}
              to="/profile"
              sx={{ p: 0.5, ml: 0.5, '&:hover': { opacity: 0.85 } }}
            >
              <Avatar
                src={auth?.user?.profilePictureUrl}
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: accentAlpha(0.15),
                  border: `1.5px solid ${accentAlpha(0.4)}`,
                  color: accent,
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              >
                {!auth?.user?.profilePictureUrl && <UserIcon sx={{ fontSize: 18 }} />}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}