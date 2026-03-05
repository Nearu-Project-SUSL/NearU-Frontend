import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { PageLayout } from '../components/PageLayout';
import { Bus, Train, Bike, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { NotificationDropdown } from '../components/NotificationDropdown';
import userAvatar from 'figma:asset/902c55af84906a0971d3584133214377bc973536.png';

export default function TransportSelection() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const transportOptions = [
    {
      id: 'tuk',
      title: 'Tuk Rides',
      description: 'Instant ride-hailing for short distances. Perfect for quick trips between faculties or local hangouts.',
      image: 'https://images.unsplash.com/photo-1607607495455-cae135756707?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGlsbHVzdHJhdGVkJTIwdHVrJTIwdHVrJTIwc3RyZWV0JTIwYXJ0fGVufDF8fHx8MTc3MTU5OTU2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      buttonText: 'View Tuk Riders',
      buttonIcon: ArrowRight,
      route: '/transport/tuk',
      gradient: 'from-orange-600/20 via-yellow-600/10 to-orange-600/20'
    },
    {
      id: 'bus',
      title: 'Bus Routine',
      description: 'Accurate times on public bus services. Track arrival times to Pambahinna and plan ahead.',
      image: 'https://images.unsplash.com/photo-1642443055969-282b3416a333?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWJyYW50JTIwaWxsdXN0cmF0ZWQlMjBidXMlMjBjaXR5JTIwc3RyZWV0fGVufDF8fHx8MTc3MTU5OTU2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      buttonText: 'View Routine',
      buttonIcon: Bus,
      route: '/transport/bus',
      gradient: 'from-blue-600/20 via-yellow-600/10 to-blue-600/20'
    },
    {
      id: 'train',
      title: 'Train Routine',
      description: 'Inter-city connections and railway timings. Find the best train to get you home for the weekend.',
      image: 'https://images.unsplash.com/photo-1640687735167-b71c4734e05c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2VuaWMlMjB0cmFpbiUyMGlsbHVzdHJhdGlvbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3NzE1OTk1Njd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      buttonText: 'Check Times',
      buttonIcon: Train,
      route: '/transport/train',
      gradient: 'from-green-600/20 via-yellow-600/10 to-green-600/20'
    }
  ];

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-yellow-600/5 animate-gradient pointer-events-none"></div>
      
      {/* Animated pattern */}
      <div className="fixed inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(250, 204, 21, 0.4) 1px, transparent 0)`,
        backgroundSize: '40px 40px',
        animation: 'gridMove 30s linear infinite'
      }}></div>

      {/* Floating orbs */}
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="fixed bottom-1/4 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }}></div>

      {/* Sidebar */}
      <Sidebar activeSection="transport" />

      {/* Main Content */}
      <PageLayout>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-2xl border-b-2 border-yellow-400/20 shadow-2xl shadow-yellow-400/5">
          <div className="flex items-center justify-between px-8 lg:px-12 py-5">
            <div className="flex items-center gap-6">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🚗</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl text-white">Transport Hub</h1>
                <p className="text-yellow-400/70 text-sm">Your journey starts here</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <NotificationDropdown />
              
              <Link to="/profile" className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-yellow-400/50 group-hover:border-yellow-400 transition-all group-hover:scale-110 duration-300">
                  <img 
                    src={userAvatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <section className="px-8 lg:px-12 py-16 relative">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16 animate-fadeIn">
              <h2 className="text-5xl lg:text-6xl text-white mb-6">
                Where do you want to<br />
                <span className="text-yellow-400">go today?</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Reliable and safe travel options for students around campus and beyond.<br />
                Check schedules, book rides, and find your way.
              </p>
            </div>

            {/* Transport Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {transportOptions.map((option, index) => {
                const ButtonIcon = option.buttonIcon;
                const isHovered = hoveredCard === option.id;
                
                return (
                  <div
                    key={option.id}
                    onMouseEnter={() => setHoveredCard(option.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${option.gradient} border-2 transition-all duration-500 hover:scale-105 cursor-pointer animate-slideUp ${
                      isHovered ? 'border-yellow-400/60 shadow-2xl shadow-yellow-500/20' : 'border-yellow-400/20 hover:border-yellow-400/40'
                    }`}
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-5" style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, rgba(250, 204, 21, 0.3) 1px, transparent 0)`,
                      backgroundSize: '20px 20px'
                    }}></div>

                    {/* Image Section */}
                    <div className="relative h-80 overflow-hidden">
                      <img 
                        src={option.image}
                        alt={option.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                      
                      {/* Decorative Corner */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400/10 backdrop-blur-sm" style={{
                        clipPath: 'polygon(100% 0, 0 0, 100% 100%)'
                      }}></div>
                    </div>

                    {/* Content Section */}
                    <div className="relative p-8 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm">
                      {/* Title */}
                      <h3 className="text-3xl text-white mb-4 group-hover:text-yellow-400 transition-colors duration-300">
                        {option.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-400 text-base leading-relaxed mb-8 min-h-[80px]">
                        {option.description}
                      </p>

                      {/* Button */}
                      <button
                        onClick={() => navigate(option.route)}
                        className={`w-full py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg font-medium group/btn ${
                          isHovered
                            ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-xl shadow-yellow-500/40 scale-105'
                            : 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg hover:shadow-xl'
                        }`}
                      >
                        <span>{option.buttonText}</span>
                        <ButtonIcon className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>

                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Info Card */}
            <div className="mt-16 bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 border-2 border-yellow-400/20 rounded-3xl p-10 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-5xl mb-3">🛡️</div>
                    <h4 className="text-xl text-white mb-2">Safe & Secure</h4>
                    <p className="text-gray-400 text-sm">All transport options are verified and safe for students</p>
                  </div>
                  <div>
                    <div className="text-5xl mb-3">⚡</div>
                    <h4 className="text-xl text-white mb-2">Real-time Updates</h4>
                    <p className="text-gray-400 text-sm">Get live tracking and schedule updates instantly</p>
                  </div>
                  <div>
                    <div className="text-5xl mb-3">💰</div>
                    <h4 className="text-xl text-white mb-2">Student Friendly</h4>
                    <p className="text-gray-400 text-sm">Affordable pricing and special student discounts</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Access Links */}
            <div className="mt-12 flex flex-wrap justify-center gap-4 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
              <Link 
                to="/rides" 
                className="px-6 py-3 bg-white/5 hover:bg-yellow-400/10 border border-yellow-400/20 hover:border-yellow-400/40 rounded-xl text-yellow-400 transition-all hover:scale-105 duration-300"
              >
                Quick Ride Booking
              </Link>
              <Link 
                to="/home" 
                className="px-6 py-3 bg-white/5 hover:bg-yellow-400/10 border border-yellow-400/20 hover:border-yellow-400/40 rounded-xl text-yellow-400 transition-all hover:scale-105 duration-300"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </PageLayout>
    </div>
  );
}