import { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { PageLayout } from '../components/PageLayout';
import { EnhancedServiceCard } from '../components/EnhancedServiceCard';
import { DealCard } from '../components/DealCard';
import { ReviewCard } from '../components/ReviewCard';
import { NotificationDropdown } from '../components/NotificationDropdown';
import { Bell, User, Plus, Tag, TrendingUp, Heart, Sparkles, MapPin, X, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import userAvatar from 'figma:asset/902c55af84906a0971d3584133214377bc973536.png';

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    rating: 5,
    review: ''
  });
  const [reviews, setReviews] = useState([
    {
      name: 'Thimira',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      rating: 5,
      review: 'NearU has completely transformed my university life! The food delivery is super fast and the student discounts are amazing. Highly recommended for all students!',
      date: '2 days ago',
    },
    {
      name: 'Uvindu',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      rating: 5,
      review: 'Love the ride-sharing feature! It\'s so convenient for getting to campus and back. The drivers are friendly and the app is really easy to use. Great service overall!',
      date: '1 week ago',
    },
    {
      name: 'Manjari',
      avatar: userAvatar,
      rating: 5,
      review: 'Found my perfect accommodation through NearU Bodims. The verified listings gave me peace of mind and the booking process was seamless. Thank you NearU!',
      date: '3 weeks ago',
    },
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'offers', 'reviews'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    { 
      image: 'https://images.unsplash.com/photo-1766592817657-fc61d166f06f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGVsaXZlcnklMjByZXN0YXVyYW50JTIwbWVhbHxlbnwxfHx8fDE3NzE2MDIyMzF8MA&ixlib=rb-4.1.0&q=80&w=1080', 
      label: 'Food Delivery', 
      description: 'Order from nearby restaurants with exclusive student discounts',
      gradient: 'bg-gradient-to-br from-orange-600/20 to-red-700/20',
      iconBg: 'bg-gradient-to-br from-orange-500 to-red-600',
      count: '50+'
    },
    { 
      image: 'https://images.unsplash.com/photo-1768461831418-2ef9e050da72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1wdXMlMjB0cmFuc3BvcnRhdGlvbiUyMGJpY3ljbGUlMjByaWRlfGVufDF8fHx8MTc3MTYwMjIzMnww&ixlib=rb-4.1.0&q=80&w=1080', 
      label: 'Campus Rides', 
      description: 'Quick and affordable transportation around campus and city',
      gradient: 'bg-gradient-to-br from-blue-600/20 to-cyan-700/20',
      iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      count: '24/7'
    },
    { 
      image: 'https://images.unsplash.com/photo-1707903074794-e35472388c44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwYWNjb21tb2RhdGlvbiUyMGFwYXJ0bWVudHxlbnwxfHx8fDE3NzE2MDIyMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080', 
      label: 'Accommodation', 
      description: 'Find verified boarding houses and apartments near university',
      gradient: 'bg-gradient-to-br from-green-600/20 to-emerald-700/20',
      iconBg: 'bg-gradient-to-br from-green-500 to-emerald-600',
      count: '100+'
    },
    { 
      image: 'https://images.unsplash.com/photo-1514178494750-80c2ed3def1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJ0JTIwdGltZSUyMGpvYiUyMHN0dWRlbnQlMjB3b3JrfGVufDF8fHx8MTc3MTYwMjIzMnww&ixlib=rb-4.1.0&q=80&w=1080', 
      label: 'Part-Time Jobs', 
      description: 'Discover flexible work opportunities tailored for students',
      gradient: 'bg-gradient-to-br from-purple-600/20 to-violet-700/20',
      iconBg: 'bg-gradient-to-br from-purple-500 to-violet-600',
      count: 'New'
    },
    { 
      image: 'https://images.unsplash.com/photo-1764385827580-7a602f33c524?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaWZ0JTIwYm94JTIwcHJlc2VudCUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc3MTYwMjIzM3ww&ixlib=rb-4.1.0&q=80&w=1080', 
      label: 'Custom Gifts', 
      description: 'Personalized gifts for any occasion, delivered to campus',
      gradient: 'bg-gradient-to-br from-pink-600/20 to-rose-700/20',
      iconBg: 'bg-gradient-to-br from-pink-500 to-rose-600',
      count: '🎁'
    },
  ];

  const deals = [
    {
      title: '50% Off on First Food Order',
      description: 'Get amazing discounts on your first order from any restaurant. Limited time offer!',
      discount: '50% OFF',
      image: 'https://images.unsplash.com/photo-1766592817657-fc61d166f06f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGVsaXZlcnklMjByZXN0YXVyYW50JTIwbWVhbHxlbnwxfHx8fDE3NzE0OTUzOTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      title: 'Free Ride Credits',
      description: 'Earn free ride credits worth $20 when you refer a friend to NearU Rides.',
      discount: 'FREE $20',
      image: 'https://images.unsplash.com/photo-1745139440352-37dac08fb978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWN5Y2xlJTIwZGVsaXZlcnklMjBzZXJ2aWNlJTIwcmlkZXxlbnwxfHx8fDE3NzE1MTI2MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      title: 'Student Housing Special',
      description: 'Find the perfect accommodation with exclusive student discounts and verified listings.',
      discount: '30% OFF',
      image: 'https://images.unsplash.com/photo-1641443084309-7b73be298683?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwYWNjb21tb2RhdGlvbiUyMGRvcm1pdG9yeXxlbnwxfHx8fDE3NzE1MTI2MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleReviewFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReviewFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add the new review to the reviews array
    const newReview = {
      name: reviewForm.name,
      avatar: userAvatar,
      rating: parseInt(reviewForm.rating.toString()),
      review: reviewForm.review,
      date: 'Just now'
    };
    setReviews(prev => [...prev, newReview]);
    // Reset the form
    setReviewForm({
      name: '',
      rating: 5,
      review: ''
    });
    // Close the modal
    setIsReviewModalOpen(false);
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-yellow-600/5 animate-gradient pointer-events-none"></div>
      
      {/* Animated radial dots pattern */}
      <div className="fixed inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(250, 204, 21, 0.4) 1px, transparent 0)`,
        backgroundSize: '40px 40px',
        animation: 'gridMove 30s linear infinite'
      }}></div>

      {/* Large floating orbs */}
      <div className="fixed top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="fixed bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-yellow-600/10 to-amber-500/10 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }}></div>
      <div className="fixed top-1/2 right-1/3 w-[400px] h-[400px] bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '4s' }}></div>

      {/* Sidebar */}
      <Sidebar activeSection={activeSection} />

      {/* Main Content */}
      <PageLayout>
        {/* Enhanced Header */}
        <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-2xl border-b-2 border-yellow-400/20 shadow-2xl shadow-yellow-400/5">
          <div className="flex items-center justify-between px-8 lg:px-12 py-5">
            {/* Left - Logo & Greeting */}
            <div className="flex items-center gap-6">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">🎓</span>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl text-white">{getGreeting()}, <span className="text-yellow-400 animate-pulse">Manjari</span></h1>
                  <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                </div>
                <div className="flex items-center gap-2 text-yellow-400/70 text-xs">
                  <MapPin className="w-3 h-3" />
                  <span>Sabaragamuwa University</span>
                </div>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-4">
              {/* Quick Stats */}
              

              {/* Notifications */}
              <NotificationDropdown />
              
              {/* Profile */}
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

        {/* Hero Section */}
        <section id="home" className="px-8 lg:px-12 py-12 relative">
          {/* Welcome Banner */}
          <div className="max-w-7xl mx-auto mb-12 relative group">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Content */}
            <div className="relative bg-gradient-to-br from-yellow-400/10 via-yellow-500/5 to-transparent rounded-3xl p-10 border-2 border-yellow-400/20 backdrop-blur-sm animate-fadeIn hover:border-yellow-400/40 transition-all duration-500 shadow-2xl overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-yellow-400/20 to-transparent rounded-full blur-3xl"></div>
              
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-3xl blur-xl animate-pulse"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-3xl flex items-center justify-center shadow-2xl">
                      <User className="w-10 h-10 text-black" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-4xl lg:text-5xl text-white mb-2 flex items-center gap-3">
                      Hello <span className="text-yellow-400">Manjari</span>
                      <span className="text-3xl animate-bounce">👋</span>
                    </h2>
                    <p className="text-gray-400 text-lg">What would you like to do today?</p>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex gap-3">
                  <button 
                    onClick={() => navigate('/food')}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black rounded-xl transition-all shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105 duration-300 border-2 border-black/20"
                  >
                    Order Food
                  </button>
                  <button 
                    onClick={() => navigate('/rides')}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 hover:border-yellow-400/40 transition-all backdrop-blur-sm hover:scale-105 duration-300"
                  >
                    Book Ride
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Services Grid */}
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <h3 className="text-2xl text-white">Explore Services</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <EnhancedServiceCard 
                  key={service.label}
                  {...service}
                  delay={`${index * 0.1}s`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Deals & Offers Section */}
        <section id="offers" className="px-8 lg:px-12 py-12 relative">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8 animate-slideIn">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-50 animate-pulse"></div>
                <Tag className="relative w-10 h-10 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-4xl text-yellow-400">Hot Deals & Offers</h2>
                <p className="text-gray-400 text-sm">Limited time exclusive offers just for you</p>
              </div>
              <div className="flex-1 h-1 bg-gradient-to-r from-yellow-400/50 via-yellow-400/20 to-transparent ml-4 rounded-full"></div>
            </div>

            {/* Deals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map((deal, index) => (
                <DealCard 
                  key={index}
                  {...deal}
                  delay={`${index * 0.15}s`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section id="reviews" className="px-8 lg:px-12 py-12 pb-24 relative">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8 animate-slideIn">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-50 animate-pulse"></div>
                <User className="relative w-10 h-10 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-4xl text-yellow-400">What Students Say</h2>
                <p className="text-gray-400 text-sm">Real experiences from our community members</p>
              </div>
              <div className="flex-1 h-1 bg-gradient-to-r from-yellow-400/50 via-yellow-400/20 to-transparent ml-4 rounded-full"></div>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {reviews.map((review, index) => (
                <ReviewCard 
                  key={index}
                  {...review}
                  delay={`${index * 0.15}s`}
                />
              ))}
            </div>

            {/* Add Review Button */}
            <div className="flex justify-center animate-fadeIn" style={{ animationDelay: '0.6s' }}>
              <button className="group relative px-10 py-5 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black rounded-2xl transition-all shadow-2xl shadow-yellow-500/30 hover:shadow-yellow-500/50 border-2 border-black/20 flex items-center gap-3 hover:scale-110 duration-300 overflow-hidden" onClick={() => setIsReviewModalOpen(true)}>
                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Plus className="w-6 h-6 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
                <span className="text-xl relative z-10">Share Your Experience</span>
              </button>
            </div>
          </div>
        </section>
      </PageLayout>

      {/* Review Modal */}
      {isReviewModalOpen && (
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
                  <Star className="w-6 h-6 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-white">Share Your Experience</h2>
              </div>
              <button 
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center transition-all text-gray-400 hover:text-white" 
                onClick={() => setIsReviewModalOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleReviewFormSubmit} className="relative space-y-6">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-2">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={reviewForm.name}
                  onChange={handleReviewFormChange}
                  required
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-yellow-400/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-all"
                />
              </div>

              {/* Rating Input */}
              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-2">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                      className="group transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star
                        className={`w-8 h-8 transition-all ${
                          reviewForm.rating >= star 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-600 group-hover:text-gray-500'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-yellow-400 font-medium">{reviewForm.rating}/5</span>
                </div>
              </div>

              {/* Review Textarea */}
              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-2">Your Review</label>
                <textarea
                  name="review"
                  value={reviewForm.review}
                  onChange={handleReviewFormChange}
                  required
                  placeholder="Share your experience with NearU..."
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-yellow-400/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-6 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black rounded-xl font-bold transition-all shadow-xl shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105 duration-300 border-2 border-black/20"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}