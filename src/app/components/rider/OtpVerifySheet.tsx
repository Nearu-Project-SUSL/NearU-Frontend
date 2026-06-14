/**
 * OtpVerifySheet.tsx
 * Bottom sheet for the rider to enter the student's OTP to start the ride.
 * Uses the `input-otp` package (already in package.json) for the PIN field.
 */
import { useState } from 'react';
import { Drawer } from 'vaul';
import { OTPInput } from 'input-otp';
import { Key as KeyIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface OtpVerifySheetProps {
  onVerify: (otp: string) => void;
  error?: string | null;
  isVerifying?: boolean;
}

const RIDER_ACCENT = '#10b981';
const ACCENT_ALPHA = (a: number) => `rgba(16, 185, 129, ${a})`;
const OTP_LENGTH = 4;

// ─── Slot component for input-otp ──────────────────────────────────────────
function Slot({ slot }: { slot: { char: string | null; isActive: boolean } }) {
  const isActive = slot?.isActive ?? false;
  const char = slot?.char ?? null;

  return (
    <div
      style={{
        width: 60,
        height: 68,
        borderRadius: 16,
        border: isActive
          ? `2px solid ${RIDER_ACCENT}`
          : char
          ? `1px solid ${ACCENT_ALPHA(0.4)}`
          : '1px solid rgba(255,255,255,0.08)',
        background: isActive ? ACCENT_ALPHA(0.08) : 'rgba(255, 255, 255, 0.02)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 28,
        fontWeight: 800,
        color: char ? 'white' : 'rgba(255,255,255,0.2)',
        transition: 'all 0.15s ease',
        boxShadow: isActive ? `0 0 15px ${ACCENT_ALPHA(0.35)}` : 'none',
        fontFamily: 'monospace',
      }}
    >
      {char ?? (isActive ? (
        <span
          style={{
            display: 'inline-block',
            width: 2,
            height: 26,
            background: RIDER_ACCENT,
            animation: 'blink 1s step-end infinite',
          }}
        />
      ) : null)}
    </div>
  );
}

export default function OtpVerifySheet({ onVerify, error, isVerifying = false }: OtpVerifySheetProps) {
  const [otp, setOtp] = useState('');

  const handleComplete = (value: string) => {
    setOtp(value);
    onVerify(value);
  };

  const handleManualSubmit = () => {
    if (otp.length === OTP_LENGTH) onVerify(otp);
  };

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
            border: `1px solid ${ACCENT_ALPHA(0.25)}`,
            borderBottom: 'none',
            outline: 'none',
            padding: '20px 24px 44px',
          }}
        >
          {/* Handle */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <div style={{ width: 44, height: 4, background: 'rgba(255,255,255,0.12)', borderRadius: 2 }} />
          </div>

          {/* Icon + Title */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              width: 56, height: 56,
              background: ACCENT_ALPHA(0.12),
              border: `1px solid ${ACCENT_ALPHA(0.35)}`,
              borderRadius: 16,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
              boxShadow: `0 0 20px ${ACCENT_ALPHA(0.15)}`,
            }}>
              <KeyIcon style={{ color: RIDER_ACCENT, fontSize: 26 }} />
            </div>
            <h2 style={{ color: 'white', margin: '0 0 6px', fontWeight: 800, fontSize: 20, letterSpacing: '-0.01em' }}>
              Enter Passenger OTP
            </h2>
            <p style={{ color: '#9ca3af', margin: 0, fontSize: 13, fontWeight: 500 }}>
              Ask the student for the 4-digit code to start the ride
            </p>
          </div>

          {/* OTP Input */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <OTPInput
              maxLength={OTP_LENGTH}
              value={otp}
              onChange={setOtp}
              onComplete={handleComplete}
              render={({ slots }) => (
                <div style={{ display: 'flex', gap: 12 }}>
                  {slots.map((slot, i) => (
                    <Slot key={i} slot={slot} />
                  ))}
                </div>
              )}
            />
          </div>

          {/* Error message */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 12,
              padding: '12px 14px',
              marginBottom: 20,
              textAlign: 'center',
            }}>
              <p style={{ color: '#ef4444', margin: 0, fontSize: 13, fontWeight: 600 }}>{error}</p>
            </div>
          )}

          {/* Submit button */}
          <motion.button
            whileHover={otp.length === OTP_LENGTH && !isVerifying ? { scale: 1.02, boxShadow: `0 10px 30px ${ACCENT_ALPHA(0.5)}` } : {}}
            whileTap={otp.length === OTP_LENGTH && !isVerifying ? { scale: 0.98 } : {}}
            onClick={handleManualSubmit}
            disabled={otp.length < OTP_LENGTH || isVerifying}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: 16,
              border: 'none',
              background: otp.length < OTP_LENGTH || isVerifying
                ? ACCENT_ALPHA(0.3)
                : `linear-gradient(135deg, ${RIDER_ACCENT}, #059669)`,
              color: 'white',
              fontWeight: 800,
              fontSize: 16,
              cursor: otp.length < OTP_LENGTH || isVerifying ? 'not-allowed' : 'pointer',
              boxShadow: otp.length >= OTP_LENGTH ? `0 4px 20px ${ACCENT_ALPHA(0.35)}` : 'none',
              transition: 'box-shadow 0.25s ease',
            }}
          >
            {isVerifying ? 'Verifying...' : 'Start Ride'}
          </motion.button>

          <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
