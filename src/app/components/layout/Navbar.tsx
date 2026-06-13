import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import useAuth from '../../hooks/useAuth';
import { useSidebar } from '../../context/SidebarContext';
import { useNearUTheme } from '../../context/ThemeContext';
import { getHomePathForRoles } from '../../utils/roleUtils';
import { NotificationPanel } from './NotificationDropdown';
import { useNotificationStore } from '../../store/notificationStore';

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
  Menu as MenuIcon,
  WbSunny as SunIcon,
  NightlightRound as MoonIcon,
} from '@mui/icons-material';

export default function Navbar() {
  const { auth } = useAuth();
  const { toggleMobileSidebar } = useSidebar();
  const { isDark, toggleTheme } = useNearUTheme();
  const theme = useTheme();

  // Live unread count from global notification store
  const unreadCount = useNotificationStore((s) => s.unreadCount());

  // Notification panel open/close
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef  = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!notifOpen) return;
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [notifOpen]);

  const getHomePath  = () => getHomePathForRoles(auth?.user?.roles);
  const accent       = theme.palette.primary.main;
  const accentAlpha  = (a: number) => `rgba(46, 158, 191, ${a})`;

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
        overflow: 'visible',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 }, minHeight: '64px !important', gap: 2, overflow: 'visible' }}>

        {/* ── Left: Logo ──────────────────────────────────────────────────── */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
          <IconButton
            onClick={toggleMobileSidebar}
            edge="start"
            sx={{ display: { xs: 'flex', md: 'none' }, color: theme.palette.text.secondary, mr: 1 }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            component={Link}
            to={getHomePath()}
            sx={{
              display: 'flex', alignItems: 'center', gap: 1.5,
              textDecoration: 'none', cursor: 'pointer',
              '&:hover': { opacity: 0.85 },
            }}
          >
            <Box component="img" src="/NearU Logo.svg" alt="NearU Logo"
              sx={{ width: 44, height: 44, objectFit: 'contain', flexShrink: 0 }} />
            <Typography sx={{
              color: accent, fontWeight: 800, fontStyle: 'italic',
              fontSize: '1.15rem', letterSpacing: '-0.02em', lineHeight: 1,
              display: { xs: 'none', sm: 'block' },
            }}>
              NearU
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* ── Right: Actions ──────────────────────────────────────────────── */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>

          {/* Theme Toggle */}
          <Tooltip title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton
              onClick={toggleTheme}
              id="theme-toggle-btn"
              aria-label="Toggle theme"
              sx={{
                color: theme.palette.text.secondary, borderRadius: '10px',
                transition: 'color 0.2s ease',
                '&:hover': { color: accent, bgcolor: accentAlpha(0.08) },
              }}
            >
              {isDark ? <SunIcon sx={{ fontSize: 20 }} /> : <MoonIcon sx={{ fontSize: 20 }} />}
            </IconButton>
          </Tooltip>

          {/* ── Notifications ─────────────────────────────────────────────
              Positioned wrapper holds both the MUI bell button AND the
              floating NotificationPanel so click-outside detection works
              reliably with a single ref.
          ──────────────────────────────────────────────────────────────── */}
          <Box ref={notifRef} sx={{ position: 'relative', display: 'inline-flex' }}>
            <Tooltip title="Notifications">
              <IconButton
                id="navbar-notification-btn"
                aria-label="Toggle notifications"
                onClick={() => setNotifOpen((o) => !o)}
                sx={{
                  color: notifOpen ? accent : theme.palette.text.secondary,
                  borderRadius: '10px',
                  bgcolor: notifOpen ? accentAlpha(0.08) : 'transparent',
                  '&:hover': { color: accent, bgcolor: accentAlpha(0.08) },
                  transition: 'all 0.2s ease',
                }}
              >
                <Badge
                  badgeContent={unreadCount}
                  max={99}
                  invisible={unreadCount === 0}
                  sx={{
                    '& .MuiBadge-badge': {
                      bgcolor: '#ef4444',
                      color: '#fff',
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

            {/* Floating panel — rendered inside the same ref box */}
            {notifOpen && (
              <Box sx={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                zIndex: 9999,
              }}>
                <NotificationPanel onClose={() => setNotifOpen(false)} />
              </Box>
            )}
          </Box>

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
                  width: 34, height: 34,
                  bgcolor: accentAlpha(0.15),
                  border: `1.5px solid ${accentAlpha(0.4)}`,
                  color: accent, fontWeight: 700, fontSize: '0.85rem',
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