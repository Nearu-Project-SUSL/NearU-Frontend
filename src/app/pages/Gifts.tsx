import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { PageLayout } from '../components/PageLayout';
import { Gift, Star, MapPin, Phone, Search, Sparkles, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { NotificationDropdown } from '../components/NotificationDropdown';
import userAvatar from 'figma:asset/902c55af84906a0971d3584133214377bc973536.png';
import giftIllustration from 'figma:asset/8fc9b43b90df657686021dbb999c563159d745ee.png';

interface GiftShop {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  location: string;
  phone: string;
  specialty: string;
  featured?: boolean;
}

export default function Gifts() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteShops, setFavoriteShops] = useState<Set<string>>(new Set(['gifty-house'])); // Mock favorites

  const toggleFavorite = (e: React.MouseEvent, shopId: string) => {
    e.stopPropagation(); // Prevent card click
    setFavoriteShops(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(shopId)) {
        newFavorites.delete(shopId);
      } else {
        newFavorites.add(shopId);
      }
      return newFavorites;
    });
  };

  const giftShops: GiftShop[] = [
    {
      id: 'gifty-house',
      name: 'Gifty House',
      description: 'Birthday gifts for boys and girls, fresh flower bouquets & tasty cakes',
      image: 'https://images.unsplash.com/photo-1601307666167-910027240bcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGdpZnQlMjBib3glMjBwaW5rfGVufDF8fHx8MTc3MTYwMTM5NXww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.9,
      reviews: 287,
      location: 'Infront of University',
      phone: '+94 77 123 4567',
      specialty: 'Birthday Gifts',
      featured: true
    },
    {
      id: 'blooms-boutique',
      name: 'Blooms Boutique',
      description: 'Fresh flower arrangements, wedding bouquets & special occasion flowers',
      image: 'https://images.unsplash.com/photo-1645093365896-348545896152?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGZsb3dlciUyMGJvdXF1ZXQlMjBnaWZ0fGVufDF8fHx8MTc3MTYwMTM5NXww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.8,
      reviews: 195,
      location: 'Near Campus Gate',
      phone: '+94 77 234 5678',
      specialty: 'Fresh Flowers',
      featured: true
    },
    {
      id: 'sweet-treats',
      name: 'Sweet Treats',
      description: 'Custom birthday cakes, cupcakes, pastries & celebration desserts',
      image: 'https://images.unsplash.com/photo-1664289597477-d5b2d266169d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGNha2UlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NzE1NTUzMjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.9,
      reviews: 312,
      location: 'Pambahinna Junction',
      phone: '+94 77 345 6789',
      specialty: 'Custom Cakes'
    },
    {
      id: 'luxury-hampers',
      name: 'Luxury Hampers',
      description: 'Premium gift hampers, chocolate boxes & gourmet gift baskets',
      image: 'https://images.unsplash.com/photo-1770989064308-78baffbaa47e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnaWZ0JTIwaGFtcGVyfGVufDF8fHx8MTc3MTUxNzQ1OXww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.7,
      reviews: 156,
      location: 'Y Junction',
      phone: '+94 77 456 7890',
      specialty: 'Gift Hampers'
    },
    {
      id: 'teddy-corner',
      name: 'Teddy Corner',
      description: 'Soft toys, teddy bears, plushies & cute gift items for all ages',
      image: 'https://images.unsplash.com/photo-1735416117618-94ac2c428e3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWRkeSUyMGJlYXIlMjBnaWZ0JTIwdG95fGVufDF8fHx8MTc3MTYwMTM5Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.6,
      reviews: 142,
      location: 'Faculty Area',
      phone: '+94 77 567 8901',
      specialty: 'Soft Toys'
    },
    {
      id: 'choco-bliss',
      name: 'Choco Bliss',
      description: 'Premium chocolates, candy boxes & sweet gift collections',
      image: 'https://images.unsplash.com/photo-1644766532391-e5fc3ed1bbb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBib3glMjBnaWZ0fGVufDF8fHx8MTc3MTUzNjE3NHww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.8,
      reviews: 198,
      location: 'Library Junction',
      phone: '+94 77 678 9012',
      specialty: 'Chocolates'
    }
  ];

  const featuredShops = giftShops.filter(s => s.featured);
  const popularShops = giftShops.filter(s => !s.featured);

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
      <Sidebar activeSection="gifts" />

      {/* Main Content */}
      <PageLayout>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-2xl border-b-2 border-yellow-400/20 shadow-2xl shadow-yellow-400/5">
          <div className="flex items-center justify-between px-8 lg:px-12 py-5">
            <div className="flex items-center gap-6">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300">
                  <Gift className="w-7 h-7 text-black" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl text-white">Gift Hub</h1>
                <p className="text-yellow-400/70 text-sm">Let your gift speak the language of love</p>
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

          {/* Search Bar */}
          <div className="px-8 lg:px-12 pb-5">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search Food, Gifts, shops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-900/50 rounded-xl text-white placeholder-gray-500 border-2 border-yellow-400/20 focus:border-yellow-400 focus:outline-none transition-all"
              />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <section className="px-8 lg:px-12 py-12 relative">
          <div className="max-w-7xl mx-auto">
            {/* Hero Banner */}
            <div className="relative bg-gradient-to-r from-green-600 via-green-500 to-green-600 rounded-3xl p-12 mb-12 overflow-hidden shadow-2xl animate-fadeIn">
              {/* Decorative patterns */}
              <div className="absolute inset-0 opacity-10 bg-[#d8b82be6]" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.3) 1px, transparent 0)`,
                backgroundSize: '30px 30px'
              }}></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-8 h-8 text-yellow-300" />
                    <span className="text-yellow-300 text-lg font-medium">Special Moments</span>
                  </div>
                  <h2 className="text-4xl lg:text-5xl text-white mb-4">
                    Let your gift speak the<br />language of love.
                  </h2>
                  <p className="text-xl text-white/95 mb-6">
                    Quick access to gift shops contact numbers and place your order<br />
                    effortlessly and save your favorite places via NearU.
                  </p>
                </div>

                {/* Gift Illustration */}
                <div className="relative w-80 h-64 flex-shrink-0">
                  <div className="absolute inset-0 bg-white/10 rounded-full blur-2xl"></div>
                  <img 
                    src={giftIllustration}
                    alt="Gift boxes"
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
                  <p className="text-gray-400">Most loved gift shops on campus</p>
                </div>
                <div className="flex items-center gap-2 text-yellow-400">
                  <Heart className="w-5 h-5 fill-yellow-400" />
                  <span>Top Picks</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredShops.map((shop, index) => (
                  <div
                    key={shop.id}
                    className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 hover:border-yellow-400/60 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20 animate-slideUp cursor-pointer"
                    style={{ animationDelay: `${index * 0.15}s` }}
                    onClick={() => navigate(`/gifts/${shop.id}`)}
                  >
                    {/* Image */}
                    <div className="relative h-80 overflow-hidden">
                      <img 
                        src={shop.image}
                        alt={shop.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                      
                      {/* Rating Badge */}
                      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-yellow-400/30 flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="text-white font-bold">{shop.rating}</span>
                        <span className="text-gray-400 text-sm">({shop.reviews})</span>
                      </div>

                      {/* Specialty Badge */}
                      <div className="absolute top-4 left-4 bg-yellow-400 text-black px-4 py-2 rounded-xl text-sm font-bold">
                        🎁 {shop.specialty}
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => toggleFavorite(e, shop.id)}
                        className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full p-3 transition-all hover:scale-110 z-10"
                      >
                        <Heart
                          className={`w-6 h-6 transition-all ${
                            favoriteShops.has(shop.id) 
                              ? 'fill-red-500 stroke-red-500' 
                              : 'fill-none stroke-white hover:stroke-red-500'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                      <h3 className="text-3xl text-white mb-3 group-hover:text-yellow-400 transition-colors duration-300">
                        {shop.name}
                      </h3>
                      <p className="text-gray-400 mb-6 leading-relaxed text-lg">
                        {shop.description}
                      </p>

                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <MapPin className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                          <span>{shop.location}</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button className="flex-1 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all shadow-lg hover:shadow-xl font-medium text-lg">
                          View Menu
                        </button>
                        <a
                          href={`tel:${shop.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="w-14 h-14 bg-yellow-400/10 hover:bg-yellow-400/20 border-2 border-yellow-400/30 hover:border-yellow-400/60 rounded-xl flex items-center justify-center transition-all"
                        >
                          <Phone className="w-6 h-6 text-yellow-400" />
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
                  <p className="text-gray-400">Discover more amazing gift shops</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularShops.map((shop, index) => (
                  <div
                    key={shop.id}
                    className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 hover:border-yellow-400/40 rounded-3xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/10 animate-slideUp cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => navigate(`/gifts/${shop.id}`)}
                  >
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={shop.image}
                        alt={shop.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                      
                      {/* Specialty Badge */}
                      <div className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1 rounded-lg text-sm font-bold">
                        {shop.specialty}
                      </div>

                      {/* Rating */}
                      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-yellow-400/30 flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-white text-sm font-medium">{shop.rating}</span>
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => toggleFavorite(e, shop.id)}
                        className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full p-2 transition-all hover:scale-110 z-10"
                      >
                        <Heart
                          className={`w-5 h-5 transition-all ${
                            favoriteShops.has(shop.id) 
                              ? 'fill-red-500 stroke-red-500' 
                              : 'fill-none stroke-white hover:stroke-red-500'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-2xl text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                        {shop.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {shop.description}
                      </p>

                      <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
                        <MapPin className="w-4 h-4 text-yellow-400" />
                        <span className="truncate">{shop.location}</span>
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
                    <div className="text-5xl mb-3">🎁</div>
                    <h4 className="text-xl text-white mb-2">No Delivery Charges</h4>
                    <p className="text-gray-400 text-sm">Free delivery around university campus area</p>
                  </div>
                  <div>
                    <div className="text-5xl mb-3">✨</div>
                    <h4 className="text-xl text-white mb-2">Custom Gifts</h4>
                    <p className="text-gray-400 text-sm">Personalized gift options available</p>
                  </div>
                  <div>
                    <div className="text-5xl mb-3">💝</div>
                    <h4 className="text-xl text-white mb-2">Same Day Delivery</h4>
                    <p className="text-gray-400 text-sm">Quick service for urgent gift orders</p>
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