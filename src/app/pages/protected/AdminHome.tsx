import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router';
import useAdminTransport from '../../hooks/useAdminTransport';
import type { AdminRider } from '../../../types/adminTransport';
import useAuth from '../../hooks/useAuth';
import { rideHub } from '../../services/rideHubService';
import { toast } from 'sonner';
import { 
  Building2, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Users, 
  Package, 
  TrendingUp, 
  Bell, 
  LogOut,
  Search,
  Mail,
  Phone,
  Calendar,
  X,
  Save,
  DollarSign,
  Star,
  User,
  Bike,
  ShoppingBag,
  AlertCircle,
  Activity,
  BarChart3,
  MessageSquare,
  Settings,
  FileText,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

interface PendingBusiness {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessType: string;
  address: string;
  description: string;
  registrationNumber: string;
  taxId: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Student {
  id: string;
  fullName: string;
  email: string;
  studentId: string;
  faculty: string;
  year: string;
  joinedDate: string;
  status: 'active' | 'suspended';
}

interface Review {
  id: string;
  studentName: string;
  businessName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'approved' | 'pending' | 'flagged';
}

export default function AdminHome() {
  const navigate = useNavigate();
  const {
    riders: adminRiders,
    busRoutes,
    trainRoutes,
    bookings: transportBookings,
    analyticsSummary,
    loading: transportLoading,
    error: transportError,
    refreshAll: refreshTransport,
    approveRider,
    rejectRider,
    suspendRider,
    reactivateRider,
    updateRiderAvailability,
    activateBusRoute,
    deactivateBusRoute,
    deleteBusRoute,
    activateTrainRoute,
    deactivateTrainRoute,
    deleteTrainRoute,
    cancelBooking
  } = useAdminTransport();
  const { auth } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'businesses' | 'transport' | 'riders' | 'students' | 'reviews' | 'analytics' | 'settings'>('overview');
  const [selectedBusiness, setSelectedBusiness] = useState<PendingBusiness | null>(null);
  const [selectedRider, setSelectedRider] = useState<AdminRider | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [riderFilterTab, setRiderFilterTab] = useState<'all' | 'pending' | 'approved' | 'suspended' | 'rejected'>('all');
  const [riderSearchQuery, setRiderSearchQuery] = useState('');

  // SignalR Lifecycle Setup for live notifications
  useEffect(() => {
    const setupHub = async () => {
      const token = localStorage.getItem('auth_accessToken') || auth?.accessToken;
      if (!token) return;

      try {
        await rideHub.connect(token);
        
        // Listen to live Rider registration event
        rideHub.setCallbacks({
          onNewRiderApplication: (payload: any) => {
            // Play sound/vibe & show toast
            toast.info(`🔔 New Rider Application: ${payload.name || payload.email} is waiting for approval!`, {
              duration: 8000,
              action: {
                label: 'Refresh Dashboard',
                onClick: () => refreshTransport()
              }
            });
            // Refresh list dynamically
            refreshTransport();
          }
        });
      } catch (err) {
        console.warn('SignalR connection failed for admin dashboard:', err);
      }
    };

    setupHub();

    return () => {
      // Disconnect or clear callbacks on unmount to avoid memory leaks
      rideHub.clearCallbacks();
    };
  }, [auth?.accessToken, refreshTransport]);

  // Sample data
  const [pendingBusinesses, setPendingBusinesses] = useState<PendingBusiness[]>([
    {
      id: '1',
      businessName: 'Spicy Kitchen Restaurant',
      ownerName: 'Kasun Perera',
      email: 'kasun@spicykitchen.lk',
      phone: '+94 77 555 1234',
      businessType: 'Food Vendor',
      address: 'Main Street, Belihuloya',
      description: 'Traditional Sri Lankan restaurant serving authentic cuisine with fresh ingredients.',
      registrationNumber: 'BR-2024-001',
      taxId: 'TX-123456',
      submittedDate: '2024-02-15',
      status: 'pending'
    },
    {
      id: '2',
      businessName: 'Campus Mart Supermarket',
      ownerName: 'Nimal Silva',
      email: 'nimal@campusmart.lk',
      phone: '+94 77 555 5678',
      businessType: 'Retail Shop',
      address: 'University Road, Belihuloya',
      description: 'One-stop shop for all student needs including stationery, snacks, and daily essentials.',
      registrationNumber: 'BR-2024-002',
      taxId: 'TX-789012',
      submittedDate: '2024-02-20',
      status: 'pending'
    },
    {
      id: '3',
      businessName: 'Quick Bites Cafe',
      ownerName: 'Saman Fernando',
      email: 'saman@quickbites.lk',
      phone: '+94 77 555 9012',
      businessType: 'Food Vendor',
      address: 'Campus Gate, Belihuloya',
      description: 'Fast food and beverages catering to busy students.',
      registrationNumber: 'BR-2024-003',
      taxId: 'TX-345678',
      submittedDate: '2024-02-25',
      status: 'pending'
    }
  ]);

  const [students] = useState<Student[]>([
    {
      id: '1',
      fullName: 'Dilani Wickramasinghe',
      email: 'dilani@student.sab.ac.lk',
      studentId: 'SAB/2023/001',
      faculty: 'Computing',
      year: '2nd Year',
      joinedDate: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      fullName: 'Ravindu Perera',
      email: 'ravindu@student.sab.ac.lk',
      studentId: 'SAB/2023/002',
      faculty: 'Engineering',
      year: '3rd Year',
      joinedDate: '2024-01-18',
      status: 'active'
    },
    {
      id: '3',
      fullName: 'Thilini Fernando',
      email: 'thilini@student.sab.ac.lk',
      studentId: 'SAB/2023/003',
      faculty: 'Management',
      year: '1st Year',
      joinedDate: '2024-01-20',
      status: 'active'
    }
  ]);

  const [reviews] = useState<Review[]>([
    {
      id: '1',
      studentName: 'Dilani Wickramasinghe',
      businessName: 'Campus Canteen',
      rating: 5,
      comment: 'Excellent food quality and quick service! Highly recommend the rice and curry.',
      date: '2024-03-01',
      status: 'approved'
    },
    {
      id: '2',
      studentName: 'Ravindu Perera',
      businessName: 'Quick Tuk Rides',
      rating: 4,
      comment: 'Reliable service but could improve wait times during peak hours.',
      date: '2024-03-02',
      status: 'pending'
    }
  ]);

  // Analytics data
  const userGrowthData = [
    { month: 'Jan', students: 450, businesses: 12, riders: 8 },
    { month: 'Feb', students: 680, businesses: 18, riders: 12 },
    { month: 'Mar', students: 920, businesses: 24, riders: 15 },
    { month: 'Apr', students: 1240, businesses: 28, riders: 18 },
    { month: 'May', students: 1560, businesses: 32, riders: 22 },
    { month: 'Jun', students: 1847, businesses: 35, riders: 25 }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 68000 },
    { month: 'Mar', revenue: 92000 },
    { month: 'Apr', revenue: 124000 },
    { month: 'May', revenue: 156000 },
    { month: 'Jun', revenue: 184000 }
  ];

  const categoryData = [
    { name: 'Food Vendors', value: 45, color: '#f59e0b' },
    { name: 'Transport', value: 25, color: '#3b82f6' },
    { name: 'Accommodation', value: 15, color: '#8b5cf6' },
    { name: 'Retail', value: 10, color: '#10b981' },
    { name: 'Services', value: 5, color: '#ef4444' }
  ];

  const activityData = [
    { day: 'Mon', orders: 120, deliveries: 95, bookings: 45 },
    { day: 'Tue', orders: 145, deliveries: 120, bookings: 52 },
    { day: 'Wed', orders: 165, deliveries: 135, bookings: 48 },
    { day: 'Thu', orders: 190, deliveries: 155, bookings: 60 },
    { day: 'Fri', orders: 220, deliveries: 185, bookings: 75 },
    { day: 'Sat', orders: 180, deliveries: 140, bookings: 55 },
    { day: 'Sun', orders: 150, deliveries: 110, bookings: 40 }
  ];

  const stats = [
    { 
      label: 'Pending Approvals', 
      value: (pendingBusinesses.filter(b => b.status === 'pending').length + adminRiders.filter(r => r.status === 'pending').length).toString(),
      icon: AlertCircle, 
      color: 'from-orange-500 to-orange-600',
      bgColor: 'orange',
      change: '+12%',
      changeType: 'increase'
    },
    { 
      label: 'Active Students', 
      value: '1,847', 
      icon: Users, 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'blue',
      change: '+24%',
      changeType: 'increase'
    },
    { 
      label: 'Total Businesses', 
      value: '35', 
      icon: Building2, 
      color: 'from-purple-500 to-purple-600',
      bgColor: 'purple',
      change: '+8%',
      changeType: 'increase'
    },
    { 
      label: 'Active Riders', 
      value: analyticsSummary.riders.approved.toString(), 
      icon: Bike, 
      color: 'from-green-500 to-green-600',
      bgColor: 'green',
      change: '+15%',
      changeType: 'increase'
    },
    { 
      label: 'Today\'s Bookings', 
      value: analyticsSummary.bookingsToday.toString(), 
      icon: ShoppingBag, 
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'yellow',
      change: '+5%',
      changeType: 'increase'
    },
    { 
      label: 'Today\'s Revenue', 
      value: `Rs. ${analyticsSummary.revenueTodayLkr}`, 
      icon: DollarSign, 
      color: 'from-pink-500 to-pink-600',
      bgColor: 'pink',
      change: '+18%',
      changeType: 'increase'
    }
  ];

  const handleApproveBusiness = (id: string) => {
    if (confirm('Are you sure you want to approve this business?')) {
      setPendingBusinesses(pendingBusinesses.map(business =>
        business.id === id ? { ...business, status: 'approved' } : business
      ));
      setSelectedBusiness(null);
    }
  };

  const handleRejectBusiness = (id: string) => {
    if (confirm('Are you sure you want to reject this business application?')) {
      setPendingBusinesses(pendingBusinesses.map(business =>
        business.id === id ? { ...business, status: 'rejected' } : business
      ));
      setSelectedBusiness(null);
    }
  };

  const handleApproveRider = async (id: string) => {
    if (confirm('Are you sure you want to approve this rider?')) {
      await approveRider(id);
      setSelectedRider(null);
    }
  };

  const handleRejectRider = async (id: string) => {
    if (confirm('Are you sure you want to reject this rider application?')) {
      await rejectRider(id);
      setSelectedRider(null);
    }
  };

  const handleSuspendRider = async (id: string) => {
    if (confirm('Suspend this rider?')) {
      await suspendRider(id);
      setSelectedRider(null);
    }
  };

  const handleReactivateRider = async (id: string) => {
    if (confirm('Reactivate this rider?')) {
      await reactivateRider(id);
      setSelectedRider(null);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-yellow-600/5 animate-gradient pointer-events-none"></div>
      
      {/* Floating orbs */}
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="fixed bottom-1/4 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }}></div>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-2xl border-b-2 border-yellow-400/20 shadow-2xl shadow-yellow-400/5">
        <div className="flex items-center justify-between px-8 lg:px-12 py-5">
          <div className="flex items-center gap-6">
            <Link to="/" className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity animate-pulse"></div>
              <div className="relative w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="w-7 h-7 text-black" />
              </div>
            </Link>
            <div>
              <h1 className="text-2xl text-white">Admin Dashboard</h1>
              <p className="text-yellow-400/70 text-sm">NearU Platform Management</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl pl-10 pr-4 py-2 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
              />
            </div>

            <button className="relative w-12 h-12 bg-yellow-400/10 hover:bg-yellow-400/20 rounded-xl flex items-center justify-center transition-all group hover:scale-110 duration-300 border border-yellow-400/20">
              <Bell className="w-5 h-5 text-yellow-400 group-hover:rotate-12 transition-transform duration-300" />
              <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
              <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            
            <Link to="/login" className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all border border-red-500/20 hover:border-red-500/40 text-sm font-medium flex items-center gap-2 hover:scale-105 duration-300">
              <LogOut className="w-4 h-4" />
              Logout
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-8 lg:px-12 flex gap-2 pb-4 overflow-x-auto scrollbar-hide">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'businesses', label: 'Businesses', icon: Building2, badge: pendingBusinesses.filter(b => b.status === 'pending').length },
            { id: 'transport', label: 'Transport', icon: Bike },
            { id: 'riders', label: 'Riders', icon: Bike, badge: adminRiders.filter(r => r.status === 'pending').length },
            { id: 'students', label: 'Students', icon: Users },
            { id: 'reviews', label: 'Reviews', icon: MessageSquare },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-xl transition-all font-medium whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg shadow-yellow-400/30'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {(tab.badge ?? 0) > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === tab.id ? 'bg-black text-yellow-400' : 'bg-orange-500 text-white'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <section className="px-8 lg:px-12 py-12 relative">
        <div className="max-w-7xl mx-auto">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <div 
                    key={stat.label}
                    className="relative group animate-fadeIn"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                    <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-6 hover:border-yellow-400/40 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          stat.changeType === 'increase' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                      <p className="text-3xl text-white mb-1">{stat.value}</p>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth Chart */}
                <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-6 animate-fadeIn">
                  <h3 className="text-xl text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-yellow-400" />
                    User Growth
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={userGrowthData}>
                      <defs>
                        <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorBusinesses" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #f59e0b', borderRadius: '8px' }}
                        labelStyle={{ color: '#f59e0b' }}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="students" stroke="#3b82f6" fillOpacity={1} fill="url(#colorStudents)" />
                      <Area type="monotone" dataKey="businesses" stroke="#f59e0b" fillOpacity={1} fill="url(#colorBusinesses)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Business Categories */}
                <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-6 animate-fadeIn">
                  <h3 className="text-xl text-white mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-yellow-400" />
                    Business Categories
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #f59e0b', borderRadius: '8px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Activity Chart */}
              <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-6 animate-fadeIn">
                <h3 className="text-xl text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-yellow-400" />
                  Weekly Activity
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #f59e0b', borderRadius: '8px' }}
                      labelStyle={{ color: '#f59e0b' }}
                    />
                    <Legend />
                    <Bar dataKey="orders" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="deliveries" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="bookings" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Quick Actions */}
              <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-8 animate-fadeIn">
                <h3 className="text-2xl text-white mb-6 flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-yellow-400" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => setActiveTab('businesses')}
                    className="p-6 bg-orange-500/10 hover:bg-orange-500/20 border-2 border-orange-500/20 hover:border-orange-500/40 rounded-xl transition-all group hover:scale-105 duration-300"
                  >
                    <Building2 className="w-8 h-8 text-orange-400 mb-3 group-hover:scale-110 transition-transform" />
                    <h4 className="text-white mb-1">Review Businesses</h4>
                    <p className="text-sm text-gray-400">{pendingBusinesses.filter(b => b.status === 'pending').length} pending</p>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('riders')}
                    className="p-6 bg-green-500/10 hover:bg-green-500/20 border-2 border-green-500/20 hover:border-green-500/40 rounded-xl transition-all group hover:scale-105 duration-300"
                  >
                    <Bike className="w-8 h-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
                    <h4 className="text-white mb-1">Review Riders</h4>
                    <p className="text-sm text-gray-400">{adminRiders.filter(r => r.status === 'pending').length} pending</p>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('students')}
                    className="p-6 bg-blue-500/10 hover:bg-blue-500/20 border-2 border-blue-500/20 hover:border-blue-500/40 rounded-xl transition-all group hover:scale-105 duration-300"
                  >
                    <Users className="w-8 h-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                    <h4 className="text-white mb-1">Manage Students</h4>
                    <p className="text-sm text-gray-400">{students.length} active</p>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="p-6 bg-purple-500/10 hover:bg-purple-500/20 border-2 border-purple-500/20 hover:border-purple-500/40 rounded-xl transition-all group hover:scale-105 duration-300"
                  >
                    <MessageSquare className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                    <h4 className="text-white mb-1">Moderate Reviews</h4>
                    <p className="text-sm text-gray-400">{reviews.filter(r => r.status === 'pending').length} pending</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Businesses Tab */}
          {activeTab === 'businesses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl text-white mb-2">Business Applications</h2>
                  <p className="text-gray-400">Review and approve business registrations</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pendingBusinesses.filter(b => b.status === 'pending').map((business, index) => (
                  <div 
                    key={business.id}
                    className="relative group animate-fadeIn"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-6 hover:border-yellow-400/40 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl text-white mb-1">{business.businessName}</h3>
                          <p className="text-yellow-400 text-sm mb-2">{business.businessType}</p>
                          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{business.description}</p>
                        </div>
                        <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium border border-orange-500/30">
                          Pending
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-400">Owner:</span>
                          <span className="text-white">{business.ownerName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-white">{business.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-white">{business.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-400">Submitted:</span>
                          <span className="text-white">{business.submittedDate}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedBusiness(business)}
                          className="flex-1 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-all border border-blue-500/20 hover:border-blue-500/40 text-sm font-medium flex items-center justify-center gap-2 hover:scale-105 duration-300"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        <button
                          onClick={() => handleApproveBusiness(business.id)}
                          className="flex-1 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-xl transition-all border border-green-500/20 hover:border-green-500/40 text-sm font-medium flex items-center justify-center gap-2 hover:scale-105 duration-300"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectBusiness(business.id)}
                          className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all border border-red-500/20 hover:border-red-500/40 flex items-center justify-center hover:scale-105 duration-300"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {pendingBusinesses.filter(b => b.status === 'pending').length === 0 && (
                <div className="text-center py-12 bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl text-white mb-2">All Caught Up!</h3>
                  <p className="text-gray-400">No pending business approvals at the moment.</p>
                </div>
              )}
            </div>
          )}

          {/* Transport Tab */}
          {activeTab === 'transport' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl text-white mb-2">Transport Operations</h2>
                  <p className="text-gray-400">Admin controls for riders, routes, and bookings</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate('/transport')}
                    className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-all border border-blue-500/20 hover:border-blue-500/40 text-sm font-medium"
                  >
                    Open Transport Page
                  </button>
                  <button
                    onClick={refreshTransport}
                    className="px-4 py-2 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 rounded-xl transition-all border border-yellow-400/20 hover:border-yellow-400/40 text-sm font-medium"
                  >
                    {transportLoading ? 'Refreshing...' : 'Refresh'}
                  </button>
                </div>
              </div>

              {transportError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl">
                  {transportError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-5">
                  <p className="text-sm text-gray-400">Pending Riders</p>
                  <p className="text-2xl text-white">
                    {adminRiders.filter(r => r.status === 'pending').length}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-5">
                  <p className="text-sm text-gray-400">Active Bus Routes</p>
                  <p className="text-2xl text-white">
                    {busRoutes.filter(r => r.status === 'active').length}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-5">
                  <p className="text-sm text-gray-400">Active Train Routes</p>
                  <p className="text-2xl text-white">
                    {trainRoutes.filter(r => r.status === 'active').length}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-5">
                  <p className="text-sm text-gray-400">Bookings Today</p>
                  <p className="text-2xl text-white">{analyticsSummary.bookingsToday}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-5">
                  <h3 className="text-lg text-white mb-4">Recent Bookings</h3>
                  <div className="space-y-3">
                    {transportBookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between text-sm">
                        <div className="text-gray-300">
                          {booking.serviceType.toUpperCase()} • {booking.pickup} → {booking.dropoff}
                        </div>
                        <div className="text-yellow-400">LKR {booking.priceLkr}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-5">
                  <h3 className="text-lg text-white mb-4">Rider Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Approved</span>
                      <span className="text-green-400">{analyticsSummary.riders.approved}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Pending</span>
                      <span className="text-yellow-400">{analyticsSummary.riders.pending}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Suspended</span>
                      <span className="text-red-400">{analyticsSummary.riders.suspended}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-5">
                  <h3 className="text-lg text-white mb-4">Rider Actions</h3>
                  <div className="space-y-3">
                    {adminRiders.slice(0, 6).map((rider) => (
                      <div key={rider.id} className="flex flex-col gap-2 border border-yellow-400/10 rounded-xl p-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-300">{rider.fullName}</span>
                          <span className="text-yellow-400">{rider.status}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {rider.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveRider(rider.id)}
                                className="px-3 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-xs"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectRider(rider.id)}
                                className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {rider.status === 'approved' && (
                            <button
                              onClick={() => handleSuspendRider(rider.id)}
                              className="px-3 py-1 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-lg text-xs"
                            >
                              Suspend
                            </button>
                          )}
                          {rider.status === 'suspended' && (
                            <button
                              onClick={() => handleReactivateRider(rider.id)}
                              className="px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-xs"
                            >
                              Reactivate
                            </button>
                          )}
                          <button
                            onClick={() => updateRiderAvailability(rider.id, 'available')}
                            className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs"
                            disabled={rider.status !== 'approved'}
                          >
                            Available
                          </button>
                          <button
                            onClick={() => updateRiderAvailability(rider.id, 'busy')}
                            className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs"
                            disabled={rider.status !== 'approved'}
                          >
                            Busy
                          </button>
                          <button
                            onClick={() => updateRiderAvailability(rider.id, 'offline')}
                            className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs"
                            disabled={rider.status !== 'approved'}
                          >
                            Offline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-5">
                  <h3 className="text-lg text-white mb-4">Bus Routes</h3>
                  <div className="space-y-3">
                    {busRoutes.slice(0, 6).map((route) => (
                      <div key={route.id} className="flex items-center justify-between text-sm border border-yellow-400/10 rounded-xl p-3">
                        <div>
                          <p className="text-gray-200">{route.from} → {route.to}</p>
                          <p className="text-gray-500">{route.category} • LKR {route.priceLkr}</p>
                        </div>
                        <div className="flex gap-2">
                          {route.status === 'active' ? (
                            <button
                              onClick={() => deactivateBusRoute(route.id)}
                              className="px-3 py-1 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-lg text-xs"
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => activateBusRoute(route.id)}
                              className="px-3 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-xs"
                            >
                              Activate
                            </button>
                          )}
                          <button
                            onClick={() => deleteBusRoute(route.id)}
                            className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-5">
                  <h3 className="text-lg text-white mb-4">Train Routes</h3>
                  <div className="space-y-3">
                    {trainRoutes.slice(0, 6).map((route) => (
                      <div key={route.id} className="flex items-center justify-between text-sm border border-yellow-400/10 rounded-xl p-3">
                        <div>
                          <p className="text-gray-200">{route.from} → {route.to}</p>
                          <p className="text-gray-500">{route.category} • LKR {route.priceLkr}</p>
                        </div>
                        <div className="flex gap-2">
                          {route.status === 'active' ? (
                            <button
                              onClick={() => deactivateTrainRoute(route.id)}
                              className="px-3 py-1 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-lg text-xs"
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => activateTrainRoute(route.id)}
                              className="px-3 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-xs"
                            >
                              Activate
                            </button>
                          )}
                          <button
                            onClick={() => deleteTrainRoute(route.id)}
                            className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-5">
                  <h3 className="text-lg text-white mb-4">Bookings</h3>
                  <div className="space-y-3">
                    {transportBookings.slice(0, 6).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between text-sm border border-yellow-400/10 rounded-xl p-3">
                        <div>
                          <p className="text-gray-200">{booking.serviceType.toUpperCase()} • {booking.pickup} → {booking.dropoff}</p>
                          <p className="text-gray-500">{booking.status} • LKR {booking.priceLkr}</p>
                        </div>
                        {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                          <button
                            onClick={() => cancelBooking(booking.id)}
                            className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Riders Tab */}
          {activeTab === 'riders' && (() => {
            const filteredRiders = adminRiders.filter(rider => {
              const matchesSearch = 
                rider.fullName.toLowerCase().includes(riderSearchQuery.toLowerCase()) ||
                rider.email.toLowerCase().includes(riderSearchQuery.toLowerCase()) ||
                rider.phone.includes(riderSearchQuery);
              
              const matchesTab = riderFilterTab === 'all' || rider.status === riderFilterTab;
              return matchesSearch && matchesTab;
            });

            return (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl text-white mb-2 font-bold tracking-tight">Rider Management</h2>
                    <p className="text-gray-400 text-sm">Review, approve, suspend, or update platform riders</p>
                  </div>
                </div>

                {/* Search & Tabs Filtering */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-yellow-400/10 pb-4">
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'all', label: 'All', count: adminRiders.length },
                      { id: 'pending', label: 'Pending', count: adminRiders.filter(r => r.status === 'pending').length },
                      { id: 'approved', label: 'Approved', count: adminRiders.filter(r => r.status === 'approved').length },
                      { id: 'suspended', label: 'Suspended', count: adminRiders.filter(r => r.status === 'suspended').length },
                      { id: 'rejected', label: 'Rejected', count: adminRiders.filter(r => r.status === 'rejected').length }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setRiderFilterTab(tab.id as any)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 hover:scale-[1.02] ${
                          riderFilterTab === tab.id
                            ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg shadow-yellow-400/30'
                            : 'bg-gray-800/40 text-gray-400 hover:bg-gray-800 hover:text-white border border-yellow-400/10'
                        }`}
                      >
                        {tab.label}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          riderFilterTab === tab.id ? 'bg-black/20 text-black' : 'bg-gray-700 text-gray-300'
                        }`}>
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search name, email, or phone..."
                      value={riderSearchQuery}
                      onChange={(e) => setRiderSearchQuery(e.target.value)}
                      className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl pl-10 pr-4 py-2 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-350"
                    />
                  </div>
                </div>

                {filteredRiders.length === 0 ? (
                  <div className="text-center py-16 bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl shadow-xl">
                    <Bike className="w-16 h-16 text-yellow-400/50 mx-auto mb-4 animate-bounce" />
                    <h3 className="text-xl text-white mb-2 font-semibold">No Riders Found</h3>
                    <p className="text-gray-400 text-sm max-w-md mx-auto">
                      {riderSearchQuery 
                        ? `No results match your search: "${riderSearchQuery}"` 
                        : `No riders currently have a status of "${riderFilterTab}"`}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredRiders.map((rider, index) => (
                      <div 
                        key={rider.id}
                        className="relative group animate-fadeIn"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-yellow-600/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-6 hover:border-yellow-400/40 transition-all flex flex-col justify-between h-full shadow-2xl">
                          <div>
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-xl text-white font-bold mb-1 group-hover:text-yellow-400 transition-colors">{rider.fullName}</h3>
                                <span className="text-yellow-400/60 text-xs font-mono">ID: {rider.id.slice(0, 8)}...</span>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                rider.status === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                rider.status === 'pending' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                rider.status === 'suspended' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                'bg-gray-500/10 text-gray-400 border-gray-500/20'
                              }`}>
                                {rider.status.charAt(0).toUpperCase() + rider.status.slice(1)}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 mb-6">
                              <div className="flex items-center gap-2.5 text-sm">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-300 truncate" title={rider.email}>{rider.email}</span>
                              </div>
                              <div className="flex items-center gap-2.5 text-sm">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-300">{rider.phone}</span>
                              </div>
                              <div className="flex items-center gap-2.5 text-sm">
                                <Bike className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-400">Vehicle:</span>
                                <span className="text-white capitalize">{rider.vehicleType} ({rider.vehicleNumber})</span>
                              </div>
                              <div className="flex items-center gap-2.5 text-sm">
                                <FileText className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-400">License:</span>
                                <span className="text-white font-mono">{rider.licenseNumber}</span>
                              </div>
                              <div className="flex items-center gap-2.5 text-sm">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500/20" />
                                <span className="text-gray-400">Rating:</span>
                                <span className="text-white font-semibold">
                                  {rider.ratingAvg > 0 ? `${rider.ratingAvg.toFixed(1)} ★ (${rider.ratingCount} reviews)` : 'No ratings yet'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2.5 text-sm">
                                <Activity className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-400">Availability:</span>
                                <div className="flex items-center gap-1.5">
                                  <span className={`w-2.5 h-2.5 rounded-full ${
                                    rider.availability === 'available' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' :
                                    rider.availability === 'busy' ? 'bg-yellow-500 shadow-[0_0_8px_#eab308]' :
                                    'bg-gray-500'
                                  }`} />
                                  <span className="text-white capitalize font-semibold">{rider.availability}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {/* Quick Availability Actions (Only for approved riders) */}
                            {rider.status === 'approved' && (
                              <div className="flex items-center justify-between border-t border-yellow-400/5 pt-3">
                                <span className="text-xs text-gray-400 font-semibold">Quick Availability:</span>
                                <div className="flex gap-1.5">
                                  {(['available', 'busy', 'offline'] as const).map((avail) => (
                                    <button
                                      key={avail}
                                      onClick={() => updateRiderAvailability(rider.id, avail)}
                                      className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all duration-200 ${
                                        rider.availability === avail
                                          ? avail === 'available' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                            avail === 'busy' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                            'bg-gray-800 text-gray-200 border border-gray-700'
                                          : 'bg-black/20 text-gray-500 border border-transparent hover:text-gray-300'
                                      }`}
                                    >
                                      {avail}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Admin Action Buttons */}
                            <div className="flex gap-2 pt-3 border-t border-yellow-400/10">
                              <button
                                onClick={() => setSelectedRider(rider)}
                                className="flex-1 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-all border border-blue-500/20 hover:border-blue-500/40 text-sm font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] duration-200"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>

                              {rider.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleApproveRider(rider.id)}
                                    className="flex-1 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-xl transition-all border border-green-500/20 hover:border-green-500/40 text-sm font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] duration-200"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleRejectRider(rider.id)}
                                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all border border-red-500/20 hover:border-red-500/40 flex items-center justify-center hover:scale-[1.02] duration-200"
                                    title="Reject Application"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}

                              {rider.status === 'approved' && (
                                <button
                                  onClick={() => handleSuspendRider(rider.id)}
                                  className="flex-1 px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-xl transition-all border border-orange-500/20 hover:border-orange-500/40 text-sm font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] duration-200"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Suspend
                                </button>
                              )}

                              {rider.status === 'suspended' && (
                                <button
                                  onClick={() => handleReactivateRider(rider.id)}
                                  className="flex-1 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-all border border-blue-500/20 hover:border-blue-500/40 text-sm font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] duration-200"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Reactivate
                                </button>
                              )}

                              {rider.status === 'rejected' && (
                                <button
                                  onClick={() => handleApproveRider(rider.id)}
                                  className="flex-1 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-xl transition-all border border-green-500/20 hover:border-green-500/40 text-sm font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] duration-200"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Approve
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl text-white mb-2">Student Management</h2>
                  <p className="text-gray-400">View and manage registered students</p>
                </div>
              </div>

              <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-yellow-400/10 border-b-2 border-yellow-400/20">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm text-yellow-400">Student ID</th>
                        <th className="px-6 py-4 text-left text-sm text-yellow-400">Name</th>
                        <th className="px-6 py-4 text-left text-sm text-yellow-400">Email</th>
                        <th className="px-6 py-4 text-left text-sm text-yellow-400">Faculty</th>
                        <th className="px-6 py-4 text-left text-sm text-yellow-400">Year</th>
                        <th className="px-6 py-4 text-left text-sm text-yellow-400">Status</th>
                        <th className="px-6 py-4 text-left text-sm text-yellow-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student, index) => (
                        <tr 
                          key={student.id}
                          className="border-b border-yellow-400/10 hover:bg-yellow-400/5 transition-colors animate-fadeIn"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <td className="px-6 py-4 text-white text-sm">{student.studentId}</td>
                          <td className="px-6 py-4 text-white text-sm">{student.fullName}</td>
                          <td className="px-6 py-4 text-gray-400 text-sm">{student.email}</td>
                          <td className="px-6 py-4 text-white text-sm">{student.faculty}</td>
                          <td className="px-6 py-4 text-white text-sm">{student.year}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              student.status === 'active' 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {student.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button className="text-blue-400 hover:text-blue-300 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl text-white mb-2">Review Moderation</h2>
                  <p className="text-gray-400">Monitor and moderate user reviews</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {reviews.map((review, index) => (
                  <div 
                    key={review.id}
                    className="relative group animate-fadeIn"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-6 hover:border-yellow-400/40 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg text-white">{review.studentName}</h3>
                            <span className="text-gray-400">reviewed</span>
                            <span className="text-yellow-400">{review.businessName}</span>
                          </div>
                          <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-300 mb-3">{review.comment}</p>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          review.status === 'approved' 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : review.status === 'pending'
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {review.status}
                        </span>
                      </div>

                      {review.status === 'pending' && (
                        <div className="flex gap-2">
                          <button className="flex-1 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-xl transition-all border border-green-500/20 hover:border-green-500/40 text-sm font-medium flex items-center justify-center gap-2 hover:scale-105 duration-300">
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button className="flex-1 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all border border-red-500/20 hover:border-red-500/40 text-sm font-medium flex items-center justify-center gap-2 hover:scale-105 duration-300">
                            <XCircle className="w-4 h-4" />
                            Flag
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl text-white mb-2">Platform Analytics</h2>
                <p className="text-gray-400">Detailed insights and performance metrics</p>
              </div>

              {/* Revenue Chart */}
              <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-6">
                <h3 className="text-xl text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-yellow-400" />
                  Revenue Growth
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #f59e0b', borderRadius: '8px' }}
                      labelStyle={{ color: '#f59e0b' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Avg. Order Value</p>
                      <p className="text-2xl text-white">Rs. 538</p>
                    </div>
                  </div>
                  <p className="text-sm text-green-400">+12% from last month</p>
                </div>

                <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Avg. Delivery Time</p>
                      <p className="text-2xl text-white">28 min</p>
                    </div>
                  </div>
                  <p className="text-sm text-green-400">-5% from last month</p>
                </div>

                <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Avg. Rating</p>
                      <p className="text-2xl text-white">4.6</p>
                    </div>
                  </div>
                  <p className="text-sm text-green-400">+0.3 from last month</p>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl text-white mb-2">Platform Settings</h2>
                <p className="text-gray-400">Configure platform settings and preferences</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-6">
                  <h3 className="text-lg text-white mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-yellow-400" />
                    General Settings
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Platform Name</label>
                      <input
                        type="text"
                        defaultValue="NearU"
                        className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Support Email</label>
                      <input
                        type="email"
                        defaultValue="support@nearu.lk"
                        className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Contact Phone</label>
                      <input
                        type="tel"
                        defaultValue="+94 77 000 0000"
                        className="w-full bg-black/40 border-2 border-yellow-400/20 focus:border-yellow-400/60 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-6">
                  <h3 className="text-lg text-white mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-yellow-400" />
                    Notification Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white">New Business Applications</span>
                      <button className="w-12 h-6 bg-yellow-400 rounded-full relative">
                        <span className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full transition-all"></span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">New Rider Applications</span>
                      <button className="w-12 h-6 bg-yellow-400 rounded-full relative">
                        <span className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full transition-all"></span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Flagged Reviews</span>
                      <button className="w-12 h-6 bg-yellow-400 rounded-full relative">
                        <span className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full transition-all"></span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Daily Reports</span>
                      <button className="w-12 h-6 bg-gray-600 rounded-full relative">
                        <span className="absolute left-1 top-1 w-4 h-4 bg-gray-400 rounded-full transition-all"></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all border border-gray-700 hover:scale-105 duration-300">
                  Cancel
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black rounded-xl font-medium transition-all hover:scale-105 duration-300 flex items-center gap-2 shadow-lg">
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Business Details Modal */}
      {selectedBusiness && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-400/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            <button
              onClick={() => setSelectedBusiness(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl text-white mb-6">Business Details</h2>

            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">Business Name</label>
                <p className="text-white text-lg">{selectedBusiness.businessName}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Owner Name</label>
                <p className="text-white">{selectedBusiness.ownerName}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Email</label>
                <p className="text-white">{selectedBusiness.email}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Phone</label>
                <p className="text-white">{selectedBusiness.phone}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Business Type</label>
                <p className="text-white">{selectedBusiness.businessType}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Address</label>
                <p className="text-white">{selectedBusiness.address}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Description</label>
                <p className="text-white">{selectedBusiness.description}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Registration Number</label>
                <p className="text-white">{selectedBusiness.registrationNumber}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Tax ID</label>
                <p className="text-white">{selectedBusiness.taxId}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => handleApproveBusiness(selectedBusiness.id)}
                className="flex-1 px-6 py-3 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-xl transition-all border border-green-500/20 hover:border-green-500/40 font-medium flex items-center justify-center gap-2 hover:scale-105 duration-300"
              >
                <CheckCircle className="w-5 h-5" />
                Approve Business
              </button>
              <button
                onClick={() => handleRejectBusiness(selectedBusiness.id)}
                className="flex-1 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all border border-red-500/20 hover:border-red-500/40 font-medium flex items-center justify-center gap-2 hover:scale-105 duration-300"
              >
                <XCircle className="w-5 h-5" />
                Reject Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rider Details Modal */}
      {selectedRider && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-400/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            <button
              onClick={() => setSelectedRider(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl text-white mb-6">Rider Details</h2>

            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">Full Name</label>
                <p className="text-white text-lg">{selectedRider.fullName}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Email</label>
                <p className="text-white">{selectedRider.email}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Phone</label>
                <p className="text-white">{selectedRider.phone}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Vehicle Type</label>
                <p className="text-white">{selectedRider.vehicleType}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Vehicle Number</label>
                <p className="text-white">{selectedRider.vehicleNumber}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">License Number</label>
                <p className="text-white">{selectedRider.licenseNumber}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Availability</label>
                <p className="text-white">{selectedRider.availability}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Rating</label>
                <p className="text-white">{selectedRider.ratingAvg} ({selectedRider.ratingCount})</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Joined</label>
                <p className="text-white">{selectedRider.createdAt}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => handleApproveRider(selectedRider.id)}
                className="flex-1 px-6 py-3 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-xl transition-all border border-green-500/20 hover:border-green-500/40 font-medium flex items-center justify-center gap-2 hover:scale-105 duration-300"
              >
                <CheckCircle className="w-5 h-5" />
                Approve Rider
              </button>
              <button
                onClick={() => handleRejectRider(selectedRider.id)}
                className="flex-1 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all border border-red-500/20 hover:border-red-500/40 font-medium flex items-center justify-center gap-2 hover:scale-105 duration-300"
              >
                <XCircle className="w-5 h-5" />
                Reject Application
              </button>
              {selectedRider.status === 'approved' && (
                <button
                  onClick={() => handleSuspendRider(selectedRider.id)}
                  className="flex-1 px-6 py-3 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-xl transition-all border border-orange-500/20 hover:border-orange-500/40 font-medium flex items-center justify-center gap-2 hover:scale-105 duration-300"
                >
                  <AlertCircle className="w-5 h-5" />
                  Suspend Rider
                </button>
              )}
              {selectedRider.status === 'suspended' && (
                <button
                  onClick={() => handleReactivateRider(selectedRider.id)}
                  className="flex-1 px-6 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-all border border-blue-500/20 hover:border-blue-500/40 font-medium flex items-center justify-center gap-2 hover:scale-105 duration-300"
                >
                  <CheckCircle className="w-5 h-5" />
                  Reactivate Rider
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
