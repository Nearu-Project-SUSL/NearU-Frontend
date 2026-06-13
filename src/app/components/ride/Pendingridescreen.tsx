import { useEffect, useState } from 'react';
import { RidesApi } from '../../../api/Ridesapi';
import { motion } from 'framer-motion';
import {
  Check as CheckIcon,
  Close as CancelIcon,
  Radar as RadarIcon,
  DirectionsBike as BikeIcon,
  NavigateNext as NextIcon,
} from '@mui/icons-material';

interface Props {
  rideId: string;
  onAccepted: (otpExpiresAt?: string) => void;
  onCancel: () => void;
}

const STEPS = [
  {
    label: 'Request Submitted',
    sub: 'Broadcasted to nearby riders',
    state: 'done',
  },
  {
    label: 'Rider Accepting',
    sub: 'Waiting for a rider to pick up your request',
    state: 'active',
  },
  {
    label: 'Rider Verifies OTP',
    sub: 'You will receive an OTP once accepted',
    state: 'pending',
  },
  {
    label: 'Ride in Progress',
    sub: 'Track your rider live on the map',
    state: 'pending',
  },
];

export function PendingRideScreen({ rideId, onAccepted, onCancel }: Props) {
  const [cancelling, setCancelling] = useState(false);
  const [dots, setDots] = useState('');

  // Animated ellipsis for "Searching" text
  useEffect(() => {
    const id = setInterval(
      () => setDots(d => (d.length >= 3 ? '' : d + '.')),
      500,
    );
    return () => clearInterval(id);
  }, []);

  async function handleCancel() {
    setCancelling(true);
    try {
      await RidesApi.cancelRide(rideId);
    } catch {
      // proceed regardless
    } finally {
      onCancel();
    }
  }

  const activeStep = 1;

  return (
    <div
      className="flex flex-col min-h-screen items-center justify-center p-4 animate-fadeIn"
      style={{
        background: 'radial-gradient(circle at 50% 50%, #111827 0%, #030712 100%)',
        color: '#f9fafb',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Background Decorative Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '15%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(46, 158, 191, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      {/* TOP STATUS BADGE */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          position: 'absolute',
          top: 24,
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            padding: '6px 16px',
            borderRadius: 30,
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            color: '#f59e0b',
            fontSize: 12.5,
            fontWeight: 600,
            letterSpacing: '0.02em',
            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <RadarIcon
            style={{
              fontSize: 15,
              animation: 'spin 4s linear infinite',
            }}
          />
          Finding a rider{dots}
        </div>
      </motion.div>

      {/* MAIN POPUP */}
      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        style={{
          width: '100%',
          maxWidth: '520px',
          borderRadius: 28,
          padding: '32px 28px',
          background: 'rgba(17, 17, 17, 0.75)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 30px 90px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          zIndex: 10,
        }}
      >
        {/* TITLE */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h2 style={{ color: 'white', margin: '0 0 6px', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' }}>
            Waiting for a Rider
          </h2>
          <p style={{ color: '#9ca3af', margin: 0, fontSize: 13.5, fontWeight: 500, lineHeight: 1.4 }}>
            We're matching you with the nearest available NearU partner
          </p>
        </div>

        {/* HIGH-TECH PULSING FINDER WIDGET */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: 24,
            padding: '30px 20px',
            marginBottom: 24,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Radar Circles */}
          <div style={{ position: 'relative', width: 80, height: 80, marginBottom: 16 }}>
            <motion.div
              animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '1.5px solid rgba(46, 158, 191, 0.35)',
              }}
            />
            <motion.div
              animate={{ scale: [1, 1.6], opacity: [0.8, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.6, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '1.5px solid rgba(46, 158, 191, 0.2)',
              }}
            />
            {/* Core Radar Icon */}
            <div
              style={{
                position: 'absolute',
                inset: 12,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2E9EBF, #1c6d85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(46, 158, 191, 0.4)',
              }}
            >
              <RadarIcon style={{ color: 'white', fontSize: 28, animation: 'spin 3s linear infinite' }} />
            </div>
          </div>

          <span
            style={{
              color: '#d1d5db',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.01em',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            Searching nearby riders{dots}
          </span>
        </div>

        {/* PROGRESS STEPS - SLEEK TIMELINE */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.01)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: 24,
            padding: '24px 20px',
            marginBottom: 24,
          }}
        >
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.4)',
              margin: '0 0 16px',
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Ride Progress
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative' }}>
            {/* Vertical timeline line */}
            <div
              style={{
                position: 'absolute',
                left: 14,
                top: 14,
                bottom: 14,
                width: 2,
                background: 'rgba(255,255,255,0.06)',
                zIndex: 0,
              }}
            />
            {/* Active connection line overlay */}
            <div
              style={{
                position: 'absolute',
                left: 14,
                top: 14,
                height: '25%', // Active step height overlay
                width: 2,
                background: 'linear-gradient(to bottom, #10b981, #2E9EBF)',
                zIndex: 0,
              }}
            />

            {STEPS.map((step, i) => {
              const isDone = step.state === 'done';
              const isActive = step.state === 'active';
              return (
                <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', zIndex: 1 }}>
                  {/* Timeline Badge */}
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 800,
                      flexShrink: 0,
                      transition: 'all 0.3s ease',
                      border: isDone
                        ? '1px solid rgba(16, 185, 129, 0.4)'
                        : isActive
                        ? '1px solid #2E9EBF'
                        : '1px solid rgba(255, 255, 255, 0.08)',
                      background: isDone
                        ? 'rgba(16, 185, 129, 0.12)'
                        : isActive
                        ? 'rgba(46, 158, 191, 0.15)'
                        : 'rgba(255, 255, 255, 0.02)',
                      color: isDone ? '#10b981' : isActive ? '#2E9EBF' : 'rgba(255, 255, 255, 0.35)',
                      boxShadow: isDone
                        ? '0 0 10px rgba(16, 185, 129, 0.15)'
                        : isActive
                        ? '0 0 12px rgba(46, 158, 191, 0.25)'
                        : 'none',
                    }}
                  >
                    {isDone ? (
                      <CheckIcon style={{ fontSize: 14 }} />
                    ) : isActive ? (
                      <motion.div
                        animate={{ scale: [0.9, 1.1, 0.9] }}
                        transition={{ repeat: Infinity, duration: 1.6 }}
                      >
                        {i + 1}
                      </motion.div>
                    ) : (
                      i + 1
                    )}
                  </div>

                  {/* Texts */}
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 700,
                        fontSize: 14.5,
                        color: isDone || isActive ? '#f3f4f6' : 'rgba(255, 255, 255, 0.4)',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {step.label}
                    </p>
                    <p
                      style={{
                        margin: '2px 0 0',
                        fontSize: 12.5,
                        color: isDone || isActive ? '#9ca3af' : 'rgba(255, 255, 255, 0.25)',
                        lineHeight: 1.35,
                      }}
                    >
                      {step.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIDER ID */}
        <div
          style={{
            borderRadius: 16,
            padding: '10px 16px',
            fontSize: 12.5,
            marginBottom: 20,
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            color: 'rgba(255, 255, 255, 0.5)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>Ride Identifier</span>
          <span style={{ color: '#2E9EBF', fontFamily: 'monospace', fontWeight: 700 }}>
            {rideId.slice(0, 8).toUpperCase()}…
          </span>
        </div>

        {/* ACTIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <motion.button
            whileHover={{ scale: 1.015, background: 'rgba(239, 68, 68, 0.15)' }}
            whileTap={{ scale: 0.985 }}
            onClick={handleCancel}
            disabled={cancelling}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 16,
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#ef4444',
              fontWeight: 700,
              fontSize: 14.5,
              cursor: cancelling ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <CancelIcon style={{ fontSize: 16 }} />
            {cancelling ? 'Cancelling...' : 'Cancel Request'}
          </motion.button>
        </div>
      </motion.div>

      {/* Global CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
