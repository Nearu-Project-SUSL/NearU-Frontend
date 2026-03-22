import { ReactNode } from 'react';
import { Box } from '@mui/material';

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <Box 
      component="main"
      sx={{ 
        flexGrow: 1, 
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