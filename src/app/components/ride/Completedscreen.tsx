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
  PersonalRide: 'Personal ride',
  FoodDelivery: 'Food delivery',
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
    { label: 'Service', value: SERVICE_LABEL[serviceType] },
    { label: 'Rider', value: riderName },
    { label: 'Distance', value: `${distanceKm.toFixed(2)} km` },
  ];

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4 animate-fadeIn"
      style={{ background: '#0b0b0b' }}
    >
      {/* POPUP CARD */}
      <div
        className="w-full max-w-lg rounded-3xl px-6 py-6 animate-slideUp"
        style={{
          background: 'rgba(18,18,18,0.96)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* HEADER */}
        <div className="text-center mb-5">
          <div className="text-[18px] font-semibold text-white">
            Ride completed 🎉
          </div>
          <div className="text-[12px] text-white/50 mt-1">
            Trip saved successfully
          </div>
        </div>

        {/* SUCCESS ICON */}
        <div className="flex justify-center mb-5">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-[24px]"
            style={{
              background: 'rgba(99,195,74,0.12)',
              border: '1px solid rgba(99,195,74,0.3)',
              color: '#63c34a',
            }}
          >
            ✓
          </div>
        </div>

        {/* RECEIPT */}
        <div
          className="rounded-2xl p-4 mb-5"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {receiptRows.map((row) => (
            <div
              key={row.label}
              className="flex justify-between py-2 border-b border-white/10"
            >
              <span className="text-[13px] text-white/50">
                {row.label}
              </span>
              <span className="text-[13px] text-white/80">
                {row.value}
              </span>
            </div>
          ))}

          <div className="flex justify-between pt-3">
            <span className="text-[14px] font-medium">
              Total paid
            </span>
            <span className="text-[20px] font-semibold text-green-400">
              Rs. {finalFare.toFixed(2)}
            </span>
          </div>
        </div>

        {/* RATING */}
        <div className="mb-5 text-center">
          <div className="text-[13px] text-white/60 mb-3">
            Rate your rider
          </div>

          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => handleRate(n)}
                onMouseEnter={() => !submitted && setHovered(n)}
                onMouseLeave={() => setHovered(0)}
                disabled={submitted}
                className="text-[26px] transition-transform hover:scale-110"
                style={{
                  color:
                    n <= (hovered || rating)
                      ? '#efab3a'
                      : 'rgba(255,255,255,0.3)',
                }}
              >
                ★
              </button>
            ))}
          </div>

          {submitted && (
            <div className="text-[12px] text-white/50 mt-2">
              Thanks for your feedback
            </div>
          )}
        </div>

        {/* BUTTON */}
        <button
          onClick={onDone}
          className="w-full py-3 rounded-xl font-medium text-black"
          style={{ background: '#63c34a' }}
        >
          Back to home
        </button>
      </div>
    </div>
  );
}