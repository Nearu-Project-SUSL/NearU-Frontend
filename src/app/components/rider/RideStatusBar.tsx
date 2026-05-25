/**
 * RideStatusBar.tsx
 * Fixed bottom action bar shown during active ride states.
 * Shows current state label, next action button, and a live pulsing indicator.
 */
import { motion } from 'motion/react';
import type { RideStatus } from '../../../api/riderService';
import type { ActiveRide } from '../../../api/riderService';
import {
  DirectionsBike as BikeIcon,
  CheckCircle as CheckIcon,
  LocationOn as PinIcon,
} from '@mui/icons-material';

interface RideStatusBarProps {
  rideStatus: RideStatus;
  activeRide: ActiveRide | null;
  onArrive: () => void;
  onComplete: () => void;
  isLoading?: boolean;
}

const RIDER_ACCENT = '#10b981';
const ACCENT_ALPHA = (a: number) => `rgba(16, 185, 129, ${a})`;

const STATUS_CONFIG: Record<string, { label: string; subtitle: string; color: string }> = {
  EN_ROUTE_PICKUP: {
    label: 'En Route to Pickup',
    subtitle: 'Navigate to the pickup location',
    color: '#2E9EBF',
  },
  ARRIVED_WAITING: {
    label: 'Waiting for Student',
    subtitle: 'Student is entering the OTP',
    color: '#f59e0b',
  },
  RIDE_IN_PROGRESS: {
    label: 'Ride in Progress',
    subtitle: 'Navigate to the destination',
    color: RIDER_ACCENT,
  },
  COMPLETING: {
    label: 'Completing Ride...',
    subtitle: 'Waiting for student confirmation',
    color: RIDER_ACCENT,
  },
};

export default function RideStatusBar({
  rideStatus,
  activeRide,
  onArrive,
  onComplete,
  isLoading = false,
}: RideStatusBarProps) {
  const config = STATUS_CONFIG[rideStatus];
  if (!config) return null;

  const showArriveButton = rideStatus === 'EN_ROUTE_PICKUP';
  const showCompleteButton = rideStatus === 'RIDE_IN_PROGRESS';
  const isCompleting = rideStatus === 'COMPLETING';

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        background: '#0e0e0e',
        borderTop: `1px solid ${ACCENT_ALPHA(0.25)}`,
        padding: '16px 20px 28px',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Status header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        {/* Live pulse dot */}
        <div style={{ position: 'relative', width: 12, height: 12, flexShrink: 0 }}>
          <div style={{
            width: 12, height: 12,
            borderRadius: '50%',
            background: config.color,
          }} />
          {!isCompleting && (
            <motion.div
              animate={{ scale: [1, 2, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: config.color,
              }}
            />
          )}
        </div>

        <div style={{ flex: 1 }}>
          <p style={{ color: 'white', margin: 0, fontWeight: 700, fontSize: 15 }}>{config.label}</p>
          {activeRide && (
            <p style={{ color: '#9ca3af', margin: 0, fontSize: 12 }}>
              {rideStatus === 'EN_ROUTE_PICKUP'
                ? `📍 ${activeRide.pickupLocation}`
                : rideStatus === 'RIDE_IN_PROGRESS'
                ? `🏁 ${activeRide.dropoffLocation}`
                : config.subtitle}
            </p>
          )}
        </div>

        {/* Fare badge */}
        {activeRide && (
          <div style={{
            padding: '5px 12px',
            borderRadius: 20,
            background: ACCENT_ALPHA(0.12),
            border: `1px solid ${ACCENT_ALPHA(0.3)}`,
          }}>
            <p style={{ color: RIDER_ACCENT, margin: 0, fontWeight: 700, fontSize: 14 }}>
              Rs. {activeRide.fareEstimate.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* Action button */}
      {showArriveButton && (
        <button
          onClick={onArrive}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '15px',
            borderRadius: 16,
            border: 'none',
            background: isLoading
              ? 'rgba(46,158,191,0.3)'
              : 'linear-gradient(135deg, #2E9EBF, #1a7a9a)',
            color: 'white',
            fontWeight: 700,
            fontSize: 16,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            boxShadow: isLoading ? 'none' : '0 4px 20px rgba(46,158,191,0.35)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <PinIcon style={{ fontSize: 18 }} />
          {isLoading ? 'Updating...' : 'I\'ve Arrived at Pickup'}
        </button>
      )}

      {showCompleteButton && (
        <button
          onClick={onComplete}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '15px',
            borderRadius: 16,
            border: 'none',
            background: isLoading
              ? ACCENT_ALPHA(0.3)
              : `linear-gradient(135deg, ${RIDER_ACCENT}, #059669)`,
            color: 'white',
            fontWeight: 700,
            fontSize: 16,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            boxShadow: isLoading ? 'none' : `0 4px 20px ${ACCENT_ALPHA(0.4)}`,
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <CheckIcon style={{ fontSize: 18 }} />
          {isLoading ? 'Completing...' : 'Complete Ride'}
        </button>
      )}

      {isCompleting && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          padding: '14px',
          borderRadius: 16,
          background: ACCENT_ALPHA(0.08),
          border: `1px solid ${ACCENT_ALPHA(0.2)}`,
        }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          >
            <BikeIcon style={{ color: RIDER_ACCENT, fontSize: 22 }} />
          </motion.div>
          <p style={{ color: '#9ca3af', margin: 0, fontSize: 14 }}>
            Waiting for student to confirm...
          </p>
        </div>
      )}
    </motion.div>
  );
}
