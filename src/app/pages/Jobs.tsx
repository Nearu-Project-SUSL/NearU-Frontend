import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { PageLayout } from '../components/PageLayout';
import { Briefcase, Star, MapPin, Phone, Search, Sparkles, Clock, Users, DollarSign, Calendar, TrendingUp, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { NotificationDropdown } from '../components/NotificationDropdown';
import userAvatar from 'figma:asset/902c55af84906a0971d3584133214377bc973536.png';
import jobHeroImage from 'figma:asset/aa2d35b36877e4987df5bbeb46939c2e561509b7.png';
import jobCardImage from 'figma:asset/118505676d6f74a8cfee4cd2ea4276f52b6cd2a2.png';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: number;
  salaryPeriod: string;
  workers: number;
  availableFor: string;
  jobType: string;
  description: string;
  postedDate: string;
  duration: string;
  phone: string;
  featured?: boolean;
  category: string;
}

export default function Jobs() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedJobType, setSelectedJobType] = useState<string>('all');
  const [favoriteJobs, setFavoriteJobs] = useState<Set<string>>(new Set(['1', '2'])); // Mock favorites

  const toggleFavorite = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation(); // Prevent card click
    setFavoriteJobs(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(jobId)) {
        newFavorites.delete(jobId);
      } else {
        newFavorites.add(jobId);
      }
      return newFavorites;
    });
  };

  const jobs: Job[] = [
    {
      id: '1',
      title: 'Food Service Worker',
      company: 'Belihul Oya Resort',
      location: 'Belihuloya, Galagama',
      salary: 3000,
      salaryPeriod: 'per day',
      workers: 3,
      availableFor: 'Boys',
      jobType: 'Part-Time',
      description: 'Day and night food serving. 3 days service. Great opportunity for students during holidays.',
      postedDate: '2025-12-17',
      duration: '3 days',
      phone: '+94 77 123 4567',
      featured: true,
      category: 'Hospitality'
    },
    {
      id: '2',
      title: 'Campus Tour Guide',
      company: 'Sabaragamuwa University',
      location: 'University Campus',
      salary: 2500,
      salaryPeriod: 'per day',
      workers: 5,
      availableFor: 'Mixed',
      jobType: 'Part-Time',
      description: 'Guide prospective students and visitors around campus. Weekend availability required.',
      postedDate: '2026-01-10',
      duration: 'Weekends',
      phone: '+94 77 234 5678',
      featured: true,
      category: 'Education'
    },
    {
      id: '3',
      title: 'Content Writer',
      company: 'Local Marketing Agency',
      location: 'Remote/Flexible',
      salary: 5000,
      salaryPeriod: 'per article',
      workers: 2,
      availableFor: 'Mixed',
      jobType: 'Freelance',
      description: 'Write engaging blog posts and social media content. Flexible hours, work from anywhere.',
      postedDate: '2026-02-01',
      duration: 'Ongoing',
      phone: '+94 77 345 6789',
      category: 'Creative'
    },
    {
      id: '4',
      title: 'Tutor - Mathematics',
      company: 'Private Tutoring',
      location: 'Near Campus',
      salary: 2000,
      salaryPeriod: 'per hour',
      workers: 3,
      availableFor: 'Mixed',
      jobType: 'Part-Time',
      description: 'Help high school students with A/L mathematics. Evening hours available.',
      postedDate: '2026-01-25',
      duration: 'Ongoing',
      phone: '+94 77 456 7890',
      category: 'Education'
    },
    {
      id: '5',
      title: 'Graphic Designer',
      company: 'Student Startup',
      location: 'Remote',
      salary: 15000,
      salaryPeriod: 'per project',
      workers: 1,
      availableFor: 'Mixed',
      jobType: 'Freelance',
      description: 'Create social media graphics and promotional materials. Portfolio required.',
      postedDate: '2026-02-05',
      duration: 'Project-based',
      phone: '+94 77 567 8901',
      category: 'Creative'
    },
    {
      id: '6',
      title: 'Shop Assistant',
      company: 'Campus Bookstore',
      location: 'University Campus',
      salary: 1500,
      salaryPeriod: 'per day',
      workers: 2,
      availableFor: 'Mixed',
      jobType: 'Part-Time',
      description: 'Assist customers, manage inventory, and handle cashier duties. Afternoon shifts.',
      postedDate: '2026-01-20',
      duration: 'Ongoing',
      phone: '+94 77 678 9012',
      category: 'Retail'
    },
    {
      id: '7',
      title: 'Social Media Manager',
      company: 'Student Club',
      location: 'Campus',
      salary: 8000,
      salaryPeriod: 'per month',
      workers: 1,
      availableFor: 'Mixed',
      jobType: 'Part-Time',
      description: 'Manage social media accounts, create content, and engage with followers.',
      postedDate: '2026-02-08',
      duration: '6 months',
      phone: '+94 77 789 0123',
      category: 'Marketing'
    },
    {
      id: '8',
      title: 'Event Staff',
      company: 'Event Management Co.',
      location: 'Various Locations',
      salary: 2500,
      salaryPeriod: 'per event',
      workers: 10,
      availableFor: 'Mixed',
      jobType: 'Part-Time',
      description: 'Help with event setup, registration, and customer service. Weekend availability.',
      postedDate: '2026-01-15',
      duration: 'Event-based',
      phone: '+94 77 890 1234',
      featured: true,
      category: 'Events'
    }
  ];

  const featuredJobs = jobs.filter(j => j.featured);
  const regularJobs = jobs.filter(j => !j.featured);

  const filteredJobs = [...featuredJobs, ...regularJobs].filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
    const matchesJobType = selectedJobType === 'all' || job.jobType === selectedJobType;
    
    return matchesSearch && matchesCategory && matchesJobType;
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
      <Sidebar activeSection="jobs" />

      {/* Main Content */}
      <PageLayout>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-2xl border-b-2 border-yellow-400/20 shadow-2xl shadow-yellow-400/5">
          <div className="flex items-center justify-between px-8 lg:px-12 py-5">
            <div className="flex items-center gap-6">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-7 h-7 text-black" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl text-white">Jobs Hub</h1>
                <p className="text-yellow-400/70 text-sm">Flexible part-time jobs opportunities</p>
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
                  placeholder="Search jobs, companies, or locations..."
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
                <option value="Hospitality">Hospitality</option>
                <option value="Education">Education</option>
                <option value="Creative">Creative</option>
                <option value="Retail">Retail</option>
                <option value="Marketing">Marketing</option>
                <option value="Events">Events</option>
              </select>

              <select
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
                className="px-4 py-3 bg-gray-900/50 text-white rounded-xl border-2 border-yellow-400/20 focus:border-yellow-400 focus:outline-none transition-all"
              >
                <option value="all">All Types</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
          </div>
        </header>
        
        {/* Main Content Area */}
        <section className="px-8 lg:px-12 py-12 relative">
          <div className="max-w-7xl mx-auto">
            {/* Hero Banner */}
            <div className="relative bg-gradient-to-r from-green-600 via-green-500 to-green-600 rounded-3xl overflow-hidden shadow-2xl animate-fadeIn mb-12">
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.3) 1px, transparent 0)`,
                backgroundSize: '30px 30px'
              }}></div>
              
              <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center p-12">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-8 h-8 text-yellow-300" />
                    <span className="text-yellow-300 text-lg font-medium">Earn While You Learn</span>
                  </div>
                  <h2 className="text-4xl lg:text-5xl text-white mb-4">
                    Flexible part-time jobs<br />opportunities
                  </h2>
                  <p className="text-xl text-white/95 mb-6">
                    Quick access to available part time jobs contact numbers and easily find<br />
                    a chance to earn something while learning via NearU.
                  </p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-3xl text-white font-bold">{jobs.length}+</div>
                      <div className="text-white/80 text-sm">Active Jobs</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-3xl text-white font-bold">50+</div>
                      <div className="text-white/80 text-sm">Companies</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-3xl text-white font-bold">200+</div>
                      <div className="text-white/80 text-sm">Students Hired</div>
                    </div>
                  </div>
                </div>

                {/* Hero Image */}
                <div className="relative">
                  <div className="absolute inset-0 bg-white/10 rounded-3xl blur-2xl"></div>
                  <img 
                    src={jobHeroImage}
                    alt="Part-time jobs"
                    className="relative w-full h-full object-contain rounded-2xl drop-shadow-2xl animate-float"
                  />
                </div>
              </div>
            </div>

            {/* Featured Jobs Section */}
            {featuredJobs.length > 0 && (
              <div className="mb-16 animate-slideUp" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-4xl text-white mb-2">New Opportunities</h2>
                    <p className="text-gray-400">Fresh job postings just for you</p>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-400">
                    <TrendingUp className="w-5 h-5" />
                    <span>Hot Jobs</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featuredJobs.map((job, index) => (
                    <div
                      key={job.id}
                      className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 hover:border-yellow-400/60 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20 animate-slideUp cursor-pointer"
                      style={{ animationDelay: `${index * 0.15}s` }}
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      {/* Job Image */}
                      <div className="relative h-64 overflow-hidden">
                        <img 
                          src={jobCardImage}
                          alt={job.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                        
                        {/* Job Type Badge */}
                        <div className="absolute top-4 left-4 bg-yellow-400 text-black px-4 py-2 rounded-xl text-sm font-bold">
                          {job.jobType}
                        </div>

                        {/* Featured Badge */}
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl text-sm font-bold">
                          🔥 Featured
                        </div>

                        {/* Favorite Button */}
                        <button
                          onClick={(e) => toggleFavorite(e, job.id)}
                          className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full p-3 transition-all hover:scale-110 z-10"
                        >
                          <Heart
                            className={`w-6 h-6 transition-all ${
                              favoriteJobs.has(job.id) 
                                ? 'fill-red-500 stroke-red-500' 
                                : 'fill-none stroke-white hover:stroke-red-500'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-8">
                        <h3 className="text-3xl text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                          {job.title}
                        </h3>
                        <p className="text-gray-400 mb-2 text-lg">{job.company}</p>
                        <p className="text-gray-500 mb-6">{job.description}</p>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <MapPin className="w-4 h-4 text-yellow-400" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Users className="w-4 h-4 text-yellow-400" />
                            <span>{job.workers} positions</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                          <div>
                            <div className="text-2xl text-yellow-400 font-bold">
                              LKR {job.salary.toLocaleString()}
                            </div>
                            <div className="text-gray-500 text-xs">{job.salaryPeriod}</div>
                          </div>
                          
                          <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all shadow-lg hover:shadow-xl font-medium">
                            View Details
                          </button>
                        </div>
                      </div>

                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Jobs Section */}
            <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-4xl text-white mb-2">All Opportunities</h2>
                  <p className="text-gray-400">
                    Found <span className="text-yellow-400 font-semibold">{filteredJobs.length}</span> job listings
                  </p>
                </div>
                {(searchQuery || selectedCategory !== 'all' || selectedJobType !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedJobType('all');
                    }}
                    className="text-yellow-400 hover:text-yellow-300 text-sm transition-colors px-4 py-2 border border-yellow-400/30 rounded-lg hover:border-yellow-400/60"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job, index) => (
                  <div
                    key={job.id}
                    className="group relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 hover:border-yellow-400/40 rounded-3xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/10 animate-slideUp cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    {/* Job Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={jobCardImage}
                        alt={job.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1 rounded-lg text-sm font-bold">
                        {job.category}
                      </div>

                      {/* Workers Needed */}
                      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-yellow-400/30 flex items-center gap-1">
                        <Users className="w-4 h-4 text-yellow-400" />
                        <span className="text-white text-sm font-medium">{job.workers} needed</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-2xl text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                        {job.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4">{job.company}</p>

                      <div className="flex items-center gap-3 mb-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-yellow-400" />
                          <span className="truncate">{job.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-yellow-400" />
                          <span>{job.duration}</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                        <span className="px-2 py-1 bg-yellow-400/10 text-yellow-400 rounded-full text-xs">
                          {job.availableFor}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                        <div>
                          <div className="text-xl text-yellow-400 font-bold">
                            LKR {job.salary.toLocaleString()}
                          </div>
                          <div className="text-gray-500 text-xs">{job.salaryPeriod}</div>
                        </div>
                      </div>
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => toggleFavorite(e, job.id)}
                      className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm rounded-full p-2 transition-all group-hover:scale-110"
                    >
                      <Heart
                        className="w-5 h-5"
                        fill={favoriteJobs.has(job.id) ? 'red' : 'none'}
                        stroke={favoriteJobs.has(job.id) ? 'none' : 'red'}
                      />
                    </button>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredJobs.length === 0 && (
                <div className="text-center py-16">
                  <Briefcase className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-2xl text-gray-400 mb-2">No jobs found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedJobType('all');
                    }}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            {/* Quick Info Banner */}
            <div className="mt-16 bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 border-2 border-yellow-400/20 rounded-3xl p-10 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
              <div className="max-w-4xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-5xl mb-3">💼</div>
                    <h4 className="text-xl text-white mb-2">Verified Employers</h4>
                    <p className="text-gray-400 text-sm">All jobs verified by NearU team</p>
                  </div>
                  <div>
                    <div className="text-5xl mb-3">⚡</div>
                    <h4 className="text-xl text-white mb-2">Quick Apply</h4>
                    <p className="text-gray-400 text-sm">Easy application process</p>
                  </div>
                  <div>
                    <div className="text-5xl mb-3">🎓</div>
                    <h4 className="text-xl text-white mb-2">Student Friendly</h4>
                    <p className="text-gray-400 text-sm">Flexible hours for students</p>
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