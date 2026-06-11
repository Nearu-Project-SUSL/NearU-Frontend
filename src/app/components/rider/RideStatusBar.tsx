/**
 * RideStatusBar.tsx
 * Fixed floating bottom action bar shown during active ride states.
 * Shows current state label, next action button, and a live pulsing indicator.
 */
import { motion } from 'framer-motion';
import type { RideStatus } from '../../../api/riderService';
import type { ActiveRide } from '../../../api/riderService';
import {
  DirectionsBike as BikeIcon,
  CheckCircle as CheckIcon,
  LocationOn as PinIcon,
  Flag as FlagIcon,
  HourglassEmpty as HourglassIcon,
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

const STATUS_CONFIG: Record<string, { label: string; subtitle: string; color: string; gradient: string }> = {
  EN_ROUTE_PICKUP: {
    label: 'En Route to Pickup',
    subtitle: 'Navigate to the pickup location',
    color: '#2E9EBF',
    gradient: 'linear-gradient(135deg, #2E9EBF, #1a7a9a)',
  },
  ARRIVED_WAITING: {
    label: 'Waiting for Student',
    subtitle: 'Student is entering the OTP',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
  },
  RIDE_IN_PROGRESS: {
    label: 'Ride in Progress',
    subtitle: 'Navigate to the destination',
    color: RIDER_ACCENT,
    gradient: `linear-gradient(135deg, ${RIDER_ACCENT}, #059669)`,
  },
  COMPLETING: {
    label: 'Completing Ride...',
    subtitle: 'Waiting for student confirmation',
    color: RIDER_ACCENT,
    gradient: `linear-gradient(135deg, ${RIDER_ACCENT}, #059669)`,
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
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '560px',
        zIndex: 1200,
        pointerEvents: 'none', // Allow clicking maps behind container margins
      }}
    >
      <motion.div
        initial={{ y: 120, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 120, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        style={{
          pointerEvents: 'auto', // Enable pointer events on the card itself
          background: 'rgba(18, 18, 18, 0.82)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 24,
          border: `1px solid ${ACCENT_ALPHA(0.2)}`,
          padding: '20px 24px',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Status header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Live pulse dot wrapper */}
          <div
            style={{
              position: 'relative',
              width: 14,
              height: 14,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: config.color,
                boxShadow: `0 0 8px ${config.color}`,
              }}
            />
            {!isCompleting && (
              <motion.div
                animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: config.color,
                }}
              />
            )}
          </div>

          {/* Label + Subtitle */}
          <div style={{ flex: 1 }}>
            <p style={{ color: 'white', margin: '0 0 3px', fontWeight: 800, fontSize: 16, letterSpacing: '-0.01em' }}>
              {config.label}
            </p>
            {activeRide && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {rideStatus === 'EN_ROUTE_PICKUP' ? (
                  <PinIcon style={{ color: '#2E9EBF', fontSize: 14, flexShrink: 0 }} />
                ) : rideStatus === 'RIDE_IN_PROGRESS' ? (
                  <FlagIcon style={{ color: RIDER_ACCENT, fontSize: 14, flexShrink: 0 }} />
                ) : (
                  <HourglassIcon style={{ color: '#f59e0b', fontSize: 14, flexShrink: 0 }} />
                )}
                <span
                  style={{
                    color: '#9ca3af',
                    fontSize: 12.5,
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '280px',
                  }}
                >
                  {rideStatus === 'EN_ROUTE_PICKUP'
                    ? activeRide.pickupLocation
                    : rideStatus === 'RIDE_IN_PROGRESS'
                    ? activeRide.dropoffLocation
                    : config.subtitle}
                </span>
              </div>
            )}
          </div>

          {/* Fare badge */}
          {activeRide && (
            <div
              style={{
                padding: '6px 14px',
                borderRadius: 30,
                background: ACCENT_ALPHA(0.08),
                border: `1px solid ${ACCENT_ALPHA(0.2)}`,
                backdropFilter: 'blur(4px)',
                flexShrink: 0,
              }}
            >
              <p
                style={{
                  color: RIDER_ACCENT,
                  margin: 0,
                  fontWeight: 800,
                  fontSize: 14,
                  fontFamily: 'monospace',
                  letterSpacing: '-0.02em',
                }}
              >
                Rs. {activeRide.fareEstimate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          )}
        </div>

        {/* Action buttons with spring-physics motion */}
        {showArriveButton && (
          <motion.button
            whileHover={{ scale: 1.015, translateY: -1 }}
            whileTap={{ scale: 0.985 }}
            onClick={onArrive}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: 16,
              border: 'none',
              background: isLoading ? 'rgba(46,158,191,0.25)' : config.gradient,
              color: 'white',
              fontWeight: 800,
              fontSize: 15,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: isLoading ? 'none' : '0 8px 24px rgba(46,158,191,0.3)',
              transition: 'box-shadow 0.25s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              letterSpacing: '0.01em',
            }}
          >
            <PinIcon style={{ fontSize: 19 }} />
            {isLoading ? 'Updating...' : "I've Arrived at Pickup"}
          </motion.button>
        )}

        {showCompleteButton && (
          <motion.button
            whileHover={{ scale: 1.015, translateY: -1 }}
            whileTap={{ scale: 0.985 }}
            onClick={onComplete}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: 16,
              border: 'none',
              background: isLoading ? ACCENT_ALPHA(0.25) : config.gradient,
              color: 'white',
              fontWeight: 800,
              fontSize: 15,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: isLoading ? 'none' : `0 8px 24px ${ACCENT_ALPHA(0.35)}`,
              transition: 'box-shadow 0.25s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              letterSpacing: '0.01em',
            }}
          >
            <CheckIcon style={{ fontSize: 19 }} />
            {isLoading ? 'Completing...' : 'Complete Ride'}
          </motion.button>
        )}

        {isCompleting && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              padding: '16px',
              borderRadius: 16,
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <BikeIcon style={{ color: RIDER_ACCENT, fontSize: 20 }} />
            </motion.div>
            <p style={{ color: '#9ca3af', margin: 0, fontSize: 13.5, fontWeight: 500 }}>
              Waiting for student to confirm...
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
