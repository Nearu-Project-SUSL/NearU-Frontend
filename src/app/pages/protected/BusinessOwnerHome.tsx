import { PageLayout } from '../../components/layout/PageLayout';
import { Sidebar } from '../../components/layout/Sidebar';
import useAuth from '../../hooks/useAuth';

export default function BusinessOwnerHome() {
  const { auth } = useAuth();
  
  return (
    <div className="min-h-screen w-full relative bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Sidebar activeSection="home" />
      <PageLayout>
        <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-2xl border-b-2 border-yellow-400/20 px-8 py-5 flex justify-between">
           <h1 className="text-xl text-white">Business Portal</h1>
        </header>
        <div className="p-8">
          <h2 className="text-3xl text-yellow-500">Welcome Business Partner, {auth?.user?.email || 'User'}!</h2>
          <p className="text-gray-400 mt-4">Manage your listings and sales here.</p>
        </div>
      </PageLayout>
    </div>
  );
}