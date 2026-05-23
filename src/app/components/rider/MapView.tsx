/**
 * MapView.tsx
 * Reusable full-screen map component using react-leaflet + OpenStreetMap.
 * Uses CartoDB Dark Matter tiles for dark-mode aesthetic.
 * No API key required.
 */
import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { LocationCoords } from '../../../api/riderService';

// ─── Fix Leaflet default marker icon paths broken by Vite bundling ─────────
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

// ─── Custom SVG Icons ─────────────────────────────────────────────────────────
const createCustomIcon = (color: string, emoji: string) =>
  L.divIcon({
    className: '',
    html: `
      <div style="
        width: 42px; height: 42px;
        background: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 14px rgba(0,0,0,0.5);
        display: flex; align-items: center; justify-content: center;
      ">
        <span style="transform: rotate(45deg); font-size: 18px; line-height:1;">${emoji}</span>
      </div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -42],
  });

const riderIcon = createCustomIcon('#10b981', '🛵');
const pickupIcon = createCustomIcon('#2E9EBF', '📍');
const dropoffIcon = createCustomIcon('#f59e0b', '🏁');

// ─── Helper: smoothly pan map when rider position changes ────────────────────
function MapPanner({ center }: { center: [number, number] }) {
  const map = useMap();
  const prevCenter = useRef<[number, number] | null>(null);

  useEffect(() => {
    if (
      prevCenter.current === null ||
      Math.abs(prevCenter.current[0] - center[0]) > 0.0001 ||
      Math.abs(prevCenter.current[1] - center[1]) > 0.0001
    ) {
      map.panTo(center, { animate: true, duration: 1 });
      prevCenter.current = center;
    }
  }, [center, map]);

  return null;
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface MapViewProps {
  riderCoords?: LocationCoords | null;
  pickupCoords?: { lat: number; lng: number } | null;
  dropoffCoords?: { lat: number; lng: number } | null;
  /** Height of the map container */
  height?: string;
}

export default function MapView({
  riderCoords,
  pickupCoords,
  dropoffCoords,
  height = '100%',
}: MapViewProps) {
  // Default center: Sabaragamuwa University of Sri Lanka (adjust if needed)
  const defaultCenter: [number, number] = [6.6775, 80.9007];

  const center: [number, number] = riderCoords
    ? [riderCoords.latitude, riderCoords.longitude]
    : defaultCenter;

  // Build route polyline points
  const routePoints: [number, number][] = [];
  if (riderCoords) routePoints.push([riderCoords.latitude, riderCoords.longitude]);
  if (pickupCoords) routePoints.push([pickupCoords.lat, pickupCoords.lng]);

  return (
    <div style={{ height, width: '100%', borderRadius: 'inherit', overflow: 'hidden' }}>
      <MapContainer
        center={center}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        {/* CartoDB Dark Matter — free, no API key */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          subdomains="abcd"
          maxZoom={20}
        />

        {/* Auto-pan when rider moves */}
        {riderCoords && <MapPanner center={center} />}

        {/* Rider position marker */}
        {riderCoords && (
          <Marker
            position={[riderCoords.latitude, riderCoords.longitude]}
            icon={riderIcon}
          />
        )}

        {/* Pickup marker */}
        {pickupCoords && (
          <Marker position={[pickupCoords.lat, pickupCoords.lng]} icon={pickupIcon} />
        )}

        {/* Dropoff marker */}
        {dropoffCoords && (
          <Marker position={[dropoffCoords.lat, dropoffCoords.lng]} icon={dropoffIcon} />
        )}

        {/* Dashed route line: Rider → Pickup */}
        {routePoints.length === 2 && (
          <Polyline
            positions={routePoints}
            pathOptions={{
              color: '#10b981',
              weight: 3,
              opacity: 0.75,
              dashArray: '8, 8',
            }}
          />
        )}

        {/* Solid line: Pickup → Dropoff when ride in progress */}
        {pickupCoords && dropoffCoords && (
          <Polyline
            positions={[
              [pickupCoords.lat, pickupCoords.lng],
              [dropoffCoords.lat, dropoffCoords.lng],
            ]}
            pathOptions={{
              color: '#2E9EBF',
              weight: 3,
              opacity: 0.6,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
