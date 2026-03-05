import { Link } from 'react-router';
import { ArrowRight, CheckCircle, Users, Shield, Zap, TrendingUp, Star, ChevronRight, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Users,
      title: 'Connected Community',
      description: 'Bridge the gap between students and local businesses through a unified digital platform.',
      stat: '10K+',
      statLabel: 'Active Users'
    },
    {
      icon: Shield,
      title: 'Verified Services',
      description: 'All providers are verified ensuring quality, reliability, and safety for every transaction.',
      stat: '100%',
      statLabel: 'Verified'
    },
    {
      icon: Zap,
      title: 'Instant Access',
      description: 'Find food, rides, accommodation, and jobs instantly without wasting time on endless searches.',
      stat: '<5min',
      statLabel: 'Avg Response'
    },
    {
      icon: TrendingUp,
      title: 'Local Growth',
      description: 'Empower local businesses with digital tools to reach students and grow their customer base.',
      stat: '300+',
      statLabel: 'Local Partners'
    }
  ];

  const services = [
    {
      title: 'Food Delivery',
      description: 'Order from campus restaurants with exclusive student discounts',
      image: 'https://images.unsplash.com/photo-1729860649884-40ec104f9dfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGVsaXZlcnklMjBzbWFydHBob25lJTIwYXBwfGVufDF8fHx8MTc3MTQyNTY2Mnww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      title: 'Student Housing',
      description: 'Find verified accommodations near your campus',
      image: 'https://images.unsplash.com/photo-1649800291434-f49d99f4e390?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwYWNjb21tb2RhdGlvbiUyMGhvdXNpbmd8ZW58MXx8fHwxNzcxNTE0NDcwfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      title: 'Part-Time Jobs',
      description: 'Discover flexible work opportunities tailored for students',
      image: 'https://images.unsplash.com/photo-1514178494750-80c2ed3def1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJ0JTIwdGltZSUyMGpvYiUyMHdvcmslMjBzdHVkZW50fGVufDF8fHx8MTc3MTUxNDQ3MHww&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Active Students' },
    { value: '500+', label: 'Local Businesses' },
    { value: '50,000+', label: 'Transactions' },
    { value: '4.8★', label: 'User Rating' }
  ];

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-black">
      {/* Fixed background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-yellow-600/5 animate-gradient"></div>

      {/* Floating orbs */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-float"></div>
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-yellow-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-yellow-400/20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🎓</span>
                </div>
                <div>
                  <span className="text-white text-2xl">Near<span className="text-yellow-400">U</span></span>
                  <p className="text-yellow-400/70 text-xs">Campus Connect</p>
                </div>
              </div>

              {/* Nav Links */}
              <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-gray-400 hover:text-yellow-400 transition-colors">Features</a>
                <a href="#services" className="text-gray-400 hover:text-yellow-400 transition-colors">Services</a>
                <a href="#about" className="text-gray-400 hover:text-yellow-400 transition-colors">About</a>
              </div>

              {/* CTA Buttons */}
              <div className="flex items-center gap-4">
                <Link 
                  to="/login" 
                  className="text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black rounded-xl transition-all shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105 duration-300"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6 lg:px-8 pt-20">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left - Content */}
              <div className="space-y-8 animate-slideIn">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 text-sm">Official Sabaragamuwa University Partner</span>
                </div>

                {/* Heading */}
                <div className="space-y-4">
                  <h1 className="text-5xl lg:text-7xl text-white leading-tight">
                    Your Campus.<br />
                    <span className="text-yellow-400">Connected.</span>
                  </h1>
                  <p className="text-xl text-gray-400 leading-relaxed">
                    The all-in-one platform connecting university students with local services, 
                    verified providers, and opportunities—right at your fingertips.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Link 
                    to="/register" 
                    className="group px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black rounded-2xl transition-all shadow-2xl shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105 duration-300 flex items-center gap-3"
                  >
                    <span className="text-lg">Start Exploring</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    to="/home" 
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl border-2 border-yellow-400/20 hover:border-yellow-400/40 transition-all backdrop-blur-sm hover:scale-105 duration-300 flex items-center gap-3"
                  >
                    <span className="text-lg">View Demo</span>
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-6 pt-8 border-t border-yellow-400/10">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <p className="text-2xl lg:text-3xl text-yellow-400 mb-1">{stat.value}</p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right - Illustration */}
              <div className="relative animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-3xl blur-3xl"></div>
                  
                  {/* Main image */}
                  <div className="relative rounded-3xl overflow-hidden border-2 border-yellow-400/20 shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1758270704524-596810e891b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudHMlMjBjYW1wdXMlMjBjb21tdW5pdHl8ZW58MXx8fHwxNzcxNTE0NDY5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="University Campus"
                      className="w-full h-auto"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  </div>

                  {/* Floating cards */}
                  <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-400/30 rounded-2xl p-4 backdrop-blur-xl shadow-xl animate-float">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <p className="text-white text-sm">Verified</p>
                        <p className="text-yellow-400 text-xs">100% Secure</p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -top-6 -right-6 bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-400/30 rounded-2xl p-4 backdrop-blur-xl shadow-xl animate-float" style={{ animationDelay: '1s' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                        <Star className="w-6 h-6 text-black fill-black" />
                      </div>
                      <div>
                        <p className="text-white text-sm">Rating</p>
                        <p className="text-yellow-400 text-xs">4.8 / 5.0</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 lg:px-8 relative">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16 animate-fadeIn">
              <h2 className="text-4xl lg:text-5xl text-white mb-4">
                Why Choose <span className="text-yellow-400">NearU</span>?
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                A comprehensive platform designed to solve real challenges faced by students and local businesses
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    onMouseEnter={() => setActiveFeature(index)}
                    className={`group relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border-2 rounded-3xl p-8 transition-all duration-500 hover:scale-105 cursor-pointer animate-slideUp ${
                      activeFeature === index
                        ? 'border-yellow-400/60 shadow-2xl shadow-yellow-500/20'
                        : 'border-yellow-400/20 hover:border-yellow-400/40'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Icon */}
                    <div className="relative mb-6">
                      <div className={`absolute inset-0 bg-yellow-400 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
                      <div className="relative w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-8 h-8 text-black" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl text-white mb-3 group-hover:text-yellow-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                      {feature.description}
                    </p>

                    {/* Stat */}
                    <div className="pt-6 border-t border-yellow-400/10">
                      <p className="text-3xl text-yellow-400 mb-1">{feature.stat}</p>
                      <p className="text-xs text-gray-500">{feature.statLabel}</p>
                    </div>

                    {/* Corner decoration */}
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 px-6 lg:px-8 relative">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16 animate-fadeIn">
              <h2 className="text-4xl lg:text-5xl text-white mb-4">
                Everything You Need.<br />
                <span className="text-yellow-400">One Platform.</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                From daily essentials to career opportunities, we've got you covered
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-400/20 hover:border-yellow-400/60 transition-all duration-500 hover:scale-105 animate-slideUp"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h3 className="text-2xl text-white mb-3 group-hover:text-yellow-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 mb-6">
                      {service.description}
                    </p>
                    <button className="flex items-center gap-2 text-yellow-400 group-hover:gap-4 transition-all">
                      <span>Learn more</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 via-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Problem & Solution Section */}
        <section id="about" className="py-24 px-6 lg:px-8 relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left - Problem */}
              <div className="space-y-8 animate-slideIn">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full">
                  <span className="text-red-400 text-sm">⚠️ The Problem</span>
                </div>
                
                <h2 className="text-4xl lg:text-5xl text-white">
                  Students Face<br />
                  <span className="text-red-400">Daily Challenges</span>
                </h2>

                <div className="space-y-4">
                  {[
                    'Inefficient word-of-mouth recommendations',
                    'Unorganized social media groups',
                    'Time-consuming physical searches',
                    'Difficulty verifying service quality',
                    'Limited options and price comparison',
                    'Risk of fraud or poor service'
                  ].map((problem, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                      <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-400 text-xs">✕</span>
                      </div>
                      <p className="text-gray-300">{problem}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right - Solution */}
              <div className="space-y-8 animate-slideIn" style={{ animationDelay: '0.3s' }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full">
                  <span className="text-yellow-400 text-sm">✓ Our Solution</span>
                </div>
                
                <h2 className="text-4xl lg:text-5xl text-white">
                  NearU Makes It<br />
                  <span className="text-yellow-400">Effortless</span>
                </h2>

                <div className="space-y-4">
                  {[
                    'Centralized platform for all services',
                    'Verified and trusted providers',
                    'Instant search and comparison',
                    'Transparent ratings and reviews',
                    'Secure digital transactions',
                    'Real-time availability updates'
                  ].map((solution, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-yellow-400/5 border border-yellow-400/20 rounded-xl hover:bg-yellow-400/10 transition-colors">
                      <div className="w-6 h-6 bg-yellow-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-4 h-4 text-yellow-400" />
                      </div>
                      <p className="text-gray-300">{solution}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-30"></div>
              <h2 className="relative text-5xl lg:text-6xl text-white">
                Ready to <span className="text-yellow-400">Connect</span>?
              </h2>
            </div>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join thousands of students and local businesses already thriving on NearU
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-8">
              <Link 
                to="/register" 
                className="group px-10 py-5 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black rounded-2xl transition-all shadow-2xl shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-110 duration-300 flex items-center gap-3"
              >
                <span className="text-xl">Get Started Free</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-yellow-400/10 py-12 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              {/* Brand */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🎓</span>
                  </div>
                  <span className="text-white text-xl">Near<span className="text-yellow-400">U</span></span>
                </div>
                <p className="text-gray-500 text-sm">
                  Connecting campus communities with trusted local services.
                </p>
              </div>

              {/* Links */}
              <div>
                <h4 className="text-white mb-4">Platform</h4>
                <div className="space-y-2">
                  {['Features', 'Services', 'Pricing', 'About'].map((link) => (
                    <a key={link} href="#" className="block text-gray-500 hover:text-yellow-400 text-sm transition-colors">
                      {link}
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-white mb-4">Support</h4>
                <div className="space-y-2">
                  {['Help Center', 'Contact', 'FAQ', 'Terms'].map((link) => (
                    <a key={link} href="#" className="block text-gray-500 hover:text-yellow-400 text-sm transition-colors">
                      {link}
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-white mb-4">Connect</h4>
                <div className="space-y-2">
                  {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((link) => (
                    <a key={link} href="#" className="block text-gray-500 hover:text-yellow-400 text-sm transition-colors">
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-yellow-400/10 text-center text-gray-500 text-sm">
              © 2025 NearU. All rights reserved. Made with ❤️ for Sabaragamuwa University
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
