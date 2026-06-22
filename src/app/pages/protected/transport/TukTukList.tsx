import { useEffect, useState } from 'react';
import { Phone, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Sidebar } from '../../../components/layout/Sidebar';
import { PageLayout } from '../../../components/layout/PageLayout';
import Navbar from '../../../components/layout/Navbar';
import { getTukTukDrivers } from '../../../../api/transportApi';
import { TukTukDriver } from '../../../../types/transport';

export default function TukTukList() {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<TukTukDriver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        const data = await getTukTukDrivers();
        setDrivers(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load tuk tuk drivers:', err);
        setError('Could not load tuk tuk drivers. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
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

            <h2 className="text-4xl text-white mb-2">Tuk Tuk Riders</h2>
            <p className="text-gray-400 mb-10">Available drivers around campus</p>

            {loading && (
              <div className="text-center py-20 text-gray-400">Loading drivers...</div>
            )}

            {error && (
              <div className="text-center py-20 text-red-400">{error}</div>
            )}

            {!loading && !error && drivers.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                No tuk tuk drivers available right now.
              </div>
            )}

            {!loading && !error && drivers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {drivers.map((driver) => (
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
                      <p className="text-gray-400 text-sm mb-2">📍 {driver.operatingArea}</p>
                    )}

                    {driver.notes && (
                      <p className="text-gray-500 text-sm italic">{driver.notes}</p>
                    )}
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