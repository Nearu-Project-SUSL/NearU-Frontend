import { useState } from 'react';
import { Store, Phone, Edit2, Save, X, Plus, Trash2, DollarSign, TrendingUp, Users, Star, UtensilsCrossed, Package, Camera, Bell, Settings, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  available: boolean;
}

export default function BusinessOwnerHome() {
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'menu'>('overview');
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [businessData, setBusinessData] = useState({
    name: 'Campus Canteen',
    phone: '+94 77 555 1234',
    email: 'campuscanteen@nearu.lk',
    address: 'Main Campus Building, Sabaragamuwa University',
    description: 'Serving delicious meals to students and staff since 2020. We offer a wide variety of Sri Lankan and Western cuisine at affordable prices.',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400'
  });

  const [businessForm, setBusinessForm] = useState(businessData);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Rice & Curry',
      description: 'Traditional Sri Lankan rice with 3 curries',
      price: '250',
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
      available: true
    },
    {
      id: '2',
      name: 'Chicken Fried Rice',
      description: 'Fragrant fried rice with chicken and vegetables',
      price: '320',
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
      available: true
    },
    {
      id: '3',
      name: 'Kottu Roti',
      description: 'Chopped roti with vegetables and your choice of protein',
      price: '350',
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1626074353765-517a1f1b7da3?w=400',
      available: true
    },
    {
      id: '4',
      name: 'Club Sandwich',
      description: 'Triple-decker sandwich with chicken, bacon, lettuce',
      price: '280',
      category: 'Snacks',
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400',
      available: true
    },
    {
      id: '5',
      name: 'Cappuccino',
      description: 'Rich espresso with steamed milk foam',
      price: '180',
      category: 'Beverages',
      image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
      available: true
    },
    {
      id: '6',
      name: 'Chocolate Cake',
      description: 'Moist chocolate cake with rich frosting',
      price: '200',
      category: 'Desserts',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
      available: false
    }
  ]);

  const [newItem, setNewItem] = useState<MenuItem>({
    id: '',
    name: '',
    description: '',
    price: '',
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    available: true
  });

  const stats = [
    { label: 'Total Orders', value: '1,247', icon: Package, color: 'from-blue-500 to-blue-600', change: '+12%' }
  ];

  const recentOrders = [
    { id: '#1247', customer: 'Kasun Perera', items: '2x Rice & Curry, 1x Drink', amount: 'Rs. 580', time: '5 mins ago', status: 'pending' },
    { id: '#1246', customer: 'Thimira Silva', items: '1x Kottu Roti', amount: 'Rs. 350', time: '12 mins ago', status: 'preparing' },
    { id: '#1245', customer: 'Manjari Fernando', items: '1x Club Sandwich, 1x Cappuccino', amount: 'Rs. 460', time: '25 mins ago', status: 'ready' },
    { id: '#1244', customer: 'Uvindu Rathnayake', items: '3x Fried Rice', amount: 'Rs. 960', time: '1 hour ago', status: 'completed' }
  ];

  const categories = ['Main Course', 'Snacks', 'Beverages', 'Desserts'];

  const handleSaveBusinessInfo = () => {
    setBusinessData(businessForm);
    setIsEditingBusiness(false);
  };

  const handleCancelBusinessEdit = () => {
    setBusinessForm(businessData);
    setIsEditingBusiness(false);
  };

  const handleAddItem = () => {
    const item: MenuItem = {
      ...newItem,
      id: Date.now().toString()
    };
    setMenuItems([...menuItems, item]);
    setNewItem({
      id: '',
      name: '',
      description: '',
      price: '',
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      available: true
    });
    setShowAddItemModal(false);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
  };

  const handleSaveEditItem = () => {
    if (editingItem) {
      setMenuItems(menuItems.map(item => 
        item.id === editingItem.id ? editingItem : item
      ));
      setEditingItem(null);
    }
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setMenuItems(menuItems.filter(item => item.id !== id));
    }
  };

  const handleToggleAvailability = (id: string) => {
    setMenuItems(menuItems.map(item =>
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'preparing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'ready': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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

      {/* Main Content */}
      <div className="relative">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-2xl border-b-2 border-yellow-400/20 shadow-2xl shadow-yellow-400/5">
          <div className="flex items-center justify-between px-8 lg:px-12 py-5">
            <div className="flex items-center gap-6">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-yellow-400 shadow-xl shadow-yellow-400/30 group-hover:scale-110 transition-transform duration-300">
                  <img 
                    src={businessData.logo}
                    alt="Business Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-2xl text-white">{businessData.name}</h1>
                <p className="text-yellow-400/70 text-sm">Business Dashboard</p>
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
              onClick={() => setActiveTab('menu')}
              className={`px-6 py-2.5 rounded-xl transition-all font-medium ${
                activeTab === 'menu'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              Menu Management
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <section className="px-8 lg:px-12 py-12 relative">
          <div className="max-w-7xl mx-auto">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <div 
                      key={stat.label}
                      className="relative group animate-fadeIn"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                      
                    </div>
                  ))}
                </div>

                {/* Business Information */}
                <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 rounded-2xl p-8 animate-slideIn">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Store className="w-6 h-6 text-yellow-400" />
                      <h3 className="text-2xl text-white">Business Information</h3>
                    </div>
                    <button
                      onClick={() => setIsEditingBusiness(!isEditingBusiness)}
                      className="px-4 py-2 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 rounded-xl transition-all border border-yellow-400/20 hover:border-yellow-400/40 text-sm font-medium flex items-center gap-2"
                    >
                      {isEditingBusiness ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                      {isEditingBusiness ? 'Cancel' : 'Edit'}
                    </button>
                  </div>

                  {isEditingBusiness ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Business Name</label>
                          <input
                            type="text"
                            value={businessForm.name}
                            onChange={(e) => setBusinessForm({...businessForm, name: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-yellow-400/20 rounded-xl text-white focus:outline-none focus:border-yellow-400"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                          <input
                            type="tel"
                            value={businessForm.phone}
                            onChange={(e) => setBusinessForm({...businessForm, phone: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-yellow-400/20 rounded-xl text-white focus:outline-none focus:border-yellow-400"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                        <input
                          type="email"
                          value={businessForm.email}
                          onChange={(e) => setBusinessForm({...businessForm, email: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-yellow-400/20 rounded-xl text-white focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Address</label>
                        <input
                          type="text"
                          value={businessForm.address}
                          onChange={(e) => setBusinessForm({...businessForm, address: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-yellow-400/20 rounded-xl text-white focus:outline-none focus:border-yellow-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                        <textarea
                          value={businessForm.description}
                          onChange={(e) => setBusinessForm({...businessForm, description: e.target.value})}
                          rows={3}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-yellow-400/20 rounded-xl text-white focus:outline-none focus:border-yellow-400 resize-none"
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={handleSaveBusinessInfo}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                        >
                          <Save className="w-5 h-5" />
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancelBusinessEdit}
                          className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                        >
                          <X className="w-5 h-5" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl">
                          <Store className="w-5 h-5 text-yellow-400" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-400">Business Name</p>
                            <p className="text-white font-medium">{businessData.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl">
                          <Phone className="w-5 h-5 text-yellow-400" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-400">Phone</p>
                            <p className="text-white font-medium">{businessData.phone}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-800/30 rounded-xl">
                          <p className="text-sm text-gray-400 mb-2">Address</p>
                          <p className="text-white">{businessData.address}</p>
                        </div>
                        <div className="p-4 bg-gray-800/30 rounded-xl">
                          <p className="text-sm text-gray-400 mb-2">Description</p>
                          <p className="text-white text-sm">{businessData.description}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Menu Management Tab */}
            {activeTab === 'menu' && (
              <div className="space-y-8">
                {/* Add New Item Button */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl text-white mb-2">Menu Items</h2>
                    <p className="text-gray-400">Manage your food items, prices, and availability</p>
                  </div>
                  <button
                    onClick={() => setShowAddItemModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black rounded-xl font-medium transition-all hover:scale-105 flex items-center gap-2 shadow-xl"
                  >
                    <Plus className="w-5 h-5" />
                    Add New Item
                  </button>
                </div>

                {/* Menu Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems.map((item, index) => (
                    <div 
                      key={item.id}
                      className="relative group animate-fadeIn"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className={`relative bg-gradient-to-br from-gray-900/80 to-black/80 border-2 rounded-2xl overflow-hidden hover:border-yellow-400/40 transition-all ${
                        item.available ? 'border-yellow-400/20' : 'border-gray-700/50 opacity-60'
                      }`}>
                        {/* Item Image */}
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          {!item.available && (
                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                              <span className="text-white font-semibold text-lg">Unavailable</span>
                            </div>
                          )}
                          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${
                            item.available 
                              ? 'bg-green-500/90 text-white' 
                              : 'bg-red-500/90 text-white'
                          }`}>
                            {item.available ? 'Available' : 'Out of Stock'}
                          </div>
                        </div>

                        {/* Item Details */}
                        <div className="p-5">
                          {editingItem?.id === item.id ? (
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={editingItem.name}
                                onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                                className="w-full px-3 py-2 bg-gray-800/50 border border-yellow-400/20 rounded-lg text-white focus:outline-none focus:border-yellow-400 text-sm"
                                placeholder="Item name"
                              />
                              <textarea
                                value={editingItem.description}
                                onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                                rows={2}
                                className="w-full px-3 py-2 bg-gray-800/50 border border-yellow-400/20 rounded-lg text-white focus:outline-none focus:border-yellow-400 resize-none text-sm"
                                placeholder="Description"
                              />
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  value={editingItem.price}
                                  onChange={(e) => setEditingItem({...editingItem, price: e.target.value})}
                                  className="flex-1 px-3 py-2 bg-gray-800/50 border border-yellow-400/20 rounded-lg text-white focus:outline-none focus:border-yellow-400 text-sm"
                                  placeholder="Price"
                                />
                                <select
                                  value={editingItem.category}
                                  onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                                  className="flex-1 px-3 py-2 bg-gray-800/50 border border-yellow-400/20 rounded-lg text-white focus:outline-none focus:border-yellow-400 text-sm"
                                >
                                  {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={handleSaveEditItem}
                                  className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-all"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingItem(null)}
                                  className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-all"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-white mb-1">{item.name}</h3>
                                  <p className="text-sm text-gray-400 mb-2">{item.description}</p>
                                  <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-yellow-400">Rs. {item.price}</span>
                                    <span className="text-xs text-gray-500 px-2 py-1 bg-gray-800/50 rounded">
                                      {item.category}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2 mt-4">
                                <button
                                  onClick={() => handleEditItem(item)}
                                  className="flex-1 px-3 py-2 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 rounded-lg transition-all border border-yellow-400/20 hover:border-yellow-400/40 text-sm font-medium flex items-center justify-center gap-1"
                                >
                                  <Edit2 className="w-4 h-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleToggleAvailability(item.id)}
                                  className={`flex-1 px-3 py-2 rounded-lg transition-all border text-sm font-medium ${
                                    item.available
                                      ? 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border-orange-500/20 hover:border-orange-500/40'
                                      : 'bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/20 hover:border-green-500/40'
                                  }`}
                                >
                                  {item.available ? 'Mark Unavailable' : 'Mark Available'}
                                </button>
                                <button
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all border border-red-500/20 hover:border-red-500/40 flex items-center justify-center"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Add New Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fadeIn">
          <div className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-400/30 rounded-3xl p-8 shadow-2xl w-full max-w-2xl animate-slideUp max-h-[90vh] overflow-y-auto">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 rounded-3xl" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(250, 204, 21, 0.3) 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }}></div>

            {/* Header */}
            <div className="relative flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                  <UtensilsCrossed className="w-6 h-6 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-white">Add New Menu Item</h2>
              </div>
              <button 
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center transition-all text-gray-400 hover:text-white" 
                onClick={() => setShowAddItemModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="relative space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Item Name</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-yellow-400/20 rounded-xl text-white focus:outline-none focus:border-yellow-400"
                  placeholder="e.g., Chicken Burger"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-yellow-400/20 rounded-xl text-white focus:outline-none focus:border-yellow-400 resize-none"
                  placeholder="Describe your menu item..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Price (Rs.)</label>
                  <input
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-yellow-400/20 rounded-xl text-white focus:outline-none focus:border-yellow-400"
                    placeholder="250"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-yellow-400/20 rounded-xl text-white focus:outline-none focus:border-yellow-400"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Image URL</label>
                <input
                  type="url"
                  value={newItem.image}
                  onChange={(e) => setNewItem({...newItem, image: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-yellow-400/20 rounded-xl text-white focus:outline-none focus:border-yellow-400"
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddItem}
                  disabled={!newItem.name || !newItem.price}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Item
                </button>
                <button
                  onClick={() => setShowAddItemModal(false)}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}