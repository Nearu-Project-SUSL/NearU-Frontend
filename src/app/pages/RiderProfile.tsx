import { useState, useRef } from 'react';
import { Sidebar } from '../components/Sidebar';
import { PageLayout } from '../components/PageLayout';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Settings, Camera, Bell, Shield, LogOut, ChevronRight, DollarSign, Star, Bike, Package, Clock, TrendingUp, Award, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router';
import userAvatar from 'figma:asset/902c55af84906a0971d3584133214377bc973536.png';

export default function RiderProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'earnings' | 'settings'>('overview');
  const [profilePicture, setProfilePicture] = useState<string>(userAvatar);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: 'Nimal Bandara',
    riderId: 'RDR-2024-001',
    email: 'nimal.bandara@nearu.lk',
    phone: '+94 77 987 6543',
    vehicleType: 'Tuk Tuk',
    vehicleNumber: 'CAB-1234',
    licenseNumber: 'DL-123456',
    location: 'Belihuloya, Sri Lanka',
    joinDate: 'March 2024',
    bio: 'Professional tuk-tuk driver with 5+ years of experience. Dedicated to providing safe and comfortable rides for students around Sabaragamuwa University campus.'
  });

  const [editForm, setEditForm] = useState(profileData);
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const stats = [
    { label: 'Total Earnings', value: 'Rs. 45,750', icon: DollarSign, color: 'from-green-500 to-green-600' },
    { label: 'Completed Rides', value: '287', icon: Bike, color: 'from-blue-500 to-blue-600' },
    { label: 'Deliveries', value: '142', icon: Package, color: 'from-orange-500 to-orange-600' },
    { label: 'Rating', value: '4.9', icon: Star, color: 'from-yellow-500 to-yellow-600' }
  ];

  const earningsData = [
    { period: 'Today', amount: 'Rs. 1,250', rides: '8 rides', status: 'completed' },
    { period: 'This Week', amount: 'Rs. 7,840', rides: '42 rides', status: 'completed' },
    { period: 'This Month', amount: 'Rs. 28,500', rides: '165 rides', status: 'completed' },
    { period: 'All Time', amount: 'Rs. 45,750', rides: '287 rides', status: 'completed' }
  ];

  const recentActivity = [
    { action: 'Completed delivery to Computing Faculty', time: '15 mins ago', icon: Package, earning: 'Rs. 150' },
    { action: 'Completed ride to Belihuloya Town', time: '1 hour ago', icon: Bike, earning: 'Rs. 250' },
    { action: 'Completed delivery to Library', time: '3 hours ago', icon: Package, earning: 'Rs. 120' },
    { action: 'Completed ride from Main Gate', time: '5 hours ago', icon: Bike, earning: 'Rs. 180' },
    { action: 'Received 5-star rating', time: '1 day ago', icon: Star, earning: '+10 pts' }
  ];

  const achievements = [
    { title: 'Top Rated Driver', description: 'Maintained 4.9+ rating', icon: Award, color: 'from-yellow-500 to-yellow-600' },
    { title: '100 Rides Milestone', description: 'Completed 100 successful rides', icon: TrendingUp, color: 'from-blue-500 to-blue-600' },
    { title: 'Speed Demon', description: 'Fastest delivery times', icon: Clock, color: 'from-purple-500 to-purple-600' }
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

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    // Here you would typically make an API call to change the password
    alert('Password changed successfully!');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordChange(false);
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
      <Sidebar activeSection="transport" />

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
                <h1 className="text-2xl text-white">Rider Profile</h1>
                <p className="text-yellow-400/70 text-sm">Manage your rider account and settings</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative w-12 h-12 bg-yellow-400/10 hover:bg-yellow-400/20 rounded-xl flex items-center justify-center transition-all group hover:scale-110 duration-300 border border-yellow-400/20">
                <Bell className="w-5 h-5 text-yellow-400 group-hover:rotate-12 transition-transform duration-300" />
                <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <Link to="/rider-home" className="px-4 py-2 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 rounded-xl transition-all border border-yellow-400/20 hover:border-yellow-400/40 text-sm font-medium">
                Back to Dashboard
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
              onClick={() => setActiveTab('earnings')}
              className={`px-6 py-2.5 rounded-xl transition-all font-medium ${
                activeTab === 'earnings'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              Earnings
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
                      <span className="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        Online
                      </span>
                    </div>
                    <p className="text-xl text-yellow-400 mb-4">{profileData.riderId} • {profileData.vehicleType}</p>
                    <p className="text-gray-400 max-w-2xl leading-relaxed">{profileData.bio}</p>
                  </div>

                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black rounded-xl font-medium transition-all hover:scale-105 flex items-center gap-2 shadow-xl"
                  >
                    <Edit2 className="w-5 h-5" />
                    {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label}
                  className="relative group animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                  <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-6 hover:border-yellow-400/40 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile Information */}
                <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-8 animate-slideIn">
                  <div className="flex items-center gap-3 mb-6">
                    <User className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-2xl text-white">Profile Information</h3>
                  </div>

                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-yellow-400/20 rounded-xl text-white focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-yellow-400/20 rounded-xl text-white focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-yellow-400/20 rounded-xl text-white focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Vehicle Number</label>
                        <input
                          type="text"
                          value={editForm.vehicleNumber}
                          onChange={(e) => setEditForm({...editForm, vehicleNumber: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-yellow-400/20 rounded-xl text-white focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
                        <textarea
                          value={editForm.bio}
                          onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                          rows={3}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-yellow-400/20 rounded-xl text-white focus:outline-none focus:border-yellow-400 resize-none"
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={handleSave}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                        >
                          <Save className="w-5 h-5" />
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                        >
                          <X className="w-5 h-5" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl">
                        <Mail className="w-5 h-5 text-yellow-400" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-400">Email</p>
                          <p className="text-white">{profileData.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl">
                        <Phone className="w-5 h-5 text-yellow-400" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-400">Phone</p>
                          <p className="text-white">{profileData.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl">
                        <Bike className="w-5 h-5 text-yellow-400" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-400">Vehicle Number</p>
                          <p className="text-white">{profileData.vehicleNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl">
                        <Shield className="w-5 h-5 text-yellow-400" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-400">License Number</p>
                          <p className="text-white">{profileData.licenseNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl">
                        <MapPin className="w-5 h-5 text-yellow-400" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-400">Location</p>
                          <p className="text-white">{profileData.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl">
                        <Calendar className="w-5 h-5 text-yellow-400" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-400">Member Since</p>
                          <p className="text-white">{profileData.joinDate}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recent Activity */}
                <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-8 animate-slideIn" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <Clock className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-2xl text-white">Recent Activity</h3>
                  </div>

                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all">
                        <div className="w-10 h-10 bg-yellow-400/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <activity.icon className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm">{activity.action}</p>
                          <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                        </div>
                        <span className="text-green-400 font-medium text-sm flex-shrink-0">{activity.earning}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-8 lg:col-span-2 animate-slideIn" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <Award className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-2xl text-white">Achievements</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="relative group">
                        <div className={`absolute inset-0 bg-gradient-to-br ${achievement.color} rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                        <div className="relative bg-gray-800/50 border border-yellow-400/20 rounded-xl p-6 hover:border-yellow-400/40 transition-all text-center">
                          <div className={`w-16 h-16 bg-gradient-to-br ${achievement.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                            <achievement.icon className="w-8 h-8 text-white" />
                          </div>
                          <h4 className="text-white font-semibold mb-2">{achievement.title}</h4>
                          <p className="text-gray-400 text-sm">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'earnings' && (
              <div className="space-y-8">
                {/* Earnings Overview */}
                <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-8 animate-fadeIn">
                  <div className="flex items-center gap-3 mb-6">
                    <DollarSign className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-2xl text-white">Earnings Overview</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {earningsData.map((earning, index) => (
                      <div key={index} className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative bg-gray-800/50 border border-yellow-400/20 rounded-xl p-6 hover:border-yellow-400/40 transition-all">
                          <p className="text-sm text-gray-400 mb-2">{earning.period}</p>
                          <p className="text-2xl font-bold text-white mb-1">{earning.amount}</p>
                          <p className="text-xs text-gray-500">{earning.rides}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Earnings Chart Placeholder */}
                <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-8 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <TrendingUp className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-2xl text-white">Performance Metrics</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gray-800/30 rounded-xl">
                      <p className="text-sm text-gray-400 mb-2">Average per Ride</p>
                      <p className="text-3xl font-bold text-green-400">Rs. 195</p>
                    </div>
                    <div className="text-center p-6 bg-gray-800/30 rounded-xl">
                      <p className="text-sm text-gray-400 mb-2">Completion Rate</p>
                      <p className="text-3xl font-bold text-blue-400">98.5%</p>
                    </div>
                    <div className="text-center p-6 bg-gray-800/30 rounded-xl">
                      <p className="text-sm text-gray-400 mb-2">Response Time</p>
                      <p className="text-3xl font-bold text-purple-400">2.3 min</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Security Settings */}
                <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-8 animate-slideIn">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-2xl text-white">Security Settings</h3>
                  </div>

                  {!showPasswordChange ? (
                    <div className="space-y-4">
                      <button
                        onClick={() => setShowPasswordChange(true)}
                        className="w-full flex items-center justify-between p-4 bg-gray-800/30 hover:bg-gray-800/50 rounded-xl transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-yellow-400" />
                          <div className="text-left">
                            <p className="text-white font-medium">Change Password</p>
                            <p className="text-sm text-gray-400">Update your account password</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
                      </button>

                      <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Bell className="w-5 h-5 text-yellow-400" />
                          <div>
                            <p className="text-white font-medium">Push Notifications</p>
                            <p className="text-sm text-gray-400">Receive ride requests instantly</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                            required
                            className="w-full px-4 py-3 bg-gray-800/50 border border-yellow-400/20 rounded-xl text-white focus:outline-none focus:border-yellow-400 pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400"
                          >
                            {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                            required
                            className="w-full px-4 py-3 bg-gray-800/50 border border-yellow-400/20 rounded-xl text-white focus:outline-none focus:border-yellow-400 pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400"
                          >
                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                            required
                            className="w-full px-4 py-3 bg-gray-800/50 border border-yellow-400/20 rounded-xl text-white focus:outline-none focus:border-yellow-400 pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black rounded-xl font-medium transition-all"
                        >
                          Update Password
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowPasswordChange(false)}
                          className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Account Settings */}
                <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-8 animate-slideIn" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <Settings className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-2xl text-white">Account Settings</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-yellow-400" />
                        <div>
                          <p className="text-white font-medium">Email Notifications</p>
                          <p className="text-sm text-gray-400">Receive updates via email</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-yellow-400" />
                        <div>
                          <p className="text-white font-medium">Location Services</p>
                          <p className="text-sm text-gray-400">Share your location for rides</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                      </label>
                    </div>

                    <button className="w-full flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-all group border border-red-500/20 hover:border-red-500/40 mt-8">
                      <div className="flex items-center gap-3">
                        <LogOut className="w-5 h-5 text-red-400" />
                        <div className="text-left">
                          <p className="text-red-400 font-medium">Logout</p>
                          <p className="text-sm text-gray-400">Sign out of your account</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-red-400" />
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
