import { useEffect, useState } from 'react';
import { RidesApi } from '../../../api/Ridesapi';

interface Props {
  rideId: string;
  onAccepted: (otpExpiresAt?: string) => void;
  onCancel: () => void;
}

const STEPS = [
  {
    label: 'Request submitted',
    sub: 'Broadcasted to nearby riders',
    state: 'done',
  },
  {
    label: 'Rider accepts',
    sub: 'Waiting for a rider to pick up your request',
    state: 'active',
  },
  {
    label: 'Rider verifies OTP',
    sub: 'You will receive an OTP once accepted',
    state: 'pending',
  },
  {
    label: 'Ride in progress',
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

  // Placeholder poll — SignalR will push the real status change in production
  useEffect(() => {
    const id = setInterval(() => {
      console.log('[Rides] polling status for', rideId);
    }, 5000);
    return () => clearInterval(id);
  }, [rideId]);

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

  return (
    <div
      className="flex flex-col min-h-screen items-center justify-center p-4 animate-fadeIn"
      style={{
        background: '#0b0b0b',
        color: 'var(--text-primary)',
      }}
    >
      {/* TOP STATUS BADGE */}
      <div className="absolute top-5 left-0 right-0 flex justify-center">
        <div
          className="px-3 py-1 rounded-full text-[12px] font-medium"
          style={{
            background: 'rgba(239,171,58,0.12)',
            color: '#efab3a',
          }}
        >
          Finding a rider{dots}
        </div>
      </div>

      {/* MAIN POPUP */}
      <div
        className="w-full max-w-xl rounded-3xl px-6 py-6 animate-slideUp"
        style={{
          background: 'rgba(18,18,18,0.96)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
        }}
      >

        {/* TITLE */}
        <div className="text-center mb-5">
          <h2 className="text-[18px] font-semibold">
            Waiting for a rider
          </h2>
          <p className="text-[12px] text-white/50 mt-1">
            We’re matching you with the nearest available rider
          </p>
        </div>

        {/* STATUS CARD (replaces map box) */}
        <div
          className="rounded-2xl p-5 mb-5 flex flex-col items-center justify-center"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div
            className="w-3 h-3 rounded-full mb-3 animate-pulse"
            style={{ background: 'var(--nearu-accent)' }}
          />

          <span className="text-[13px] text-white/60 text-center">
            Searching nearby riders{dots}
          </span>
        </div>

        {/* PROGRESS STEPS */}
        <div className="rounded-2xl p-4 border mb-5"
          style={{
            background: 'rgba(255,255,255,0.03)',
            borderColor: 'rgba(255,255,255,0.08)',
          }}
        >
          <p className="text-[11px] uppercase tracking-widest mb-3 text-white/50">
            Ride progress
          </p>

          <div className="flex flex-col gap-3">
            {STEPS.map((step, i) => (
              <div key={i} className="flex gap-3 items-start">

                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] border"
                  style={
                    step.state === 'done'
                      ? { background: 'rgba(99,195,74,0.15)', color: '#63c34a', borderColor: 'rgba(99,195,74,0.3)' }
                      : step.state === 'active'
                      ? { background: 'rgba(46,158,191,0.15)', color: '#2e9ebf', borderColor: '#2e9ebf' }
                      : { background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.4)', borderColor: 'rgba(255,255,255,0.08)' }
                  }
                >
                  {step.state === 'done' ? '✓' : i + 1}
                </div>

                <div>
                  <div className="text-[14px] font-medium">
                    {step.label}
                  </div>
                  <div className="text-[12px] text-white/50">
                    {step.sub}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* RIDER ID */}
        <div
          className="rounded-xl px-3 py-2 text-[12px] mb-4"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          Ride ID:{" "}
          <span style={{ color: 'var(--nearu-accent)', fontFamily: 'monospace' }}>
            {rideId.slice(0, 8)}…
          </span>
        </div>

        {/* ACTIONS */}
        <button
          onClick={handleCancel}
          disabled={cancelling}
          className="w-full py-3 rounded-xl text-[14px] font-medium transition"
          style={{
            background: 'rgba(232,76,110,0.12)',
            border: '1px solid rgba(232,76,110,0.25)',
            color: '#e84c6e',
          }}
        >
          {cancelling ? 'Cancelling…' : 'Cancel request'}
        </button>

        {/* DEV ONLY — remove before production */}
        <button
          onClick={() => onAccepted(new Date(Date.now() + 10 * 60 * 1000).toISOString())}
          className="w-full py-3 rounded-[10px] text-[13px] font-medium border active:scale-[0.98]"
          style={{ background: 'transparent', borderColor: 'var(--nearu-border)', color: 'var(--text-secondary)' }}
        >
          [Dev] Simulate rider accepted →
        </button>

      </div>
    </div>

  );
}