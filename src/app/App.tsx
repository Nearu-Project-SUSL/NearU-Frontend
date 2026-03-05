import { RouterProvider } from 'react-router';
import { router } from './routes';
import { SidebarProvider } from './context/SidebarContext';

export default function App() {
  return (
    <SidebarProvider>
      <RouterProvider router={router} />
    </SidebarProvider>
  );
}
