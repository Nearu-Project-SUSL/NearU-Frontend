import { useState } from 'react';
import { User, Phone, MapPin, Clock, Package, Navigation, X, Check, AlertCircle, Star, DollarSign, Bike } from 'lucide-react';
import { Link } from 'react-router';
import userAvatar from 'figma:asset/902c55af84906a0971d3584133214377bc973536.png';

interface RideRequest {
  id: string;
  type: 'ride' | 'delivery';
  studentName: string;
  studentAvatar: string;
  studentPhone: string;
  pickup: string;
  dropoff: string;
  distance: string;
  estimatedEarning: string;
  requestedTime: string;
  status: 'pending' | 'accepted' | 'declined';
  orderDetails?: string;
  rating?: number;
}

export default function RiderHome() {
  const [requests, setRequests] = useState<RideRequest[]>([
    {
      id: '1',
      type: 'ride',
      studentName: 'Kasun Perera',
      studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      studentPhone: '+94 77 123 4567',
      pickup: 'Main Campus Gate',
      dropoff: 'Belihuloya Town Center',
      distance: '3.5 km',
      estimatedEarning: 'Rs. 250',
      requestedTime: '2 mins ago',
      status: 'pending',
      rating: 4.8
    },
    {
      id: '2',
      type: 'delivery',
      studentName: 'Thimira Silva',
      studentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      studentPhone: '+94 77 234 5678',
      pickup: 'Campus Canteen',
      dropoff: 'Computing Faculty - Room 201',
      distance: '1.2 km',
      estimatedEarning: 'Rs. 150',
      requestedTime: '5 mins ago',
      status: 'pending',
      orderDetails: '2x Rice & Curry, 1x Fried Rice, 2x Drinks',
      rating: 5.0
    },
    {
      id: '3',
      type: 'ride',
      studentName: 'Manjari Fernando',
      studentAvatar: userAvatar,
      studentPhone: '+94 77 345 6789',
      pickup: 'Library',
      dropoff: 'Student Accommodation Block B',
      distance: '2.1 km',
      estimatedEarning: 'Rs. 180',
      requestedTime: '8 mins ago',
      status: 'pending',
      rating: 4.9
    },
    {
      id: '4',
      type: 'delivery',
      studentName: 'Uvindu Rathnayake',
      studentAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      studentPhone: '+94 77 456 7890',
      pickup: 'Brew & Bean Cafe',
      dropoff: 'Engineering Faculty - Lab 3',
      distance: '1.8 km',
      estimatedEarning: 'Rs. 160',
      requestedTime: '12 mins ago',
      status: 'pending',
      orderDetails: '3x Coffee, 2x Sandwich, 1x Pastry',
      rating: 4.7
    }
  ]);

  const [selectedRequest, setSelectedRequest] = useState<RideRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleAccept = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (request) {
      setRequests(prev => 
        prev.map(r => r.id === requestId ? { ...r, status: 'accepted' } : r)
      );
      setSelectedRequest(request);
      setShowDetailsModal(true);
    }
  };

  const handleDecline = (requestId: string) => {
    setRequests(prev => 
      prev.map(r => r.id === requestId ? { ...r, status: 'declined' } : r)
    );
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const acceptedRequests = requests.filter(r => r.status === 'accepted');

  const stats = [
    { label: 'Today\'s Earnings', value: 'Rs. 1,250', icon: DollarSign, color: 'from-green-500 to-green-600' },
    { label: 'Completed Rides', value: '8', icon: Bike, color: 'from-blue-500 to-blue-600' },
    { label: 'Rating', value: '4.9', icon: Star, color: 'from-yellow-500 to-yellow-600' },
    { label: 'Active Requests', value: pendingRequests.length.toString(), icon: AlertCircle, color: 'from-orange-500 to-orange-600' }
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

      {/* Main Content */}
      <div className="relative">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-2xl border-b-2 border-yellow-400/20 shadow-2xl shadow-yellow-400/5">
          <div className="flex items-center justify-between px-8 lg:px-12 py-5">
            <div className="flex items-center gap-6">
              <Link to="/rider-profile" className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-yellow-400 shadow-xl shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300">
                  <img 
                    src={userAvatar}
                    alt="Rider Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
              <div>
                <h1 className="text-2xl text-white">Rider Dashboard</h1>
                <p className="text-yellow-400/70 text-sm">Welcome back, Driver!</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-xl border border-green-500/30 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Online</span>
              </div>
              
              <Link to="/home" className="px-4 py-2 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 rounded-xl transition-all border border-yellow-400/20 hover:border-yellow-400/40 text-sm font-medium">
                Back to Home
              </Link>
            </div>
          </div>
        </header>

        {/* Stats Section */}
        <section className="px-8 lg:px-12 py-8 relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label}
                  className="relative group animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                  <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-6 hover:border-yellow-400/40 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pending Requests Section */}
        <section className="px-8 lg:px-12 py-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <AlertCircle className="w-8 h-8 text-yellow-400" />
              <div>
                <h2 className="text-2xl text-white">Available Requests</h2>
                <p className="text-gray-400 text-sm">{pendingRequests.length} new requests waiting for you</p>
              </div>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-12 text-center">
                <Navigation className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-xl text-gray-400">No pending requests at the moment</p>
                <p className="text-sm text-gray-500 mt-2">New requests will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pendingRequests.map((request, index) => (
                  <div 
                    key={request.id}
                    className="relative group animate-slideIn"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-6 hover:border-yellow-400/40 transition-all">
                      {/* Type Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${
                          request.type === 'ride' 
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                            : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        }`}>
                          {request.type === 'ride' ? <Bike className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                          {request.type === 'ride' ? 'Ride Request' : 'Delivery Request'}
                        </div>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {request.requestedTime}
                        </span>
                      </div>

                      {/* Student Info */}
                      <div className="flex items-center gap-3 mb-4">
                        <img 
                          src={request.studentAvatar}
                          alt={request.studentName}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-yellow-400/30"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">{request.studentName}</h3>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm text-yellow-400">{request.rating}</span>
                          </div>
                        </div>
                      </div>

                      {/* Order Details (for deliveries) */}
                      {request.orderDetails && (
                        <div className="mb-4 p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
                          <p className="text-xs text-gray-400 mb-1">Order Details:</p>
                          <p className="text-sm text-white">{request.orderDetails}</p>
                        </div>
                      )}

                      {/* Route Info */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-green-500/30">
                            <MapPin className="w-4 h-4 text-green-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-400">Pickup</p>
                            <p className="text-sm text-white">{request.pickup}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-red-500/30">
                            <MapPin className="w-4 h-4 text-red-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-400">Dropoff</p>
                            <p className="text-sm text-white">{request.dropoff}</p>
                          </div>
                        </div>
                      </div>

                      {/* Trip Details */}
                      <div className="flex items-center justify-between mb-4 p-3 bg-gray-800/30 rounded-xl">
                        <div className="text-center">
                          <p className="text-xs text-gray-400">Distance</p>
                          <p className="text-sm font-semibold text-white">{request.distance}</p>
                        </div>
                        <div className="w-px h-8 bg-gray-700"></div>
                        <div className="text-center">
                          <p className="text-xs text-gray-400">Earnings</p>
                          <p className="text-sm font-semibold text-green-400">{request.estimatedEarning}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleDecline(request.id)}
                          className="flex-1 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 hover:border-red-500/50 transition-all flex items-center justify-center gap-2 font-medium"
                        >
                          <X className="w-5 h-5" />
                          Decline
                        </button>
                        <button
                          onClick={() => handleAccept(request.id)}
                          className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all flex items-center justify-center gap-2 font-medium shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 duration-300"
                        >
                          <Check className="w-5 h-5" />
                          Accept
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Accepted Requests Section */}
        {acceptedRequests.length > 0 && (
          <section className="px-8 lg:px-12 py-6 pb-24 relative">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <Check className="w-8 h-8 text-green-400" />
                <div>
                  <h2 className="text-2xl text-white">Accepted Requests</h2>
                  <p className="text-gray-400 text-sm">{acceptedRequests.length} active request(s)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {acceptedRequests.map((request) => (
                  <div 
                    key={request.id}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-green-600/10 rounded-2xl blur-xl opacity-50"></div>
                    <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-green-400/30 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30">
                          ✓ Accepted
                        </div>
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowDetailsModal(true);
                          }}
                          className="text-yellow-400 hover:text-yellow-300 text-sm font-medium underline"
                        >
                          View Details
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <img 
                          src={request.studentAvatar}
                          alt={request.studentName}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-green-400/30"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-white">{request.studentName}</h3>
                          <p className="text-sm text-gray-400">{request.pickup} → {request.dropoff}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Student Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fadeIn">
          <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-400/30 rounded-3xl p-8 shadow-2xl w-full max-w-lg animate-slideUp">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 rounded-3xl" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(250, 204, 21, 0.3) 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }}></div>

            {/* Header */}
            <div className="relative flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-white">Student Details</h2>
              </div>
              <button 
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center transition-all text-gray-400 hover:text-white" 
                onClick={() => setShowDetailsModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="relative space-y-6">
              {/* Student Profile */}
              <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-2xl border border-yellow-400/20">
                <img 
                  src={selectedRequest.studentAvatar}
                  alt={selectedRequest.studentName}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-yellow-400/40"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1">{selectedRequest.studentName}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 font-medium">{selectedRequest.rating} Rating</span>
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    selectedRequest.type === 'ride' 
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                      : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  }`}>
                    {selectedRequest.type === 'ride' ? 'Ride Request' : 'Delivery Request'}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-4 bg-gray-800/50 rounded-2xl border border-yellow-400/20">
                <p className="text-sm text-gray-400 mb-3 font-medium">Contact Information</p>
                <a 
                  href={`tel:${selectedRequest.studentPhone}`}
                  className="flex items-center gap-3 p-3 bg-green-500/10 hover:bg-green-500/20 rounded-xl border border-green-500/30 hover:border-green-500/50 transition-all group"
                >
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">Phone Number</p>
                    <p className="text-white font-medium">{selectedRequest.studentPhone}</p>
                  </div>
                </a>
              </div>

              {/* Trip Details */}
              <div className="p-4 bg-gray-800/50 rounded-2xl border border-yellow-400/20">
                <p className="text-sm text-gray-400 mb-3 font-medium">Trip Details</p>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-green-500/30">
                      <MapPin className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">Pickup Location</p>
                      <p className="text-sm text-white font-medium">{selectedRequest.pickup}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-red-500/30">
                      <MapPin className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">Dropoff Location</p>
                      <p className="text-sm text-white font-medium">{selectedRequest.dropoff}</p>
                    </div>
                  </div>
                </div>

                {selectedRequest.orderDetails && (
                  <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <p className="text-xs text-gray-400 mb-2">Order Details</p>
                    <p className="text-sm text-white">{selectedRequest.orderDetails}</p>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-700/50 flex justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Distance</p>
                    <p className="text-white font-semibold">{selectedRequest.distance}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Earnings</p>
                    <p className="text-green-400 font-semibold text-lg">{selectedRequest.estimatedEarning}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <a
                  href={`tel:${selectedRequest.studentPhone}`}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all flex items-center justify-center gap-2 font-medium shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 duration-300"
                >
                  <Phone className="w-5 h-5" />
                  Call Student
                </a>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}