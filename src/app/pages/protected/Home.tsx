import { PageLayout } from '../../components/layout/PageLayout';
import { Sidebar } from '../../components/layout/Sidebar';
import { NotificationDropdown } from '../../components/layout/NotificationDropdown';
import useAuth from '../../hooks/useAuth';

export default function Home() {
  const { auth } = useAuth();
  
  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Sidebar activeSection="home" />
      <PageLayout>
        <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-2xl border-b-2 border-yellow-400/20 px-8 py-5 flex justify-between">
           <h1 className="text-xl text-white">Student Dashboard</h1>
           {/* NotificationDropdown is missing? Wait, it was in components. Did I move it? */}
        </header>
        <div className="p-8">
          <h2 className="text-3xl text-yellow-400">Welcome back, {auth?.user?.email || 'User'}!</h2>
          <p className="text-gray-400 mt-4">You have successfully logged in as a Student.</p>
        </div>
      </PageLayout>
    </div>
  );
}