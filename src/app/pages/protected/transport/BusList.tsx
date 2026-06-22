import { useEffect, useState } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../../../components/layout/Sidebar';
import { PageLayout } from '../../../components/layout/PageLayout';
import Navbar from '../../../components/layout/Navbar';
import { getBusRoutes } from '../../../../api/transportApi';
import { BusRoute } from '../../../../types/transport';

export default function BusList() {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const data = await getBusRoutes();
        setRoutes(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load bus routes:', err);
        setError('Could not load bus routes. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);

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

            <h2 className="text-4xl text-white mb-2">Bus Routine</h2>
            <p className="text-gray-400 mb-10">Scheduled bus services</p>

            {loading && (
              <div className="text-center py-20 text-gray-400">Loading routes...</div>
            )}

            {error && (
              <div className="text-center py-20 text-red-400">{error}</div>
            )}

            {!loading && !error && routes.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                No bus routes available right now.
              </div>
            )}

            {!loading && !error && routes.length > 0 && (
              <div className="space-y-4">
                {routes.map((route) => (
                  <div
                    key={route.id}
                    className="bg-gray-900/60 border border-[#2e9ebf]/20 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:border-[#2e9ebf]/50 transition-colors"
                  >
                    <div>
                      <h3 className="text-xl text-white mb-1">{route.routeName}</h3>
                      <p className="text-gray-400 text-sm">
                        {route.startPoint} → {route.endPoint}
                      </p>
                      {route.busNumber && (
                        <p className="text-[#2e9ebf] text-sm mt-1">{route.busNumber}</p>
                      )}
                      {route.notes && (
                        <p className="text-gray-500 text-sm italic mt-1">{route.notes}</p>
                      )}
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