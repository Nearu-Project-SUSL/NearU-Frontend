import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { PageLayout } from '../components/PageLayout';
import { Tag, Search, Sparkles, MapPin, Phone, Calendar, TrendingUp, Percent, Clock, Star, Gift, UtensilsCrossed, Home, Bus, ShoppingBag, Ticket, Zap } from 'lucide-react';
import { Link } from 'react-router';
import { NotificationDropdown } from '../components/NotificationDropdown';
import userAvatar from 'figma:asset/902c55af84906a0971d3584133214377bc973536.png';

interface Deal {
  id: string;
  title: string;
  business: string;
  category: string;
  discount: number;
  discountType: 'percentage' | 'fixed' | 'bogo';
  originalPrice?: number;
  discountedPrice?: number;
  description: string;
  terms: string;
  location: string;
  phone: string;
  promoCode?: string;
  validUntil: string;
  daysLeft: number;
  featured?: boolean;
  tags: string[];
  imageColor: string;
}

export default function Deals() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const deals: Deal[] = [
    {
      id: '1',
      title: '50% Off on All Meals',
      business: 'Campus Canteen',
      category: 'Food',
      discount: 50,
      discountType: 'percentage',
      originalPrice: 600,
      discountedPrice: 300,
      description: 'Get 50% off on any meal from our lunch and dinner menu. Valid for students with ID card.',
      terms: 'Valid only for dine-in. Show student ID. Not applicable with other offers.',
      location: 'University Campus',
      phone: '+94 77 111 2222',
      promoCode: 'STUDENT50',
      validUntil: '2026-03-15',
      daysLeft: 21,
      featured: true,
      tags: ['Popular', 'Limited Time'],
      imageColor: 'from-orange-500 to-red-500'
    },
    {
      id: '2',
      title: 'Buy 1 Get 1 Free Coffee',
      business: 'Brew & Bean Cafe',
      category: 'Food',
      discount: 0,
      discountType: 'bogo',
      description: 'Buy any coffee and get another one free! Perfect for studying with friends.',
      terms: 'Valid on all coffee drinks. Applies to item of equal or lesser value.',
      location: 'Near Main Gate',
      phone: '+94 77 222 3333',
      promoCode: 'BOGO1',
      validUntil: '2026-02-28',
      daysLeft: 6,
      featured: true,
      tags: ['Hot Deal', 'Weekend Special'],
      imageColor: 'from-amber-600 to-yellow-500'
    },
    {
      id: '3',
      title: '30% Off First Month Rent',
      business: 'Student Residency',
      category: 'Accommodation',
      discount: 30,
      discountType: 'percentage',
      originalPrice: 15000,
      discountedPrice: 10500,
      description: 'Special discount for new tenants. Furnished rooms with WiFi included.',
      terms: 'Minimum 6-month contract required. Deposit applicable.',
      location: '500m from Campus',
      phone: '+94 77 333 4444',
      validUntil: '2026-03-31',
      daysLeft: 37,
      tags: ['New Offer'],
      imageColor: 'from-blue-500 to-cyan-500'
    },
    {
      id: '4',
      title: 'LKR 200 Off Tuk Rides',
      business: 'Quick Tuk Service',
      category: 'Transport',
      discount: 200,
      discountType: 'fixed',
      description: 'Get LKR 200 off on your first 5 rides. Safe and reliable transport for students.',
      terms: 'Valid for first-time users only. Use promo code at booking.',
      location: 'Campus Area',
      phone: '+94 77 444 5555',
      promoCode: 'FIRST200',
      validUntil: '2026-04-30',
      daysLeft: 67,
      featured: true,
      tags: ['New Users', 'Transport'],
      imageColor: 'from-green-500 to-emerald-500'
    },
    {
      id: '5',
      title: '25% Off Books & Stationery',
      business: 'Campus Bookstore',
      category: 'Shopping',
      discount: 25,
      discountType: 'percentage',
      description: 'Huge savings on textbooks, notebooks, and all stationery items.',
      terms: 'Valid on in-stock items only. Cannot be combined with clearance sales.',
      location: 'University Bookshop',
      phone: '+94 77 555 6666',
      promoCode: 'BOOKS25',
      validUntil: '2026-03-10',
      daysLeft: 16,
      tags: ['Student Essential'],
      imageColor: 'from-purple-500 to-pink-500'
    },
    {
      id: '6',
      title: 'Free Delivery on Orders Over LKR 1000',
      business: 'Quick Mart Groceries',
      category: 'Shopping',
      discount: 0,
      discountType: 'fixed',
      description: 'Order your groceries and get free delivery to campus. Fresh produce daily.',
      terms: 'Minimum order LKR 1000. Delivery within 2 hours.',
      location: 'Belihuloya Town',
      phone: '+94 77 666 7777',
      promoCode: 'FREEDEL',
      validUntil: '2026-05-31',
      daysLeft: 98,
      tags: ['Groceries', 'Free Delivery'],
      imageColor: 'from-teal-500 to-green-500'
    },
    {
      id: '7',
      title: '40% Off Gift Items',
      business: 'Happy Gifts & More',
      category: 'Gifts',
      discount: 40,
      discountType: 'percentage',
      description: 'Perfect gifts for your loved ones. Includes flowers, chocolates, and personalized items.',
      terms: 'Valid on selected items. Check store for details.',
      location: 'Town Center',
      phone: '+94 77 777 8888',
      promoCode: 'GIFT40',
      validUntil: '2026-03-20',
      daysLeft: 26,
      tags: ['Valentine Special'],
      imageColor: 'from-rose-500 to-pink-500'
    },
    {
      id: '8',
      title: 'Student Meal Plan - LKR 8000/Month',
      business: 'Healthy Bites Restaurant',
      category: 'Food',
      discount: 35,
      discountType: 'percentage',
      originalPrice: 12000,
      discountedPrice: 8000,
      description: 'Unlimited lunch and dinner for an entire month! Healthy, nutritious meals.',
      terms: 'Valid for one month from purchase date. Non-transferable.',
      location: 'Near University',
      phone: '+94 77 888 9999',
      validUntil: '2026-02-25',
      daysLeft: 3,
      featured: true,
      tags: ['Best Value', 'Meal Plan'],
      imageColor: 'from-lime-500 to-green-600'
    },
    {
      id: '9',
      title: '20% Off Printing Services',
      business: 'Print Pro',
      category: 'Services',
      discount: 20,
      discountType: 'percentage',
      description: 'Assignments, projects, reports - we print it all with quality and speed.',
      terms: 'Bulk orders get additional discounts. Color printing available.',
      location: 'Campus Gate',
      phone: '+94 77 999 0000',
      promoCode: 'PRINT20',
      validUntil: '2026-06-30',
      daysLeft: 128,
      tags: ['Academic'],
      imageColor: 'from-indigo-500 to-blue-500'
    },
    {
      id: '10',
      title: 'Weekend Bus Pass - LKR 500',
      business: 'Regional Transport',
      category: 'Transport',
      discount: 40,
      discountType: 'percentage',
      originalPrice: 850,
      discountedPrice: 500,
      description: 'Unlimited weekend travel on all routes. Perfect for exploring nearby areas.',
      terms: 'Valid Saturday-Sunday only. Student ID required.',
      location: 'Bus Station',
      phone: '+94 77 000 1111',
      validUntil: '2026-04-15',
      daysLeft: 52,
      tags: ['Weekend Only'],
      imageColor: 'from-sky-500 to-blue-600'
    },
    {
      id: '11',
      title: 'Gym Membership - 3 Months Free',
      business: 'Fitness Hub',
      category: 'Services',
      discount: 0,
      discountType: 'bogo',
      description: 'Sign up for 6 months and get 3 months absolutely free! Stay fit during your studies.',
      terms: '6-month commitment required. Full gym access included.',
      location: 'Town Sports Complex',
      phone: '+94 77 111 2222',
      validUntil: '2026-03-01',
      daysLeft: 7,
      tags: ['Health & Fitness'],
      imageColor: 'from-red-500 to-orange-500'
    },
    {
      id: '12',
      title: 'Laundry Service - 10kg for LKR 400',
      business: 'Fresh & Clean Laundry',
      category: 'Services',
      discount: 30,
      discountType: 'percentage',
      originalPrice: 570,
      discountedPrice: 400,
      description: 'Professional laundry service with pickup and delivery. Save time for studies!',
      terms: 'Campus pickup available. 24-hour turnaround.',
      location: 'Near Campus',
      phone: '+94 77 222 3333',
      promoCode: 'CLEAN30',
      validUntil: '2026-05-15',
      daysLeft: 82,
      tags: ['Convenient'],
      imageColor: 'from-cyan-500 to-teal-500'
    }
  ];

  const featuredDeals = deals.filter(d => d.featured);
  const regularDeals = deals.filter(d => !d.featured);

  const filteredDeals = [...featuredDeals, ...regularDeals].filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          deal.business.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          deal.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || deal.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Food': return UtensilsCrossed;
      case 'Accommodation': return Home;
      case 'Transport': return Bus;
      case 'Shopping': return ShoppingBag;
      case 'Gifts': return Gift;
      case 'Services': return Zap;
      default: return Tag;
    }
  };

  const getDiscountDisplay = (deal: Deal) => {
    if (deal.discountType === 'percentage') {
      return `${deal.discount}% OFF`;
    } else if (deal.discountType === 'fixed') {
      return `LKR ${deal.discount} OFF`;
    } else {
      return 'BOGO';
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
      <Sidebar activeSection="offers" />

      {/* Main Content */}
      <PageLayout>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-2xl border-b-2 border-yellow-400/20 shadow-2xl shadow-yellow-400/5">
          <div className="flex items-center justify-between px-8 lg:px-12 py-5">
            <div className="flex items-center gap-6">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300">
                  <Tag className="w-7 h-7 text-black" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl text-white">Deals & Offers</h1>
                <p className="text-yellow-400/70 text-sm">Exclusive student discounts & promotions</p>
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

          {/* Search Bar and Filters */}
          <div className="px-8 lg:px-12 pb-5">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search deals, businesses, or categories..."
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
                <option value="all">All Categories</option>
                <option value="Food">Food & Dining</option>
                <option value="Accommodation">Accommodation</option>
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
                <option value="Gifts">Gifts</option>
                <option value="Services">Services</option>
              </select>
            </div>
          </div>
        </header>
        
        {/* Main Content Area */}
        <section className="px-8 lg:px-12 py-12 relative">
          <div className="max-w-7xl mx-auto">
            {/* Hero Banner */}
            <div className="relative bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 rounded-3xl overflow-hidden shadow-2xl animate-fadeIn mb-12">
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0, 0, 0, 0.3) 1px, transparent 0)`,
                backgroundSize: '30px 30px'
              }}></div>
              
              <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center p-12">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-8 h-8 text-black" />
                    <span className="text-black text-lg font-medium">Save More, Spend Less</span>
                  </div>
                  <h2 className="text-4xl lg:text-5xl text-black mb-4">
                    Exclusive Student<br />Deals & Offers
                  </h2>
                  <p className="text-xl text-black/90 mb-6">
                    Discover amazing discounts from local businesses around campus.<br />
                    Save money on food, transport, accommodation, and more!
                  </p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className="bg-black/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-3xl text-black font-bold">{deals.length}+</div>
                      <div className="text-black/80 text-sm">Active Deals</div>
                    </div>
                    <div className="bg-black/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-3xl text-black font-bold">30+</div>
                      <div className="text-black/80 text-sm">Businesses</div>
                    </div>
                    <div className="bg-black/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-3xl text-black font-bold">50%</div>
                      <div className="text-black/80 text-sm">Max Savings</div>
                    </div>
                  </div>
                </div>

                {/* Illustration */}
                <div className="relative flex items-center justify-center">
                  <div className="text-9xl animate-float">🎁</div>
                  <div className="absolute top-0 right-0 text-6xl animate-bounce" style={{ animationDelay: '0.5s' }}>💰</div>
                  <div className="absolute bottom-0 left-0 text-6xl animate-bounce" style={{ animationDelay: '1s' }}>🎉</div>
                </div>
              </div>
            </div>

            {/* Featured Deals Section */}
            {featuredDeals.length > 0 && (
              <div className="mb-16 animate-slideUp" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-4xl text-white mb-2">🔥 Hot Deals</h2>
                    <p className="text-gray-400">Limited time offers you don't want to miss</p>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-400">
                    <TrendingUp className="w-5 h-5" />
                    <span>Trending</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featuredDeals.map((deal, index) => {
                    const CategoryIcon = getCategoryIcon(deal.category);
                    return (
                      <div
                        key={deal.id}
                        className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 hover:border-yellow-400/60 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20 animate-slideUp cursor-pointer"
                        style={{ animationDelay: `${index * 0.15}s` }}
                      >
                        {/* Deal Header with Gradient */}
                        <div className={`relative h-48 bg-gradient-to-br ${deal.imageColor} overflow-hidden`}>
                          <div className="absolute inset-0 opacity-20" style={{
                            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.3) 1px, transparent 0)`,
                            backgroundSize: '20px 20px'
                          }}></div>
                          
                          {/* Discount Badge */}
                          <div className="absolute top-6 left-6 bg-white text-black px-6 py-3 rounded-2xl shadow-xl">
                            <div className="text-3xl font-bold">{getDiscountDisplay(deal)}</div>
                          </div>

                          {/* Featured Badge */}
                          <div className="absolute top-6 right-6 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-xl">
                            <Star className="w-4 h-4 fill-white" />
                            Featured
                          </div>

                          {/* Days Left */}
                          <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-white" />
                            <span className="text-white text-sm font-medium">{deal.daysLeft} days left</span>
                          </div>

                          {/* Large Icon */}
                          <div className="absolute bottom-6 left-6 text-white/30 text-7xl">
                            <CategoryIcon className="w-20 h-20" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-3xl text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                                {deal.title}
                              </h3>
                              <p className="text-gray-400 text-lg font-medium">{deal.business}</p>
                            </div>
                            <div className="px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-lg text-sm font-medium">
                              {deal.category}
                            </div>
                          </div>

                          <p className="text-gray-500 mb-6 leading-relaxed">{deal.description}</p>

                          {/* Price Display */}
                          {deal.originalPrice && deal.discountedPrice && (
                            <div className="flex items-center gap-4 mb-6 p-4 bg-yellow-400/5 rounded-xl border border-yellow-400/20">
                              <div>
                                <div className="text-gray-500 text-sm line-through">
                                  LKR {deal.originalPrice.toLocaleString()}
                                </div>
                                <div className="text-3xl text-yellow-400 font-bold">
                                  LKR {deal.discountedPrice.toLocaleString()}
                                </div>
                              </div>
                              <div className="flex-1 text-right">
                                <div className="text-green-400 text-2xl font-bold">
                                  Save LKR {(deal.originalPrice - deal.discountedPrice).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-6">
                            {deal.tags.map((tag, i) => (
                              <span key={i} className="px-3 py-1 bg-gray-800/80 text-yellow-400 rounded-full text-xs border border-yellow-400/30">
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Info Grid */}
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <MapPin className="w-4 h-4 text-yellow-400" />
                              <span>{deal.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Calendar className="w-4 h-4 text-yellow-400" />
                              <span>Until {deal.validUntil}</span>
                            </div>
                          </div>

                          {/* Promo Code */}
                          {deal.promoCode && (
                            <div className="mb-6 p-4 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 rounded-xl border-2 border-yellow-400/30 border-dashed">
                              <div className="text-gray-400 text-xs mb-1">Promo Code</div>
                              <div className="flex items-center justify-between">
                                <div className="text-yellow-400 text-2xl font-bold tracking-wider font-mono">
                                  {deal.promoCode}
                                </div>
                                <Ticket className="w-6 h-6 text-yellow-400" />
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center gap-3">
                            <a
                              href={`tel:${deal.phone}`}
                              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all shadow-lg hover:shadow-xl font-medium flex items-center justify-center gap-2 group"
                            >
                              <Phone className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                              Call Now
                            </a>
                            <button className="px-6 py-3 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 rounded-xl transition-all border border-yellow-400/30 hover:border-yellow-400/60 font-medium">
                              Details
                            </button>
                          </div>
                        </div>

                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All Deals Section */}
            <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-4xl text-white mb-2">All Deals & Offers</h2>
                  <p className="text-gray-400">
                    Found <span className="text-yellow-400 font-semibold">{filteredDeals.length}</span> active deals
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
                    Clear all filters
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDeals.map((deal, index) => {
                  const CategoryIcon = getCategoryIcon(deal.category);
                  return (
                    <div
                      key={deal.id}
                      className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 hover:border-yellow-400/40 rounded-3xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/10 animate-slideUp cursor-pointer"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Deal Header */}
                      <div className={`relative h-40 bg-gradient-to-br ${deal.imageColor} overflow-hidden`}>
                        <div className="absolute inset-0 opacity-20" style={{
                          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.3) 1px, transparent 0)`,
                          backgroundSize: '20px 20px'
                        }}></div>
                        
                        {/* Discount Badge */}
                        <div className="absolute top-4 left-4 bg-white text-black px-4 py-2 rounded-xl font-bold shadow-lg">
                          {getDiscountDisplay(deal)}
                        </div>

                        {/* Days Left */}
                        {deal.daysLeft <= 7 && (
                          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold animate-pulse">
                            Ending Soon!
                          </div>
                        )}

                        {/* Icon */}
                        <div className="absolute bottom-4 right-4 text-white/30">
                          <CategoryIcon className="w-12 h-12" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl text-white mb-1 group-hover:text-yellow-400 transition-colors duration-300 flex-1">
                            {deal.title}
                          </h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">{deal.business}</p>

                        {/* Price */}
                        {deal.originalPrice && deal.discountedPrice && (
                          <div className="mb-4 p-3 bg-yellow-400/5 rounded-lg border border-yellow-400/20">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-gray-500 text-xs line-through">LKR {deal.originalPrice}</div>
                                <div className="text-xl text-yellow-400 font-bold">LKR {deal.discountedPrice}</div>
                              </div>
                              <div className="text-green-400 text-sm font-bold">
                                Save {deal.discount}%
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Info */}
                        <div className="space-y-2 mb-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-400">
                            <MapPin className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                            <span className="truncate">{deal.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400">
                            <Clock className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                            <span>{deal.daysLeft} days remaining</span>
                          </div>
                        </div>

                        {/* Promo Code */}
                        {deal.promoCode && (
                          <div className="mb-4 p-3 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 rounded-lg border border-yellow-400/30 border-dashed">
                            <div className="text-gray-500 text-xs mb-1">Code</div>
                            <div className="text-yellow-400 text-lg font-bold font-mono tracking-wide">
                              {deal.promoCode}
                            </div>
                          </div>
                        )}

                        {/* Action */}
                        <a
                          href={`tel:${deal.phone}`}
                          className="w-full px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all shadow-lg hover:shadow-xl text-sm font-medium flex items-center justify-center gap-2 group"
                        >
                          <Phone className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                          Contact Business
                        </a>
                      </div>

                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>
                    </div>
                  );
                })}
              </div>

              {/* Empty State */}
              {filteredDeals.length === 0 && (
                <div className="text-center py-16">
                  <Tag className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-2xl text-gray-400 mb-2">No deals found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            {/* Business Banner */}
            <div className="mt-16 bg-gradient-to-br from-gray-900/90 to-black/90 border-2 border-yellow-400/30 rounded-3xl p-10 animate-fadeIn relative overflow-hidden" style={{ animationDelay: '0.3s' }}>
              <div className="absolute top-0 right-0 text-yellow-400/10 text-9xl">💼</div>
              <div className="relative z-10 max-w-4xl">
                <h3 className="text-3xl text-white mb-4">Are you a local business?</h3>
                <p className="text-gray-400 text-lg mb-6">
                  Reach thousands of students at Sabaragamuwa University! Post your offers and deals on NearU and grow your business with the student community.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl">
                    Post Your Deal
                  </button>
                  <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all duration-300 border-2 border-yellow-400/30 hover:border-yellow-400/60">
                    Learn More
                  </button>
                </div>
              </div>
            </div>

            {/* Info Cards */}
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 border-2 border-yellow-400/20 rounded-2xl p-8 text-center group hover:scale-105 transition-all duration-300">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">💳</div>
                <h4 className="text-xl text-white mb-2">Easy Redemption</h4>
                <p className="text-gray-400 text-sm">Simply show your student ID and promo code</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 border-2 border-yellow-400/20 rounded-2xl p-8 text-center group hover:scale-105 transition-all duration-300">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🔔</div>
                <h4 className="text-xl text-white mb-2">New Deals Daily</h4>
                <p className="text-gray-400 text-sm">Fresh offers added regularly by local businesses</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 border-2 border-yellow-400/20 rounded-2xl p-8 text-center group hover:scale-105 transition-all duration-300">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🎓</div>
                <h4 className="text-xl text-white mb-2">Student Exclusive</h4>
                <p className="text-gray-400 text-sm">All deals verified for university students</p>
              </div>
            </div>
          </div>
        </section>
      </PageLayout>
    </div>
  );
}