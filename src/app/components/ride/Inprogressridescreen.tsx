import { motion } from 'framer-motion';
import {
  DirectionsBike as BikeIcon,
  Flag as FlagIcon,
  AttachMoney as MoneyIcon,
  HourglassEmpty as HourglassIcon,
  Shield as ShieldIcon,
  NavigateNext as NextIcon,
} from '@mui/icons-material';

interface Props {
  riderName?: string;
  riderVehicle?: string;
  estimatedFare: number;
  dropoffLabel?: string;
  onRiderCompleted: () => void;
}

export function InProgressRideScreen({
  riderName = 'Your rider',
  riderVehicle,
  estimatedFare,
  dropoffLabel = 'Drop-off point',
  onRiderCompleted,
}: Props) {
  const initials = riderName
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

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
          left: '10%',
          width: '360px',
          height: '360px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(55px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '25%',
          right: '15%',
          width: '320px',
          height: '320px',
          background: 'radial-gradient(circle, rgba(46, 158, 191, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
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
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            color: '#10b981',
            fontSize: 12.5,
            fontWeight: 600,
            letterSpacing: '0.02em',
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 6px #10b981',
            }}
          />
          Ride In Progress
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
            Your Trip is Ongoing
          </h2>
          <p style={{ color: '#9ca3af', margin: 0, fontSize: 13.5, fontWeight: 500 }}>
            Live tracking and route navigation active
          </p>
        </div>

        {/* LIVE STATUS CARD */}
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
          }}
        >
          {/* Animated pulsing orb */}
          <div style={{ position: 'relative', width: 14, height: 14, marginBottom: 12 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
              }}
            />
            <motion.div
              animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: '#10b981',
              }}
            />
          </div>

          <span style={{ color: '#d1d5db', fontSize: 13.5, fontWeight: 600, textAlign: 'center' }}>
            Navigating to your destination
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
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1.5px solid rgba(16, 185, 129, 0.35)',
              color: '#10b981',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.1)',
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
        </Paper>

        {/* TRIP INFO - SLEEK RECEIPT */}
        <div
          style={{
            borderRadius: 24,
            padding: '22px 20px',
            marginBottom: 24,
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.02)',
          }}
        >
          {/* Destination */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: 16,
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FlagIcon style={{ color: '#ef4444', fontSize: 16 }} />
              <span style={{ fontSize: 13.5, color: '#9ca3af', fontWeight: 500 }}>Destination</span>
            </div>
            <span style={{ fontSize: 14, color: '#f3f4f6', fontWeight: 700 }}>
              {dropoffLabel}
            </Typography>
          </Box>

          {/* Fare */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MoneyIcon style={{ color: '#10b981', fontSize: 16 }} />
              <span style={{ fontSize: 14, color: '#f3f4f6', fontWeight: 600 }}>Estimated Fare</span>
            </div>
            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: '#10b981',
                fontFamily: 'monospace',
                letterSpacing: '-0.02em',
              }}
            >
              Rs. {estimatedFare.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* TRIP SECURITY */}
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
          <ShieldIcon style={{ color: '#2E9EBF', fontSize: 16, marginTop: 2, flexShrink: 0 }} />
          <span>
            Safe ride active. In-app navigation is monitored by NearU control center for passenger and rider security.
          </span>
        </div>

        {/* DEV BUTTON - subtle dotted plate */}
        <button
          onClick={onRiderCompleted}
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
          <span>[Developer Mode] Simulate Rider Complete</span>
          <NextIcon style={{ fontSize: 14 }} />
        </button>
      </motion.div>
    </div>
  );
}