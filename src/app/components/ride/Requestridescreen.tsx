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

  async function handleEstimate() {
    setError('');
    setEstimating(true);
    try {
      const res = await RidesApi.getEstimate(pickupLat, pickupLng, dropoffLat, dropoffLng);
      setEstimatedFare(res.data.estimatedFare);
      setDistanceKm(res.data.distanceKm);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Could not get estimate.');
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
        details:          details.trim() || 'No additional details',
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
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create request.');
    } finally {
      setLoading(false);
    }
  }

  const theme = useTheme();
  const accent = theme.palette.primary.main;
  const accentAlpha = (a: number) => `rgba(46, 158, 191, ${a})`;

  
  return (
    <div
      className="relative flex flex-col overflow-hidden animate-fadeIn"
      style={{
        minHeight: '100vh',
        background: 'black', 
      }}
    >

      <Box
        sx={{
          mb: 8,
          px: { xs: 3, md: 6 },
          py: { xs: 6, md: 8 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          background: "transparent",
          border: "none",
          borderRadius: "20px",
          overflow: "hidden",
          gap: 4,
        }}>

        <Box sx={{
          width:"100%",
          textAlign:"center",
        }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              color: theme.palette.text.primary,
              fontSize: { xs: "2.3rem", md: "3.6rem" },
              letterSpacing: "-0.03em",
              mb: 2,
            }}
          >
            Rides{" "}
            <Box component="span" sx={{ color: accent }}>
              Near U
            </Box>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: { xs: "0.95rem", md: "1.05rem" },
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Discover the best ride options near Sabaragamuwa University.
            From quick trips to long journeys all in one place.
          </Typography>
        </Box>
      </Box>

      {/* CENTERED POPUP PANEL*/}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-4">

        <div
          className="w-full max-w-lg rounded-3xl px-6 pt-6 pb-7 animate-slideUp"
          style={{
            background: 'rgba(15,15,15,0.96)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          }}
        >

          {/* drag handle */}
          <div className="flex justify-center mb-4">
            <div
              className="w-10 h-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            />
          </div>

          {/* SERVICE SELECTOR */}
          <div className="flex gap-2 mb-4">
            {SERVICES.map(s => (
              <button
                key={s.type}
                onClick={() => setService(s.type)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium border"
                style={{
                  background:
                    service === s.type
                      ? 'var(--nearu-accent-subtle)'
                      : 'rgba(255,255,255,0.06)',
                  borderColor:
                    service === s.type
                      ? 'var(--nearu-accent)'
                      : 'rgba(255,255,255,0.1)',
                  color:
                    service === s.type
                      ? 'var(--nearu-accent)'
                      : 'rgba(255,255,255,0.55)',
                }}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>

          {/* LOCATION INPUTS */}
          <div
            className="rounded-2xl overflow-hidden mb-3"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            {/* Pickup */}
            <div
              className="flex items-center gap-3 px-4 py-3 border-b"
              style={{ borderColor: 'rgba(255,255,255,0.07)' }}
            >
              <input
                value={pickupLabel}
                onChange={e => setPickupLabel(e.target.value)}
                className="w-full bg-transparent text-[14px] outline-none border-none"
                style={{
                  color: 'white',
                  caretColor: 'white',
                  background: 'transparent',
                  WebkitBoxShadow: '0 0 0 1000px transparent inset',
                }}
              />

              <button onClick={handleUseMyLocation}></button>
            </div>

            {/* Dropoff */}
            <div className="px-4 py-3">
              <input
                value={dropoffLabel}
                onChange={e => setDropoffLabel(e.target.value)}
                placeholder="Where are you going?"
                className="w-full bg-transparent text-[14px] outline-none border-none"
                style={{
                  color: 'white',
                  caretColor: 'white',
                  background: 'transparent',
                  WebkitBoxShadow: '0 0 0 1000px transparent inset',
                }}
              />
            </div>
          </div>

          {/* ── Fare Estimate ── */}
          {estimatedFare !== null && distanceKm !== null && (
            <div
              className="mb-3 rounded-xl p-3 border"
              style={{
                background: 'rgba(46,158,191,0.12)',
                borderColor: 'rgba(46,158,191,0.35)',
              }}
            >
              <div className="flex justify-between text-[13px] text-white/70">
                <span>Distance</span>
                <span>{distanceKm.toFixed(2)} km</span>
              </div>

              <div className="flex justify-between text-[13px] text-white/70 mt-1">
                <span>Estimated fare</span>
                <span>Rs. {estimatedFare.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="mb-3 text-red-400 text-[13px]">
              {error}
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex gap-2.5">
            <button
              onClick={handleEstimate}
              disabled={estimating}
              className="px-4 py-3 rounded-xl border text-white/80"
            >
              {estimating ? '…' : '💰 Estimate'}
            </button>

            <button
              onClick={handleRequest}
              disabled={loading}
              className="flex-1 py-3 rounded-xl font-semibold text-white"
              style={{ background: 'var(--nearu-accent)' }}
            >
              {loading ? 'Requesting…' : '🛵 Request ride'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}