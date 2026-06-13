import { useState } from 'react';
import { RidesApi } from '../../../api/Ridesapi';
import type { ServiceType } from './Ridestypes';
import { motion } from 'framer-motion';
import {
  CheckCircle as CheckIcon,
  Star as StarIcon,
  Home as HomeIcon,
} from '@mui/icons-material';

interface Props {
  rideId: string;
  serviceType: ServiceType;
  riderName?: string;
  distanceKm: number;
  finalFare: number;
  onDone: () => void;
}

const SERVICE_LABEL: Record<ServiceType, string> = {
  PersonalRide: 'Personal Ride',
  FoodDelivery: 'Food Delivery',
  GroceryPickup: 'Grocery Pickup',
};

export function CompletedScreen({
  rideId,
  serviceType,
  riderName = 'Your rider',
  distanceKm,
  finalFare,
  onDone,
}: Props) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  async function handleRate(n: number) {
    if (submitted) return;
    setRating(n);
    try {
      await RidesApi.rateRide(rideId, n);
    } finally {
      setSubmitted(true);
    }
  }

  const receiptRows = [
    { label: 'Service Type', value: SERVICE_LABEL[serviceType] },
    { label: 'Rider Name', value: riderName },
    { label: 'Distance', value: `${distanceKm.toFixed(2)} km` },
  ];

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4 animate-fadeIn"
      style={{
        background: 'radial-gradient(circle at 50% 50%, #111827 0%, #030712 100%)',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Decorative Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          width: '320px',
          height: '320px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
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
          background: 'radial-gradient(circle, rgba(46, 158, 191, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      {/* POPUP CARD */}
      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        style={{
          width: '100%',
          maxWidth: '500px',
          borderRadius: 28,
          padding: '36px 28px',
          background: 'rgba(17, 17, 17, 0.75)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 30px 90px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          zIndex: 10,
        }}
      >
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h2 style={{ color: 'white', margin: '0 0 6px', fontWeight: 800, fontSize: 22, letterSpacing: '-0.02em' }}>
            Ride Completed
          </h2>
          <p style={{ color: '#9ca3af', margin: 0, fontSize: 13.5, fontWeight: 500 }}>
            Your trip has been saved successfully
          </p>
        </div>

        {/* SUCCESS ICON */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.15 }}
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '2px solid rgba(16, 185, 129, 0.4)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(16, 185, 129, 0.25)',
            }}
          >
            <CheckIcon style={{ fontSize: 36 }} />
          </motion.div>
        </div>

        {/* RECEIPT */}
        <div
          style={{
            borderRadius: 24,
            padding: '20px 20px',
            marginBottom: 28,
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.02)',
          }}
        >
          {receiptRows.map((row) => (
            <div
              key={row.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <span style={{ fontSize: 13.5, color: '#9ca3af', fontWeight: 500 }}>{row.label}</span>
              <span style={{ fontSize: 13.5, color: '#f3f4f6', fontWeight: 700 }}>{row.value}</span>
            </div>
          ))}

          <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', paddingTop: 16 }}>
            <span style={{ fontSize: 14.5, color: '#f3f4f6', fontWeight: 600 }}>Total Paid</span>
            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: '#10b981',
                fontFamily: 'monospace',
                letterSpacing: '-0.02em',
              }}
            >
              Rs. {finalFare.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* RATING */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <p
            style={{
              color: '#d1d5db',
              margin: '0 0 14px',
              fontSize: 13.5,
              fontWeight: 600,
              letterSpacing: '0.01em',
            }}
          >
            Rate your Rider
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <motion.button
                key={n}
                onClick={() => handleRate(n)}
                onMouseEnter={() => !submitted && setHovered(n)}
                onMouseLeave={() => setHovered(0)}
                disabled={submitted}
                whileHover={!submitted ? { scale: 1.25 } : {}}
                whileTap={!submitted ? { scale: 0.9 } : {}}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: submitted ? 'default' : 'pointer',
                  transition: 'color 0.2s ease',
                  color: n <= (hovered || rating) ? '#f59e0b' : 'rgba(255, 255, 255, 0.15)',
                }}
              >
                <StarIcon style={{ fontSize: 32 }} />
              </motion.button>
            ))}
          </div>

          {submitted && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ color: '#10b981', margin: '12px 0 0', fontSize: 13, fontWeight: 600 }}
            >
              Thank you for your feedback!
            </motion.p>
          )}
        </div>

        {/* BUTTON */}
        <motion.button
          whileHover={{ scale: 1.015, boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)' }}
          whileTap={{ scale: 0.985 }}
          onClick={onDone}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 16,
            border: 'none',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            fontWeight: 800,
            fontSize: 15,
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <HomeIcon style={{ fontSize: 18 }} />
          Back to Home
        </motion.button>
      </motion.div>
    </div>
  );
}