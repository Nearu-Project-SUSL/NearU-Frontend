import { Home, UtensilsCrossed, Bike, Bus, Briefcase, Building2, Gift, Tag, Settings, X, GraduationCap, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useSidebar } from '../context/SidebarContext';

interface SidebarProps {
  activeSection?: string;
}

export function Sidebar({ activeSection }: SidebarProps) {
  const { isExpanded, toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: 'Home', id: 'home', path: '/home' },
    { icon: UtensilsCrossed, label: 'Food', id: 'food', path: '/food' },
    { icon: Bus, label: 'Transport', id: 'transport', path: '/transport' },
    { icon: Bike, label: 'Rides', id: 'rides', path: '/rides' },
    { icon: Briefcase, label: 'Jobs', id: 'jobs', path: '/jobs' },
    { icon: Building2, label: 'Accommodation', id: 'accommodation', path: '/accommodation' },
    { icon: Gift, label: 'Custom Gifts', id: 'gifts', path: '/gifts' },
    { icon: Tag, label: 'Deals and Offers', id: 'offers', path: '/deals' },
  ];

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-gradient-to-b from-gray-900 to-black border-r-2 border-yellow-400/20 z-40 transition-all duration-500 ease-in-out ${
        isExpanded ? 'w-56' : 'w-20'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between h-20 px-5 border-b border-yellow-400/20">
          <div className={`transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>
            <h2 className="text-yellow-400 text-xl whitespace-nowrap">NearU</h2>
            <p className="text-yellow-400/70 text-xs whitespace-nowrap">Uni Life Assistant</p>
          </div>
          
          <button
            onClick={toggleSidebar}
            className="w-8 h-8 bg-yellow-400/10 hover:bg-yellow-400/20 rounded-lg flex items-center justify-center transition-all group hover:scale-110"
          >
            <X className={`w-5 h-5 text-yellow-400 transition-transform duration-300 ${isExpanded ? 'rotate-0' : 'rotate-45'}`} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.path) {
                    navigate(item.path);
                    if (item.id !== 'home' && item.id !== 'transport') {
                      setTimeout(() => {
                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }
                  } else {
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`group relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-yellow-400/20 text-yellow-400 shadow-lg shadow-yellow-400/20'
                    : 'text-yellow-400/70 hover:bg-yellow-400/10 hover:text-yellow-400'
                }`}
              >
                <Icon className={`w-6 h-6 flex-shrink-0 transition-transform duration-300 ${
                  isActive ? 'scale-110' : 'group-hover:scale-110'
                }`} />
                
                <span className={`text-sm whitespace-nowrap transition-all duration-300 ${
                  isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute'
                }`}>
                  {item.label}
                </span>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-yellow-400 rounded-r-full animate-slideIn"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Account at bottom */}
        <div className="absolute bottom-6 left-0 right-0 px-3">
          <Link 
            to="/profile"
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full border border-yellow-400/20 hover:border-yellow-400/40 ${
              activeSection === 'profile' ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/40' : 'bg-yellow-400/5 text-yellow-400/70 hover:bg-yellow-400/10 hover:text-yellow-400'
            }`}
          >
            {/* User Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <User className="w-4.5 h-4.5 text-black" />
            </div>
            
            {/* User Info */}
            <div className={`flex flex-col justify-center transition-all duration-300 ${
              isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 absolute'
            }`}>
              <span className="text-sm font-semibold whitespace-nowrap leading-tight">
                Student Name
              </span>
              <span className="text-xs text-yellow-400/50 whitespace-nowrap leading-tight">
                View Profile
              </span>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}