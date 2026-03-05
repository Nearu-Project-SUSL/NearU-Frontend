import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { PageLayout } from '../components/PageLayout';
import { UtensilsCrossed, Star, Clock, MapPin, Phone, Search, Sparkles, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { NotificationDropdown } from '../components/NotificationDropdown';
import userAvatar from 'figma:asset/902c55af84906a0971d3584133214377bc973536.png';

interface Vendor {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  location: string;
  deliveryTime: string;
  phone: string;
  category: string;
  featured?: boolean;
  offers?: string;
}

export default function Food() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteVendors, setFavoriteVendors] = useState<Set<string>>(new Set(['uvindu-foods'])); // Mock favorites

  const toggleFavorite = (e: React.MouseEvent, vendorId: string) => {
    e.stopPropagation(); // Prevent card click
    setFavoriteVendors(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(vendorId)) {
        newFavorites.delete(vendorId);
      } else {
        newFavorites.add(vendorId);
      }
      return newFavorites;
    });
  };

  const vendors: Vendor[] = [
    {
      id: 'uvindu-foods',
      name: 'Uvindu Foods',
      description: 'Authentic Sri Lankan rice & curry. Fresh breakfast, lunch & dinner.',
      image: 'https://images.unsplash.com/photo-1743674453123-93356ade2891?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYW4lMjByaWNlJTIwY3VycnklMjBwbGF0ZXxlbnwxfHx8fDE3NzE2MDA5MTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.8,
      reviews: 234,
      location: 'Infront of University',
      deliveryTime: '10-15 mins',
      phone: '+94 77 123 4567',
      category: 'Sri Lankan',
      featured: true,
      offers: '10% OFF on orders above LKR 500'
    },
    {
      id: 'shan-foods',
      name: 'Shan Foods',
      description: 'Delicious fried rice & noodles. Chinese & local cuisine.',
      image: 'https://images.unsplash.com/photo-1581184953963-d15972933db1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllZCUyMHJpY2UlMjBhc2lhbiUyMGZvb2R8ZW58MXx8fHwxNzcxNTgwMDcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.7,
      reviews: 189,
      location: 'Near Campus Gate',
      deliveryTime: '15-20 mins',
      phone: '+94 77 234 5678',
      category: 'Chinese',
      featured: true,
      offers: 'Free delivery for students'
    },
    {
      id: 'burger-hub',
      name: 'Burger Hub',
      description: 'Juicy burgers & sandwiches. Fast food made fresh daily.',
      image: 'https://images.unsplash.com/photo-1767065703549-000399981385?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpY2lvdXMlMjBidXJnZXIlMjBzZXNhbWUlMjBidW58ZW58MXx8fHwxNzcxNjAwOTEzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.9,
      reviews: 312,
      location: 'Pambahinna Junction',
      deliveryTime: '20-25 mins',
      phone: '+94 77 345 6789',
      category: 'Fast Food',
      offers: 'Buy 1 Get 1 Free on Wednesdays'
    },
    {
      id: 'pizza-corner',
      name: 'Pizza Corner',
      description: 'Wood-fired pizzas & pasta. Italian favorites with local twist.',
      image: 'https://images.unsplash.com/photo-1672856399643-47ddf6b2d6d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHNsaWNlJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NzE1NTg2ODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.6,
      reviews: 156,
      location: 'Y Junction',
      deliveryTime: '25-30 mins',
      phone: '+94 77 456 7890',
      category: 'Italian',
      offers: '15% OFF on large pizzas'
    },
    {
      id: 'noodle-house',
      name: 'Noodle House',
      description: 'Asian noodles & soups. Ramen, pho & more authentic flavors.',
      image: 'https://images.unsplash.com/photo-1635685296916-95acaf58471f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub29kbGVzJTIwYXNpYW4lMjBjdWlzaW5lfGVufDF8fHx8MTc3MTU5OTUyMXww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.5,
      reviews: 142,
      location: 'Faculty Area',
      deliveryTime: '15-20 mins',
      phone: '+94 77 567 8901',
      category: 'Asian',
      offers: 'Free drink with combo meals'
    },
    {
      id: 'wrap-express',
      name: 'Wrap Express',
      description: 'Healthy wraps & salads. Fresh ingredients, quick service.',
      image: 'https://images.unsplash.com/photo-1705131187470-9458824c0d79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW5kd2ljaCUyMHdyYXAlMjByZXN0YXVyYW50fGVufDF8fHx8MTc3MTYwMDkxOHww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.7,
      reviews: 198,
      location: 'Library Junction',
      deliveryTime: '10-15 mins',
      phone: '+94 77 678 9012',
      category: 'Healthy',
      offers: 'Student discount 20% everyday'
    }
  ];

  const featuredVendors = vendors.filter(v => v.featured);
  const popularVendors = vendors.filter(v => !v.featured);

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
      <Sidebar activeSection="food" />

      {/* Main Content */}
      <PageLayout>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-2xl border-b-2 border-yellow-400/20 shadow-2xl shadow-yellow-400/5">
          <div className="flex items-center justify-between px-8 lg:px-12 py-5">
            <div className="flex items-center gap-6">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300">
                  <UtensilsCrossed className="w-7 h-7 text-black" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl text-white">Food Hub</h1>
                <p className="text-yellow-400/70 text-sm">Fresh foods to your doorstep</p>
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
            {/* Hero Banner */}
            <div className="relative bg-gradient-to-r from-green-700 via-green-600 to-green-700 rounded-3xl p-12 mb-12 overflow-hidden shadow-2xl animate-fadeIn">
              {/* Decorative patterns */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.3) 1px, transparent 0)`,
                backgroundSize: '30px 30px'
              }}></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-8 h-8 text-yellow-400" />
                    <span className="text-yellow-400 text-lg font-medium">Special Offer!</span>
                  </div>
                  <h2 className="text-4xl lg:text-5xl text-white mb-4">
                    Get the Fresh foods to your doorstep
                  </h2>
                  <p className="text-xl text-white/90 mb-6">
                    Quick access to restaurant contact numbers and place your order<br />
                    effortlessly and save your favorite places via NearU.
                  </p>
                  
                  {/* Search Bar */}
                  <div className="relative max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search Food, Gifts, shops..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/95 backdrop-blur-sm rounded-xl text-gray-900 placeholder-gray-500 border-2 border-transparent focus:border-yellow-400 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Burger Image */}
                <div className="relative w-64 h-64 flex-shrink-0">
                  <div className="absolute inset-0 bg-white/10 rounded-full blur-2xl"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1767065703549-000399981385?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpY2lvdXMlMjBidXJnZXIlMjBzZXNhbWUlMjBidW58ZW58MXx8fHwxNzcxNjAwOTEzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Burger"
                    className="relative w-full h-full object-contain drop-shadow-2xl animate-float"
                  />
                </div>
              </div>
            </div>

            {/* Your Favorites Section */}
            <div className="mb-16 animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-4xl text-white mb-2">Your Favorites</h2>
                  <p className="text-gray-400">Most loved food vendors on campus</p>
                </div>
                <div className="flex items-center gap-2 text-yellow-400">
                  <Star className="w-5 h-5 fill-yellow-400" />
                  <span>Top Rated</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredVendors.map((vendor, index) => (
                  <div
                    key={vendor.id}
                    className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 hover:border-yellow-400/60 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20 animate-slideUp cursor-pointer"
                    style={{ animationDelay: `${index * 0.15}s` }}
                    onClick={() => navigate(`/food/${vendor.id}`)}
                  >
                    {/* Offer Badge */}
                    {vendor.offers && (
                      <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
                        🎉 {vendor.offers}
                      </div>
                    )}

                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={vendor.image}
                        alt={vendor.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                      
                      {/* Rating Badge */}
                      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-yellow-400/30 flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="text-white font-bold">{vendor.rating}</span>
                        <span className="text-gray-400 text-sm">({vendor.reviews})</span>
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => toggleFavorite(e, vendor.id)}
                        className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full p-3 transition-all hover:scale-110 z-10"
                      >
                        <Heart
                          className={`w-6 h-6 transition-all ${
                            favoriteVendors.has(vendor.id) 
                              ? 'fill-red-500 stroke-red-500' 
                              : 'fill-none stroke-white hover:stroke-red-500'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                      <h3 className="text-3xl text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                        {vendor.name}
                      </h3>
                      <p className="text-gray-400 mb-6 leading-relaxed">
                        {vendor.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                          <span className="text-gray-300">{vendor.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                          <span className="text-gray-300">{vendor.deliveryTime}</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button className="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all shadow-lg hover:shadow-xl font-medium">
                          View Menu
                        </button>
                        <a
                          href={`tel:${vendor.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="w-12 h-12 bg-yellow-400/10 hover:bg-yellow-400/20 border-2 border-yellow-400/30 hover:border-yellow-400/60 rounded-xl flex items-center justify-center transition-all"
                        >
                          <Phone className="w-5 h-5 text-yellow-400" />
                        </a>
                      </div>
                    </div>

                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Near You Section */}
            <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-4xl text-white mb-2">Popular Near You</h2>
                  <p className="text-gray-400">Discover more amazing food vendors</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularVendors.map((vendor, index) => (
                  <div
                    key={vendor.id}
                    className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 hover:border-yellow-400/40 rounded-3xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/10 animate-slideUp cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => navigate(`/food/${vendor.id}`)}
                  >
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={vendor.image}
                        alt={vendor.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1 rounded-lg text-sm font-bold">
                        {vendor.category}
                      </div>

                      {/* Rating */}
                      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-yellow-400/30 flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-white text-sm font-medium">{vendor.rating}</span>
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => toggleFavorite(e, vendor.id)}
                        className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full p-2 transition-all hover:scale-110 z-10"
                      >
                        <Heart
                          className={`w-5 h-5 transition-all ${
                            favoriteVendors.has(vendor.id) 
                              ? 'fill-red-500 stroke-red-500' 
                              : 'fill-none stroke-white hover:stroke-red-500'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-2xl text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                        {vendor.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {vendor.description}
                      </p>

                      <div className="flex items-center gap-3 mb-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-yellow-400" />
                          <span>{vendor.deliveryTime}</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-yellow-400" />
                          <span className="truncate">{vendor.location}</span>
                        </div>
                      </div>

                      <button className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all shadow-lg hover:shadow-xl font-medium">
                        View Menu
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Info Banner */}
            <div className="mt-16 bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 border-2 border-yellow-400/20 rounded-3xl p-10 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-5xl mb-3">🍽️</div>
                    <h4 className="text-xl text-white mb-2">No Delivery Charges</h4>
                    <p className="text-gray-400 text-sm">Most vendors offer free delivery for students</p>
                  </div>
                  <div>
                    <div className="text-5xl mb-3">⚡</div>
                    <h4 className="text-xl text-white mb-2">Quick Service</h4>
                    <p className="text-gray-400 text-sm">Average delivery time is 15-20 minutes</p>
                  </div>
                  <div>
                    <div className="text-5xl mb-3">💰</div>
                    <h4 className="text-xl text-white mb-2">Student Discounts</h4>
                    <p className="text-gray-400 text-sm">Exclusive offers and deals for university students</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </PageLayout>
    </div>
  );
}