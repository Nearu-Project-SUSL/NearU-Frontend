import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { PageLayout } from '../components/PageLayout';
import { Gift, Star, MapPin, Phone, ArrowLeft, Heart } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { NotificationDropdown } from '../components/NotificationDropdown';
import userAvatar from 'figma:asset/902c55af84906a0971d3584133214377bc973536.png';
import giftBannerImage from 'figma:asset/e2c451e6648a07f1c28e2b825c0b5a083a4f024b.png';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  priceLabel: string;
}

interface ShopData {
  id: string;
  name: string;
  description: string;
  bannerImage: string;
  phone: string;
  location: string;
  rating: number;
  reviews: number;
  products: Product[];
}

export default function GiftShop() {
  const { shopId } = useParams();
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Mock shop data - In real app, this would come from API
  const shopsData: { [key: string]: ShopData } = {
    'gifty-house': {
      id: 'gifty-house',
      name: 'Gifty House',
      description: 'Our shop is infront of Sabaragamuwa University. We have birthday gifts for boys and girls both, and also you can buy tasty cakes in our place. you can order the gifts around university without delivery charges. Call us & Order.',
      bannerImage: giftBannerImage,
      phone: '+94 77 123 4567',
      location: 'Infront of University',
      rating: 4.9,
      reviews: 287,
      products: [
        {
          id: 'prod1',
          name: 'Fresh Flower bouquets',
          description: 'Beautiful fresh flower arrangements for any occasion',
          image: 'https://images.unsplash.com/photo-1645093365896-348545896152?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGZsb3dlciUyMGJvdXF1ZXQlMjBnaWZ0fGVufDF8fHx8MTc3MTYwMTM5NXww&ixlib=rb-4.1.0&q=80&w=1080',
          price: 1000,
          priceLabel: 'From LKR 1000'
        },
        {
          id: 'prod2',
          name: 'Customized Gift boxes',
          description: 'Personalized gift boxes with your choice of items',
          image: 'https://images.unsplash.com/photo-1601307666167-910027240bcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGdpZnQlMjBib3glMjBwaW5rfGVufDF8fHx8MTc3MTYwMTM5NXww&ixlib=rb-4.1.0&q=80&w=1080',
          price: 500,
          priceLabel: 'From LKR 500'
        },
        {
          id: 'prod3',
          name: 'Birthday Celebration Cakes',
          description: 'Custom birthday cakes made fresh daily',
          image: 'https://images.unsplash.com/photo-1664289597477-d5b2d266169d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMGNha2UlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NzE1NTUzMjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
          price: 1500,
          priceLabel: 'From LKR 1500'
        },
        {
          id: 'prod4',
          name: 'Teddy Bear Gift Sets',
          description: 'Cute teddy bears with chocolates and cards',
          image: 'https://images.unsplash.com/photo-1735416117618-94ac2c428e3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWRkeSUyMGJlYXIlMjBnaWZ0JTIwdG95fGVufDF8fHx8MTc3MTYwMTM5Nnww&ixlib=rb-4.1.0&q=80&w=1080',
          price: 800,
          priceLabel: 'From LKR 800'
        },
        {
          id: 'prod5',
          name: 'Luxury Gift Hampers',
          description: 'Premium hampers with gourmet treats',
          image: 'https://images.unsplash.com/photo-1770989064308-78baffbaa47e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBnaWZ0JTIwaGFtcGVyfGVufDF8fHx8MTc3MTUxNzQ1OXww&ixlib=rb-4.1.0&q=80&w=1080',
          price: 2000,
          priceLabel: 'From LKR 2000'
        },
        {
          id: 'prod6',
          name: 'Chocolate Gift Boxes',
          description: 'Assorted premium chocolates in elegant boxes',
          image: 'https://images.unsplash.com/photo-1644766532391-e5fc3ed1bbb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBib3glMjBnaWZ0fGVufDF8fHx8MTc3MTUzNjE3NHww&ixlib=rb-4.1.0&q=80&w=1080',
          price: 600,
          priceLabel: 'From LKR 600'
        }
      ]
    },
    'blooms-boutique': {
      id: 'blooms-boutique',
      name: 'Blooms Boutique',
      description: 'Premium fresh flower arrangements for all occasions. Wedding bouquets, birthday flowers, and special event decorations. We source the freshest flowers daily and create stunning arrangements that speak your emotions.',
      bannerImage: 'https://images.unsplash.com/photo-1645093365896-348545896152?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGZsb3dlciUyMGJvdXF1ZXQlMjBnaWZ0fGVufDF8fHx8MTc3MTYwMTM5NXww&ixlib=rb-4.1.0&q=80&w=1080',
      phone: '+94 77 234 5678',
      location: 'Near Campus Gate',
      rating: 4.8,
      reviews: 195,
      products: [
        {
          id: 'prod1',
          name: 'Rose Bouquets',
          description: 'Classic red, pink, white roses',
          image: 'https://images.unsplash.com/photo-1645093365896-348545896152?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGZsb3dlciUyMGJvdXF1ZXQlMjBnaWZ0fGVufDF8fHx8MTc3MTYwMTM5NXww&ixlib=rb-4.1.0&q=80&w=1080',
          price: 1200,
          priceLabel: 'From LKR 1200'
        },
        {
          id: 'prod2',
          name: 'Mixed Flower Arrangements',
          description: 'Colorful seasonal flowers',
          image: 'https://images.unsplash.com/photo-1645093365896-348545896152?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGZsb3dlciUyMGJvdXF1ZXQlMjBnaWZ0fGVufDF8fHx8MTc3MTYwMTM5NXww&ixlib=rb-4.1.0&q=80&w=1080',
          price: 1500,
          priceLabel: 'From LKR 1500'
        }
      ]
    }
  };

  const shop = shopsData[shopId || ''] || shopsData['gifty-house'];

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
              <Link 
                to="/gifts"
                className="w-12 h-12 bg-yellow-400/10 hover:bg-yellow-400/20 rounded-xl flex items-center justify-center transition-all hover:scale-110 duration-300 border border-yellow-400/20 group"
              >
                <ArrowLeft className="w-5 h-5 text-yellow-400 group-hover:-translate-x-1 transition-transform duration-300" />
              </Link>

              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300">
                  <Gift className="w-7 h-7 text-black" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl text-white">{shop.name}</h1>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 text-sm">{shop.rating} ({shop.reviews} reviews)</span>
                </div>
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
        <section className="px-8 lg:px-12 py-12 relative">
          <div className="max-w-7xl mx-auto">
            {/* Hero Banner */}
            <div className="relative h-96 rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-yellow-500/10 animate-fadeIn">
              <img 
                src={shop.bannerImage}
                alt={shop.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
              
              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 right-0 p-10">
                <div className="flex items-end justify-between">
                  <div className="flex-1">
                    <h2 className="text-5xl text-white mb-4 font-bold">{shop.name}</h2>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-5 py-3 rounded-xl border border-yellow-400/30">
                        <MapPin className="w-5 h-5 text-yellow-400" />
                        <span className="text-white font-medium">{shop.location}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-5 py-3 rounded-xl border border-yellow-400/30">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="text-white font-medium">{shop.rating} Rating</span>
                      </div>
                    </div>
                  </div>
                  
                  <a
                    href={`tel:${shop.phone}`}
                    className="px-10 py-5 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold rounded-2xl shadow-2xl shadow-yellow-500/40 transition-all hover:scale-105 flex items-center gap-4 text-lg"
                  >
                    <Phone className="w-6 h-6" />
                    <span>Call & Order</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gradient-to-br from-green-600/20 to-green-700/10 border-2 border-green-500/20 rounded-3xl p-10 mb-12 animate-slideUp">
              <h3 className="text-3xl text-white mb-4 font-bold">{shop.name}</h3>
              <p className="text-gray-300 text-lg leading-relaxed">
                {shop.description}
              </p>
            </div>

            {/* Products Grid */}
            <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-4xl text-white font-bold">Our Products</h2>
                <div className="text-gray-400 text-lg">
                  {shop.products.length} items available
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {shop.products.map((product, index) => (
                  <div
                    key={product.id}
                    className="group relative bg-gradient-to-br from-green-600/10 to-green-700/5 border-2 border-green-500/20 hover:border-yellow-400/40 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10 animate-slideUp"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="relative md:w-64 h-64 flex-shrink-0">
                        <img 
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        
                        {/* Favorite Button */}
                        <button
                          onClick={() => toggleFavorite(product.id)}
                          className="absolute top-4 right-4 w-12 h-12 bg-black/80 hover:bg-black rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg border border-yellow-400/30"
                        >
                          <Heart 
                            className={`w-6 h-6 transition-all ${
                              favorites[product.id] 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-8 flex flex-col justify-between">
                        <div>
                          <h3 className="text-3xl text-white mb-3 font-bold group-hover:text-yellow-400 transition-colors duration-300">
                            {product.name}
                          </h3>
                          <p className="text-gray-400 text-lg leading-relaxed">
                            {product.description}
                          </p>
                        </div>

                        <div className="mt-6">
                          <div className="text-3xl text-white font-bold mb-4">
                            {product.priceLabel}
                          </div>
                          <a
                            href={`tel:${shop.phone}`}
                            className="block w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-center rounded-xl transition-all shadow-lg hover:shadow-xl font-bold text-lg"
                          >
                            Call to Order
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Offers Banner */}
            <div className="mt-16 relative overflow-hidden bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 border-2 border-yellow-400/30 rounded-3xl p-10 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center text-5xl shadow-xl">
                    🎉
                  </div>
                  <div>
                    <h3 className="text-3xl text-white mb-2 font-bold">Special Offers Available!</h3>
                    <p className="text-gray-300 text-lg">No delivery charges around university • Same day delivery available</p>
                  </div>
                </div>
                <a
                  href={`tel:${shop.phone}`}
                  className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold rounded-xl transition-all hover:scale-105 shadow-xl text-lg"
                >
                  Order Now
                </a>
              </div>
            </div>
          </div>
        </section>
      </PageLayout>
    </div>
  );
}