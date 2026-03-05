import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { PageLayout } from '../components/PageLayout';
import { Heart, Bell, User, Briefcase, Tag, Home as HomeIcon, UtensilsCrossed, Gift, MapPin, Phone, Star, Trash2, Filter, Search, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import userAvatar from 'figma:asset/902c55af84906a0971d3584133214377bc973536.png';

interface FavoriteItem {
  id: string;
  type: 'job' | 'deal' | 'accommodation' | 'food' | 'gift' | 'transport';
  title: string;
  subtitle: string;
  description: string;
  location: string;
  phone?: string;
  price?: string;
  savedDate: string;
  imageColor: string;
  rating?: number;
  link: string;
}

export default function Favorites() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const favorites: FavoriteItem[] = [
    {
      id: '1',
      type: 'job',
      title: 'Food Service Worker',
      subtitle: 'Belihul Oya Resort',
      description: 'Day and night food serving. 3 days service. Great opportunity for students during holidays.',
      location: 'Belihuloya, Galagama',
      phone: '+94 77 123 4567',
      price: 'LKR 3,000/day',
      savedDate: '2 days ago',
      imageColor: 'from-blue-500 to-blue-600',
      link: '/jobs/1'
    },
    {
      id: '2',
      type: 'deal',
      title: '50% Off on All Meals',
      subtitle: 'Campus Canteen',
      description: 'Get 50% off on any meal from our lunch and dinner menu. Valid for students with ID card.',
      location: 'University Campus',
      phone: '+94 77 111 2222',
      price: 'LKR 300 (was 600)',
      savedDate: '5 hours ago',
      imageColor: 'from-orange-500 to-red-500',
      link: '/deals'
    },
    {
      id: '3',
      type: 'accommodation',
      title: 'Modern Studio Apartment',
      subtitle: 'Student Residency',
      description: 'Fully furnished studio with WiFi, kitchen, and laundry facilities. Perfect for students.',
      location: '500m from Campus',
      phone: '+94 77 333 4444',
      price: 'LKR 15,000/month',
      savedDate: '1 day ago',
      imageColor: 'from-purple-500 to-pink-500',
      rating: 4.5,
      link: '/accommodation/1'
    },
    {
      id: '4',
      type: 'food',
      title: 'Brew & Bean Cafe',
      subtitle: 'Coffee & Pastries',
      description: 'Cozy cafe near campus with great coffee and study-friendly atmosphere. Student discounts available.',
      location: 'Near Main Gate',
      phone: '+94 77 222 3333',
      savedDate: '3 days ago',
      imageColor: 'from-amber-600 to-yellow-500',
      rating: 4.8,
      link: '/food/2'
    },
    {
      id: '5',
      type: 'deal',
      title: 'Buy 1 Get 1 Free Coffee',
      subtitle: 'Brew & Bean Cafe',
      description: 'Buy any coffee and get another one free! Perfect for studying with friends.',
      location: 'Near Main Gate',
      phone: '+94 77 222 3333',
      savedDate: '3 days ago',
      imageColor: 'from-amber-600 to-yellow-500',
      link: '/deals'
    },
    {
      id: '6',
      type: 'gift',
      title: 'Happy Gifts & More',
      subtitle: 'Custom Gift Shop',
      description: 'Personalized gifts, flowers, chocolates, and party supplies. Perfect for special occasions.',
      location: 'Town Center',
      phone: '+94 77 777 8888',
      savedDate: '1 week ago',
      imageColor: 'from-rose-500 to-pink-500',
      rating: 4.6,
      link: '/gifts/1'
    },
    {
      id: '7',
      type: 'job',
      title: 'Campus Tour Guide',
      subtitle: 'Sabaragamuwa University',
      description: 'Guide prospective students and visitors around campus. Weekend availability required.',
      location: 'University Campus',
      phone: '+94 77 234 5678',
      price: 'LKR 2,500/day',
      savedDate: '4 days ago',
      imageColor: 'from-green-500 to-emerald-500',
      link: '/jobs/2'
    },
    {
      id: '8',
      type: 'food',
      title: 'Healthy Bites Restaurant',
      subtitle: 'Student Meal Plans',
      description: 'Affordable meal plans for students. Unlimited lunch and dinner options available.',
      location: 'Near University',
      phone: '+94 77 888 9999',
      savedDate: '2 weeks ago',
      imageColor: 'from-lime-500 to-green-600',
      rating: 4.7,
      link: '/food/3'
    },
    {
      id: '9',
      type: 'accommodation',
      title: 'Shared Apartment - 2 BHK',
      subtitle: 'Student Housing',
      description: 'Looking for 2 roommates. Spacious apartment with all amenities included.',
      location: '1km from Campus',
      phone: '+94 77 555 6666',
      price: 'LKR 8,000/month per person',
      savedDate: '5 days ago',
      imageColor: 'from-cyan-500 to-blue-500',
      rating: 4.3,
      link: '/accommodation/2'
    },
    {
      id: '10',
      type: 'deal',
      title: '25% Off Books & Stationery',
      subtitle: 'Campus Bookstore',
      description: 'Huge savings on textbooks, notebooks, and all stationery items.',
      location: 'University Bookshop',
      phone: '+94 77 555 6666',
      price: '25% discount',
      savedDate: '1 day ago',
      imageColor: 'from-indigo-500 to-purple-500',
      link: '/deals'
    }
  ];

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'job': return Briefcase;
      case 'deal': return Tag;
      case 'accommodation': return HomeIcon;
      case 'food': return UtensilsCrossed;
      case 'gift': return Gift;
      default: return Heart;
    }
  };

  const getCategoryLabel = (type: string) => {
    switch (type) {
      case 'job': return 'Job';
      case 'deal': return 'Deal';
      case 'accommodation': return 'Accommodation';
      case 'food': return 'Restaurant';
      case 'gift': return 'Gift Shop';
      case 'transport': return 'Transport';
      default: return 'Item';
    }
  };

  const filteredFavorites = favorites.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categoryStats = {
    all: favorites.length,
    job: favorites.filter(f => f.type === 'job').length,
    deal: favorites.filter(f => f.type === 'deal').length,
    accommodation: favorites.filter(f => f.type === 'accommodation').length,
    food: favorites.filter(f => f.type === 'food').length,
    gift: favorites.filter(f => f.type === 'gift').length,
  };

  const handleRemoveFavorite = (id: string) => {
    // In a real app, this would remove from state/database
    console.log('Removing favorite:', id);
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
      <Sidebar activeSection="favorites" />

      {/* Main Content */}
      <PageLayout>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-2xl border-b-2 border-yellow-400/20 shadow-2xl shadow-yellow-400/5">
          <div className="flex items-center justify-between px-8 lg:px-12 py-5">
            <div className="flex items-center gap-6">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-7 h-7 text-black fill-black" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl text-white">My Favorites</h1>
                <p className="text-yellow-400/70 text-sm">All your saved items in one place</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/profile')}
                className="px-4 py-2 bg-gray-800/50 hover:bg-gray-800 text-white rounded-xl transition-all border border-yellow-400/20 hover:border-yellow-400/40 text-sm font-medium flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Profile
              </button>

              <button className="relative w-12 h-12 bg-yellow-400/10 hover:bg-yellow-400/20 rounded-xl flex items-center justify-center transition-all group hover:scale-110 duration-300 border border-yellow-400/20">
                <Bell className="w-5 h-5 text-yellow-400 group-hover:rotate-12 transition-transform duration-300" />
                <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
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

          {/* Search and Filter */}
          <div className="px-8 lg:px-12 pb-5">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your favorites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/50 rounded-xl text-white placeholder-gray-500 border-2 border-yellow-400/20 focus:border-yellow-400 focus:outline-none transition-all"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-gray-900/50 text-white rounded-xl border-2 border-yellow-400/20 focus:border-yellow-400 focus:outline-none transition-all"
              >
                <option value="all">All Categories ({categoryStats.all})</option>
                <option value="job">Jobs ({categoryStats.job})</option>
                <option value="deal">Deals ({categoryStats.deal})</option>
                <option value="accommodation">Accommodation ({categoryStats.accommodation})</option>
                <option value="food">Restaurants ({categoryStats.food})</option>
                <option value="gift">Gift Shops ({categoryStats.gift})</option>
              </select>
            </div>
          </div>
        </header>
        
        {/* Main Content Area */}
        <section className="px-8 lg:px-12 py-12 relative">
          <div className="max-w-7xl mx-auto">
            {/* Stats Banner */}
            <div className="relative bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 rounded-3xl overflow-hidden shadow-2xl animate-fadeIn mb-12">
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0, 0, 0, 0.3) 1px, transparent 0)`,
                backgroundSize: '30px 30px'
              }}></div>
              
              <div className="relative z-10 p-8">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  <div className="text-center">
                    <div className="text-4xl mb-2">❤️</div>
                    <div className="text-3xl text-black font-bold">{categoryStats.all}</div>
                    <div className="text-black/80 text-sm">Total Favorites</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-2">💼</div>
                    <div className="text-3xl text-black font-bold">{categoryStats.job}</div>
                    <div className="text-black/80 text-sm">Jobs Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-2">🏷️</div>
                    <div className="text-3xl text-black font-bold">{categoryStats.deal}</div>
                    <div className="text-black/80 text-sm">Deals Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-2">🏠</div>
                    <div className="text-3xl text-black font-bold">{categoryStats.accommodation}</div>
                    <div className="text-black/80 text-sm">Places Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl mb-2">🍽️</div>
                    <div className="text-3xl text-black font-bold">{categoryStats.food}</div>
                    <div className="text-black/80 text-sm">Restaurants</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Favorites Grid */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl text-white mb-2">Your Saved Items</h2>
                  <p className="text-gray-400">
                    Showing <span className="text-yellow-400 font-semibold">{filteredFavorites.length}</span> of {favorites.length} favorites
                  </p>
                </div>
                {(searchQuery || selectedCategory !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="text-yellow-400 hover:text-yellow-300 text-sm transition-colors px-4 py-2 border border-yellow-400/30 rounded-lg hover:border-yellow-400/60"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              {filteredFavorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFavorites.map((item, index) => {
                    const Icon = getCategoryIcon(item.type);
                    return (
                      <div
                        key={item.id}
                        className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 hover:border-yellow-400/40 rounded-3xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/10 animate-slideUp"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {/* Header with gradient */}
                        <div className={`relative h-40 bg-gradient-to-br ${item.imageColor} overflow-hidden`}>
                          <div className="absolute inset-0 opacity-20" style={{
                            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.3) 1px, transparent 0)`,
                            backgroundSize: '20px 20px'
                          }}></div>
                          
                          {/* Category Badge */}
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-black px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {getCategoryLabel(item.type)}
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveFavorite(item.id)}
                            className="absolute top-4 right-4 w-9 h-9 bg-red-500/90 hover:bg-red-600 backdrop-blur-sm text-white rounded-xl transition-all hover:scale-110 flex items-center justify-center group/btn"
                          >
                            <Trash2 className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                          </button>

                          {/* Saved Date */}
                          <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white text-xs">
                            Saved {item.savedDate}
                          </div>

                          {/* Large Icon */}
                          <div className="absolute bottom-4 left-4 text-white/30">
                            <Icon className="w-16 h-16" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-xl text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                            {item.title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-1">{item.subtitle}</p>
                          <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.description}</p>

                          {/* Info */}
                          <div className="space-y-2 mb-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-400">
                              <MapPin className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                              <span className="truncate">{item.location}</span>
                            </div>
                            {item.price && (
                              <div className="flex items-center gap-2 text-yellow-400 font-semibold">
                                <span>💰</span>
                                <span>{item.price}</span>
                              </div>
                            )}
                            {item.rating && (
                              <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                <span className="text-white font-medium">{item.rating}</span>
                                <span className="text-gray-500 text-xs">rating</span>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            {item.phone && (
                              <a
                                href={`tel:${item.phone}`}
                                className="flex-1 px-4 py-2.5 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-xl transition-all border border-green-500/30 hover:border-green-500/60 text-sm font-medium flex items-center justify-center gap-2"
                              >
                                <Phone className="w-4 h-4" />
                                Call
                              </a>
                            )}
                            <button
                              onClick={() => navigate(item.link)}
                              className={`${item.phone ? 'flex-1' : 'w-full'} px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black rounded-xl transition-all shadow-lg hover:shadow-xl text-sm font-medium`}
                            >
                              View Details
                            </button>
                          </div>
                        </div>

                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-16 bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-3xl">
                  <Heart className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-2xl text-gray-400 mb-2">No favorites found</h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery || selectedCategory !== 'all' 
                      ? 'Try adjusting your search or filters'
                      : 'Start adding items to your favorites to see them here'
                    }
                  </p>
                  {searchQuery || selectedCategory !== 'all' ? (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                      }}
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      Clear Filters
                    </button>
                  ) : (
                    <div className="flex flex-wrap justify-center gap-3">
                      <Link
                        to="/jobs"
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all hover:scale-105"
                      >
                        Browse Jobs
                      </Link>
                      <Link
                        to="/deals"
                        className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800 text-white rounded-xl font-medium transition-all hover:scale-105"
                      >
                        Browse Deals
                      </Link>
                      <Link
                        to="/accommodation"
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800 text-white rounded-xl font-medium transition-all hover:scale-105"
                      >
                        Find Housing
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-12 bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 border-2 border-yellow-400/20 rounded-3xl p-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-2xl text-white mb-6 text-center">Discover More</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Link
                  to="/jobs"
                  className="p-6 bg-gray-800/30 hover:bg-gray-800/50 rounded-2xl transition-all group hover:scale-105 border border-yellow-400/10 hover:border-yellow-400/30"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform text-center">💼</div>
                  <h4 className="text-lg text-white text-center mb-2">Find More Jobs</h4>
                  <p className="text-gray-400 text-sm text-center">Browse available part-time opportunities</p>
                </Link>

                <Link
                  to="/deals"
                  className="p-6 bg-gray-800/30 hover:bg-gray-800/50 rounded-2xl transition-all group hover:scale-105 border border-yellow-400/10 hover:border-yellow-400/30"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform text-center">🏷️</div>
                  <h4 className="text-lg text-white text-center mb-2">More Deals</h4>
                  <p className="text-gray-400 text-sm text-center">Discover exclusive student discounts</p>
                </Link>

                <Link
                  to="/food"
                  className="p-6 bg-gray-800/30 hover:bg-gray-800/50 rounded-2xl transition-all group hover:scale-105 border border-yellow-400/10 hover:border-yellow-400/30"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform text-center">🍽️</div>
                  <h4 className="text-lg text-white text-center mb-2">Explore Food</h4>
                  <p className="text-gray-400 text-sm text-center">Find restaurants and cafes near you</p>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </PageLayout>
    </div>
  );
}
