import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { PageLayout } from '../components/PageLayout';
import { NotificationDropdown } from '../components/NotificationDropdown';
import { MapPin, Navigation, Bike, Package, Star, Phone, X, Clock, DollarSign, Target, User, Bell, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import userAvatar from 'figma:asset/902c55af84906a0971d3584133214377bc973536.png';

type RideState = 'booking' | 'searching' | 'confirmed' | 'completed';
type ServiceType = 'ride' | 'delivery';

interface Rider {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  vehicle: string;
  vehicleNumber: string;
  distanceAway?: string;
  estimatedTime?: string;
  price?: string;
}

export default function Rides() {
  const [rideState, setRideState] = useState<RideState>('booking');
  const [serviceType, setServiceType] = useState<ServiceType>('ride');
  const [pickupLocation, setPickupLocation] = useState('University Main Gate');
  const [dropoffLocation, setDropoffLocation] = useState('Y Junction Vico Mart');
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [showRiderModal, setShowRiderModal] = useState(false);

  const availableRiders: Rider[] = [
    {
      id: '1',
      name: 'Pamal Pahasara',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      rating: 4.8,
      vehicle: 'Black Yamaha',
      vehicleNumber: 'GN125 (BSG-5674)',
      distanceAway: '0.5 km',
      estimatedTime: '3 min',
      price: '$3.50'
    },
    {
      id: '2',
      name: 'John Hog',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      rating: 4.7,
      vehicle: 'Red Honda',
      vehicleNumber: 'CB150 (CAA-1234)',
      distanceAway: '0.8 km',
      estimatedTime: '5 min',
      price: '$3.80'
    },
    {
      id: '3',
      name: 'Mary Linton',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      rating: 4.9,
      vehicle: 'Blue Suzuki',
      vehicleNumber: 'GS125 (BBA-7890)',
      distanceAway: '1.2 km',
      estimatedTime: '6 min',
      price: '$4.00'
    },
    {
      id: '4',
      name: 'Micheal Scott',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      rating: 4.6,
      vehicle: 'Black TVS',
      vehicleNumber: 'Apache (CAB-4567)',
      distanceAway: '1.5 km',
      estimatedTime: '7 min',
      price: '$4.20'
    }
  ];

  const handleFindRider = () => {
    setRideState('searching');
    setTimeout(() => {
      setSelectedRider(availableRiders[0]);
      setRideState('confirmed');
    }, 3000);
  };

  const handleContactRider = (rider: Rider) => {
    setSelectedRider(rider);
    setShowRiderModal(true);
  };

  const handleCancelRide = () => {
    setRideState('booking');
    setSelectedRider(null);
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
      <Sidebar activeSection="rides" />

      {/* Main Content */}
      <PageLayout>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-2xl border-b-2 border-yellow-400/20 shadow-2xl shadow-yellow-400/5">
          <div className="flex items-center justify-between px-8 lg:px-12 py-5">
            <div className="flex items-center gap-6">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300">
                  <Bike className="w-8 h-8 text-black" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl text-white">Quick Rides</h1>
                <p className="text-yellow-400/70 text-sm">Get where you need to go</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <NotificationDropdown />
              
              <Link to="/register" className="relative group">
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
        <section className="px-8 lg:px-12 py-12 relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Left Side - Booking Form / Map */}
              <div className="lg:col-span-3">
                {/* Map Placeholder */}
                <div className="relative h-[500px] rounded-3xl overflow-hidden border-2 border-yellow-400/20 mb-6 animate-fadeIn">
                  <img 
                    src="https://images.unsplash.com/photo-1648529739495-d4d8a8abce4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXAlMjBzdHJlZXQlMjBuYXZpZ2F0aW9uJTIwZ3BzfGVufDF8fHx8MTc3MTU5ODQ3Mnww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Map"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Map Overlay Text */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-black/80 backdrop-blur-xl border-2 border-yellow-400/30 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <Navigation className="w-5 h-5 text-yellow-400" />
                        <span className="text-white">Live tracking available</span>
                      </div>
                      <p className="text-gray-400 text-sm">Track your rider in real-time once confirmed</p>
                    </div>
                  </div>
                </div>

                {/* Booking Form Card */}
                {rideState === 'booking' && (
                  <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border-2 border-yellow-400/20 rounded-3xl p-8 animate-slideUp">
                    {/* Service Type Toggle */}
                    <div className="flex gap-3 mb-8">
                      <button
                        onClick={() => setServiceType('ride')}
                        className={`flex-1 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 ${
                          serviceType === 'ride'
                            ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg shadow-yellow-500/30'
                            : 'bg-white/5 text-yellow-400 border-2 border-yellow-400/20 hover:border-yellow-400/40'
                        }`}
                      >
                        <Bike className="w-5 h-5" />
                        <span className="font-medium">Ride</span>
                      </button>
                      <button
                        onClick={() => setServiceType('delivery')}
                        className={`flex-1 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 ${
                          serviceType === 'delivery'
                            ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg shadow-yellow-500/30'
                            : 'bg-white/5 text-yellow-400 border-2 border-yellow-400/20 hover:border-yellow-400/40'
                        }`}
                      >
                        <Package className="w-5 h-5" />
                        <span className="font-medium">Delivery</span>
                      </button>
                    </div>

                    {/* Pickup Location */}
                    <div className="mb-6">
                      <label className="text-gray-400 text-sm mb-2 block">Pickup Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" />
                        <input
                          type="text"
                          value={pickupLocation}
                          onChange={(e) => setPickupLocation(e.target.value)}
                          className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-12 py-4 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                          placeholder="Enter pickup location"
                        />
                      </div>
                    </div>

                    {/* Dropoff Location */}
                    <div className="mb-8">
                      <label className="text-gray-400 text-sm mb-2 block">Destination</label>
                      <div className="relative">
                        <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" />
                        <input
                          type="text"
                          value={dropoffLocation}
                          onChange={(e) => setDropoffLocation(e.target.value)}
                          className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-12 py-4 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                          placeholder="Where to?"
                        />
                      </div>
                    </div>

                    {/* Find Rider Button */}
                    <button
                      onClick={handleFindRider}
                      className="w-full py-5 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black rounded-xl transition-all shadow-2xl shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105 duration-300 flex items-center justify-center gap-3 text-lg font-medium"
                    >
                      <Navigation className="w-6 h-6" />
                      Find Rider
                    </button>
                  </div>
                )}

                {/* Searching State */}
                {rideState === 'searching' && (
                  <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 backdrop-blur-xl border-2 border-yellow-400/30 rounded-3xl p-12 text-center animate-fadeIn">
                    <div className="relative w-32 h-32 mx-auto mb-8">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full animate-ping opacity-20"></div>
                      <div className="absolute inset-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full animate-pulse flex items-center justify-center">
                        <Target className="w-16 h-16 text-black animate-spin" style={{ animationDuration: '3s' }} />
                      </div>
                    </div>
                    <h3 className="text-3xl text-white mb-4">Finding Your Rider...</h3>
                    <p className="text-gray-400 mb-8">Please wait while we connect you with the nearest available rider</p>
                    <button
                      onClick={handleCancelRide}
                      className="px-8 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border-2 border-red-500/30 rounded-xl transition-all"
                    >
                      Cancel Request
                    </button>
                  </div>
                )}

                {/* Confirmed State */}
                {rideState === 'confirmed' && selectedRider && (
                  <div className="space-y-6 animate-slideUp">
                    {/* Status Banner */}
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-400/30 rounded-2xl p-4 flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 font-medium">Ride Confirmed</span>
                    </div>

                    {/* Rider Info Card */}
                    <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 backdrop-blur-xl border-2 border-yellow-400/30 rounded-3xl p-8">
                      <div className="text-center mb-6">
                        <p className="text-gray-400 mb-2">Estimated arrival in</p>
                        <h3 className="text-4xl text-yellow-400">5 minutes</h3>
                      </div>

                      <h2 className="text-3xl text-white mb-6 text-center">Your Rider is on the Way</h2>

                      <div className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl p-6 mb-6">
                        <div className="flex items-center gap-6 mb-6">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full blur-lg animate-pulse"></div>
                            <img
                              src={selectedRider.avatar}
                              alt={selectedRider.name}
                              className="relative w-24 h-24 rounded-full object-cover border-4 border-yellow-400/50"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-2xl text-white mb-2">{selectedRider.name}</h4>
                            <div className="flex items-center gap-2 mb-3">
                              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                              <span className="text-yellow-400 text-lg">{selectedRider.rating}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                              <Bike className="w-4 h-4" />
                              <span className="text-sm">{selectedRider.vehicleNumber}</span>
                            </div>
                          </div>
                        </div>

                        <button className="w-full py-4 bg-black hover:bg-gray-900 text-white rounded-xl transition-all flex items-center justify-center gap-3 border-2 border-yellow-400/20 hover:border-yellow-400/40">
                          <Phone className="w-5 h-5 text-green-400" />
                          <span className="text-lg">Call Rider</span>
                        </button>
                      </div>

                      {/* Trip Details */}
                      <div className="bg-white/5 rounded-2xl p-6 mb-6">
                        <h5 className="text-white mb-4 text-sm uppercase tracking-wide">Trip Details</h5>
                        <div className="space-y-4">
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Pickup</p>
                            <p className="text-white text-lg">{pickupLocation}</p>
                          </div>
                          <div className="h-px bg-yellow-400/10"></div>
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Dropoff</p>
                            <p className="text-white text-lg">{dropoffLocation}</p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleCancelRide}
                        className="w-full py-3 text-red-400 hover:text-red-300 transition-colors text-sm"
                      >
                        Cancel Ride
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side - Available Riders */}
              <div className="lg:col-span-2">
                <div className="sticky top-28">
                  <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border-2 border-yellow-400/20 rounded-3xl p-6">
                    <h3 className="text-2xl text-white mb-6">Available Riders</h3>
                    
                    <div className="space-y-4">
                      {availableRiders.map((rider, index) => (
                        <div
                          key={rider.id}
                          className="group bg-gradient-to-br from-yellow-400/10 to-transparent border-2 border-yellow-400/20 hover:border-yellow-400/40 rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] animate-slideUp cursor-pointer"
                          style={{ animationDelay: `${index * 0.1}s` }}
                          onClick={() => handleContactRider(rider)}
                        >
                          <div className="flex flex-col gap-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <h4 className="text-white text-lg mb-2 truncate">{rider.name}</h4>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <div className="flex items-center gap-1 bg-yellow-400/20 px-2.5 py-1 rounded-lg">
                                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                    <span className="text-yellow-400 text-xs font-medium">{rider.rating}</span>
                                  </div>
                                  <span className="text-gray-400 text-xs">{rider.distanceAway}</span>
                                </div>
                              </div>
                              
                              <button className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black text-sm font-medium rounded-lg transition-all shadow-lg hover:shadow-xl duration-300 whitespace-nowrap">
                                Contact
                              </button>
                            </div>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-400 pt-2 border-t border-yellow-400/10">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{rider.estimatedTime}</span>
                              </div>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-3.5 h-3.5" />
                                <span>{rider.price}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </PageLayout>

      {/* Rider Detail Modal */}
      {showRiderModal && selectedRider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative max-w-md w-full bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 backdrop-blur-xl border-2 border-yellow-400/30 rounded-3xl p-8 animate-slideUp">
            <button
              onClick={() => setShowRiderModal(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-black/40 hover:bg-black/60 rounded-xl flex items-center justify-center transition-all border border-yellow-400/20"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="text-center mb-6">
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full blur-xl animate-pulse"></div>
                <img
                  src={selectedRider.avatar}
                  alt={selectedRider.name}
                  className="relative w-32 h-32 rounded-full object-cover border-4 border-yellow-400/50"
                />
              </div>
              <h3 className="text-3xl text-white mb-3">{selectedRider.name}</h3>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 text-xl">{selectedRider.rating}</span>
              </div>
            </div>

            <div className="bg-black/40 rounded-2xl p-6 mb-6 border border-yellow-400/10">
              <h5 className="text-gray-400 text-sm mb-4">Vehicle Details</h5>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">NO:</span>
                  <span className="text-white">{selectedRider.vehicleNumber.split('(')[1]?.replace(')', '') || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Vehicle:</span>
                  <span className="text-white">{selectedRider.vehicle}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Distance:</span>
                  <span className="text-white">{selectedRider.distanceAway}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">ETA:</span>
                  <span className="text-white">{selectedRider.estimatedTime}</span>
                </div>
              </div>
            </div>

            <button className="w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black rounded-xl transition-all shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 flex items-center justify-center gap-3 text-lg font-medium hover:scale-105 duration-300">
              <Phone className="w-5 h-5 text-green-600" />
              Call Rider
            </button>
          </div>
        </div>
      )}
    </div>
  );
}