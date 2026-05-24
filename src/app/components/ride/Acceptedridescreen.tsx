import { useState } from 'react';
import { RidesApi } from '../../../api/Ridesapi';

interface Props {
  rideId: string;
  otp?: string;              // pushed via SignalR OtpIssued event after acceptance
  otpExpiresAt?: string;
  riderName?: string;
  riderVehicle?: string;
  riderRating?: number;
  onRideStarted: () => void; // called when SignalR fires InProgress status
}

export function AcceptedRideScreen({
  rideId,
  otp,
  otpExpiresAt,
  riderName = 'Your rider',
  riderVehicle,
  riderRating,
  onRideStarted,
}: Props) {
  const [currentExpiry, setCurrentExpiry] = useState(otpExpiresAt);
  const [refreshing, setRefreshing]       = useState(false);

  const initials = riderName
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // OTP digits — show dots if not yet received via SignalR
  const otpDigits = otp?.split('') ?? [];

  async function handleRefresh() {
    setRefreshing(true);
    try {
      const res = await RidesApi.refreshOtp(rideId);
      // New OTP is delivered to student via SignalR OtpIssued event
      // Update expiry from response so timer resets
      if (res.data.otpExpiresAt) setCurrentExpiry(res.data.otpExpiresAt);
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
        background: '#0b0b0b',
        color: 'var(--text-primary)',
      }}
    >
      {/* TOP STATUS */}
      <div className="absolute top-5 left-0 right-0 flex justify-center">
        <div
          className="px-3 py-1 rounded-full text-[12px] font-medium"
          style={{
            background: 'var(--nearu-accent-subtle)',
            color: 'var(--nearu-accent)',
          }}
        >
          Rider on the way
        </div>
      </div>

      {/* MAIN CARD */}
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
            Your rider is coming
          </h2>
          <p className="text-[12px] text-white/50 mt-1">
            Verify OTP when the rider arrives
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
            className="w-3 h-3 rounded-full mb-3"
            style={{
              background: 'var(--nearu-accent)',
              boxShadow: '0 0 0 8px var(--nearu-accent-subtle)',
            }}
          />

          <span className="text-[13px] text-white/60 text-center">
            Rider is approaching your pickup location
          </span>
        </div>

        {/* RIDER CARD */}
        <div
          className="flex items-center gap-3.5 rounded-2xl px-4 py-3 mb-5 border"
          style={{
            background: 'rgba(255,255,255,0.03)',
            borderColor: 'rgba(255,255,255,0.08)',
          }}
        >
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center font-medium"
            style={{
              background: 'var(--nearu-accent-subtle)',
              border: '1px solid var(--nearu-accent)',
              color: 'var(--nearu-accent)',
            }}
          >
            {initials}
          </div>

          <div className="flex-1">
            <div className="text-[15px] font-medium">
              {riderName}
            </div>
            {riderVehicle && (
              <div className="text-[12px] text-white/50">
                {riderVehicle}
              </div>
            )}
          </div>

          {riderRating != null && (
            <div className="text-[14px] font-medium text-yellow-400">
              {riderRating.toFixed(1)} ★
            </div>
          )}
        </div>

        {/* OTP CARD */}
        <div
          className="rounded-2xl p-5 mb-5 border"
          style={{
            background: 'rgba(255,255,255,0.03)',
            borderColor: 'rgba(255,255,255,0.08)',
          }}
        >
          <div className="text-center mb-4">
            <p className="text-[11px] uppercase tracking-widest text-white/50">
              Your OTP
            </p>
            <p className="text-[12px] text-white/40 mt-1">
              Share only with your rider
            </p>
          </div>

          {/* OTP BOXES */}
          <div className="flex justify-center gap-3 mb-4">
            {otpDigits.length === 4
              ? otpDigits.map((d, i) => (
                  <div
                    key={i}
                    className="w-14 h-16 rounded-xl flex items-center justify-center text-[26px] font-semibold"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--nearu-accent)',
                      color: 'var(--nearu-accent)',
                    }}
                  >
                    {d}
                  </div>
                ))
              : [0, 1, 2, 3].map(i => (
                  <div
                    key={i}
                    className="w-14 h-16 rounded-xl flex items-center justify-center text-[20px]"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.3)',
                    }}
                  >
                    •
                  </div>
                ))}
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="w-full py-2.5 rounded-xl text-[13px] font-medium border"
            style={{
              background: 'transparent',
              borderColor: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)',
            }}
          >
            {refreshing ? 'Refreshing…' : '↺ Refresh OTP'}
          </button>
        </div>

        {/* INFO */}
        <div
          className="rounded-xl px-3.5 py-3 text-[12px] mb-4 border"
          style={{
            background: 'rgba(255,255,255,0.03)',
            borderColor: 'rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          Rider will use this OTP to start your ride. Tracking begins after verification.
        </div>

        {/* DEV BUTTON */}
        <button
          onClick={onRideStarted}
          className="w-full py-3 rounded-xl text-[13px] border"
          style={{
            background: 'transparent',
            borderColor: 'rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          [Dev] Simulate ride started →
        </button>
      </div>
    </div>
  );
}