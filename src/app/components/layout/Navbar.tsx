
import { Link, useNavigate } from 'react-router';
import useAuth from '../../hooks/useAuth';
import { useSidebar } from '../../context/SidebarContext';

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
} from '@mui/material';

// MUI Icons
import {
  Notifications as BellIcon,
  Person as UserIcon,
  Work as WorkIcon,
} from '@mui/icons-material';

export default function Navbar() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const { isExpanded } = useSidebar();

  return (
    <AppBar
      position="sticky"
      sx={{
        width: '100%',
        bgcolor: 'rgba(18, 18, 18, 0.65)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(250, 204, 21, 0.15)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        zIndex: 10,
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 }, minHeight: '64px !important', gap: 2 }}>

        {/* Left: Logo wordmark */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              bgcolor: '#facc15',
              backgroundImage: 'linear-gradient(135deg, #fde68a 0%, #facc15 60%, #ca8a04 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 14px rgba(250, 204, 21, 0.3)',
              flexShrink: 0,
            }}
          >
            <WorkIcon sx={{ color: '#1a0a00', fontSize: 18 }} />
          </Box>
          <Typography
            sx={{
              color: '#facc15',
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
          <Tooltip title="Notifications">
            <IconButton
              sx={{
                color: 'rgba(255,255,255,0.5)',
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
                <BellIcon sx={{ fontSize: 21 }} />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Profile">
            <IconButton
              component={Link}
              to="/profile"
              sx={{ p: 0.5, ml: 0.5, '&:hover': { opacity: 0.85 } }}
            >
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: 'rgba(250,204,21,0.15)',
                  border: '1.5px solid rgba(250,204,21,0.35)',
                  color: '#facc15',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              >
                <UserIcon sx={{ fontSize: 18 }} />
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}