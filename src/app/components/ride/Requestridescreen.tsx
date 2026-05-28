import { useEffect, useState } from 'react';
import type { ServiceType } from './Ridestypes';
import { RidesApi } from '../../../api/Ridesapi';

import {
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Paper,
  Stack,
  CircularProgress,
} from '@mui/material';

import {
  MyLocation as MyLocationIcon,
  TripOrigin as PickupIcon,
  LocationOn as DropoffIcon,
} from '@mui/icons-material';

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from 'react-leaflet';

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

const SERVICES: {
  type: ServiceType;
  label: string;
  icon: string;
}[] = [
  { type: 'PersonalRide', label: 'Personal', icon: '🛵' },
  { type: 'FoodDelivery', label: 'Food', icon: '🍱' },
  { type: 'GroceryPickup', label: 'Grocery', icon: '🛒' },
];

const SERVICE_TYPE_MAP: Record<ServiceType, number> = {
  PersonalRide: 0,
  FoodDelivery: 1,
  GroceryPickup: 2,
};

// Sabaragamuwa University default coords
const DEFAULT_LAT = 6.7145;
const DEFAULT_LNG = 80.7872;

function MapEvents({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

function MapRecenter({
  center,
}: {
  center: [number, number];
}) {
  const map = useMapEvents({});

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

export function RequestRideScreen({
  onRideCreated,
}: Props) {
  const [service, setService] =
    useState<ServiceType>('PersonalRide');

  const [pickupLabel, setPickupLabel] =
    useState('');

  const [dropoffLabel, setDropoffLabel] =
    useState('');

  const [details, setDetails] =
    useState('');

  const [estimatedFare, setEstimatedFare] =
    useState<number | null>(null);

  const [distanceKm, setDistanceKm] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [estimating, setEstimating] =
    useState(false);

  const [error, setError] =
    useState('');

  const [locating, setLocating] =
    useState(false);

  // Real GPS state
  const [pickupLat, setPickupLat] =
    useState(DEFAULT_LAT);

  const [pickupLng, setPickupLng] =
    useState(DEFAULT_LNG);

  const [dropoffLat, setDropoffLat] =
    useState(DEFAULT_LAT + 0.003);

  const [dropoffLng, setDropoffLng] =
    useState(DEFAULT_LNG + 0.003);

  const [pickingMode, setPickingMode] =
    useState<'pickup' | 'dropoff'>('pickup');

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

        setPickupLabel(
          `My location (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`
        );

        setLocating(false);
      },

      () => {
        setPickupLabel('Faculty of Computing, SUSL');
        setLocating(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 8000,
      }
    );
  }, []);

  // Re-estimate whenever locations change
  useEffect(() => {
    if (
      pickupLat &&
      pickupLng &&
      dropoffLat &&
      dropoffLng
    ) {
      handleEstimate();
    }
  }, [
    pickupLat,
    pickupLng,
    dropoffLat,
    dropoffLng,
  ]);

  function handleUseMyLocation() {
    if (!navigator.geolocation) return;

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      pos => {
        setPickupLat(pos.coords.latitude);
        setPickupLng(pos.coords.longitude);

        setPickupLabel(
          `My location (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`
        );

        setLocating(false);
      },

      () => setLocating(false),

      {
        enableHighAccuracy: true,
      }
    );
  }

  async function handleSearch(
    query: string,
    mode: 'pickup' | 'dropoff'
  ) {
    if (!query || query.length < 3) return;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
      );

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
      console.error('Geocoding failed:', err);
    }
  }

  async function getRoadDistanceKm(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): Promise<number> {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?overview=false`
    );

    const data = await res.json();

    // OSRM returns distance in meters
    return data.routes[0].distance / 1000;
  }

  async function handleEstimate() {
    setError('');
    setEstimating(true);

    try {
      const roadKm = await getRoadDistanceKm(
        pickupLat,
        pickupLng,
        dropoffLat,
        dropoffLng
      );

      const res =
        await RidesApi.getEstimate(
          pickupLat,
          pickupLng,
          dropoffLat,
          dropoffLng
        );

      setDistanceKm(roadKm);
      setEstimatedFare(
        res.data.estimatedFare
      );
    } catch (e: any) {
      const backendError =
        e.response?.data?.message ||
        e.message ||
        'Could not get estimate.';

      setError(backendError);

      setEstimatedFare(null);
      setDistanceKm(null);
    } finally {
      setEstimating(false);
    }
  }

  async function handleRequest() {
    if (
      !pickupLabel.trim() ||
      !dropoffLabel.trim()
    ) {
      setError(
        'Please enter both pickup and drop-off locations.'
      );

      return;
    }

    setError('');
    setLoading(true);

    try {
      const res =
        await RidesApi.createRequest({
          serviceType:
            SERVICE_TYPE_MAP[service],

          details: {
            note:
              details.trim() ||
              'No additional details',
          } as any,

          pickupLatitude: pickupLat,
          pickupLongitude: pickupLng,

          dropoffLatitude: dropoffLat,
          dropoffLongitude: dropoffLng,

          confirmEstimate: true,
        });

      onRideCreated(
        res.data.rideId,
        res.data.otpExpiresAt,
        res.data.estimatedFare,
        res.data.distanceKm,
        res.data.serviceType,
        pickupLat,
        pickupLng,
        dropoffLat,
        dropoffLng,
        dropoffLabel
      );
    } catch (e: any) {
      const backendError =
        e.response?.data?.message ||
        e.message ||
        'Failed to create request.';

      setError(backendError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        bgcolor: 'var(--background)',
      }}
    >
      {/* FULL SCREEN MAP */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}
      >
        <MapContainer
          center={[pickupLat, pickupLng]}
          zoom={15}
          zoomControl={false}
          style={{
            height: '100%',
            width: '100%',
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            className="map-tiles"
          />

          <MapRecenter
            center={[pickupLat, pickupLng]}
          />

          <Marker
            position={[pickupLat, pickupLng]}
            icon={DefaultIcon}
          />

          <Marker
            position={[dropoffLat, dropoffLng]}
            icon={DefaultIcon}
          />

          <MapEvents
            onMapClick={(lat, lng) => {
              if (
                pickingMode === 'pickup'
              ) {
                setPickupLat(lat);
                setPickupLng(lng);

                setPickupLabel(
                  `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`
                );
              } else {
                setDropoffLat(lat);
                setDropoffLng(lng);

                setDropoffLabel(
                  `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`
                );
              }
            }}
          />
        </MapContainer>
      </Box>

      {/* TOP HEADER */}
      <Box
        sx={{
          position: 'absolute',
          top: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          width: '100%',
          maxWidth: 450,
          px: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              'space-between',
            bgcolor: '--color-background',
            backdropFilter:
              'blur(16px)',
            border: '1px solid',
            borderColor:
              'var(--border)',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color:
                '--text-primary',
            }}
          >
            Near
            <Box
              component="span"
              sx={{
                color:
                  'var(--nearu-accent)',
              }}
            >
              U
            </Box>{' '}
            Rides
          </Typography>

          <Stack
            direction="row"
            spacing={1}
          >
            {SERVICES.map(s => (
              <IconButton
                key={s.type}
                onClick={() =>
                  setService(s.type)
                }
                sx={{
                  width: 36,
                  height: 36,

                  bgcolor:
                    service === s.type
                      ? 'var(--nearu-accent)'
                      : 'var(--muted)',

                  color:
                    'var(--foreground)',

                  transform:
                    service === s.type
                      ? 'scale(1.1)'
                      : 'scale(1)',

                  boxShadow:
                    service === s.type
                      ? '0 0 15px var(--nearu-accent)'
                      : 'none',

                  transition:
                    'all 0.2s',

                  '&:hover': {
                    bgcolor:
                      service === s.type
                        ? 'var(--nearu-accent)'
                        : 'var(--accent)',
                  },
                }}
                title={s.label}
              >
                <Box
                  component="span"
                  sx={{
                    fontSize: 16,
                  }}
                >
                  {s.icon}
                </Box>
              </IconButton>
            ))}
          </Stack>
        </Paper>
      </Box>

      {/* FLOATING REQUEST DIALOG (BOTTOM) */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          width: '100%',
          maxWidth: 450,
          px: 2,
        }}
      >
        <Paper
          elevation={24}
          sx={{
            borderRadius: 5,
            p: 3,
            bgcolor: '--bg-base',
            backdropFilter:
              'blur(24px)',
            border: '1px solid',
            borderColor:
              '--color-border',
            boxShadow:
              '0 20px 80px rgba(0,0,0,0.4)',
            animation:
              'slideUp 0.5s ease-out',
          }}
        >
          {/* LOCATION MODE SELECTOR */}
          <Stack
            direction="row"
            sx={{
              bgcolor: '--color-background',
              borderRadius: 3,
              p: 0.5,
              mb: 2,
              border: '1px solid',
              borderColor:
                'var(--border)',
            }}
          >
            <Button
              fullWidth
              onClick={() =>
                setPickingMode(
                  'pickup'
                )
              }
              sx={{
                py: 1,
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: 2.5,

                bgcolor:
                  pickingMode ===
                  'pickup'
                    ? 'var(--nearu-accent)'
                    : 'transparent',

                color:
                  pickingMode ===
                  'pickup'
                    ? 'var(--nearu-accent-foreground)'
                    : 'var(--muted-foreground)',

                '&:hover': {
                  bgcolor:
                    pickingMode ===
                    'pickup'
                      ? 'var(--nearu-accent)'
                      : 'transparent',
                },

                textTransform:
                  'none',
              }}
            >
              Pickup
            </Button>

            <Button
              fullWidth
              onClick={() =>
                setPickingMode(
                  'dropoff'
                )
              }
              sx={{
                py: 1,
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: 2.5,

                bgcolor:
                  pickingMode ===
                  'dropoff'
                    ? 'var(--nearu-accent)'
                    : 'transparent',

                color:
                  pickingMode ===
                  'dropoff'
                    ? 'var(--nearu-accent-foreground)'
                    : 'var(--muted-foreground)',

                '&:hover': {
                  bgcolor:
                    pickingMode ===
                    'dropoff'
                      ? 'var(--nearu-accent)'
                      : 'var(--accent)',
                },

                textTransform:
                  'none',
              }}
            >
              Drop-off
            </Button>
          </Stack>

          {/* INPUTS SECTION */}
          <Stack
            spacing={1.5}
            sx={{ mb: 3 }}
          >
            <TextField
              fullWidth
              placeholder="Enter pickup address..."
              value={pickupLabel}
              onChange={e =>
                setPickupLabel(
                  e.target.value
                )
              }
              onKeyDown={e =>
                e.key === 'Enter' &&
                handleSearch(
                  pickupLabel,
                  'pickup'
                )
              }
              onBlur={() =>
                handleSearch(
                  pickupLabel,
                  'pickup'
                )
              }
              autoComplete="off"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PickupIcon
                      sx={{
                        fontSize: 18,
                        color:
                          'var(--nearu-accent)',
                      }}
                    />
                  </InputAdornment>
                ),

                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={
                        handleUseMyLocation
                      }
                      size="small"
                      sx={{
                        color:
                          'var(--muted-foreground)',
                      }}
                    >
                      <MyLocationIcon
                        sx={{
                          fontSize: 18,
                        }}
                      />
                    </IconButton>
                  </InputAdornment>
                ),

                sx: {
                  bgcolor:
                    'var(--input-background)',

                  borderRadius: 3,

                  '& fieldset': {
                    borderColor:
                      pickingMode ===
                      'pickup'
                        ? 'var(--nearu-accent)'
                        : 'var(--border)',
                  },

                  fontSize: '14px',

                  color:
                    'var(--foreground)',
                },
              }}
            />

            <TextField
              fullWidth
              placeholder="Where to?"
              value={dropoffLabel}
              onChange={e =>
                setDropoffLabel(
                  e.target.value
                )
              }
              onKeyDown={e =>
                e.key === 'Enter' &&
                handleSearch(
                  dropoffLabel,
                  'dropoff'
                )
              }
              onBlur={() =>
                handleSearch(
                  dropoffLabel,
                  'dropoff'
                )
              }
              autoComplete="off"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DropoffIcon
                      sx={{
                        fontSize: 18,
                        color:
                          '#f44336',
                      }}
                    />
                  </InputAdornment>
                ),

                sx: {
                  bgcolor:
                    'var(--input-background)',

                  borderRadius: 3,

                  '& fieldset': {
                    borderColor:
                      pickingMode ===
                      'dropoff'
                        ? 'var(--nearu-accent)'
                        : 'var(--border)',
                  },

                  fontSize: '14px',

                  color:
                    'var(--foreground)',
                },
              }}
            />
          </Stack>

          {/* ESTIMATE / INFO */}
          {estimating ? (
            <Box
              sx={{
                mb: 3,
                display: 'flex',
                alignItems:
                  'center',
                justifyContent:
                  'center',
                gap: 1.5,
              }}
            >
              <CircularProgress
                size={16}
                sx={{
                  color:
                    'var(--nearu-accent)',
                }}
              />

              <Typography
                variant="caption"
                sx={{
                  color:
                    'var(--muted-foreground)',
                }}
              >
                Calculating fare...
              </Typography>
            </Box>
          ) : estimatedFare !==
            null ? (
            <Box
              sx={{
                mb: 3,
                display: 'flex',
                alignItems:
                  'center',
                justifyContent:
                  'space-between',

                bgcolor:
                  '--bg-surface',

                borderRadius: 4,

                p: 2,

                border: '1px solid',

                borderColor:
                  'var(--border)',
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    display:
                      'block',

                    textTransform:
                      'uppercase',

                    letterSpacing: 1,

                    color:
                      'var(--nearu-accent)',

                    mb: 0.5,
                    fontWeight:700,
                  }}
                >
                  Estimated Fare
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color:
                      'var(--text-primary)',
                  }}
                >
                  Rs.{' '}
                  {estimatedFare.toFixed(
                    2
                  )}
                </Typography>
              </Box>

              <Box
                sx={{
                  textAlign:
                    'right',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    display:
                      'block',

                    textTransform:
                      'uppercase',

                    letterSpacing: 1,

                    color:
                      'var(--nearu-accent)',

                    mb: 0.5,
                    fontWeight:700,
                  }}
                >
                  Distance
                </Typography>

                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 500,
                    color:
                      'var(--text-primary)',
                  }}
                >
                  {distanceKm?.toFixed(
                    2
                  )}{' '}
                  km
                </Typography>
              </Box>
            </Box>
          ) : null}

          {/* ERROR DISPLAY */}
          {error && (
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color:
                  'var(--destructive)',
                mb: 2,
                textAlign: 'center',
              }}
            >
              {error}
            </Typography>
          )}

          {/* MAIN ACTION */}
          <Button
            fullWidth
            onClick={handleRequest}
            disabled={
              loading ||
              !estimatedFare
            }
            variant="contained"
            sx={{
              py: 2,
              borderRadius: 4,
              fontWeight: 700,
              fontSize: '16px',

              bgcolor:
                'var(--nearu-accent)',

              color: 'white',

              boxShadow:
                '0 8px 30px rgba(46, 158, 191, 0.4)',

              '&:hover': {
                bgcolor:
                  'var(--nearu-accent)',
                opacity: 0.9,
              },

              textTransform:
                'none',

              '&:disabled': {
                bgcolor:
                  'var(--muted)',

                color:
                  'var(--muted-foreground)',
              },
            }}
          >
            {loading ? (
              <CircularProgress
                size={24}
                color="inherit"
              />
            ) : (
              'Confirm and Ride 🛵'
            )}
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}