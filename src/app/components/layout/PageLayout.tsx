import { ReactNode } from 'react';
import { Box } from '@mui/material';
import { useSidebar } from '../../context/SidebarContext';
import { COLLAPSED_WIDTH, DRAWER_WIDTH } from './Sidebar';

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const { isExpanded } = useSidebar();

  return (
    <Box 
      component="main"
      sx={{ 
        flexGrow: 1, 
        ml: { xs: 0, md: `${isExpanded ? DRAWER_WIDTH : COLLAPSED_WIDTH}px` },
        width: { 
          xs: '100%',   
          md: `calc(100% - ${isExpanded ? DRAWER_WIDTH : COLLAPSED_WIDTH}px)` 
        },
        transition: 'margin-left 0.28s cubic-bezier(0.4, 0, 0.2, 1), width 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
        position: 'relative',
        overflowX: 'hidden'
      }}
    >
      {children}
    </Box>
  );
}