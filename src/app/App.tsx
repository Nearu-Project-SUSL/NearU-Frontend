import { RouterProvider } from 'react-router';
import { router } from './routes';
import { SidebarProvider } from './context/SidebarContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <RouterProvider router={router} />
        <Toaster 
          position="top-right" 
          expand={false}
          richColors
          toastOptions={{
            style: {
              background: 'rgba(0, 0, 0, 0.9)',
              border: '1px solid rgba(250, 204, 21, 0.3)',
              color: 'white',
            },
          }}
        />
      </SidebarProvider>
    </AuthProvider>
  );
}
