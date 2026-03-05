import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { 
  ArrowLeft, MapPin, Bed, Users, Heart, Phone, Mail, Share2, 
  CheckCircle2, Star, Calendar, DollarSign, Wifi, Utensils, 
  Car, Shield, Droplet, Zap, Home, MessageCircle, Navigation
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { PageLayout } from '../components/PageLayout';
import { NotificationDropdown } from '../components/NotificationDropdown';
import userAvatar from 'figma:asset/902c55af84906a0971d3584133214377bc973536.png';

// Accommodation detail page for NearU platform
interface AccommodationDetail {
  id: string;
  name: string;
  location: string;
  fullAddress: string;
  distance: string;
  price: number;
  priceUnit: string;
  bedrooms: number;
  availableFor: string;
  facilities: string[];
  images: string[];
  rating: number;
  reviews: number;
  availableFrom: string;
  category: string;
  description: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  capacity: number;
  studentsPerRoom: number;
  rules: string[];
  amenities: { icon: string; name: string; }[];
}

const mockAccommodationDetails: Record<string, AccommodationDetail> = {
  '1': {
    id: '1',
    name: 'Nilwala Boarding House',
    location: 'Near Y Junction',
    fullAddress: 'No. 45, Y Junction Road, Belihuloya',
    distance: '0.8 km from Sabaragamuwa University',
    price: 20000,
    priceUnit: '/month',
    bedrooms: 5,
    availableFor: 'Girls Only',
    facilities: ['Attached Bathrooms', 'Water Bill Free', 'Calm Environment', '3 Students per Room', 'WiFi Included', 'Study Desks', 'Meals Available', 'Security'],
    images: [
      'https://images.unsplash.com/photo-1549881567-c622c1080d78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3N0ZWwlMjBiZWRyb29tJTIwYnVuayUyMGJlZHN8ZW58MXx8fHwxNzcxNjg3Mzc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1742094561291-069d8f61a34a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwZG9ybWl0b3J5JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzcxNTk3NTQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwYXBhcnRtZW50JTIwYmVkcm9vbXxlbnwxfHx8fDE3NzE2ODIzODV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    rating: 4.5,
    reviews: 28,
    availableFrom: '2025-12-17',
    category: 'Boarding House',
    description: 'A peaceful and secure boarding house exclusively for female students. Located in a calm neighborhood with easy access to the university. The property features well-maintained rooms with attached bathrooms, ensuring privacy and comfort. Perfect for students looking for a home away from home with all necessary amenities.',
    ownerName: 'Mrs. Nilmini Perera',
    ownerPhone: '+94 77 123 4567',
    ownerEmail: 'nilwala.boarding@gmail.com',
    capacity: 15,
    studentsPerRoom: 3,
    rules: [
      'No visitors after 8:00 PM',
      'Quiet hours: 10:00 PM - 6:00 AM',
      'Keep common areas clean',
      'No smoking or alcohol',
      'Inform before leaving overnight',
    ],
    amenities: [
      { icon: 'wifi', name: 'High-Speed WiFi' },
      { icon: 'water', name: 'Water Bill Included' },
      { icon: 'electricity', name: 'Electricity (Shared)' },
      { icon: 'security', name: '24/7 Security' },
      { icon: 'food', name: 'Meal Options Available' },
      { icon: 'parking', name: 'Bike Parking' },
    ],
  },
};

export default function AccommodationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const accommodation = mockAccommodationDetails[id || '1'] || mockAccommodationDetails['1'];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: accommodation.name,
          text: `Check out ${accommodation.name} on NearU`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getAmenityIcon = (iconName: string) => {
    switch (iconName) {
      case 'wifi': return <Wifi className="w-5 h-5" />;
      case 'water': return <Droplet className="w-5 h-5" />;
      case 'electricity': return <Zap className="w-5 h-5" />;
      case 'security': return <Shield className="w-5 h-5" />;
      case 'food': return <Utensils className="w-5 h-5" />;
      case 'parking': return <Car className="w-5 h-5" />;
      default: return <CheckCircle2 className="w-5 h-5" />;
    }
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
      <Sidebar activeSection="accommodation" />

      {/* Main Content */}
      <PageLayout>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-2xl border-b-2 border-yellow-400/20 shadow-2xl shadow-yellow-400/5">
          <div className="flex items-center justify-between px-8 lg:px-12 py-5">
            <div className="flex items-center gap-6">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300">
                  <Home className="w-7 h-7 text-black" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl text-white">Accommodation Details</h1>
                <p className="text-yellow-400/70 text-sm">Find your perfect home away from home</p>
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
        <section className="px-8 lg:px-12 py-8 relative">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => navigate('/accommodation')}
              className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-6 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Accommodations</span>
            </button>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Images and Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Image Gallery */}
                <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-3xl overflow-hidden">
                  {/* Main Image */}
                  <div className="relative h-96 overflow-hidden group">
                    <img
                      src={accommodation.images[selectedImageIndex]}
                      alt={accommodation.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    
                    {/* Image Controls */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => setIsFavorite(!isFavorite)}
                        className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-all hover:scale-110 active:scale-95"
                      >
                        <Heart
                          className={`w-6 h-6 transition-all ${
                            isFavorite ? 'fill-red-500 text-red-500' : 'text-white'
                          }`}
                        />
                      </button>
                      <button
                        onClick={handleShare}
                        className="w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-all hover:scale-110 active:scale-95"
                      >
                        <Share2 className="w-6 h-6 text-white" />
                      </button>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 bg-yellow-400 text-black px-4 py-2 rounded-full font-semibold">
                      {accommodation.category}
                    </div>
                  </div>

                  {/* Thumbnail Images */}
                  <div className="grid grid-cols-3 gap-2 p-4 bg-gray-900/50">
                    {accommodation.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative h-24 rounded-lg overflow-hidden transition-all ${
                          selectedImageIndex === index
                            ? 'ring-2 ring-yellow-400 scale-105'
                            : 'hover:scale-105 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`View ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Details Section */}
                <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-3xl p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h1 className="text-3xl text-white font-bold mb-2">{accommodation.name}</h1>
                      <div className="flex items-center gap-2 text-gray-400 mb-3">
                        <MapPin className="w-5 h-5 text-yellow-400" />
                        <span>{accommodation.fullAddress}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 bg-yellow-400/10 px-3 py-1 rounded-full">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-yellow-400 font-semibold">{accommodation.rating}</span>
                          <span className="text-gray-400 text-sm">({accommodation.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center gap-2 text-yellow-400 text-sm">
                          <Navigation className="w-4 h-4" />
                          <span>{accommodation.distance}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h2 className="text-xl text-white font-semibold mb-3">About this place</h2>
                    <p className="text-gray-300 leading-relaxed">{accommodation.description}</p>
                  </div>

                  {/* Key Information */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                      <Bed className="w-6 h-6 text-yellow-400 mb-2" />
                      <div className="text-2xl text-white font-bold">{accommodation.bedrooms}</div>
                      <div className="text-gray-400 text-sm">Bedrooms</div>
                    </div>
                    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                      <Users className="w-6 h-6 text-yellow-400 mb-2" />
                      <div className="text-2xl text-white font-bold">{accommodation.capacity}</div>
                      <div className="text-gray-400 text-sm">Total Capacity</div>
                    </div>
                    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                      <Home className="w-6 h-6 text-yellow-400 mb-2" />
                      <div className="text-2xl text-white font-bold">{accommodation.studentsPerRoom}</div>
                      <div className="text-gray-400 text-sm">Per Room</div>
                    </div>
                    <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
                      <Users className="w-6 h-6 text-yellow-400 mb-2" />
                      <div className="text-sm text-white font-bold">{accommodation.availableFor}</div>
                      <div className="text-gray-400 text-sm">Available For</div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mb-6">
                    <h2 className="text-xl text-white font-semibold mb-4">Amenities & Facilities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {accommodation.amenities.map((amenity, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 bg-gray-900/50 rounded-xl p-3 border border-gray-700"
                        >
                          <div className="text-yellow-400">
                            {getAmenityIcon(amenity.icon)}
                          </div>
                          <span className="text-gray-300 text-sm">{amenity.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* All Facilities */}
                  <div className="mb-6">
                    <h2 className="text-xl text-white font-semibold mb-4">Additional Facilities</h2>
                    <div className="flex flex-wrap gap-2">
                      {accommodation.facilities.map((facility, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-yellow-400/10 text-yellow-400 px-4 py-2 rounded-full border border-yellow-400/20"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-sm">{facility}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* House Rules */}
                  <div>
                    <h2 className="text-xl text-white font-semibold mb-4">House Rules</h2>
                    <div className="space-y-2">
                      {accommodation.rules.map((rule, index) => (
                        <div key={index} className="flex items-start gap-3 text-gray-300">
                          <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <span>{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Booking Card */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-3xl p-6 sticky top-24">
                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-gray-700">
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-4xl text-yellow-400 font-bold">
                        LKR {accommodation.price.toLocaleString()}
                      </span>
                      <span className="text-gray-400 text-lg mb-1">{accommodation.priceUnit}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>Available from: {accommodation.availableFrom}</span>
                    </div>
                  </div>

                  {/* Owner Info */}
                  <div className="mb-6 pb-6 border-b border-gray-700">
                    <h3 className="text-white font-semibold mb-3">Property Owner</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                          <span className="text-black font-bold text-lg">
                            {accommodation.ownerName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-white font-medium">{accommodation.ownerName}</div>
                          <div className="text-gray-400 text-sm">Property Owner</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="space-y-3">
                    <a
                      href={`tel:${accommodation.ownerPhone}`}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black px-6 py-4 rounded-xl flex items-center justify-center gap-2 font-semibold hover:shadow-2xl hover:shadow-yellow-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      <Phone className="w-5 h-5" />
                      <span>Call Now</span>
                    </a>

                    <button
                      onClick={() => setShowContactModal(true)}
                      className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Send Message</span>
                    </button>

                    <a
                      href={`mailto:${accommodation.ownerEmail}`}
                      className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      <Mail className="w-5 h-5" />
                      <span>Email Owner</span>
                    </a>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-yellow-400 font-semibold text-sm mb-1">
                            Verified Listing
                          </div>
                          <div className="text-gray-400 text-xs">
                            This property has been verified by NearU team
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </PageLayout>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 max-w-md w-full border-2 border-yellow-400/20 animate-scaleIn">
            <h3 className="text-2xl text-white font-bold mb-6">Contact Property Owner</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Your Name</label>
                <input
                  type="text"
                  className="w-full bg-gray-900/50 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-yellow-400 focus:outline-none"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Your Phone</label>
                <input
                  type="tel"
                  className="w-full bg-gray-900/50 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-yellow-400 focus:outline-none"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Message</label>
                <textarea
                  rows={4}
                  className="w-full bg-gray-900/50 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-yellow-400 focus:outline-none resize-none"
                  placeholder="I'm interested in this accommodation..."
                ></textarea>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowContactModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Message sent! The owner will contact you soon.');
                  setShowContactModal(false);
                }}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}