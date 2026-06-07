import { useState } from 'react';
import { RidesApi } from '../../../api/Ridesapi';
import { motion } from 'framer-motion';
import {
  Star as StarIcon,
  Refresh as RefreshIcon,
  DirectionsBike as BikeIcon,
  DirectionsRun as RunIcon,
  Shield as ShieldIcon,
  NavigateNext as NextIcon,
} from '@mui/icons-material';

interface Props {
  rideId: string;
  otp?: string;
  otpExpiresAt?: string;
  riderName?: string;
  riderVehicle?: string;
  riderRating?: number;
  distanceToPickupKm?: number;
  onRideStarted: () => void;
}

export function AcceptedRideScreen({
  rideId,
  otp,
  otpExpiresAt,
  riderName = 'Your rider',
  riderVehicle,
  riderRating,
  distanceToPickupKm,
  onRideStarted,
}: Props) {
  const [currentExpiry, setCurrentExpiry] = useState(otpExpiresAt);
  const [refreshing, setRefreshing] = useState(false);

  const initials = riderName
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const otpDigits = otp?.split('') ?? [];

  async function handleRefresh() {
    setRefreshing(true);
    try {
      const res = await RidesApi.refreshOtp(rideId);

      if (res.data.otpExpiresAt) {
        setCurrentExpiry(res.data.otpExpiresAt);
      }
    } catch {
      // ignore
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <div
      className="flex flex-col min-h-screen items-center justify-center p-4 animate-fadeIn"
      style={{
        background: 'radial-gradient(circle at 50% 50%, #111827 0%, #030712 100%)',
        color: '#f9fafb',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Decorative Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          right: '15%',
          width: '320px',
          height: '320px',
          background: 'radial-gradient(circle, rgba(46, 158, 191, 0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          width: '380px',
          height: '380px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(65px)',
          pointerEvents: 'none',
        }}
      />

      {/* TOP STATUS */}
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
            background: 'rgba(46, 158, 191, 0.08)',
            border: '1px solid rgba(46, 158, 191, 0.25)',
            color: '#2E9EBF',
            fontSize: 12.5,
            fontWeight: 600,
            letterSpacing: '0.02em',
            boxShadow: '0 4px 15px rgba(46, 158, 191, 0.15)',
          }}
        >
          Rider on the Way
        </div>
      </motion.div>

      {/* MAIN CARD */}
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
            Your Rider is Coming
          </h2>
          <p style={{ color: '#9ca3af', margin: 0, fontSize: 13.5, fontWeight: 500 }}>
            Verify OTP when the rider arrives
          </Typography>
        </Box>

        {/* STATUS CARD (REPLACES MAP BOX) */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: 24,
            padding: '24px 20px',
            marginBottom: 24,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Live pulsing dot */}
          <div style={{ position: 'relative', width: 14, height: 14, marginBottom: 12 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: '#2E9EBF',
                boxShadow: '0 0 10px rgba(46, 158, 191, 0.5)',
              }}
            />
            <motion.div
              animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: '#2E9EBF',
              }}
            />
          </div>

          <span style={{ color: '#d1d5db', fontSize: 13.5, fontWeight: 600, textAlign: 'center' }}>
            {distanceToPickupKm != null
              ? `Rider is ${distanceToPickupKm.toFixed(2)} km away`
              : 'Rider is approaching your pickup location'}
          </Typography>
        </Box>

        {/* RIDER PROFILE CARD */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            borderRadius: 24,
            padding: '16px 20px',
            marginBottom: 24,
            background: 'rgba(255, 255, 255, 0.01)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 16,
              background: 'rgba(46, 158, 191, 0.1)',
              border: '1.5px solid rgba(46, 158, 191, 0.35)',
              color: '#2E9EBF',
              boxShadow: '0 4px 15px rgba(46, 158, 191, 0.1)',
            }}
          >
            {initials}
          </Avatar>

          <div style={{ flex: 1 }}>
            <div style={{ color: '#f3f4f6', fontWeight: 800, fontSize: 15.5, letterSpacing: '-0.01em' }}>
              {riderName}
            </Typography>

            {riderVehicle && (
              <div style={{ color: '#9ca3af', fontSize: 13, fontWeight: 500, marginTop: 2 }}>
                {riderVehicle}
              </Typography>
            )}
          </Box>

          {riderRating != null && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 10px',
                borderRadius: 20,
                background: 'rgba(245, 158, 11, 0.06)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
              }}
            >
              <span style={{ color: '#f59e0b', fontSize: 13.5, fontWeight: 700 }}>
                {riderRating.toFixed(1)}
              </span>
              <StarIcon style={{ color: '#f59e0b', fontSize: 14 }} />
            </div>
          )}
        </Paper>

        {/* OTP DISPLAY CARD */}
        <div
          style={{
            borderRadius: 24,
            padding: '24px 20px',
            marginBottom: 24,
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.02)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.4)',
                margin: 0,
                fontSize: 10.5,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Your OTP
            </p>
            <p style={{ color: '#9ca3af', margin: '4px 0 0', fontSize: 13, fontWeight: 500 }}>
              Share only with your rider upon arrival
            </p>
          </div>

          {/* OTP SLOTS */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
            {otpDigits.length === 4
              ? otpDigits.map((d, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', delay: i * 0.08, stiffness: 200 }}
                    style={{
                      width: 58,
                      height: 68,
                      borderRadius: 16,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 28,
                      fontWeight: 800,
                      background: 'rgba(46, 158, 191, 0.06)',
                      border: '1.5px solid rgba(46, 158, 191, 0.4)',
                      color: '#2E9EBF',
                      boxShadow: '0 0 15px rgba(46, 158, 191, 0.2)',
                      fontFamily: 'monospace',
                    }}
                  >
                    {d}
                  </motion.div>
                ))
              : [0, 1, 2, 3].map(i => (
                  <Paper
                    key={i}
                    style={{
                      width: 58,
                      height: 68,
                      borderRadius: 16,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 22,
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      color: 'rgba(255, 255, 255, 0.25)',
                    }}
                  >
                    •
                  </Paper>
                ))}
          </Stack>

          <motion.button
            whileHover={{ scale: 1.015, borderColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
            whileTap={{ scale: 0.985 }}
            onClick={handleRefresh}
            disabled={refreshing}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 16,
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#d1d5db',
              fontSize: 13.5,
              fontWeight: 600,
              cursor: refreshing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s ease',
            }}
          >
            <RefreshIcon
              style={{
                fontSize: 16,
                animation: refreshing ? 'spin 1s linear infinite' : 'none',
              }}
            />
            {refreshing ? 'Refreshing...' : 'Refresh OTP'}
          </motion.button>
        </div>

        {/* INFO GRID */}
        <div
          style={{
            borderRadius: 18,
            padding: '14px 18px',
            fontSize: 12.5,
            marginBottom: 20,
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            color: '#9ca3af',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            lineHeight: 1.45,
          }}
        >
          <ShieldIcon style={{ color: '#10b981', fontSize: 16, marginTop: 2, flexShrink: 0 }} />
          <span>
            Rider will use this OTP to securely start your ride. Location sharing is active only during trip progress.
          </span>
        </div>

        {/* DEV BUTTON - subtle dotted plate */}
        <button
          onClick={onRideStarted}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: 12,
            background: 'transparent',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.3)',
            fontSize: 11.5,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
          onMouseOver={e => {
            e.currentTarget.style.color = '#10b981';
            e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <BikeIcon style={{ fontSize: 14 }} />
          <span>[Developer Mode] Simulate Ride Start</span>
          <NextIcon style={{ fontSize: 14 }} />
        </button>
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