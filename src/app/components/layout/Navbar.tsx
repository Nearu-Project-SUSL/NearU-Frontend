import { Bell, User, Menu } from 'lucide-react';
import { Link } from 'react-router';
import { useSidebar } from '../../context/SidebarContext';

export default function Navbar() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Menu and Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="w-10 h-10 bg-yellow-400/10 hover:bg-yellow-400/20 rounded-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            >
              <Menu className="w-5 h-5 text-yellow-400" />
            </button>
            
            <Link to="/home" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20 group-hover:scale-105 transition-transform">
                <span className="text-xl">🎓</span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-white font-bold text-lg">
                  Near<span className="text-yellow-400">U</span>
                </h1>
                <p className="text-gray-400 text-xs">Your Campus. Your Community.</p>
              </div>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button className="relative w-10 h-10 bg-gray-700/50 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95">
              <Bell className="w-5 h-5 text-gray-300" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                3
              </span>
            </button>

            <button className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg shadow-yellow-500/20">
              <User className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
