import { PageLayout } from '../../components/layout/PageLayout';
import { Sidebar } from '../../components/layout/Sidebar';
import useAuth from '../../hooks/useAuth';

export default function Profile() {
  const { auth } = useAuth();
  
  return (
    <div className="min-h-screen w-full relative bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Sidebar activeSection="profile" />
      <PageLayout>
        <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-2xl border-b-2 border-yellow-400/20 px-8 py-5 flex justify-between">
           <h1 className="text-xl text-white">My Profile</h1>
        </header>
        <div className="p-8">
          <h2 className="text-3xl text-yellow-400">Profile Settings</h2>
          <p className="text-gray-400 mt-4">Email: {auth?.user?.email || 'Not available'}</p>
        </div>
      </PageLayout>
    </div>
  );
}