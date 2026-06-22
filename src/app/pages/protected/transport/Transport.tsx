import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Sidebar } from '../../../components/layout/Sidebar';
import { PageLayout } from '../../../components/layout/PageLayout';
import Navbar from '../../../components/layout/Navbar';
import { ArrowLeft, Phone, MapPin, Clock } from 'lucide-react';
import axiosPrivate from '../../../../api/axios'; 

type TransportType = 'tuk' | 'bus' | 'train';

export default function Transport() {
  const location = useLocation();
  const navigate = useNavigate();

  const type = location.pathname.split('/').pop() as TransportType;

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const endpoints: Record<TransportType, string> = {
      tuk: '/tuktukdrivers',
      bus: '/busroutes',
      train: '/trainroutes',
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosPrivate.get(endpoints[type]);
        setData(res.data);
      } catch (err) {
        console.error(`Failed to load ${type} data:`, err);
        setError('Could not load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (type === 'tuk' || type === 'bus' || type === 'train') {
      fetchData();
    }
  }, [type]);

  const titles: Record<TransportType, string> = {
    tuk: 'Tuk Tuk Riders',
    bus: 'Bus Routine',
    train: 'Train Routine',
  };

  const subtitles: Record<TransportType, string> = {
    tuk: 'Available drivers around campus',
    bus: 'Scheduled bus services',
    train: 'Inter-city train schedules',
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Sidebar activeSection="transport" />
      <PageLayout>
        <Navbar />
        <section className="px-8 lg:px-12 py-16 relative">
          <div className="max-w-5xl mx-auto">
            <button
              onClick={() => navigate('/transport')}
              className="flex items-center gap-2 text-gray-400 hover:text-[#2e9ebf] mb-8 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Transport
            </button>

            <h2 className="text-4xl text-white mb-2">{titles[type]}</h2>
            <p className="text-gray-400 mb-10">{subtitles[type]}</p>

            {loading && (
              <div className="text-center py-20 text-gray-400">Loading...</div>
            )}

            {error && (
              <div className="text-center py-20 text-red-400">{error}</div>
            )}

            {!loading && !error && data.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                No {type === 'tuk' ? 'tuk tuk drivers' : `${type} routes`} available right now.
              </div>
            )}

            {!loading && !error && data.length > 0 && type === 'tuk' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.map((driver) => (
                  <div
                    key={driver.id}
                    className="bg-gray-900/60 border border-[#2e9ebf]/20 rounded-2xl p-6 hover:border-[#2e9ebf]/50 transition-colors"
                  >
                    <h3 className="text-xl text-white mb-1">{driver.name}</h3>
                    <p className="text-[#2e9ebf] text-sm mb-4">{driver.plateNumber}</p>
                    <div className="flex items-center gap-2 text-gray-300 mb-2">
                      <Phone className="w-4 h-4 text-[#2e9ebf]" />
                      <a href={`tel:${driver.phoneNumber}`} className="hover:text-[#2e9ebf]">
                        {driver.phoneNumber}
                      </a>
                    </div>
                    {driver.operatingArea && (
                      <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                        <MapPin className="w-4 h-4" />
                        {driver.operatingArea}
                      </div>
                    )}
                    {driver.notes && (
                      <p className="text-gray-500 text-sm italic">{driver.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && data.length > 0 && type === 'bus' && (
              <div className="space-y-4">
                {data.map((route) => (
                  <div
                    key={route.id}
                    className="bg-gray-900/60 border border-[#2e9ebf]/20 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:border-[#2e9ebf]/50 transition-colors"
                  >
                    <div>
                      <h3 className="text-xl text-white mb-1">{route.routeName}</h3>
                      <p className="text-gray-400 text-sm">{route.startPoint} → {route.endPoint}</p>
                      {route.busNumber && <p className="text-[#2e9ebf] text-sm mt-1">{route.busNumber}</p>}
                      {route.notes && <p className="text-gray-500 text-sm italic mt-1">{route.notes}</p>}
                    </div>
                    <div className="flex items-center gap-2 text-white bg-[#2e9ebf]/10 px-4 py-2 rounded-xl">
                      <Clock className="w-4 h-4 text-[#2e9ebf]" />
                      <span>{route.departureTime}</span>
                      {route.arrivalTime && <span className="text-gray-400">→ {route.arrivalTime}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && data.length > 0 && type === 'train' && (
              <div className="space-y-4">
                {data.map((route) => (
                  <div
                    key={route.id}
                    className="bg-gray-900/60 border border-[#2e9ebf]/20 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:border-[#2e9ebf]/50 transition-colors"
                  >
                    <div>
                      <h3 className="text-xl text-white mb-1">{route.routeName}</h3>
                      <p className="text-gray-400 text-sm">{route.startStation} → {route.endStation}</p>
                      {route.trainName && <p className="text-[#2e9ebf] text-sm mt-1">{route.trainName}</p>}
                      {route.notes && <p className="text-gray-500 text-sm italic mt-1">{route.notes}</p>}
                    </div>
                    <div className="flex items-center gap-2 text-white bg-[#2e9ebf]/10 px-4 py-2 rounded-xl">
                      <Clock className="w-4 h-4 text-[#2e9ebf]" />
                      <span>{route.departureTime}</span>
                      {route.arrivalTime && <span className="text-gray-400">→ {route.arrivalTime}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </PageLayout>
    </div>
  );
}