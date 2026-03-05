import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { PageLayout } from '../components/PageLayout';
import { NotificationDropdown } from '../components/NotificationDropdown';
import { Bus, Train, Bike, Car, ArrowRight, Clock, MapPin, DollarSign, Star, Search, SlidersHorizontal, Bell } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import userAvatar from 'figma:asset/902c55af84906a0971d3584133214377bc973536.png';

type BusCategory = 'SLTB' | 'Semi' | 'AC' | 'Private';
type TrainCategory = 'Express' | 'Intercity' | 'Mail' | 'Office';

interface BusRoute {
  id: string;
  from: string;
  to: string;
  category: BusCategory;
  image: string;
  departures: string[];
  duration: string;
  price: string;
}

interface TrainRoute {
  id: string;
  from: string;
  to: string;
  category: TrainCategory;
  image: string;
  schedule: { departure: string; arrival: string; departureTime: string; arrivalTime: string }[];
  trainType: string;
  status: string;
}

interface TukDriver {
  id: string;
  name: string;
  location: string;
  vehicle: string;
  vehicleNumber: string;
  image: string;
  rating: number;
  phone: string;
}

export default function Transport() {
  const location = useLocation();
  const [busCategory, setBusCategory] = useState<BusCategory>('SLTB');
  const [trainCategory, setTrainCategory] = useState<TrainCategory>('Express');
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | TrainRoute | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Determine which sections to show based on route
  const showBusSection = location.pathname === '/transport/bus';
  const showTrainSection = location.pathname === '/transport/train';
  const showTukSection = location.pathname === '/transport/all';

  const busRoutes: BusRoute[] = [
    {
      id: 'b1',
      from: 'Colombo',
      to: 'Badulla',
      category: 'SLTB',
      image: 'https://images.unsplash.com/photo-1766579730651-45d8c0e70dd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwcmVkJTIwYnVzJTIwcnVyYWx8ZW58MXx8fHwxNzcxNTk5MTc5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      departures: ['06:00 AM', '09:30 AM', '02:00 PM', '06:30 PM'],
      duration: '5-6 hours',
      price: '$2.50'
    },
    {
      id: 'b2',
      from: 'Colombo',
      to: 'Badulla',
      category: 'Semi',
      image: 'https://images.unsplash.com/photo-1767950892295-aa606692ee87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwaW50ZXJjaXR5JTIwYnVzJTIwdHJhbnNwb3J0YXRpb258ZW58MXx8fHwxNzcxNTk5MTc5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      departures: ['07:00 AM', '10:00 AM', '03:00 PM', '07:00 PM'],
      duration: '4.5-5 hours',
      price: '$3.50'
    },
    {
      id: 'b3',
      from: 'Balangoda',
      to: 'Nanpariel',
      category: 'SLTB',
      image: 'https://images.unsplash.com/photo-1766579730651-45d8c0e70dd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwcmVkJTIwYnVzJTIwcnVyYWx8ZW58MXx8fHwxNzcxNTk5MTc5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      departures: ['08:00 AM', '11:30 AM', '04:00 PM', '08:00 PM'],
      duration: '2-3 hours',
      price: '$1.50'
    },
    {
      id: 'b4',
      from: 'Pandura',
      to: 'Badulla',
      category: 'SLTB',
      image: 'https://images.unsplash.com/photo-1766579730651-45d8c0e70dd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwcmVkJTIwYnVzJTIwcnVyYWx8ZW58MXx8fHwxNzcxNTk5MTc5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      departures: ['06:30 AM', '10:00 AM', '02:30 PM', '07:00 PM'],
      duration: '3-4 hours',
      price: '$2.00'
    },
    {
      id: 'b5',
      from: 'Colombo',
      to: 'Welimada',
      category: 'Semi',
      image: 'https://images.unsplash.com/photo-1767950892295-aa606692ee87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwaW50ZXJjaXR5JTIwYnVzJTIwdHJhbnNwb3J0YXRpb258ZW58MXx8fHwxNzcxNTk5MTc5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      departures: ['07:30 AM', '11:00 AM', '03:30 PM', '07:30 PM'],
      duration: '4-5 hours',
      price: '$3.00'
    },
    {
      id: 'b6',
      from: 'Balangoda',
      to: 'Pambahinna',
      category: 'SLTB',
      image: 'https://images.unsplash.com/photo-1766579730651-45d8c0e70dd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwcmVkJTIwYnVzJTIwcnVyYWx8ZW58MXx8fHwxNzcxNTk5MTc5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      departures: ['06:00 AM', '09:00 AM', '01:00 PM', '06:00 PM'],
      duration: '1-2 hours',
      price: '$1.00'
    },
  ];

  const trainRoutes: TrainRoute[] = [
    {
      id: 't1',
      from: 'Colombo',
      to: 'Badulla',
      category: 'Express',
      image: 'https://images.unsplash.com/photo-1754218119361-95c0d575e8cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwdHJhaW4lMjBkaWVzZWwlMjBsb2NvbW90aXZlfGVufDF8fHx8MTc3MTU5OTE3OXww&ixlib=rb-4.1.0&q=80&w=1080',
      schedule: [
        { departure: 'Colombo', arrival: 'Badulla', departureTime: '08:30 A.M.', arrivalTime: '05:50 P.M.' },
        { departure: 'Badulla', arrival: 'Colombo', departureTime: '05:45 A.M.', arrivalTime: '03:30 P.M.' }
      ],
      trainType: 'Express Train',
      status: 'Usually Not Busy'
    },
    {
      id: 't2',
      from: 'Kandy',
      to: 'Badulla',
      category: 'Intercity',
      image: 'https://images.unsplash.com/photo-1770487708882-2011b93fe17e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0cmFpbiUyMHJhaWx3YXklMjBwYXNzZW5nZXJ8ZW58MXx8fHwxNzcxNTk5MTgwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      schedule: [
        { departure: 'Kandy', arrival: 'Badulla', departureTime: '09:00 A.M.', arrivalTime: '02:30 P.M.' },
        { departure: 'Badulla', arrival: 'Kandy', departureTime: '03:00 P.M.', arrivalTime: '08:30 P.M.' }
      ],
      trainType: 'Intercity',
      status: 'Moderately Busy'
    },
    {
      id: 't3',
      from: 'Ella',
      to: 'Kandy',
      category: 'Express',
      image: 'https://images.unsplash.com/photo-1546289917-e018604f4afa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwc3RlYW0lMjBsb2NvbW90aXZlJTIwYmxhY2t8ZW58MXx8fHwxNzcxNTk5MTgwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      schedule: [
        { departure: 'Ella', arrival: 'Kandy', departureTime: '07:15 A.M.', arrivalTime: '12:45 P.M.' },
        { departure: 'Kandy', arrival: 'Ella', departureTime: '01:30 P.M.', arrivalTime: '07:00 P.M.' }
      ],
      trainType: 'Odyssey',
      status: 'Usually Busy'
    },
    {
      id: 't4',
      from: 'Colombo',
      to: 'Badulla',
      category: 'Mail',
      image: 'https://images.unsplash.com/photo-1754218119361-95c0d575e8cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwdHJhaW4lMjBkaWVzZWwlMjBsb2NvbW90aXZlfGVufDF8fHx8MTc3MTU5OTE3OXww&ixlib=rb-4.1.0&q=80&w=1080',
      schedule: [
        { departure: 'Colombo', arrival: 'Badulla', departureTime: '06:00 A.M.', arrivalTime: '03:00 P.M.' },
        { departure: 'Badulla', arrival: 'Colombo', departureTime: '04:00 P.M.', arrivalTime: '11:00 P.M.' }
      ],
      trainType: 'Mail',
      status: 'Usually Not Busy'
    },
    {
      id: 't5',
      from: 'Kandy',
      to: 'Badulla',
      category: 'Office',
      image: 'https://images.unsplash.com/photo-1770487708882-2011b93fe17e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0cmFpbiUyMHJhaWx3YXklMjBwYXNzZW5nZXJ8ZW58MXx8fHwxNzcxNTk5MTgwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      schedule: [
        { departure: 'Kandy', arrival: 'Badulla', departureTime: '05:30 A.M.', arrivalTime: '11:00 A.M.' },
        { departure: 'Badulla', arrival: 'Kandy', departureTime: '05:00 P.M.', arrivalTime: '10:30 P.M.' }
      ],
      trainType: 'Office',
      status: 'Very Busy'
    },
    {
      id: 't6',
      from: 'Ella',
      to: 'Kandy',
      category: 'Express',
      image: 'https://images.unsplash.com/photo-1546289917-e018604f4afa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwc3RlYW0lMjBsb2NvbW90aXZlJTIwYmxhY2t8ZW58MXx8fHwxNzcxNTk5MTgwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      schedule: [
        { departure: 'Ella', arrival: 'Kandy', departureTime: '10:00 A.M.', arrivalTime: '03:30 P.M.' },
        { departure: 'Kandy', arrival: 'Ella', departureTime: '04:00 P.M.', arrivalTime: '09:30 P.M.' }
      ],
      trainType: 'Odyssey',
      status: 'Moderately Busy'
    }
  ];

  const tukDrivers: TukDriver[] = [
    {
      id: 'tk1',
      name: 'Ravi Kumara',
      location: 'Pambahinna Area',
      vehicle: 'Red Tuk',
      vehicleNumber: 'ABY-4565',
      image: 'https://images.unsplash.com/photo-1742282302396-7d843909555c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dWslMjB0dWslMjB0aHJlZSUyMHdoZWVsZXIlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzE1OTkxODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.8,
      phone: '+94 77 123 4567'
    },
    {
      id: 'tk2',
      name: 'Sunil Shantha',
      location: 'Campus MainGate',
      vehicle: 'Green Tuk',
      vehicleNumber: 'ABY-4565',
      image: 'https://images.unsplash.com/photo-1740920508508-2009d8c67ed5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvJTIwcmlja3NoYXclMjBncmVlbiUyMGFzaWF8ZW58MXx8fHwxNzcxNTk5MTgxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.9,
      phone: '+94 77 234 5678'
    },
    {
      id: 'tk3',
      name: 'Suresh Perera',
      location: 'Y Junction',
      vehicle: 'Red Tuk',
      vehicleNumber: 'ABY-4565',
      image: 'https://images.unsplash.com/photo-1742282302396-7d843909555c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dWslMjB0dWslMjB0aHJlZSUyMHdoZWVsZXIlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzE1OTkxODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.7,
      phone: '+94 77 345 6789'
    },
    {
      id: 'tk4',
      name: 'Nimal Silva',
      location: 'University Grounds',
      vehicle: 'Yellow Tuk',
      vehicleNumber: 'CAB-7890',
      image: 'https://images.unsplash.com/photo-1742282302396-7d843909555c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dWslMjB0dWslMjB0aHJlZSUyMHdoZWVsZXIlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzE1OTkxODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.6,
      phone: '+94 77 456 7890'
    },
    {
      id: 'tk5',
      name: 'Anil Fernando',
      location: 'Library Junction',
      vehicle: 'Green Tuk',
      vehicleNumber: 'BCD-1234',
      image: 'https://images.unsplash.com/photo-1740920508508-2009d8c67ed5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvJTIwcmlja3NoYXclMjBncmVlbiUyMGFzaWF8ZW58MXx8fHwxNzcxNTk5MTgxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.8,
      phone: '+94 77 567 8901'
    },
    {
      id: 'tk6',
      name: 'Jagath Wijesinghe',
      location: 'Sports Complex',
      vehicle: 'Red Tuk',
      vehicleNumber: 'DEF-5678',
      image: 'https://images.unsplash.com/photo-1742282302396-7d843909555c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dWslMjB0dWslMjB0aHJlZSUyMHdoZWVsZXIlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzE1OTkxODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      rating: 4.9,
      phone: '+94 77 678 9012'
    }
  ];

  const filteredBusRoutes = busRoutes.filter(route => route.category === busCategory);
  const filteredTrainRoutes = trainRoutes.filter(route => route.category === trainCategory);

  const handleViewDetails = (route: BusRoute | TrainRoute) => {
    setSelectedRoute(route);
    setShowModal(true);
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
                  <span className="text-3xl">🚗</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl text-white">Transport Hub</h1>
                <p className="text-yellow-400/70 text-sm">Your journey starts here</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <NotificationDropdown />
              
              <Link to="/register" className="relative group">
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
          <div className="max-w-7xl mx-auto space-y-16">
            {/* Bus Routine Section */}
            {showBusSection && (
              <div className="animate-fadeIn">
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                      <Bus className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h2 className="text-4xl text-white">Bus Routine</h2>
                      <p className="text-gray-400">Find your way around Campus and anywhere. Most accurate Updates.</p>
                    </div>
                  </div>

                  {/* Category Tabs */}
                  <div className="flex gap-3 mb-8">
                    {(['SLTB', 'Semi', 'AC', 'Private'] as BusCategory[]).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setBusCategory(cat)}
                        className={`px-8 py-3 rounded-xl transition-all duration-300 ${
                          busCategory === cat
                            ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg shadow-yellow-500/30'
                            : 'bg-white/5 text-gray-400 hover:text-yellow-400 border border-yellow-400/20 hover:border-yellow-400/40'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Bus Route Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBusRoutes.map((route, index) => (
                      <div
                        key={route.id}
                        className="group bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 hover:border-yellow-400/40 rounded-3xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/10 animate-slideUp"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {/* Bus Image */}
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={route.image}
                            alt={`${route.from} - ${route.to}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-2xl text-white mb-2">{route.from} - {route.to}</h3>
                          <span className={`inline-block px-4 py-1.5 rounded-lg text-sm mb-4 ${
                            route.category === 'SLTB' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            route.category === 'Semi' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            route.category === 'AC' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          }`}>
                            {route.category}
                          </span>

                          <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-gray-400">
                              <Clock className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm">Duration: {route.duration}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                              <DollarSign className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm">Price: {route.price}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleViewDetails(route)}
                            className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group/btn"
                          >
                            <span className="font-medium">View Details</span>
                            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Train Routine Section */}
            {showTrainSection && (
              <div className="animate-fadeIn">
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                      <Train className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h2 className="text-4xl text-white">Train Routine</h2>
                      <p className="text-gray-400">Inter-city connections and railway timings. Find the best train to get you home for the weekend.</p>
                    </div>
                  </div>

                  {/* Category Tabs */}
                  <div className="flex gap-3 mb-8">
                    {(['Express', 'Intercity', 'Mail', 'Office'] as TrainCategory[]).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setTrainCategory(cat)}
                        className={`px-8 py-3 rounded-xl transition-all duration-300 ${
                          trainCategory === cat
                            ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg shadow-yellow-500/30'
                            : 'bg-white/5 text-gray-400 hover:text-yellow-400 border border-yellow-400/20 hover:border-yellow-400/40'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Train Route Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTrainRoutes.map((route, index) => (
                      <div
                        key={route.id}
                        className="group bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-yellow-400/20 hover:border-yellow-400/40 rounded-3xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/10 animate-slideUp"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {/* Train Image */}
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={route.image}
                            alt={`${route.from} - ${route.to}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-2xl text-white mb-2">{route.from} - {route.to}</h3>
                          <span className={`inline-block px-4 py-1.5 rounded-lg text-sm mb-4 ${
                            route.category === 'Express' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            route.category === 'Intercity' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                            route.category === 'Mail' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          }`}>
                            {route.category}
                          </span>

                          <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-gray-400">
                              <Train className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm">{route.trainType}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                route.status.includes('Not Busy') ? 'bg-green-400' :
                                route.status.includes('Moderately') ? 'bg-yellow-400' :
                                'bg-red-400'
                              }`}></div>
                              <span className="text-sm text-gray-400">{route.status}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleViewDetails(route)}
                            className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group/btn"
                          >
                            <span className="font-medium">View Details</span>
                            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tuk Riders Section */}
            {showTukSection && (
              <div className="animate-fadeIn">
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🛺</span>
                    </div>
                    <div>
                      <h2 className="text-4xl text-white">Tuk Riders around campus</h2>
                      <p className="text-gray-400">Reliable, Tuk rides around campus and town.</p>
                    </div>
                  </div>

                  {/* Tuk Driver Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tukDrivers.map((driver, index) => (
                      <div
                        key={driver.id}
                        className="group bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 border-2 border-yellow-400/20 hover:border-yellow-400/40 rounded-3xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/10 animate-slideUp"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {/* Tuk Image */}
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={driver.image}
                            alt={driver.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                          
                          {/* Rating Badge */}
                          <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm border border-yellow-400/30 rounded-xl px-3 py-2 flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-white text-sm">{driver.rating}</span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-2xl text-white mb-1">{driver.name}</h3>
                          <div className="flex items-center gap-2 text-gray-400 mb-3">
                            <MapPin className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm">{driver.location}</span>
                          </div>
                          <p className="text-yellow-400 text-sm mb-1">{driver.vehicle} ({driver.vehicleNumber})</p>

                          <button className="w-full mt-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group/btn">
                            <Phone className="w-5 h-5" />
                            <span className="font-medium">Call Now</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </PageLayout>

      {/* Route Details Modal */}
      {showModal && selectedRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative max-w-2xl w-full bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border-2 border-yellow-400/30 rounded-3xl p-8 animate-slideUp">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-black/40 hover:bg-black/60 rounded-xl flex items-center justify-center transition-all border border-yellow-400/20"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Image */}
            <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
              <img 
                src={'image' in selectedRoute ? selectedRoute.image : ''}
                alt="Route"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            </div>

            <h3 className="text-3xl text-white mb-6">Route Time Line</h3>

            {/* Schedule Table */}
            {'schedule' in selectedRoute ? (
              <>
                <div className="bg-black/40 rounded-2xl p-6 mb-6 border border-yellow-400/10">
                  <div className="grid grid-cols-4 gap-4 mb-4 pb-4 border-b border-yellow-400/20">
                    <div className="text-gray-400 text-sm">Direction</div>
                    <div className="text-gray-400 text-sm">Departure</div>
                    <div className="text-gray-400 text-sm">Time</div>
                    <div className="text-gray-400 text-sm">Arrival</div>
                    <div className="text-gray-400 text-sm">Time</div>
                  </div>
                  {selectedRoute.schedule.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-4 gap-4 py-3">
                      <div className="text-white">To {item.arrival}</div>
                      <div className="text-white">{item.departure}</div>
                      <div className="text-yellow-400">{item.departureTime}</div>
                      <div className="text-white">{item.arrival}</div>
                      <div className="text-yellow-400">{item.arrivalTime}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="bg-white/5 rounded-xl px-6 py-3 text-center">
                    <span className="text-white">{selectedRoute.trainType}</span>
                  </div>
                  <div className="bg-white/5 rounded-xl px-6 py-3 text-center">
                    <span className="text-white">{selectedRoute.status}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-black/40 rounded-2xl p-6 border border-yellow-400/10">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Departures</p>
                    <div className="space-y-2">
                      {selectedRoute.departures.map((time, idx) => (
                        <div key={idx} className="bg-yellow-400/10 rounded-lg px-4 py-2">
                          <span className="text-yellow-400">{time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Details</p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-400 text-xs">Duration</p>
                        <p className="text-white">{selectedRoute.duration}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Price</p>
                        <p className="text-white">{selectedRoute.price}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Type</p>
                        <p className="text-white">{selectedRoute.category}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}