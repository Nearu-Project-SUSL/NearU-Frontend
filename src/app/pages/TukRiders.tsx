import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { PageLayout } from '../components/PageLayout';
import { MapPin, Star, Phone, ArrowLeft, X } from 'lucide-react';
import { Link } from 'react-router';
import { NotificationDropdown } from '../components/NotificationDropdown';
import userAvatar from 'figma:asset/902c55af84906a0971d3584133214377bc973536.png';

interface TukDriver {
  id: string;
  name: string;
  location: string;
  vehicle: string;
  vehicleNumber: string;
  image: string;
  rating: number;
  phone: string;
}

export default function TukRiders() {
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<TukDriver | null>(null);

  const tukDrivers: TukDriver[] = [
    {
      id: 'tk1',
      name: 'Ravi kumara',
      location: 'Pambahinna Area',
      vehicle: 'Red Tuk',
      vehicleNumber: 'ABY-4565',
      image: 'https://images.unsplash.com/photo-1742282302396-7d843909555c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dWslMjB0dWslMjB0aHJlZSUyMHdoZWVsZXIlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzE1OTkxODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.8,
      phone: '+94 77 123 4567'
    },
    {
      id: 'tk2',
      name: 'Sunil Shantha',
      location: 'Campus MainGate',
      vehicle: 'Green Tuk',
      vehicleNumber: 'XYZ-7890',
      image: 'https://images.unsplash.com/photo-1740920508508-2009d8c67ed5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvJTIwcmlja3NoYXclMjBncmVlbiUyMGFzaWF8ZW58MXx8fHwxNzcxNTk5MTgxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.9,
      phone: '+94 77 234 5678'
    },
    {
      id: 'tk3',
      name: 'Suresh Perera',
      location: 'Y Junction',
      vehicle: 'Red Tuk',
      vehicleNumber: 'LMN-3456',
      image: 'https://images.unsplash.com/photo-1742282302396-7d843909555c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dWslMjB0dWslMjB0aHJlZSUyMHdoZWVsZXIlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzE1OTkxODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.7,
      phone: '+94 77 345 6789'
    },
    {
      id: 'tk4',
      name: 'Kamal Silva',
      location: 'Faculty Junction',
      vehicle: 'Yellow Tuk',
      vehicleNumber: 'PQR-5678',
      image: 'https://images.unsplash.com/photo-1742282302396-7d843909555c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dWslMjB0dWslMjB0aHJlZSUyMHdoZWVsZXIlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzE1OTkxODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.6,
      phone: '+94 77 456 7890'
    },
    {
      id: 'tk5',
      name: 'Nuwan Fernando',
      location: 'Library Area',
      vehicle: 'Green Tuk',
      vehicleNumber: 'DEF-9012',
      image: 'https://images.unsplash.com/photo-1740920508508-2009d8c67ed5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvJTIwcmlja3NoYXclMjBncmVlbiUyMGFzaWF8ZW58MXx8fHwxNzcxNTk5MTgxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.8,
      phone: '+94 77 567 8901'
    },
    {
      id: 'tk6',
      name: 'Prasad Gunasekara',
      location: 'Sports Complex',
      vehicle: 'Red Tuk',
      vehicleNumber: 'GHI-2345',
      image: 'https://images.unsplash.com/photo-1742282302396-7d843909555c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dWslMjB0dWslMjB0aHJlZSUyMHdoZWVsZXIlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzE1OTkxODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.9,
      phone: '+94 77 678 9012'
    },
    {
      id: 'tk7',
      name: 'Anil Bandara',
      location: 'Hostel Area',
      vehicle: 'Green Tuk',
      vehicleNumber: 'JKL-6789',
      image: 'https://images.unsplash.com/photo-1740920508508-2009d8c67ed5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvJTIwcmlja3NoYXclMjBncmVlbiUyMGFzaWF8ZW58MXx8fHwxNzcxNTk5MTgxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.7,
      phone: '+94 77 789 0123'
    },
    {
      id: 'tk8',
      name: 'Chaminda Jayasinghe',
      location: 'Canteen Area',
      vehicle: 'Yellow Tuk',
      vehicleNumber: 'RST-4567',
      image: 'https://images.unsplash.com/photo-1742282302396-7d843909555c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dWslMjB0dWslMjB0aHJlZSUyMHdoZWVsZXIlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzE1OTkxODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.8,
      phone: '+94 77 890 1234'
    },
    {
      id: 'tk9',
      name: 'Dilshan Rajapaksa',
      location: 'Admin Building',
      vehicle: 'Red Tuk',
      vehicleNumber: 'UVW-8901',
      image: 'https://images.unsplash.com/photo-1742282302396-7d843909555c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dWslMjB0dWslMjB0aHJlZSUyMHdoZWVsZXIlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzE1OTkxODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.6,
      phone: '+94 77 901 2345'
    }
  ];

  const handleCallDriver = (driver: TukDriver) => {
    setSelectedDriver(driver);
    setShowCallModal(true);
  };

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
              <Link 
                to="/transport"
                className="w-12 h-12 bg-yellow-400/10 hover:bg-yellow-400/20 rounded-xl flex items-center justify-center transition-all hover:scale-110 duration-300 border border-yellow-400/20 group"
              >
                <ArrowLeft className="w-5 h-5 text-yellow-400 group-hover:-translate-x-1 transition-transform duration-300" />
              </Link>

              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🛺</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl text-white">Tuk Riders</h1>
                <p className="text-yellow-400/70 text-sm">Quick rides around campus</p>
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
            <div className="mb-12 animate-fadeIn">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h2 className="text-5xl text-white mb-3">
                    Available <span className="text-yellow-400">Tuk Riders</span>
                  </h2>
                  <p className="text-xl text-gray-400 max-w-2xl">
                    Reliable and trusted tuk tuk drivers around campus and town. Call directly for quick rides.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 border-2 border-yellow-400/20 rounded-2xl p-6">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🚦</div>
                    <p className="text-yellow-400 text-lg font-medium">{tukDrivers.length} Drivers</p>
                    <p className="text-gray-400 text-sm">Available Now</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Banner */}
            <div className="mb-12 bg-gradient-to-r from-yellow-400/10 via-yellow-500/5 to-yellow-400/10 border-l-4 border-yellow-400 rounded-xl p-6 animate-slideUp">
              <div className="flex items-start gap-4">
                <div className="text-3xl">💡</div>
                <div>
                  <h3 className="text-white text-lg font-medium mb-2">How it works</h3>
                  <p className="text-gray-400">
                    Browse through our verified tuk riders, check their location, and call them directly. 
                    All drivers are trusted members of the campus community with verified credentials.
                  </p>
                </div>
              </div>
            </div>

            {/* Tuk Driver Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tukDrivers.map((driver, index) => (
                <div
                  key={driver.id}
                  className="group bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 hover:border-yellow-400/40 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/10 animate-slideUp"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  {/* Tuk Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={driver.image}
                      alt={driver.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                    
                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-2 rounded-xl border border-yellow-400/30">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-white font-medium">{driver.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                      {driver.name}
                    </h3>
                    
                    <div className="space-y-2 mb-5">
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                        <span className="text-sm">{driver.location}</span>
                      </div>
                      <p className="text-yellow-400/80 text-sm">
                        {driver.vehicle} • {driver.vehicleNumber}
                      </p>
                    </div>

                    <button 
                      onClick={() => handleCallDriver(driver)}
                      className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group/btn"
                    >
                      <Phone className="w-5 h-5 group-hover/btn:rotate-12 transition-transform duration-300" />
                      <span className="font-medium">Call Now</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Info Cards */}
            <div className="mt-16 grid md:grid-cols-3 gap-6 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <div className="bg-gradient-to-br from-green-600/10 to-green-700/10 border-2 border-green-500/20 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-3">✅</div>
                <h4 className="text-xl text-white mb-2">Verified Drivers</h4>
                <p className="text-gray-400 text-sm">All drivers are background-checked and verified by the university</p>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 border-2 border-yellow-400/20 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-3">📍</div>
                <h4 className="text-xl text-white mb-2">Local Knowledge</h4>
                <p className="text-gray-400 text-sm">Drivers know all the best routes around campus and town</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-600/10 to-blue-700/10 border-2 border-blue-500/20 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-3">💰</div>
                <h4 className="text-xl text-white mb-2">Fair Pricing</h4>
                <p className="text-gray-400 text-sm">Student-friendly rates with no hidden charges</p>
              </div>
            </div>
          </div>
        </section>
      </PageLayout>

      {/* Call Driver Modal */}
      {showCallModal && selectedDriver && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-400/30 rounded-2xl shadow-2xl shadow-yellow-500/20 w-full max-w-md overflow-hidden animate-slideUp">
            {/* Header */}
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-black">Call Driver</h3>
              <button 
                className="w-8 h-8 bg-black/20 hover:bg-black/30 rounded-lg flex items-center justify-center transition-colors" 
                onClick={() => setShowCallModal(false)}
              >
                <X className="w-5 h-5 text-black" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Driver Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <img 
                    src={selectedDriver.image}
                    alt={selectedDriver.name}
                    className="w-20 h-20 object-cover rounded-xl border-2 border-yellow-400/50"
                  />
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-black px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-black" />
                    {selectedDriver.rating.toFixed(1)}
                  </div>
                </div>
                
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-1">{selectedDriver.name}</h4>
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                    <MapPin className="w-4 h-4 text-yellow-400" />
                    <span>{selectedDriver.location}</span>
                  </div>
                  <p className="text-yellow-400/80 text-sm">
                    {selectedDriver.vehicle} • {selectedDriver.vehicleNumber}
                  </p>
                </div>
              </div>

              {/* Phone Number Display */}
              <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-4 mb-6">
                <p className="text-gray-400 text-sm mb-1">Phone Number</p>
                <p className="text-white text-xl font-mono">{selectedDriver.phone}</p>
              </div>

              {/* Call Button */}
              <button
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black shadow-xl shadow-yellow-500/40 rounded-xl flex items-center justify-center gap-3 text-lg font-bold transition-all hover:scale-105 duration-300"
                onClick={() => {
                  window.open(`tel:${selectedDriver.phone}`, '_self');
                  setShowCallModal(false);
                }}
              >
                <Phone className="w-6 h-6" />
                <span>Call {selectedDriver.name}</span>
              </button>

              {/* Cancel Button */}
              <button
                className="w-full mt-3 py-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all duration-300"
                onClick={() => setShowCallModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}