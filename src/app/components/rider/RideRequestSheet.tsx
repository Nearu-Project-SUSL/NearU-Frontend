/**
 * RideRequestSheet.tsx
 * Sliding bottom sheet that appears when a new ride request comes in.
 * Uses `vaul` (already in package.json) for native-feel drag-to-dismiss.
 * Includes a 15-second countdown timer for auto-decline.
 */
import { useEffect, useRef, useState } from 'react';
import { Drawer } from 'vaul';
import { motion } from 'motion/react';
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
        <Drawer.Overlay style={{ background: 'rgba(0,0,0,0.6)', position: 'fixed', inset: 0, zIndex: 1300 }} />
        <Drawer.Content
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1400,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            background: '#161616',
            border: `1px solid ${ACCENT_ALPHA(0.3)}`,
            borderBottom: 'none',
            outline: 'none',
            overflow: 'hidden',
          }}
        >
          {/* Progress bar countdown */}
          <div
            style={{
              height: 4,
              background: '#222',
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
              }}
            />
          </div>

          {/* Sheet handle */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 4 }}>
            <div style={{ width: 40, height: 4, background: '#333', borderRadius: 2 }} />
          </div>

          <div style={{ padding: '16px 20px 32px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 44, height: 44,
                  background: ACCENT_ALPHA(0.15),
                  border: `1px solid ${ACCENT_ALPHA(0.35)}`,
                  borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <BikeIcon style={{ color: RIDER_ACCENT, fontSize: 22 }} />
                </div>
                <div>
                  <p style={{ color: 'white', fontWeight: 700, margin: 0, fontSize: 16 }}>New Ride Request</p>
                  <p style={{ color: '#9ca3af', margin: 0, fontSize: 13 }}>from {request.studentName}</p>
                </div>
              </div>

              {/* Countdown badge */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 12px',
                borderRadius: 20,
                background: countdown > 8 ? ACCENT_ALPHA(0.12) : countdown > 4 ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)',
                border: `1px solid ${countdown > 8 ? ACCENT_ALPHA(0.3) : countdown > 4 ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`,
              }}>
                <ClockIcon style={{ fontSize: 14, color: countdown > 8 ? RIDER_ACCENT : countdown > 4 ? '#f59e0b' : '#ef4444' }} />
                <span style={{ color: 'white', fontWeight: 700, fontSize: 15 }}>{countdown}s</span>
              </div>
            </div>

            {/* Route info */}
            <div style={{
              background: '#1e1e1e',
              border: '1px solid #2e2e2e',
              borderRadius: 16,
              padding: 16,
              marginBottom: 16,
            }}>
              {/* Pickup */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
                <LocationIcon style={{ color: '#2E9EBF', fontSize: 18, marginTop: 2, flexShrink: 0 }} />
                <div>
                  <p style={{ color: '#9ca3af', margin: 0, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pickup</p>
                  <p style={{ color: 'white', margin: 0, fontWeight: 600, fontSize: 14 }}>{request.pickupLocation}</p>
                </div>
              </div>

              {/* Divider with arrow */}
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: 9, marginBottom: 14, gap: 8 }}>
                <div style={{ width: 2, height: 20, background: '#333', borderRadius: 1 }} />
                <ArrowIcon style={{ color: '#555', fontSize: 16, rotate: '90deg' }} />
              </div>

              {/* Dropoff */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <LocationIcon style={{ color: '#f59e0b', fontSize: 18, marginTop: 2, flexShrink: 0 }} />
                <div>
                  <p style={{ color: '#9ca3af', margin: 0, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Dropoff</p>
                  <p style={{ color: 'white', margin: 0, fontWeight: 600, fontSize: 14 }}>{request.dropoffLocation}</p>
                </div>
              </div>
            </div>

            {/* Fare & distance */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <div style={{
                flex: 1,
                background: ACCENT_ALPHA(0.08),
                border: `1px solid ${ACCENT_ALPHA(0.2)}`,
                borderRadius: 12,
                padding: '10px 14px',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <MoneyIcon style={{ color: RIDER_ACCENT, fontSize: 18 }} />
                <div>
                  <p style={{ color: '#9ca3af', margin: 0, fontSize: 11 }}>Fare</p>
                  <p style={{ color: RIDER_ACCENT, margin: 0, fontWeight: 700, fontSize: 15 }}>
                    Rs. {request.fareEstimate.toLocaleString()}
                  </p>
                </div>
              </div>
              <div style={{
                flex: 1,
                background: 'rgba(46,158,191,0.08)',
                border: '1px solid rgba(46,158,191,0.2)',
                borderRadius: 12,
                padding: '10px 14px',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <BikeIcon style={{ color: '#2E9EBF', fontSize: 18 }} />
                <div>
                  <p style={{ color: '#9ca3af', margin: 0, fontSize: 11 }}>Distance</p>
                  <p style={{ color: '#2E9EBF', margin: 0, fontWeight: 700, fontSize: 15 }}>
                    {request.distanceKm.toFixed(1)} km
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={onDecline}
                disabled={isAccepting}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: 14,
                  border: '1px solid #333',
                  background: 'transparent',
                  color: '#9ca3af',
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.borderColor = '#ef4444'; (e.target as HTMLButtonElement).style.color = '#ef4444'; }}
                onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.borderColor = '#333'; (e.target as HTMLButtonElement).style.color = '#9ca3af'; }}
              >
                Decline
              </button>
              <button
                onClick={onAccept}
                disabled={isAccepting}
                style={{
                  flex: 2,
                  padding: '14px',
                  borderRadius: 14,
                  border: 'none',
                  background: isAccepting
                    ? ACCENT_ALPHA(0.4)
                    : `linear-gradient(135deg, ${RIDER_ACCENT}, #059669)`,
                  color: 'white',
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: isAccepting ? 'not-allowed' : 'pointer',
                  boxShadow: isAccepting ? 'none' : `0 4px 20px ${ACCENT_ALPHA(0.4)}`,
                  transition: 'all 0.2s ease',
                }}
              >
                {isAccepting ? 'Accepting...' : '✓ Accept Ride'}
              </button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
