import { useState } from 'react';
import { Link } from 'react-router';
import { Search, SlidersHorizontal, MapPin, Bed, Users, Heart, Phone, Filter, Home, DollarSign, Calendar, Star } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { PageLayout } from '../components/PageLayout';
import { NotificationDropdown } from '../components/NotificationDropdown';
import userAvatar from 'figma:asset/902c55af84906a0971d3584133214377bc973536.png';

// Accommodation listing page for NearU platform
interface AccommodationListing {
  id: string;
  name: string;
  location: string;
  distance: string;
  price: number;
  priceUnit: string;
  bedrooms: number;
  availableFor: string;
  facilities: string[];
  image: string;
  rating: number;
  reviews: number;
  availableFrom: string;
  isFavorite: boolean;
  category: 'hostel' | 'boarding' | 'apartment' | 'shared';
}

const mockAccommodations: AccommodationListing[] = [
  {
    id: '1',
    name: 'Nilwala Boarding House',
    location: 'Near Y Junction',
    distance: '0.8 km from campus',
    price: 20000,
    priceUnit: '/month',
    bedrooms: 5,
    availableFor: 'Girls Only',
    facilities: ['Attached Bathrooms', 'Water Bill Free', 'Calm Environment', '3 Students per Room'],
    image: 'https://images.unsplash.com/photo-1549881567-c622c1080d78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3N0ZWwlMjBiZWRyb29tJTIwYnVuayUyMGJlZHN8ZW58MXx8fHwxNzcxNjg3Mzc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.5,
    reviews: 28,
    availableFrom: '2025-12-17',
    isFavorite: false,
    category: 'boarding',
  },
  {
    id: '2',
    name: 'Saubhagya Boarding House',
    location: 'Dalhousie Road',
    distance: '1.2 km from campus',
    price: 20000,
    priceUnit: '/month',
    bedrooms: 5,
    availableFor: 'Girls Only',
    facilities: ['Attached Bathrooms', 'WiFi Included', 'Study Area', '3 Students per Room'],
    image: 'https://images.unsplash.com/photo-1742094561291-069d8f61a34a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwZG9ybWl0b3J5JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzcxNTk3NTQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.8,
    reviews: 45,
    availableFrom: '2026-01-15',
    isFavorite: true,
    category: 'boarding',
  },
  {
    id: '3',
    name: 'Campus View Hostel',
    location: 'University Road',
    distance: '0.5 km from campus',
    price: 25000,
    priceUnit: '/month',
    bedrooms: 8,
    availableFor: 'Mixed',
    facilities: ['Common Kitchen', 'Laundry Service', 'Security 24/7', 'Parking Available'],
    image: 'https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwYXBhcnRtZW50JTIwYmVkcm9vbXxlbnwxfHx8fDE3NzE2ODIzODV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.3,
    reviews: 32,
    availableFrom: '2026-02-01',
    isFavorite: false,
    category: 'hostel',
  },
  {
    id: '4',
    name: 'Green Valley Apartments',
    location: 'Main Street',
    distance: '1.5 km from campus',
    price: 35000,
    priceUnit: '/month',
    bedrooms: 2,
    availableFor: 'Mixed',
    facilities: ['Fully Furnished', 'Private Bathroom', 'Kitchen', 'WiFi & TV'],
    image: 'https://images.unsplash.com/photo-1724185430857-747a68031165?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3N0ZWwlMjBzaGFyZWQlMjBraXRjaGVuJTIwZGluaW5nfGVufDF8fHx8MTc3MTY4NzM3N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.9,
    reviews: 18,
    availableFrom: '2026-03-01',
    isFavorite: false,
    category: 'apartment',
  },
  {
    id: '5',
    name: 'Student Hub Shared Rooms',
    location: 'College Lane',
    distance: '0.3 km from campus',
    price: 15000,
    priceUnit: '/month',
    bedrooms: 10,
    availableFor: 'Boys Only',
    facilities: ['Shared Bathroom', 'Study Desks', 'Common Area', '4 Students per Room'],
    image: 'https://images.unsplash.com/photo-1549881567-c622c1080d78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3N0ZWwlMjBiZWRyb29tJTIwYnVuayUyMGJlZHN8ZW58MXx8fHwxNzcxNjg3Mzc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.0,
    reviews: 52,
    availableFrom: 'Available Now',
    isFavorite: true,
    category: 'shared',
  },
  {
    id: '6',
    name: 'Peaceful Gardens Boarding',
    location: 'Garden Road',
    distance: '2.0 km from campus',
    price: 22000,
    priceUnit: '/month',
    bedrooms: 6,
    availableFor: 'Girls Only',
    facilities: ['Garden Access', 'Meals Included', 'WiFi', '2 Students per Room'],
    image: 'https://images.unsplash.com/photo-1742094561291-069d8f61a34a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwZG9ybWl0b3J5JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzcxNTk3NTQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.7,
    reviews: 36,
    availableFrom: '2026-01-20',
    isFavorite: false,
    category: 'boarding',
  },
];

export default function Accommodation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(mockAccommodations.filter(a => a.isFavorite).map(a => a.id))
  );

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const filteredAccommodations = mockAccommodations.filter(accommodation => {
    const matchesSearch = accommodation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          accommodation.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || accommodation.category === selectedCategory;
    const matchesGender = selectedGender === 'all' || 
                          accommodation.availableFor.toLowerCase().includes(selectedGender.toLowerCase()) ||
                          accommodation.availableFor === 'Mixed';
    const matchesPrice = accommodation.price >= priceRange[0] && accommodation.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesGender && matchesPrice;
  });

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
                <h1 className="text-2xl text-white">Accommodation Hub</h1>
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

          {/* Search Bar and Filters */}
          <div className="px-8 lg:px-12 pb-5">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search accommodation by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/50 rounded-xl text-white placeholder-gray-500 border-2 border-yellow-400/20 focus:border-yellow-400 focus:outline-none transition-all"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-yellow-500/20 font-medium"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span>Filters</span>
                {showFilters && <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full">Active</span>}
              </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
                {/* Category Filter */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Accommodation Type
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-gray-900/50 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-400 focus:outline-none"
                  >
                    <option value="all">All Types</option>
                    <option value="hostel">Hostel</option>
                    <option value="boarding">Boarding House</option>
                    <option value="apartment">Apartment</option>
                    <option value="shared">Shared Rooms</option>
                  </select>
                </div>

                {/* Gender Filter */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Available For
                  </label>
                  <select
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    className="w-full bg-gray-900/50 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-400 focus:outline-none"
                  >
                    <option value="all">All</option>
                    <option value="boys">Boys Only</option>
                    <option value="girls">Girls Only</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Price Range (LKR)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-1/2 bg-gray-900/50 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-yellow-400 focus:outline-none text-sm"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-1/2 bg-gray-900/50 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-yellow-400 focus:outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>
        
        {/* Main Content Area */}
        <section className="px-8 lg:px-12 py-12 relative">
          <div className="max-w-7xl mx-auto">
            {/* Hero Banner */}
            <div className="relative bg-gradient-to-r from-green-600 via-green-500 to-green-600 rounded-3xl p-12 mb-12 overflow-hidden shadow-2xl animate-fadeIn">
              {/* Decorative patterns */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.3) 1px, transparent 0)`,
                backgroundSize: '30px 30px'
              }}></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <Home className="w-8 h-8 text-yellow-300" />
                    <span className="text-yellow-300 text-lg font-medium">Find Your Home</span>
                  </div>
                  <h2 className="text-4xl lg:text-5xl text-white mb-4">
                    Safe living. Smart studying.<br />Happy Uni LIFE.
                  </h2>
                  <p className="text-xl text-white/95 mb-6">
                    Quick access to available boarding places and easily find a best place<br />
                    to stay as home via NearU.
                  </p>
                </div>

                {/* Accommodation Image */}
                <div className="relative w-80 h-64 flex-shrink-0">
                  <div className="absolute inset-0 bg-white/10 rounded-full blur-2xl"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1549881567-c622c1080d78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3N0ZWwlMjBiZWRyb29tJTIwYnVuayUyMGJlZHN8ZW58MXx8fHwxNzcxNjg3Mzc1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Accommodation"
                    className="relative w-full h-full object-cover rounded-2xl drop-shadow-2xl animate-float"
                  />
                </div>
              </div>
            </div>

            {/* Results Count and Clear Filters */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-4xl text-white mb-2">Available Accommodations</h2>
                <p className="text-gray-400">
                  Found <span className="text-yellow-400 font-semibold">{filteredAccommodations.length}</span> places to stay
                </p>
              </div>
              {(searchQuery || selectedCategory !== 'all' || selectedGender !== 'all' || priceRange[0] !== 0 || priceRange[1] !== 50000) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedGender('all');
                    setPriceRange([0, 50000]);
                  }}
                  className="text-yellow-400 hover:text-yellow-300 text-sm transition-colors px-4 py-2 border border-yellow-400/30 rounded-lg hover:border-yellow-400/60"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Accommodation Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slideUp">
              {filteredAccommodations.map((accommodation, index) => (
                <div
                  key={accommodation.id}
                  className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 hover:border-yellow-400/40 rounded-3xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/10 animate-slideUp cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={accommodation.image}
                      alt={accommodation.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(accommodation.id);
                      }}
                      className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-all hover:scale-110 active:scale-95"
                    >
                      <Heart
                        className={`w-5 h-5 transition-all ${
                          favorites.has(accommodation.id)
                            ? 'fill-red-500 text-red-500'
                            : 'text-white'
                        }`}
                      />
                    </button>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1 rounded-lg text-sm font-bold uppercase">
                      {accommodation.category}
                    </div>

                    {/* Rating */}
                    <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-yellow-400/30 flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-white text-sm font-medium">{accommodation.rating}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                      {accommodation.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                      <MapPin className="w-4 h-4 text-yellow-400" />
                      <span>{accommodation.location}</span>
                    </div>

                    {/* Quick Info */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Bed className="w-4 h-4 text-yellow-400" />
                        <span>{accommodation.bedrooms} Beds</span>
                      </div>
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-yellow-400" />
                        <span>{accommodation.availableFor}</span>
                      </div>
                    </div>

                    {/* Facilities */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {accommodation.facilities.slice(0, 2).map((facility, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full"
                          >
                            {facility}
                          </span>
                        ))}
                        {accommodation.facilities.length > 2 && (
                          <span className="text-xs bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded-full">
                            +{accommodation.facilities.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price and View Details */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-2xl text-yellow-400 font-bold">
                          LKR {accommodation.price.toLocaleString()}
                        </div>
                        <div className="text-gray-500 text-xs">{accommodation.priceUnit}</div>
                      </div>
                    </div>

                    <Link
                      to={`/accommodation/${accommodation.id}`}
                      className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all shadow-lg hover:shadow-xl font-medium flex items-center justify-center"
                    >
                      View Details
                    </Link>
                  </div>

                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredAccommodations.length === 0 && (
              <div className="text-center py-16">
                <Home className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                <h3 className="text-2xl text-gray-400 mb-2">No accommodations found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedGender('all');
                    setPriceRange([0, 50000]);
                  }}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Quick Info Banner */}
            <div className="mt-16 bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 border-2 border-yellow-400/20 rounded-3xl p-10 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-5xl mb-3">🏠</div>
                    <h4 className="text-xl text-white mb-2">Verified Listings</h4>
                    <p className="text-gray-400 text-sm">All properties verified by NearU team</p>
                  </div>
                  <div>
                    <div className="text-5xl mb-3">🔒</div>
                    <h4 className="text-xl text-white mb-2">Safe & Secure</h4>
                    <p className="text-gray-400 text-sm">Trusted accommodations for students</p>
                  </div>
                  <div>
                    <div className="text-5xl mb-3">💰</div>
                    <h4 className="text-xl text-white mb-2">Best Prices</h4>
                    <p className="text-gray-400 text-sm">Affordable options for every budget</p>
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