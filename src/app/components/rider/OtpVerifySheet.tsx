/**
 * OtpVerifySheet.tsx
 * Bottom sheet for the rider to enter the student's OTP to start the ride.
 * Uses the `input-otp` package (already in package.json) for the PIN field.
 */
import { useState } from 'react';
import { Drawer } from 'vaul';
import { OTPInput, OTPInputContext } from 'input-otp';
import { useContext } from 'react';
import { Key as KeyIcon } from '@mui/icons-material';

interface OtpVerifySheetProps {
  onVerify: (otp: string) => void;
  error?: string | null;
  isVerifying?: boolean;
}

const RIDER_ACCENT = '#10b981';
const ACCENT_ALPHA = (a: number) => `rgba(16, 185, 129, ${a})`;
const OTP_LENGTH = 4;

// ─── Slot component for input-otp ──────────────────────────────────────────
function Slot({ index }: { index: number }) {
  const { slots } = useContext(OTPInputContext);
  const slot = slots[index];
  const isActive = slot?.isActive ?? false;
  const char = slot?.char ?? null;

  return (
    <div
      style={{
        width: 60,
        height: 68,
        borderRadius: 14,
        border: isActive
          ? `2px solid ${RIDER_ACCENT}`
          : char
          ? `1px solid ${ACCENT_ALPHA(0.5)}`
          : '1px solid #333',
        background: isActive ? ACCENT_ALPHA(0.08) : '#1e1e1e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 28,
        fontWeight: 700,
        color: char ? 'white' : '#444',
        transition: 'all 0.15s ease',
        boxShadow: isActive ? `0 0 0 3px ${ACCENT_ALPHA(0.15)}` : 'none',
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
            background: '#161616',
            border: `1px solid ${ACCENT_ALPHA(0.3)}`,
            borderBottom: 'none',
            outline: 'none',
            padding: '20px 24px 40px',
          }}
        >
          {/* Handle */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <div style={{ width: 40, height: 4, background: '#333', borderRadius: 2 }} />
          </div>

          {/* Icon + Title */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              width: 56, height: 56,
              background: ACCENT_ALPHA(0.12),
              border: `1px solid ${ACCENT_ALPHA(0.3)}`,
              borderRadius: 16,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}>
              <KeyIcon style={{ color: RIDER_ACCENT, fontSize: 28 }} />
            </div>
            <h2 style={{ color: 'white', margin: '0 0 6px', fontWeight: 700, fontSize: 20 }}>
              Enter Passenger OTP
            </h2>
            <p style={{ color: '#9ca3af', margin: 0, fontSize: 14 }}>
              Ask the student for the 4-digit code to start the ride
            </p>
          </div>

          {/* OTP Input */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <OTPInput
              maxLength={OTP_LENGTH}
              value={otp}
              onChange={setOtp}
              onComplete={handleComplete}
              render={({ slots }) => (
                <div style={{ display: 'flex', gap: 12 }}>
                  {slots.map((_, i) => (
                    <Slot key={i} index={i} />
                  ))}
                </div>
              )}
            />
          </div>

          {/* Error message */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 10,
              padding: '10px 14px',
              marginBottom: 16,
              textAlign: 'center',
            }}>
              <p style={{ color: '#ef4444', margin: 0, fontSize: 13, fontWeight: 500 }}>{error}</p>
            </div>
          )}

          {/* Submit button */}
          <button
            onClick={handleManualSubmit}
            disabled={otp.length < OTP_LENGTH || isVerifying}
            style={{
              width: '100%',
              padding: '15px',
              borderRadius: 16,
              border: 'none',
              background: otp.length < OTP_LENGTH || isVerifying
                ? ACCENT_ALPHA(0.3)
                : `linear-gradient(135deg, ${RIDER_ACCENT}, #059669)`,
              color: 'white',
              fontWeight: 700,
              fontSize: 16,
              cursor: otp.length < OTP_LENGTH || isVerifying ? 'not-allowed' : 'pointer',
              boxShadow: otp.length >= OTP_LENGTH ? `0 4px 20px ${ACCENT_ALPHA(0.4)}` : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            {isVerifying ? 'Verifying...' : 'Start Ride →'}
          </button>

          <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
