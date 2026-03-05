import { useState, useRef } from 'react';
import { Sidebar } from '../components/Sidebar';
import { PageLayout } from '../components/PageLayout';
import { User, Mail, Phone, MapPin, Calendar, GraduationCap, Edit2, Save, X, Settings, Heart, Bookmark, Briefcase, Home as HomeIcon, Tag, UtensilsCrossed, Camera, Bell, Shield, LogOut, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { NotificationDropdown } from '../components/NotificationDropdown';
import userAvatar from 'figma:asset/902c55af84906a0971d3584133214377bc973536.png';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'settings'>('overview');
  const [profilePicture, setProfilePicture] = useState<string>(userAvatar);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profileData, setProfileData] = useState({
    name: 'Kasun Perera',
    studentId: 'SUSL/2023/CS/001',
    email: 'kasun.perera@std.susl.ac.lk',
    phone: '+94 77 123 4567',
    faculty: 'Computing',
    degree: 'BSc (Hons) in Computer Science',
    year: '2nd Year',
    location: 'Belihuloya, Sri Lanka',
    joinDate: 'January 2023',
    bio: 'Computer Science student passionate about technology and innovation. Looking for part-time opportunities and exploring local services around campus.'
  });

  const [editForm, setEditForm] = useState(profileData);

  const stats = [
    { label: 'Jobs Applied', value: '12', icon: Briefcase, color: 'from-blue-500 to-blue-600' },
    { label: 'Saved Deals', value: '8', icon: Tag, color: 'from-yellow-500 to-yellow-600' },
    { label: 'Bookmarks', value: '15', icon: Bookmark, color: 'from-purple-500 to-purple-600' },
    { label: 'Favorites', value: '6', icon: Heart, color: 'from-red-500 to-red-600' }
  ];

  const savedItems = {
    jobs: [
      { id: 1, title: 'Food Service Worker', company: 'Belihul Oya Resort', type: 'jobs' },
      { id: 2, title: 'Campus Tour Guide', company: 'Sabaragamuwa University', type: 'jobs' }
    ],
    deals: [
      { id: 1, title: '50% Off on All Meals', business: 'Campus Canteen', type: 'deals' },
      { id: 2, title: 'Buy 1 Get 1 Free Coffee', business: 'Brew & Bean Cafe', type: 'deals' }
    ],
    accommodations: [
      { id: 1, title: 'Modern Studio Apartment', location: '500m from Campus', type: 'accommodation' }
    ]
  };

  const recentActivity = [
    { action: 'Applied to Food Service Worker position', time: '2 hours ago', icon: Briefcase },
    { action: 'Saved 50% Off Meals deal', time: '5 hours ago', icon: Tag },
    { action: 'Bookmarked Studio Apartment', time: '1 day ago', icon: HomeIcon },
    { action: 'Contacted Campus Bookstore', time: '2 days ago', icon: Phone }
  ];

  const handleSave = () => {
    setProfileData(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(profileData);
    setIsEditing(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
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
      <Sidebar activeSection="profile" />

      {/* Main Content */}
      <PageLayout>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-2xl border-b-2 border-yellow-400/20 shadow-2xl shadow-yellow-400/5">
          <div className="flex items-center justify-between px-8 lg:px-12 py-5">
            <div className="flex items-center gap-6">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300">
                  <User className="w-7 h-7 text-black" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl text-white">My Profile</h1>
                <p className="text-yellow-400/70 text-sm">Manage your account and preferences</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative w-12 h-12 bg-yellow-400/10 hover:bg-yellow-400/20 rounded-xl flex items-center justify-center transition-all group hover:scale-110 duration-300 border border-yellow-400/20">
                <Bell className="w-5 h-5 text-yellow-400 group-hover:rotate-12 transition-transform duration-300" />
                <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <Link to="/home" className="px-4 py-2 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 rounded-xl transition-all border border-yellow-400/20 hover:border-yellow-400/40 text-sm font-medium">
                Back to Home
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-8 lg:px-12 flex gap-2 pb-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-2.5 rounded-xl transition-all font-medium ${
                activeTab === 'overview'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-6 py-2.5 rounded-xl transition-all font-medium ${
                activeTab === 'saved'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              Saved Items
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-2.5 rounded-xl transition-all font-medium ${
                activeTab === 'settings'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              Settings
            </button>
          </div>
        </header>
        
        {/* Main Content Area */}
        <section className="px-8 lg:px-12 py-12 relative">
          <div className="max-w-7xl mx-auto">
            {/* Profile Header Card */}
            <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-3xl overflow-hidden shadow-2xl mb-8 animate-fadeIn">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(250, 204, 21, 0.3) 1px, transparent 0)`,
                backgroundSize: '20px 20px'
              }}></div>

              {/* Cover Banner */}
              <div className="relative h-48 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0, 0, 0, 0.3) 1px, transparent 0)`,
                  backgroundSize: '30px 30px'
                }}></div>
              </div>

              {/* Profile Content */}
              <div className="relative px-8 lg:px-12 pb-8">
                {/* Profile Picture */}
                <div className="relative -mt-20 mb-6 inline-block">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-3xl blur-xl opacity-50"></div>
                  <div className="relative w-40 h-40 rounded-3xl overflow-hidden border-4 border-black shadow-2xl">
                    <img 
                      src={profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 w-10 h-10 bg-yellow-400 hover:bg-yellow-500 text-black rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h2 className="text-4xl text-white">{profileData.name}</h2>
                      <span className="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
                        Active
                      </span>
                    </div>
                    <p className="text-xl text-yellow-400 mb-4">{profileData.studentId}</p>
                    <p className="text-gray-400 max-w-2xl leading-relaxed">{profileData.bio}</p>
                  </div>

                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black rounded-xl font-medium transition-all hover:scale-105 flex items-center gap-2 shadow-xl"
                  >
                    <Edit2 className="w-4 h-4" />
                    {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={index}
                        className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-yellow-400/10 hover:border-yellow-400/30 transition-all hover:scale-105 cursor-pointer group"
                      >
                        <div className={`absolute top-4 right-4 w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center opacity-20 group-hover:opacity-100 transition-opacity`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-3xl text-white font-bold mb-1">{stat.value}</div>
                        <div className="text-gray-400 text-sm">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Content Based on Active Tab */}
            {activeTab === 'overview' && (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Personal Information */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-3xl p-8 animate-slideUp">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl text-white">Personal Information</h3>
                      {isEditing && (
                        <div className="flex gap-2">
                          <button
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                          <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all flex items-center gap-2"
                          >
                            <Save className="w-4 h-4" />
                            Save
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      {/* Name */}
                      <div>
                        <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                          <User className="w-4 h-4 text-yellow-400" />
                          Full Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-800/50 rounded-xl text-white border border-yellow-400/20 focus:border-yellow-400 focus:outline-none transition-all"
                          />
                        ) : (
                          <p className="text-white text-lg">{profileData.name}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                          <Mail className="w-4 h-4 text-yellow-400" />
                          Email Address
                        </label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-800/50 rounded-xl text-white border border-yellow-400/20 focus:border-yellow-400 focus:outline-none transition-all"
                          />
                        ) : (
                          <p className="text-white text-lg">{profileData.email}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                          <Phone className="w-4 h-4 text-yellow-400" />
                          Phone Number
                        </label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editForm.phone}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-800/50 rounded-xl text-white border border-yellow-400/20 focus:border-yellow-400 focus:outline-none transition-all"
                          />
                        ) : (
                          <p className="text-white text-lg">{profileData.phone}</p>
                        )}
                      </div>

                      {/* Location */}
                      <div>
                        <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                          <MapPin className="w-4 h-4 text-yellow-400" />
                          Location
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.location}
                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-800/50 rounded-xl text-white border border-yellow-400/20 focus:border-yellow-400 focus:outline-none transition-all"
                          />
                        ) : (
                          <p className="text-white text-lg">{profileData.location}</p>
                        )}
                      </div>

                      {/* Bio */}
                      <div>
                        <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                          <Edit2 className="w-4 h-4 text-yellow-400" />
                          Bio
                        </label>
                        {isEditing ? (
                          <textarea
                            value={editForm.bio}
                            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-3 bg-gray-800/50 rounded-xl text-white border border-yellow-400/20 focus:border-yellow-400 focus:outline-none transition-all resize-none"
                          />
                        ) : (
                          <p className="text-white text-lg leading-relaxed">{profileData.bio}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* University Information */}
                  <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-3xl p-8 animate-slideUp" style={{ animationDelay: '0.1s' }}>
                    <h3 className="text-2xl text-white mb-6">University Information</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                          <GraduationCap className="w-4 h-4 text-yellow-400" />
                          Student ID
                        </label>
                        <p className="text-white text-lg">{profileData.studentId}</p>
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                          <GraduationCap className="w-4 h-4 text-yellow-400" />
                          Faculty
                        </label>
                        <p className="text-white text-lg">{profileData.faculty}</p>
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                          <GraduationCap className="w-4 h-4 text-yellow-400" />
                          Degree Program
                        </label>
                        <p className="text-white text-lg">{profileData.degree}</p>
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                          <Calendar className="w-4 h-4 text-yellow-400" />
                          Academic Year
                        </label>
                        <p className="text-white text-lg">{profileData.year}</p>
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                          <Calendar className="w-4 h-4 text-yellow-400" />
                          Member Since
                        </label>
                        <p className="text-white text-lg">{profileData.joinDate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-3xl p-8 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                    <h3 className="text-2xl text-white mb-6">Recent Activity</h3>
                    
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => {
                        const Icon = activity.icon;
                        return (
                          <div
                            key={index}
                            className="flex items-start gap-4 p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all cursor-pointer group"
                          >
                            <div className="w-10 h-10 bg-yellow-400/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-400/20 transition-all">
                              <Icon className="w-5 h-5 text-yellow-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-white text-sm mb-1">{activity.action}</p>
                              <p className="text-gray-500 text-xs">{activity.time}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 border-2 border-yellow-400/30 rounded-3xl p-8 animate-slideUp" style={{ animationDelay: '0.3s' }}>
                    <h3 className="text-xl text-white mb-4">Quick Actions</h3>
                    
                    <div className="space-y-3">
                      <Link
                        to="/favorites"
                        className="px-6 py-2.5 rounded-xl transition-all font-medium bg-gray-800/50 text-gray-400 hover:bg-yellow-400 hover:text-black flex items-center gap-2"
                      >
                        <Heart className="w-4 h-4" />
                        Favourites
                      </Link>

                      <Link
                        to="/jobs"
                        className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <Briefcase className="w-5 h-5 text-yellow-400" />
                          <span className="text-white">Browse Jobs</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
                      </Link>

                      <Link
                        to="/deals"
                        className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <Tag className="w-5 h-5 text-yellow-400" />
                          <span className="text-white">View Deals</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
                      </Link>

                      <Link
                        to="/accommodation"
                        className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <HomeIcon className="w-5 h-5 text-yellow-400" />
                          <span className="text-white">Find Housing</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Saved Items Tab */}
            {activeTab === 'saved' && (
              <div className="space-y-8">
                {/* Saved Jobs */}
                <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-3xl p-8 animate-fadeIn">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl text-white flex items-center gap-3">
                      <Briefcase className="w-6 h-6 text-yellow-400" />
                      Saved Jobs
                    </h3>
                    <Link to="/jobs" className="text-yellow-400 hover:text-yellow-300 text-sm transition-colors">
                      View All Jobs →
                    </Link>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {savedItems.jobs.map((item) => (
                      <div
                        key={item.id}
                        className="p-6 bg-gray-800/30 hover:bg-gray-800/50 border border-yellow-400/10 hover:border-yellow-400/30 rounded-2xl transition-all cursor-pointer group"
                      >
                        <h4 className="text-lg text-white mb-2 group-hover:text-yellow-400 transition-colors">{item.title}</h4>
                        <p className="text-gray-400 text-sm mb-4">{item.company}</p>
                        <div className="flex items-center gap-2">
                          <button className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg text-sm transition-all">
                            View Details
                          </button>
                          <button className="w-10 h-10 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all flex items-center justify-center">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Saved Deals */}
                <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-3xl p-8 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl text-white flex items-center gap-3">
                      <Tag className="w-6 h-6 text-yellow-400" />
                      Saved Deals
                    </h3>
                    <Link to="/deals" className="text-yellow-400 hover:text-yellow-300 text-sm transition-colors">
                      View All Deals →
                    </Link>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {savedItems.deals.map((item) => (
                      <div
                        key={item.id}
                        className="p-6 bg-gray-800/30 hover:bg-gray-800/50 border border-yellow-400/10 hover:border-yellow-400/30 rounded-2xl transition-all cursor-pointer group"
                      >
                        <h4 className="text-lg text-white mb-2 group-hover:text-yellow-400 transition-colors">{item.title}</h4>
                        <p className="text-gray-400 text-sm mb-4">{item.business}</p>
                        <div className="flex items-center gap-2">
                          <button className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-black rounded-lg text-sm font-medium transition-all">
                            Use Deal
                          </button>
                          <button className="w-10 h-10 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all flex items-center justify-center">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Saved Accommodations */}
                <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-3xl p-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl text-white flex items-center gap-3">
                      <HomeIcon className="w-6 h-6 text-yellow-400" />
                      Saved Accommodations
                    </h3>
                    <Link to="/accommodation" className="text-yellow-400 hover:text-yellow-300 text-sm transition-colors">
                      View All →
                    </Link>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {savedItems.accommodations.map((item) => (
                      <div
                        key={item.id}
                        className="p-6 bg-gray-800/30 hover:bg-gray-800/50 border border-yellow-400/10 hover:border-yellow-400/30 rounded-2xl transition-all cursor-pointer group"
                      >
                        <h4 className="text-lg text-white mb-2 group-hover:text-yellow-400 transition-colors">{item.title}</h4>
                        <p className="text-gray-400 text-sm mb-4">{item.location}</p>
                        <div className="flex items-center gap-2">
                          <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg text-sm transition-all">
                            View Property
                          </button>
                          <button className="w-10 h-10 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all flex items-center justify-center">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Account Settings */}
                <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-3xl p-8 animate-fadeIn">
                  <h3 className="text-2xl text-white mb-6 flex items-center gap-3">
                    <Settings className="w-6 h-6 text-yellow-400" />
                    Account Settings
                  </h3>
                  
                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 bg-gray-800/30 hover:bg-gray-800/50 rounded-xl transition-all group">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-yellow-400" />
                        <span className="text-white">Update Profile</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
                    </button>

                    <button className="w-full flex items-center justify-between p-4 bg-gray-800/30 hover:bg-gray-800/50 rounded-xl transition-all group">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-yellow-400" />
                        <span className="text-white">Privacy & Security</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
                    </button>

                    <button className="w-full flex items-center justify-between p-4 bg-gray-800/30 hover:bg-gray-800/50 rounded-xl transition-all group">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-yellow-400" />
                        <span className="text-white">Notifications</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>
                </div>

                {/* Preferences */}
                <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-3xl p-8 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                  <h3 className="text-2xl text-white mb-6">Preferences</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white mb-1">Email Notifications</p>
                        <p className="text-gray-400 text-sm">Receive updates via email</p>
                      </div>
                      <button className="w-14 h-8 bg-yellow-400 rounded-full relative transition-all">
                        <div className="absolute right-1 top-1 w-6 h-6 bg-black rounded-full transition-all"></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white mb-1">Push Notifications</p>
                        <p className="text-gray-400 text-sm">Get instant updates</p>
                      </div>
                      <button className="w-14 h-8 bg-gray-600 rounded-full relative transition-all">
                        <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-all"></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white mb-1">Job Alerts</p>
                        <p className="text-gray-400 text-sm">New job postings</p>
                      </div>
                      <button className="w-14 h-8 bg-yellow-400 rounded-full relative transition-all">
                        <div className="absolute right-1 top-1 w-6 h-6 bg-black rounded-full transition-all"></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white mb-1">Deal Alerts</p>
                        <p className="text-gray-400 text-sm">Special offers & discounts</p>
                      </div>
                      <button className="w-14 h-8 bg-yellow-400 rounded-full relative transition-all">
                        <div className="absolute right-1 top-1 w-6 h-6 bg-black rounded-full transition-all"></div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="lg:col-span-2 bg-gradient-to-br from-red-900/20 to-black/80 border-2 border-red-500/30 rounded-3xl p-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                  <h3 className="text-2xl text-red-400 mb-6">Danger Zone</h3>
                  
                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-xl transition-all group">
                      <div className="flex items-center gap-3">
                        <LogOut className="w-5 h-5 text-red-400" />
                        <div className="text-left">
                          <p className="text-white">Sign Out</p>
                          <p className="text-gray-400 text-sm">Sign out from your account</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-red-400 group-hover:translate-x-1 transition-all" />
                    </button>

                    <button className="w-full flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-xl transition-all group">
                      <div className="flex items-center gap-3">
                        <X className="w-5 h-5 text-red-400" />
                        <div className="text-left">
                          <p className="text-white">Delete Account</p>
                          <p className="text-gray-400 text-sm">Permanently delete your account and data</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-red-400 group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </PageLayout>
    </div>
  );
}