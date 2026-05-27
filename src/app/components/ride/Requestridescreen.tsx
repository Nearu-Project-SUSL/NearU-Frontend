import { useEffect, useState } from 'react';
import type { ServiceType } from './Ridestypes';
import { RidesApi } from '../../../api/Ridesapi';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import { useTheme } from '@mui/material';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet marker icon issue
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;
 

interface Props {
  onRideCreated: (
    rideId: string,
    otpExpiresAt?: string,
    estimatedFare?: number,
    distanceKm?: number,
    serviceType?: ServiceType,
    pickupLat?: number,
    pickupLng?: number,
    dropoffLat?: number,
    dropoffLng?: number,
    dropoffLabel?: string,
  ) => void;
}

const SERVICES: { type: ServiceType; label: string; icon: string }[] = [
  { type: 'PersonalRide',  label: 'Personal',  icon: '🛵' },
  { type: 'FoodDelivery',  label: 'Food',      icon: '🍱' },
  { type: 'GroceryPickup', label: 'Grocery',   icon: '🛒' },
];

const SERVICE_TYPE_MAP: Record<ServiceType, number> = {
  PersonalRide: 0,
  FoodDelivery: 1,
  GroceryPickup: 2,
};

// Sabaragamuwa University default coords
const DEFAULT_LAT = 6.7145;
const DEFAULT_LNG = 80.7872;

function MapEvents({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMapEvents({});
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export function RequestRideScreen({ onRideCreated }: Props) {
  const [service,       setService]       = useState<ServiceType>('PersonalRide');
  const [pickupLabel,   setPickupLabel]   = useState('');
  const [dropoffLabel,  setDropoffLabel]  = useState('');
  const [details,       setDetails]       = useState('');
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);
  const [distanceKm,    setDistanceKm]    = useState<number | null>(null);
  const [loading,       setLoading]       = useState(false);
  const [estimating,    setEstimating]    = useState(false);
  const [error,         setError]         = useState('');
  const [locating,      setLocating]      = useState(false);

  // Real GPS state
  const [pickupLat,  setPickupLat]  = useState(DEFAULT_LAT);
  const [pickupLng,  setPickupLng]  = useState(DEFAULT_LNG);
  const [dropoffLat, setDropoffLat] = useState(DEFAULT_LAT + 0.003);
  const [dropoffLng, setDropoffLng] = useState(DEFAULT_LNG + 0.003);

  const [pickingMode, setPickingMode] = useState<'pickup' | 'dropoff'>('pickup');

  // Get user's real location on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setPickupLabel('Faculty of Computing, SUSL');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setPickupLat(pos.coords.latitude);
        setPickupLng(pos.coords.longitude);
        setPickupLabel(`My location (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
        setLocating(false);
      },
      () => {
        setPickupLabel('Faculty of Computing, SUSL');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }, []);

  // Re-estimate whenever locations change
  useEffect(() => {
    if (pickupLat && pickupLng && dropoffLat && dropoffLng) {
      handleEstimate();
    }
  }, [pickupLat, pickupLng, dropoffLat, dropoffLng]);

  function handleUseMyLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setPickupLat(pos.coords.latitude);
        setPickupLng(pos.coords.longitude);
        setPickupLabel(`My location (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true },
    );
  }

  async function handleSearch(query: string, mode: 'pickup' | 'dropoff') {
    if (!query || query.length < 3) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const nLat = parseFloat(lat);
        const nLng = parseFloat(lon);
        
        if (mode === 'pickup') {
          setPickupLat(nLat);
          setPickupLng(nLng);
          setPickupLabel(display_name);
        } else {
          setDropoffLat(nLat);
          setDropoffLng(nLng);
          setDropoffLabel(display_name);
        }
      }
    } catch (err) {
      console.error("Geocoding failed:", err);
    }
  }

  async function getRoadDistanceKm(
    lat1: number, lng1: number,
    lat2: number, lng2:number
  ): Promise<number>{
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?overview=false`
    );
    const data = await res.json();

    //OSRM return distance in meters
    return data.routes[0].distance / 1000;
  }

  async function handleEstimate() {
    setError('');
    setEstimating(true);
    try {
      const roadKm = await getRoadDistanceKm(pickupLat, pickupLng, dropoffLat, dropoffLng);

      const res = await RidesApi.getEstimate(pickupLat, pickupLng, dropoffLat, dropoffLng);

      setDistanceKm(roadKm);
      setEstimatedFare(res.data.estimatedFare);

    } catch (e: any) {
      const backendError = e.response?.data?.message || e.message || 'Could not get estimate.';
      setError(backendError);
      setEstimatedFare(null);
      setDistanceKm(null);
    } finally {
      setEstimating(false);
    }
  }

  async function handleRequest() {
    if (!pickupLabel.trim() || !dropoffLabel.trim()) {
      setError('Please enter both pickup and drop-off locations.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await RidesApi.createRequest({
        serviceType:      SERVICE_TYPE_MAP[service],
        details:          { note: details.trim() || 'No additional details' } as any,
        pickupLatitude:   pickupLat,
        pickupLongitude:  pickupLng,
        dropoffLatitude:  dropoffLat,
        dropoffLongitude: dropoffLng,
        confirmEstimate:  true,
      });
      onRideCreated(
        res.data.rideId,
        res.data.otpExpiresAt,
        res.data.estimatedFare,
        res.data.distanceKm,
        res.data.serviceType,
        pickupLat, pickupLng,
        dropoffLat, dropoffLng,
        dropoffLabel,
      );
    } catch (e: any) {
      const backendError = e.response?.data?.message || e.message || 'Failed to create request.';
      setError(backendError);
    } finally {
      setLoading(false);
    }
  }

  const theme = useTheme();
  const accent = theme.palette.primary.main;
  const accentAlpha = (a: number) => `rgba(46, 158, 191, ${a})`;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0b0b0b]">
      {/* FULL SCREEN MAP */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={[pickupLat, pickupLng]}
          zoom={15}
          zoomControl={false} // hide default zoom for cleaner UI
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            // Use a dark map style if possible, or adjust opacity
            className="map-tiles"
          />
          <MapRecenter center={[pickupLat, pickupLng]} />
          
          <Marker position={[pickupLat, pickupLng]} icon={DefaultIcon}>
            {/* Pickup Marker */}
          </Marker>
          <Marker position={[dropoffLat, dropoffLng]} icon={DefaultIcon}>
            {/* Dropoff Marker */}
          </Marker>
          
          <MapEvents 
            onMapClick={(lat, lng) => {
              if (pickingMode === 'pickup') {
                setPickupLat(lat);
                setPickupLng(lng);
                setPickupLabel(`Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
              } else {
                setDropoffLat(lat);
                setDropoffLng(lng);
                setDropoffLabel(`Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
              }
            }} 
          />
        </MapContainer>
      </div>

      {/* TOP HEADER */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-md px-4">
        <div 
          className="rounded-2xl p-4 flex items-center justify-between"
          style={{
            background: 'rgba(15,15,15,0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <h1 className="text-[20px] font-bold">
            Near<span style={{ color: 'var(--nearu-accent)' }}>U</span> Rides
          </h1>
          <div className="flex gap-2">
             {SERVICES.map(s => (
                <button
                  key={s.type}
                  onClick={() => setService(s.type)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[16px] transition-all"
                  style={{
                    background: service === s.type ? 'var(--nearu-accent)' : 'rgba(255,255,255,0.05)',
                    transform: service === s.type ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: service === s.type ? '0 0 15px var(--nearu-accent)' : 'none'
                  }}
                  title={s.label}
                >
                  {s.icon}
                </button>
             ))}
          </div>
        </div>
      </div>

      {/* FLOATING REQUEST DIALOG (BOTTOM) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-full max-w-md px-4">
        <div
          className="rounded-3xl p-6 animate-slideUp"
          style={{
            background: 'rgba(18,18,18,0.94)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 20px 80px rgba(0,0,0,0.8)',
          }}
        >
          {/* LOCATION MODE SELECTOR */}
          <div className="flex bg-white/5 rounded-xl overflow-hidden mb-4 p-1 border border-white/5">
            <button
              onClick={() => setPickingMode('pickup')}
              className="flex-1 py-2 text-[12px] font-semibold rounded-lg transition-all"
              style={{
                background: pickingMode === 'pickup' ? 'var(--nearu-accent)' : 'transparent',
                color: pickingMode === 'pickup' ? 'white' : 'white/40'
              }}
            >
              Pickup
            </button>
            <button
              onClick={() => setPickingMode('dropoff')}
              className="flex-1 py-2 text-[12px] font-semibold rounded-lg transition-all"
              style={{
                background: pickingMode === 'dropoff' ? 'var(--nearu-accent)' : 'transparent',
                color: pickingMode === 'dropoff' ? 'white' : 'white/40'
              }}
            >
              Drop-off
            </button>
          </div>

          {/* INPUTS SECTION */}
          <div className="space-y-3 mb-5">
            <div 
              className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all"
              style={{ 
                background: 'rgba(255,255,255,0.03)',
                borderColor: pickingMode === 'pickup' ? 'var(--nearu-accent)' : 'rgba(255,255,255,0.08)'
              }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--nearu-accent)' }} />
              <input
                value={pickupLabel}
                onChange={e => setPickupLabel(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch(pickupLabel, 'pickup')}
                onBlur={() => handleSearch(pickupLabel, 'pickup')}
                className="w-full bg-transparent text-[14px] outline-none text-white/90"
                placeholder="Enter pickup address..."
              />
              <button onClick={handleUseMyLocation} className="text-white/40 hover:text-white transition-colors">📍</button>
            </div>

            <div 
              className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all"
              style={{ 
                background: 'rgba(255,255,255,0.03)',
                borderColor: pickingMode === 'dropoff' ? 'var(--nearu-accent)' : 'rgba(255,255,255,0.08)'
              }}
            >
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <input
                value={dropoffLabel}
                onChange={e => setDropoffLabel(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch(dropoffLabel, 'dropoff')}
                onBlur={() => handleSearch(dropoffLabel, 'dropoff')}
                placeholder="Where to?"
                className="w-full bg-transparent text-[14px] outline-none text-white/90"
              />
            </div>
          </div>

          {/* ESTIMATE / INFO */}
          {estimating ? (
            <div className="mb-5 flex items-center justify-center gap-2 text-[13px] text-white/40">
              <div className="w-4 h-4 border-2 border-nearu-accent border-t-transparent rounded-full animate-spin" />
              Calculating fare...
            </div>
          ) : estimatedFare !== null && (
            <div className="mb-5 flex items-center justify-between bg-nearu-accent/10 rounded-2xl p-4 border border-nearu-accent/20">
               <div>
                  <p className="text-[11px] uppercase tracking-wider text-white/40 mb-0.5">Estimated Fare</p>
                  <p className="text-[20px] font-bold text-white">Rs. {estimatedFare.toFixed(2)}</p>
               </div>
               <div className="text-right">
                  <p className="text-[11px] uppercase tracking-wider text-white/40 mb-0.5">Distance</p>
                  <p className="text-[15px] font-medium text-white/80">{distanceKm?.toFixed(2)} km</p>
               </div>
            </div>
          )}

          {/* ERROR DISPLAY */}
          {error && <p className="text-red-400 text-[12px] mb-4 text-center">{error}</p>}

          {/* MAIN ACTION */}
          <button
            onClick={handleRequest}
            disabled={loading || !estimatedFare}
            className="w-full py-4 rounded-2xl font-bold text-white transition-all active:scale-[0.98] disabled:opacity-50"
            style={{ 
              background: 'var(--nearu-accent)',
              boxShadow: '0 8px 30px rgba(46, 158, 191, 0.4)'
            }}
          >
            {loading ? 'Requesting Ride...' : 'Confirm and Ride 🛵'}
          </button>
        </div>
      </div>
    </div>
  );
}