/**
 * RideRequestSheet.tsx
 * Sliding bottom sheet that appears when a new ride request comes in.
 * Uses `vaul` (already in package.json) for native-feel drag-to-dismiss.
 * Includes a 15-second countdown timer for auto-decline.
 */
import { useEffect, useRef, useState } from 'react';
import { Drawer } from 'vaul';
import { motion } from 'framer-motion';
import type { RideRequest } from '../../../api/riderService';
import {
  LocationOn as LocationIcon,
  TrendingFlat as ArrowIcon,
  AccessTime as ClockIcon,
  DirectionsBike as BikeIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';

interface RideRequestSheetProps {
  request: RideRequest;
  onAccept: () => void;
  onDecline: () => void;
  isAccepting?: boolean;
}

const COUNTDOWN_SECONDS = 15;
const RIDER_ACCENT = '#10b981'; // Green — Rider brand colour
const ACCENT_ALPHA = (a: number) => `rgba(16, 185, 129, ${a})`;

export default function RideRequestSheet({
  request,
  onAccept,
  onDecline,
  isAccepting = false,
}: RideRequestSheetProps) {
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown timer — auto-decline when it hits 0
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          onDecline();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [onDecline]);

  const progress = (countdown / COUNTDOWN_SECONDS) * 100;

  return (
    <Drawer.Root open dismissible={false}>
      <Drawer.Portal>
        <Drawer.Overlay style={{ background: 'rgba(0,0,0,0.7)', position: 'fixed', inset: 0, zIndex: 1300 }} />
        <Drawer.Content
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1400,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            background: 'rgba(20, 20, 20, 0.95)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: `1px solid rgba(16, 185, 129, 0.25)`,
            borderBottom: 'none',
            outline: 'none',
            overflow: 'hidden',
          }}
        >
          {/* Progress bar countdown */}
          <div
            style={{
              height: 4,
              background: '#1a1a1a',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'linear' }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                background: countdown > 8
                  ? RIDER_ACCENT
                  : countdown > 4
                  ? '#f59e0b'
                  : '#ef4444',
                transition: 'background 0.5s ease',
                boxShadow: countdown > 8 
                  ? `0 0 10px ${ACCENT_ALPHA(0.5)}` 
                  : countdown > 4 
                  ? '0 0 10px rgba(245,158,11,0.5)' 
                  : '0 0 10px rgba(239,68,68,0.5)'
              }}
            />
          </div>

          {/* Sheet handle */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 14, paddingBottom: 4 }}>
            <div style={{ width: 44, height: 4, background: 'rgba(255,255,255,0.12)', borderRadius: 2 }} />
          </div>

          <div style={{ padding: '16px 24px 36px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 48, height: 48,
                  background: ACCENT_ALPHA(0.12),
                  border: `1px solid ${ACCENT_ALPHA(0.3)}`,
                  borderRadius: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 15px ${ACCENT_ALPHA(0.15)}`
                }}>
                  <BikeIcon style={{ color: RIDER_ACCENT, fontSize: 24 }} />
                </div>
                <div>
                  <p style={{ color: 'white', fontWeight: 800, margin: 0, fontSize: 17, letterSpacing: '-0.01em' }}>New Ride Request</p>
                  <p style={{ color: '#9ca3af', margin: '2px 0 0', fontSize: 13, fontWeight: 500 }}>from {request.studentName}</p>
                </div>
              </div>

              {/* Countdown badge */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px',
                borderRadius: 20,
                background: countdown > 8 ? ACCENT_ALPHA(0.12) : countdown > 4 ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)',
                border: `1px solid ${countdown > 8 ? ACCENT_ALPHA(0.3) : countdown > 4 ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`,
              }}>
                <ClockIcon style={{ fontSize: 14, color: countdown > 8 ? RIDER_ACCENT : countdown > 4 ? '#f59e0b' : '#ef4444' }} />
                <span style={{ color: 'white', fontWeight: 800, fontSize: 14, fontFamily: 'monospace' }}>{countdown}s</span>
              </div>
            </div>

            {/* Route info */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: 20,
              padding: 18,
              marginBottom: 20,
            }}>
              {/* Pickup */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <LocationIcon style={{ color: '#2E9EBF', fontSize: 20, marginTop: 1, flexShrink: 0 }} />
                <div>
                  <p style={{ color: '#9ca3af', margin: 0, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pickup</p>
                  <p style={{ color: 'white', margin: '2px 0 0', fontWeight: 600, fontSize: 14, lineHeight: 1.4 }}>{request.pickupLocation}</p>
                </div>
              </div>

              {/* Divider connector */}
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: 9, marginTop: 6, marginBottom: 6, gap: 12 }}>
                <div style={{ 
                  width: 2, 
                  height: 24, 
                  background: 'linear-gradient(to bottom, #2E9EBF, #f59e0b)', 
                  opacity: 0.4,
                  borderRadius: 1 
                }} />
              </div>

              {/* Dropoff */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <LocationIcon style={{ color: '#f59e0b', fontSize: 20, marginTop: 1, flexShrink: 0 }} />
                <div>
                  <p style={{ color: '#9ca3af', margin: 0, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Dropoff</p>
                  <p style={{ color: 'white', margin: '2px 0 0', fontWeight: 600, fontSize: 14, lineHeight: 1.4 }}>{request.dropoffLocation}</p>
                </div>
              </div>
            </div>

            {/* Fare & distance */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
              <div style={{
                flex: 1,
                background: ACCENT_ALPHA(0.08),
                border: `1px solid ${ACCENT_ALPHA(0.2)}`,
                borderRadius: 16,
                padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <MoneyIcon style={{ color: RIDER_ACCENT, fontSize: 20 }} />
                <div>
                  <p style={{ color: '#9ca3af', margin: 0, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Fare</p>
                  <p style={{ color: RIDER_ACCENT, margin: '2px 0 0', fontWeight: 800, fontSize: 17, fontFamily: 'monospace' }}>
                    Rs. {request.fareEstimate.toLocaleString()}
                  </p>
                </div>
              </div>
              <div style={{
                flex: 1,
                background: 'rgba(46,158,191,0.08)',
                border: '1px solid rgba(46,158,191,0.2)',
                borderRadius: 16,
                padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <BikeIcon style={{ color: '#2E9EBF', fontSize: 20 }} />
                <div>
                  <p style={{ color: '#9ca3af', margin: 0, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Distance</p>
                  <p style={{ color: '#2E9EBF', margin: '2px 0 0', fontWeight: 800, fontSize: 17, fontFamily: 'monospace' }}>
                    {request.distanceKm.toFixed(1)} km
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 14 }}>
              <motion.button
                whileHover={{ scale: 1.02, borderColor: '#ef4444', color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)' }}
                whileTap={{ scale: 0.98 }}
                onClick={onDecline}
                disabled={isAccepting}
                style={{
                  flex: 1,
                  padding: '15px',
                  borderRadius: 16,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.02)',
                  color: '#9ca3af',
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Decline
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: `0 8px 25px ${ACCENT_ALPHA(0.5)}` }}
                whileTap={{ scale: 0.98 }}
                onClick={onAccept}
                disabled={isAccepting}
                style={{
                  flex: 2,
                  padding: '15px',
                  borderRadius: 16,
                  border: 'none',
                  background: isAccepting
                    ? ACCENT_ALPHA(0.4)
                    : `linear-gradient(135deg, ${RIDER_ACCENT}, #059669)`,
                  color: 'white',
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: isAccepting ? 'not-allowed' : 'pointer',
                  boxShadow: isAccepting ? 'none' : `0 4px 20px ${ACCENT_ALPHA(0.3)}`,
                  transition: 'all 0.2s ease',
                }}
              >
                {isAccepting ? 'Accepting...' : 'Accept Ride'}
              </motion.button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
