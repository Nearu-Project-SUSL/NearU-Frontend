import { useState } from 'react';
import { Sidebar } from '../../../components/layout/Sidebar';
import { PageLayout } from '../../../components/layout/PageLayout';
import { Bus, Train, ArrowRight, Clock, DollarSign, X, Loader2 } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { transportService } from '../../../../api/transportService';
import type { BusRoute, TrainRoute, BusCategory, TrainCategory } from '../../../../types/adminTransport';
import Navbar from '../../../components/layout/Navbar';

const BUS_IMAGE = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
const TRAIN_IMAGE = 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';

export default function Transport() {
  const location = useLocation();
  const [busCategory, setBusCategory] = useState<BusCategory>('SLTB');
  const [trainCategory, setTrainCategory] = useState<TrainCategory>('Express');
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | TrainRoute | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Determine which sections to show based on route
  const showBusSection = location.pathname === '/transport/bus';
  const showTrainSection = location.pathname === '/transport/train';
  const showTukSection = location.pathname === '/transport/all' || location.pathname === '/transport/tuk';

  const { data: busRoutes = [], isLoading: isLoadingBus, isError: isBusError } = useQuery<BusRoute[]>({
    queryKey: ['busRoutes'],
    queryFn: transportService.getBusRoutes,
  });

  const { data: trainRoutes = [], isLoading: isLoadingTrain, isError: isTrainError } = useQuery<TrainRoute[]>({
    queryKey: ['trainRoutes'],
    queryFn: transportService.getTrainRoutes,
  });

  const filteredBusRoutes = busRoutes.filter(route => route.category === busCategory);
  const filteredTrainRoutes = trainRoutes.filter(route => route.category === trainCategory);

  const handleViewDetails = (route: BusRoute | TrainRoute) => {
    setSelectedRoute(route);
    setShowModal(true);
  };

  const isBusRoute = (route: BusRoute | TrainRoute): route is BusRoute => 'departures' in route;

  // ── Reusable loading skeleton ──────────────────────────────────
  const LoadingCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-[#2e9ebf]/10 rounded-3xl overflow-hidden animate-pulse">
          <div className="h-48 bg-white/5" />
          <div className="p-6 space-y-3">
            <div className="h-5 bg-white/10 rounded-lg w-3/4" />
            <div className="h-4 bg-white/5 rounded-lg w-1/2" />
            <div className="h-4 bg-white/5 rounded-lg w-2/3" />
            <div className="h-10 bg-[#2e9ebf]/10 rounded-xl mt-4" />
          </div>
        </div>
      ))}
    </div>
  );

  // ── Reusable empty/error state ─────────────────────────────────
  const EmptyState = ({ icon, message }: { icon: React.ReactNode; message: string }) => (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#2e9ebf]/10 border border-[#2e9ebf]/20 flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#2e9ebf]/5 via-transparent to-[#2e9ebf]/5 pointer-events-none" />

      {/* Grid pattern */}
      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(46, 158, 191, 0.4) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Floating orbs */}
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-[#2e9ebf]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-80 h-80 bg-[#2e9ebf]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Sidebar */}
      <Sidebar activeSection="transport" />

      {/* Main Content */}
      <PageLayout>
        <Navbar />

        {/* Main Content Area */}
        <section className="px-8 lg:px-12 py-12 relative">
          <div className="max-w-7xl mx-auto space-y-16">
            
            {/* Back Button */}
            <div className="!mb-4">
              <Link 
                to="/transport"
                className="inline-flex items-center gap-2 text-sm text-[#2e9ebf] hover:text-[#2e9ebf]/80 transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back to Transport Hub
              </Link>
            </div>

            {/* ── Bus Section ── */}
            {showBusSection && (
              <div className="animate-fadeIn">
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#2e9ebf] rounded-xl flex items-center justify-center shadow-lg shadow-[#2e9ebf]/30">
                      <Bus className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">Bus Routine</h2>
                      <p className="text-gray-400 text-sm">Find your way around campus. Most accurate updates.</p>
                    </div>
                  </div>

                  {/* Category Tabs */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    {(['SLTB', 'Semi', 'AC', 'Private'] as BusCategory[]).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setBusCategory(cat)}
                        className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                          busCategory === cat
                            ? 'bg-[#2e9ebf] text-black shadow-lg shadow-[#2e9ebf]/30'
                            : 'bg-white/5 text-gray-400 hover:text-[#2e9ebf] border border-[#2e9ebf]/20 hover:border-[#2e9ebf]/50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Bus Route Cards */}
                  {isLoadingBus ? (
                    <LoadingCards />
                  ) : isBusError ? (
                    <EmptyState icon={<Bus className="w-7 h-7 text-red-400" />} message="Failed to load bus routes. Please try again later." />
                  ) : filteredBusRoutes.length === 0 ? (
                    <EmptyState icon={<Bus className="w-7 h-7 text-[#2e9ebf]" />} message={`No ${busCategory} bus routes found.`} />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredBusRoutes.map((route, index) => (
                        <div
                          key={route.id}
                          className="group bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-[#2e9ebf]/20 hover:border-[#2e9ebf]/50 rounded-3xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#2e9ebf]/10"
                          style={{ animationDelay: `${index * 0.08}s` }}
                        >
                          {/* Bus Image */}
                          <div className="relative h-44 overflow-hidden">
                            <img
                              src={BUS_IMAGE}
                              alt={`${route.from} to ${route.to}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                            {/* Status badge */}
                            <div className="absolute top-3 right-3">
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                                route.status === 'active'
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
                              }`}>
                                {route.status === 'active' ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-lg font-bold text-white leading-tight">
                                {route.from}
                                <span className="text-[#2e9ebf] mx-2">→</span>
                                {route.to}
                              </h3>
                              <span className={`shrink-0 ml-2 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                                route.category === 'SLTB' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                route.category === 'Semi' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                route.category === 'AC' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                              }`}>
                                {route.category}
                              </span>
                            </div>

                            <div className="space-y-2 mb-5">
                              <div className="flex items-center gap-2 text-gray-400">
                                <Clock className="w-3.5 h-3.5 text-[#2e9ebf] shrink-0" />
                                <span className="text-sm">{route.duration}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-400">
                                <DollarSign className="w-3.5 h-3.5 text-[#2e9ebf] shrink-0" />
                                <span className="text-sm">Rs. {route.priceLkr}</span>
                              </div>
                              {route.departures && route.departures.length > 0 && (
                                <div className="flex items-center gap-2 text-gray-400">
                                  <span className="text-xs text-[#2e9ebf] font-medium">Next:</span>
                                  <span className="text-sm font-mono">{route.departures[0]}</span>
                                  {route.departures.length > 1 && (
                                    <span className="text-xs text-gray-500">+{route.departures.length - 1} more</span>
                                  )}
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => handleViewDetails(route)}
                              className="w-full py-2.5 bg-[#2e9ebf] hover:bg-[#2e9ebf]/90 text-black font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2 group/btn"
                            >
                              <span>View Details</span>
                              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Train Section ── */}
            {showTrainSection && (
              <div className="animate-fadeIn">
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#2e9ebf] rounded-xl flex items-center justify-center shadow-lg shadow-[#2e9ebf]/30">
                      <Train className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">Train Routine</h2>
                      <p className="text-gray-400 text-sm">Inter-city connections and railway timings.</p>
                    </div>
                  </div>

                  {/* Category Tabs */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    {(['Express', 'Intercity', 'Mail', 'Office'] as TrainCategory[]).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setTrainCategory(cat)}
                        className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                          trainCategory === cat
                            ? 'bg-[#2e9ebf] text-black shadow-lg shadow-[#2e9ebf]/30'
                            : 'bg-white/5 text-gray-400 hover:text-[#2e9ebf] border border-[#2e9ebf]/20 hover:border-[#2e9ebf]/50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Train Route Cards */}
                  {isLoadingTrain ? (
                    <LoadingCards />
                  ) : isTrainError ? (
                    <EmptyState icon={<Train className="w-7 h-7 text-red-400" />} message="Failed to load train routes. Please try again later." />
                  ) : filteredTrainRoutes.length === 0 ? (
                    <EmptyState icon={<Train className="w-7 h-7 text-[#2e9ebf]" />} message={`No ${trainCategory} train routes found.`} />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredTrainRoutes.map((route, index) => (
                        <div
                          key={route.id}
                          className="group bg-gradient-to-br from-gray-900/80 to-black/80 border-2 border-[#2e9ebf]/20 hover:border-[#2e9ebf]/50 rounded-3xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#2e9ebf]/10"
                          style={{ animationDelay: `${index * 0.08}s` }}
                        >
                          {/* Train Image */}
                          <div className="relative h-44 overflow-hidden">
                            <img
                              src={TRAIN_IMAGE}
                              alt={`${route.from} to ${route.to}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                            {/* Status badge */}
                            <div className="absolute top-3 right-3">
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                                route.status === 'active'
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
                              }`}>
                                {route.status === 'active' ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-lg font-bold text-white leading-tight">
                                {route.from}
                                <span className="text-[#2e9ebf] mx-2">→</span>
                                {route.to}
                              </h3>
                              <span className={`shrink-0 ml-2 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                                route.category === 'Express' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                route.category === 'Intercity' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                                route.category === 'Mail' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                              }`}>
                                {route.category}
                              </span>
                            </div>

                            <div className="space-y-2 mb-5">
                              <div className="flex items-center gap-2 text-gray-400">
                                <Train className="w-3.5 h-3.5 text-[#2e9ebf] shrink-0" />
                                <span className="text-sm">{route.trainType}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-400">
                                <DollarSign className="w-3.5 h-3.5 text-[#2e9ebf] shrink-0" />
                                <span className="text-sm">Rs. {route.priceLkr}</span>
                              </div>
                              {route.statusText && (
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                                    route.statusText.includes('Not Busy') ? 'bg-green-400' :
                                    route.statusText.includes('Moderately') ? 'bg-[#2e9ebf]' :
                                    'bg-red-400'
                                  }`} />
                                  <span className="text-sm text-gray-400">{route.statusText}</span>
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => handleViewDetails(route)}
                              className="w-full py-2.5 bg-[#2e9ebf] hover:bg-[#2e9ebf]/90 text-black font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2 group/btn"
                            >
                              <span>View Details</span>
                              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Tuk Section ── */}
            {showTukSection && (
              <div className="animate-fadeIn">
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#2e9ebf] rounded-xl flex items-center justify-center shadow-lg shadow-[#2e9ebf]/30">
                      <span className="text-2xl">🛺</span>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">Tuk Riders around Campus</h2>
                      <p className="text-gray-400 text-sm">Reliable tuk rides around campus and town.</p>
                    </div>
                  </div>

                  {/* Tuk Driver CTA */}
                  <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-[#2e9ebf]/10 to-transparent border border-[#2e9ebf]/20 rounded-3xl mt-8">
                    <div className="text-5xl mb-4">🛺</div>
                    <h3 className="text-2xl font-bold text-white mb-3">Need a Tuk ride?</h3>
                    <p className="text-gray-400 mb-8 text-center max-w-md text-sm">
                      Use our quick ride booking feature to request a Tuk ride instantly. Nearby drivers will be notified.
                    </p>
                    <Link
                      to="/rides"
                      className="px-8 py-4 bg-[#2e9ebf] hover:bg-[#2e9ebf]/90 text-black font-bold rounded-xl hover:scale-105 transition-all shadow-xl shadow-[#2e9ebf]/20"
                    >
                      Book a Ride Now
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </PageLayout>

      {/* ── Route Details Modal ── */}
      {showModal && selectedRoute && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={e => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="relative max-w-2xl w-full max-h-[85vh] flex flex-col bg-gradient-to-br from-gray-900 to-black border-2 border-[#2e9ebf]/30 rounded-3xl overflow-hidden shadow-2xl shadow-[#2e9ebf]/10 animate-slideUp">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {selectedRoute.from} → {selectedRoute.to}
                </h3>
                <p className="text-[#2e9ebf]/70 text-sm">
                  {isBusRoute(selectedRoute) ? 'Bus Route' : `${selectedRoute.trainType}`}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all hover:scale-110"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Modal Banner Image */}
            <div className="relative h-36 overflow-hidden shrink-0">
              <img
                src={isBusRoute(selectedRoute) ? BUS_IMAGE : TRAIN_IMAGE}
                alt="Route"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
              <div className="absolute bottom-3 left-5 flex gap-2">
                <span className="px-3 py-1 bg-[#2e9ebf] text-black rounded-lg text-xs font-bold shadow-lg">
                  {isBusRoute(selectedRoute) ? selectedRoute.category : selectedRoute.trainType}
                </span>
                {!isBusRoute(selectedRoute) && selectedRoute.statusText && (
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-white rounded-lg text-xs font-medium">
                    {selectedRoute.statusText}
                  </span>
                )}
                <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  selectedRoute.status === 'active'
                    ? 'bg-green-500/30 text-green-300 border border-green-500/40'
                    : 'bg-red-500/30 text-red-300 border border-red-500/40'
                }`}>
                  {selectedRoute.status === 'active' ? '● Active' : '● Inactive'}
                </span>
              </div>
            </div>

            {/* Modal Scrollable Content */}
            <div className="overflow-y-auto flex-1 p-6 space-y-4">

              {/* Price info row */}
              <div className="flex items-center gap-6 p-4 bg-[#2e9ebf]/5 border border-[#2e9ebf]/20 rounded-2xl">
                <div className="text-center">
                  <p className="text-gray-500 text-xs mb-1">Price</p>
                  <p className="text-[#2e9ebf] font-bold text-lg">Rs. {selectedRoute.priceLkr}</p>
                </div>
                {isBusRoute(selectedRoute) && (
                  <div className="text-center border-l border-white/10 pl-6">
                    <p className="text-gray-500 text-xs mb-1">Duration</p>
                    <p className="text-white font-semibold">{selectedRoute.duration}</p>
                  </div>
                )}
                {!isBusRoute(selectedRoute) && (
                  <div className="text-center border-l border-white/10 pl-6">
                    <p className="text-gray-500 text-xs mb-1">Total Stops</p>
                    <p className="text-white font-semibold">{selectedRoute.schedule.length}</p>
                  </div>
                )}
              </div>

              {/* Train Schedule Table */}
              {!isBusRoute(selectedRoute) && (
                <div className="bg-black/40 rounded-2xl border border-[#2e9ebf]/10 overflow-hidden">
                  <div className="grid grid-cols-3 gap-3 px-4 py-3 border-b border-[#2e9ebf]/20 bg-[#2e9ebf]/5">
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wide">Route</span>
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wide">Departure</span>
                    <span className="text-gray-400 text-xs font-semibold uppercase tracking-wide">Arrival</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {selectedRoute.schedule.map((item, idx) => (
                      <div key={idx} className="grid grid-cols-3 gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
                        <div className="text-white text-sm flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2e9ebf] shrink-0" />
                          <span className="truncate text-xs">{item.departure} → {item.arrival}</span>
                        </div>
                        <span className="text-[#2e9ebf] font-mono text-sm">{item.departureTime}</span>
                        <span className="text-[#2e9ebf] font-mono text-sm">{item.arrivalTime}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bus Departures */}
              {isBusRoute(selectedRoute) && (
                <div className="bg-black/40 rounded-2xl p-5 border border-[#2e9ebf]/10">
                  <p className="text-gray-400 text-sm font-medium mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#2e9ebf]" />
                    Departure Times
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRoute.departures.map((time, idx) => (
                      <div key={idx} className="bg-[#2e9ebf]/10 border border-[#2e9ebf]/20 rounded-lg px-3 py-1.5">
                        <span className="text-[#2e9ebf] font-mono text-sm">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}