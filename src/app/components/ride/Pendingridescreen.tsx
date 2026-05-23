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
      className="flex flex-col min-h-screen animate-fadeIn"
      style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
      {/* ── Topbar ── */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 border-b"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--nearu-border)' }}
      >
        <span className="text-[17px] font-medium" style={{ color: 'var(--text-primary)' }}>
          Finding a rider
        </span>
        <span
          className="text-[12px] font-medium px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(239,171,58,0.12)', color: '#efab3a' }}
        >
          Pending
        </span>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 gap-3.5 px-4 py-[18px]">

        {/* Map placeholder */}
        <div
          className="relative rounded-xl h-[140px] border overflow-hidden
                     flex items-center justify-center animate-slideUp"
          style={{ background: 'var(--bg-elevated)', borderColor: 'var(--nearu-border)' }}
        >
          {/* Grid texture */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(var(--nearu-border) 1px, transparent 1px), linear-gradient(90deg, var(--nearu-border) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          />
          {/* Pulse dot */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                       w-3 h-3 rounded-full"
            style={{
              background: 'var(--nearu-accent)',
              boxShadow: '0 0 0 8px var(--nearu-accent-subtle)',
            }}
          />
          {/* Label */}
          <span
            className="relative z-10 text-[13px] mt-9"
            style={{ color: 'var(--text-secondary)' }}
          >
            Searching nearby riders{dots}
          </span>
        </div>

        {/* Progress steps */}
        <div
          className="rounded-xl p-4 border animate-slideUp [animation-delay:60ms]"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--nearu-border)' }}
        >
          <p
            className="text-[11px] uppercase tracking-widest mb-3"
            style={{ color: 'var(--text-secondary)' }}
          >
            Ride progress
          </p>

          <div className="flex flex-col">
            {STEPS.map((step, i) => (
              <div key={i}>
                <div className="flex gap-3.5 items-start py-2">

                  {/* Dot */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-content
                               text-[13px] font-medium flex-shrink-0 border"
                    style={
                      step.state === 'done'
                        ? { background: 'rgba(99,195,74,0.15)', color: '#63c34a', borderColor: 'rgba(99,195,74,0.3)' }
                        : step.state === 'active'
                        ? { background: 'var(--nearu-accent-subtle)', color: 'var(--nearu-accent)', borderColor: 'var(--nearu-accent)' }
                        : { background: 'var(--bg-elevated)', color: 'var(--text-secondary)', borderColor: 'var(--nearu-border)' }
                    }
                  >
                    <span className="m-auto">{step.state === 'done' ? '✓' : i + 1}</span>
                  </div>

                  {/* Text */}
                  <div className="flex-1 pt-0.5">
                    <div
                      className="text-[14px] font-medium"
                      style={{
                        color:
                          step.state === 'active'
                            ? 'var(--nearu-accent)'
                            : step.state === 'done'
                            ? 'var(--text-primary)'
                            : 'var(--text-secondary)',
                      }}
                    >
                      {step.label}
                    </div>
                    <div className="text-[12px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                      {step.sub}
                    </div>
                  </div>

                </div>

                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div
                    className="w-px h-4 ml-[13px]"
                    style={{ background: 'var(--nearu-border)' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Ride ID info */}
        <div
          className="rounded-[10px] px-3.5 py-3 border text-[13px] animate-slideUp [animation-delay:100ms]"
          style={{
            background: 'var(--bg-surface)',
            borderColor: 'var(--nearu-border)',
            color: 'var(--text-secondary)',
          }}
        >
          Ride ID:{' '}
          <span style={{ color: 'var(--nearu-accent)', fontFamily: 'monospace' }}>
            {rideId.slice(0, 8)}…
          </span>
        </div>

        {/* Cancel button */}
        <button
          onClick={handleCancel}
          disabled={cancelling}
          className="w-full py-3 rounded-[10px] text-[15px] font-medium border
                     transition-opacity duration-150 active:scale-[0.98]
                     disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: 'rgba(232,76,110,0.12)',
            borderColor: 'rgba(232,76,110,0.25)',
            color: '#e84c6e',
          }}
        >
          {cancelling ? 'Cancelling…' : 'Cancel request'}
        </button>

      </div>
    </div>
  );
}