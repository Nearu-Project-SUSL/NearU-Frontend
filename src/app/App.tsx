import { RouterProvider } from 'react-router';
import { router } from './routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SidebarProvider } from './context/SidebarContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useNearUTheme } from './context/ThemeContext';
import { Toaster } from 'sonner';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Analytics } from '@vercel/analytics/react';
import { useMemo } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// ─── Inner App — consumes ThemeContext to build a dynamic MUI theme ───────────
function MuiThemeWrapper({ children }: { children: React.ReactNode }) {
  const { isDark } = useNearUTheme();

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDark ? 'dark' : 'light',
          primary: {
            main: '#2E9EBF',
            contrastText: '#ffffff',
          },
          background: {
            default: isDark ? '#111111' : '#f5f5f2',
            paper: isDark ? '#1a1a1a' : '#ffffff',
          },
          text: {
            primary: isDark ? '#ffffff' : '#111111',
            secondary: isDark ? '#888888' : '#666666',
          },
          divider: isDark ? '#2e2e2e' : '#e0ddd7',
        },
        typography: {
          fontFamily: '"Inter", "system-ui", "-apple-system", "sans-serif"',
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: '0.75rem',
                textTransform: 'none',
                fontWeight: 600,
              },
              containedPrimary: {
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#1a7a9a',
                },
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: '0.75rem',
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none', // Prevent MUI's default gradient on Paper in dark mode
              },
            },
          },
        },
      }),
    [isDark]
  );

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  // Ensure devtools only show up in development environment AND on a local machine (localhost/local IP)
  const showDevtools =
    import.meta.env.DEV &&
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '[::1]' ||
      window.location.hostname.startsWith('192.168.') ||
      window.location.hostname.startsWith('10.') ||
      window.location.hostname.endsWith('.local'));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <MuiThemeWrapper>
            <SidebarProvider>
              <RouterProvider router={router} />
              <Toaster
                position="top-right"
                expand={false}
                richColors
                toastOptions={{
                  style: {
                    background: 'rgba(0, 0, 0, 0.9)',
                    border: '1px solid rgba(46, 158, 191, 0.3)',
                    color: 'white',
                  },
                }}
              />
            </SidebarProvider>
          </MuiThemeWrapper>
        </ThemeProvider>
      </AuthProvider>
      {showDevtools && <ReactQueryDevtools initialIsOpen={false} />}
      <Analytics />
    </QueryClientProvider>
  );
}