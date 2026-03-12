import { RouterProvider } from 'react-router';
import { router } from './routes';
import { SidebarProvider } from './context/SidebarContext';

import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <RouterProvider router={router} />
      </SidebarProvider>
    </AuthProvider>
  );
}
