import { useState } from 'react';
import { RidesApi } from '../../../api/Ridesapi';
import type { ServiceType } from './Ridestypes';

interface Props {
  rideId: string;
  serviceType: ServiceType;
  riderName?: string;
  distanceKm: number;
  finalFare: number;
  onDone: () => void;
}

const SERVICE_LABEL: Record<ServiceType, string> = {
  PersonalRide:  'Personal ride',
  FoodDelivery:  'Food delivery',
  GroceryPickup: 'Grocery pickup',
};

export function CompletedScreen({
  rideId,
  serviceType,
  riderName = 'Your rider',
  distanceKm,
  finalFare,
  onDone,
}: Props) {
  const [rating,    setRating]    = useState(0);
  const [hovered,   setHovered]   = useState(0);
  const [submitted, setSubmitted] = useState(false);

  async function handleRate(n: number) {
    if (submitted) return;
    setRating(n);
    try {
      await RidesApi.rateRide(rideId, n);
    } catch {
      // rating failed silently — still mark as submitted
    } finally {
      setSubmitted(true);
    }
  }

  const receiptRows = [
    { label: 'Service',  value: SERVICE_LABEL[serviceType] },
    { label: 'Rider',    value: riderName },
    { label: 'Distance', value: `${distanceKm.toFixed(2)} km` },
  ];

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
          Ride complete
        </span>
        <span
          className="text-[12px] font-medium px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(99,195,74,0.12)', color: '#63c34a' }}
        >
          Completed
        </span>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 gap-3.5 px-4 py-[18px]">

        {/* Success block */}
        <div className="flex flex-col items-center text-center pt-4 pb-2 gap-2.5 animate-slideUp">
          <div
            className="w-[72px] h-[72px] rounded-full flex items-center justify-center
                       text-[28px] border"
            style={{
              background: 'rgba(99,195,74,0.12)',
              borderColor: 'rgba(99,195,74,0.3)',
              color: '#63c34a',
            }}
          >
            ✓
          </div>
          <div className="text-[22px] font-medium" style={{ color: 'var(--text-primary)' }}>
            Ride archived!
          </div>
          <div className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>
            Your trip has been saved to ride history.
          </div>
        </div>

        {/* Receipt */}
        <div
          className="rounded-xl p-4 border animate-slideUp [animation-delay:60ms]"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--nearu-border)' }}
        >
          <p
            className="text-[11px] uppercase tracking-widest mb-3"
            style={{ color: 'var(--text-secondary)' }}
          >
            Trip receipt
          </p>

          {receiptRows.map(row => (
            <div
              key={row.label}
              className="flex justify-between items-center py-1.5 border-b"
              style={{ borderColor: 'var(--nearu-border)' }}
            >
              <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                {row.label}
              </span>
              <span className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
                {row.value}
              </span>
            </div>
          ))}

          {/* Total paid */}
          <div className="flex justify-between items-center pt-2 mt-1">
            <span className="text-[14px] font-medium" style={{ color: 'var(--text-primary)' }}>
              Total paid
            </span>
            <span className="text-[20px] font-medium" style={{ color: 'var(--nearu-accent)' }}>
              Rs. {finalFare.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Star rating */}
        <div
          className="rounded-xl p-4 border animate-slideUp [animation-delay:100ms]"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--nearu-border)' }}
        >
          <p
            className="text-[11px] uppercase tracking-widest mb-3"
            style={{ color: 'var(--text-secondary)' }}
          >
            Rate your rider
          </p>

          <div className="flex gap-2 justify-center py-1">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                onClick={() => handleRate(n)}
                onMouseEnter={() => !submitted && setHovered(n)}
                onMouseLeave={() => setHovered(0)}
                disabled={submitted}
                aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
                className="bg-transparent border-none cursor-pointer leading-none
                           transition-transform duration-100 disabled:cursor-default
                           hover:scale-110 active:scale-95"
                style={{
                  fontSize: 28,
                  color:
                    n <= (hovered || rating)
                      ? 'var(--nearu-accent)'
                      : 'var(--text-secondary)',
                }}
              >
                {n <= (hovered || rating) ? '★' : '☆'}
              </button>
            ))}
          </div>

          {submitted && (
            <p
              className="text-center text-[13px] mt-2.5 animate-fadeIn"
              style={{ color: 'var(--text-secondary)' }}
            >
              Thanks for rating! Your feedback helps the community.
            </p>
          )}
        </div>

        {/* Back to home */}
        <button
          onClick={onDone}
          className="w-full py-3 rounded-[10px] text-[15px] font-medium text-white
                     transition-opacity duration-150 active:scale-[0.98]
                     animate-slideUp [animation-delay:140ms]"
          style={{ background: 'var(--nearu-accent)' }}
        >
          Back to home
        </button>

      </div>
    </div>
  );
}