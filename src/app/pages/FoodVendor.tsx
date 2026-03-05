import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { PageLayout } from '../components/PageLayout';
import { UtensilsCrossed, Star, Clock, MapPin, Phone, ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { NotificationDropdown } from '../components/NotificationDropdown';
import userAvatar from 'figma:asset/902c55af84906a0971d3584133214377bc973536.png';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  image: string;
  fullPrice: number;
  halfPrice?: number;
  category: string;
}

interface VendorData {
  id: string;
  name: string;
  description: string;
  bannerImage: string;
  phone: string;
  location: string;
  rating: number;
  reviews: number;
  menu: MenuItem[];
}

export default function FoodVendor() {
  const { vendorId } = useParams();
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  // Mock vendor data - In real app, this would come from API
  const vendorsData: { [key: string]: VendorData } = {
    'uvindu-foods': {
      id: 'uvindu-foods',
      name: 'UVINDU FOODS',
      description: 'Our food shop is infront of Sabaragamuwa University. We are giving breakfat, lunch dinner foods in our place. you can order the foods around university without delivery charges.Call us & Order.',
      bannerImage: 'https://images.unsplash.com/photo-1743674453123-93356ade2891?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYW4lMjByaWNlJTIwY3VycnklMjBwbGF0ZXxlbnwxfHx8fDE3NzE2MDA5MTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      phone: '+94 77 123 4567',
      location: 'Infront of University',
      rating: 4.8,
      reviews: 234,
      menu: [
        {
          id: 'item1',
          name: 'Lunch - Rice & curry',
          description: 'Normal',
          image: 'https://images.unsplash.com/photo-1743674453123-93356ade2891?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYW4lMjByaWNlJTIwY3VycnklMjBwbGF0ZXxlbnwxfHx8fDE3NzE2MDA5MTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
          fullPrice: 300,
          halfPrice: 250,
          category: 'Rice & Curry'
        },
        {
          id: 'item2',
          name: 'Lunch - Rice & curry',
          description: 'Egg',
          image: 'https://images.unsplash.com/photo-1645802733740-50f48729d151?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVha2Zhc3QlMjBlZ2dzJTIwdG9hc3R8ZW58MXx8fHwxNzcxNTMxNjE2fDA&ixlib=rb-4.1.0&q=80&w=1080',
          fullPrice: 350,
          halfPrice: 300,
          category: 'Rice & Curry'
        },
        {
          id: 'item3',
          name: 'Lunch - Rice & curry',
          description: 'Chicken',
          image: 'https://images.unsplash.com/photo-1743674453123-93356ade2891?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcmklMjBsYW5rYW4lMjByaWNlJTIwY3VycnklMjBwbGF0ZXxlbnwxfHx8fDE3NzE2MDA5MTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
          fullPrice: 400,
          halfPrice: 350,
          category: 'Rice & Curry'
        },
        {
          id: 'item4',
          name: 'Fried Rice',
          description: 'Vegetable',
          image: 'https://images.unsplash.com/photo-1581184953963-d15972933db1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllZCUyMHJpY2UlMjBhc2lhbiUyMGZvb2R8ZW58MXx8fHwxNzcxNTgwMDcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
          fullPrice: 350,
          category: 'Fried Rice'
        },
        {
          id: 'item5',
          name: 'Fried Rice',
          description: 'Chicken',
          image: 'https://images.unsplash.com/photo-1581184953963-d15972933db1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllZCUyMHJpY2UlMjBhc2lhbiUyMGZvb2R8ZW58MXx8fHwxNzcxNTgwMDcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
          fullPrice: 450,
          category: 'Fried Rice'
        },
        {
          id: 'item6',
          name: 'Noodles',
          description: 'Vegetable',
          image: 'https://images.unsplash.com/photo-1635685296916-95acaf58471f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub29kbGVzJTIwYXNpYW4lMjBjdWlzaW5lfGVufDF8fHx8MTc3MTU5OTUyMXww&ixlib=rb-4.1.0&q=80&w=1080',
          fullPrice: 350,
          category: 'Noodles'
        }
      ]
    },
    'shan-foods': {
      id: 'shan-foods',
      name: 'SHAN FOODS',
      description: 'Authentic Chinese and local cuisine. Specializing in fried rice, noodles, and delicious Asian fusion dishes. Fresh ingredients, quick service, and student-friendly prices.',
      bannerImage: 'https://images.unsplash.com/photo-1581184953963-d15972933db1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllZCUyMHJpY2UlMjBhc2lhbiUyMGZvb2R8ZW58MXx8fHwxNzcxNTgwMDcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      phone: '+94 77 234 5678',
      location: 'Near Campus Gate',
      rating: 4.7,
      reviews: 189,
      menu: [
        {
          id: 'item1',
          name: 'Special Fried Rice',
          description: 'Mixed',
          image: 'https://images.unsplash.com/photo-1581184953963-d15972933db1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllZCUyMHJpY2UlMjBhc2lhbiUyMGZvb2R8ZW58MXx8fHwxNzcxNTgwMDcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
          fullPrice: 500,
          category: 'Fried Rice'
        },
        {
          id: 'item2',
          name: 'Chicken Fried Rice',
          description: 'Large portion',
          image: 'https://images.unsplash.com/photo-1581184953963-d15972933db1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllZCUyMHJpY2UlMjBhc2lhbiUyMGZvb2R8ZW58MXx8fHwxNzcxNTgwMDcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
          fullPrice: 450,
          category: 'Fried Rice'
        },
        {
          id: 'item3',
          name: 'Vegetable Noodles',
          description: 'Spicy',
          image: 'https://images.unsplash.com/photo-1635685296916-95acaf58471f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub29kbGVzJTIwYXNpYW4lMjBjdWlzaW5lfGVufDF8fHx8MTc3MTU5OTUyMXww&ixlib=rb-4.1.0&q=80&w=1080',
          fullPrice: 400,
          category: 'Noodles'
        },
        {
          id: 'item4',
          name: 'Chicken Noodles',
          description: 'Large',
          image: 'https://images.unsplash.com/photo-1635685296916-95acaf58471f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub29kbGVzJTIwYXNpYW4lMjBjdWlzaW5lfGVufDF8fHx8MTc3MTU5OTUyMXww&ixlib=rb-4.1.0&q=80&w=1080',
          fullPrice: 500,
          category: 'Noodles'
        }
      ]
    }
  };

  const vendor = vendorsData[vendorId || ''] || vendorsData['uvindu-foods'];

  const addToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
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
      <Sidebar activeSection="food" />

      {/* Main Content */}
      <PageLayout>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-2xl border-b-2 border-yellow-400/20 shadow-2xl shadow-yellow-400/5">
          <div className="flex items-center justify-between px-8 lg:px-12 py-5">
            <div className="flex items-center gap-6">
              <Link 
                to="/food"
                className="w-12 h-12 bg-yellow-400/10 hover:bg-yellow-400/20 rounded-xl flex items-center justify-center transition-all hover:scale-110 duration-300 border border-yellow-400/20 group"
              >
                <ArrowLeft className="w-5 h-5 text-yellow-400 group-hover:-translate-x-1 transition-transform duration-300" />
              </Link>

              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300">
                  <UtensilsCrossed className="w-7 h-7 text-black" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl text-white">{vendor.name}</h1>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 text-sm">{vendor.rating} ({vendor.reviews} reviews)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {getTotalItems() > 0 && (
                <div className="relative w-12 h-12 bg-yellow-400/10 hover:bg-yellow-400/20 rounded-xl flex items-center justify-center transition-all group hover:scale-110 duration-300 border border-yellow-400/20 cursor-pointer">
                  <ShoppingCart className="w-5 h-5 text-yellow-400" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {getTotalItems()}
                  </span>
                </div>
              )}

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
        <section className="px-8 lg:px-12 py-12 relative">
          <div className="max-w-7xl mx-auto">
            {/* Hero Banner */}
            <div className="relative h-80 rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-yellow-500/10 animate-fadeIn">
              <img 
                src={vendor.bannerImage}
                alt={vendor.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
              
              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-end justify-between">
                  <div className="flex-1">
                    <h2 className="text-5xl text-white mb-4">{vendor.name}</h2>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-xl">
                        <MapPin className="w-5 h-5 text-yellow-400" />
                        <span className="text-white">{vendor.location}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-xl">
                        <Clock className="w-5 h-5 text-yellow-400" />
                        <span className="text-white">10-15 mins</span>
                      </div>
                    </div>
                  </div>
                  
                  <a
                    href={`tel:${vendor.phone}`}
                    className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold rounded-xl shadow-xl shadow-yellow-500/40 transition-all hover:scale-105 flex items-center gap-3"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Call & Order</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gradient-to-br from-green-600/20 to-green-700/10 border-2 border-green-500/20 rounded-3xl p-8 mb-12 animate-slideUp">
              <p className="text-white text-lg leading-relaxed">
                {vendor.description}
              </p>
            </div>

            {/* Menu Section */}
            <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-4xl text-white">Our Menu</h2>
                <div className="text-gray-400">
                  {vendor.menu.length} items available
                </div>
              </div>

              <div className="space-y-6">
                {vendor.menu.map((item, index) => (
                  <div
                    key={item.id}
                    className="group bg-gradient-to-br from-green-600/10 to-green-700/5 border-2 border-green-500/20 hover:border-yellow-400/40 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10 animate-slideUp"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex flex-col md:flex-row gap-6 p-6">
                      {/* Image */}
                      <div className="relative w-full md:w-48 h-48 rounded-xl overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-2xl text-white mb-1">{item.name}</h3>
                              <p className="text-gray-400">{item.description}</p>
                            </div>
                            <span className="bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 px-3 py-1 rounded-lg text-sm">
                              {item.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-6">
                            <div>
                              <span className="text-gray-400 text-sm">Full</span>
                              <div className="text-2xl text-white font-bold">
                                LKR {item.fullPrice}
                              </div>
                            </div>
                            {item.halfPrice && (
                              <div>
                                <span className="text-gray-400 text-sm">Half</span>
                                <div className="text-2xl text-white font-bold">
                                  LKR {item.halfPrice}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Add to Cart */}
                          <div className="flex items-center gap-3">
                            {cart[item.id] ? (
                              <div className="flex items-center gap-3 bg-yellow-400/20 border-2 border-yellow-400 rounded-xl px-4 py-2">
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="w-8 h-8 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg flex items-center justify-center transition-all"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="text-white font-bold text-lg min-w-[2rem] text-center">
                                  {cart[item.id]}
                                </span>
                                <button
                                  onClick={() => addToCart(item.id)}
                                  className="w-8 h-8 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg flex items-center justify-center transition-all"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              null
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Offers Banner */}
            
          </div>
        </section>
      </PageLayout>
    </div>
  );
}