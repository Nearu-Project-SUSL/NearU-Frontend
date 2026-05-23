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
      className="flex flex-col min-h-screen animate-fadeIn"
      style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
      {/* ── Topbar ── */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 border-b"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--nearu-border)' }}
      >
        <span className="text-[17px] font-medium" style={{ color: 'var(--text-primary)' }}>
          Rider on the way
        </span>
        <span
          className="text-[12px] font-medium px-2.5 py-1 rounded-full"
          style={{ background: 'var(--nearu-accent-subtle)', color: 'var(--nearu-accent)' }}
        >
          Accepted
        </span>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 gap-3.5 px-4 py-[18px]">

        {/* Map placeholder */}
        <div
          className="relative rounded-xl h-[130px] border overflow-hidden
                     flex items-center justify-center animate-slideUp"
          style={{ background: 'var(--bg-elevated)', borderColor: 'var(--nearu-border)' }}
        >
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(var(--nearu-border) 1px, transparent 1px), linear-gradient(90deg, var(--nearu-border) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
            style={{
              background: 'var(--nearu-accent)',
              boxShadow: '0 0 0 6px var(--nearu-accent-subtle)',
            }}
          />
          <span
            className="relative z-10 text-[12px] mt-9"
            style={{ color: 'var(--text-secondary)' }}
          >
            Rider is approaching your pickup
          </span>
        </div>

        {/* Rider info card */}
        <div
          className="flex items-center gap-3.5 rounded-xl px-4 py-3.5 border
                     animate-slideUp [animation-delay:50ms]"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--nearu-border)' }}
        >
          {/* Avatar */}
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center
                       text-[15px] font-medium flex-shrink-0 border"
            style={{
              background: 'var(--nearu-accent-subtle)',
              borderColor: 'var(--nearu-accent)',
              color: 'var(--nearu-accent)',
            }}
          >
            {initials}
          </div>

          {/* Name + vehicle */}
          <div className="flex-1">
            <div className="text-[15px] font-medium" style={{ color: 'var(--text-primary)' }}>
              {riderName}
            </div>
            {riderVehicle && (
              <div className="text-[12px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                {riderVehicle}
              </div>
            )}
          </div>

          {/* Rating */}
          {riderRating != null && (
            <span className="text-[14px] font-medium" style={{ color: 'var(--nearu-accent)' }}>
              {riderRating.toFixed(1)} ★
            </span>
          )}
        </div>

        {/* OTP card */}
        <div
          className="rounded-xl p-4 border animate-slideUp [animation-delay:100ms]"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--nearu-border)' }}
        >
          {/* Header */}
          <p
            className="text-[11px] uppercase tracking-widest mb-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            Your OTP — show this to your rider
          </p>
          <p className="text-[12px] mb-4" style={{ color: 'var(--text-secondary)' }}>
            Do not share with anyone else
          </p>

          {/* OTP boxes */}
          <div className="flex gap-2.5 justify-center mb-3.5">
            {otpDigits.length === 4
              ? otpDigits.map((d, i) => (
                  <div
                    key={i}
                    className="w-14 h-16 rounded-[10px] flex items-center justify-center
                               text-[26px] font-medium border-2"
                    style={{
                      background: 'var(--bg-elevated)',
                      borderColor: 'var(--nearu-accent)',
                      color: 'var(--nearu-accent)',
                    }}
                  >
                    {d}
                  </div>
                ))
              : [0, 1, 2, 3].map(i => (
                  <div
                    key={i}
                    className="w-14 h-16 rounded-[10px] flex items-center justify-center
                               text-[20px] border-2"
                    style={{
                      background: 'var(--bg-elevated)',
                      borderColor: 'var(--nearu-accent)',
                      color: 'var(--nearu-accent)',
                      letterSpacing: 4,
                    }}
                  >
                    •
                  </div>
                ))}
          </div>


          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="w-full py-2.5 rounded-[8px] text-[13px] font-medium border
                       transition-colors duration-200 active:scale-[0.98]
                       disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'transparent',
              borderColor: 'var(--nearu-border)',
              color: 'var(--text-primary)',
            }}
          >
            {refreshing ? 'Refreshing…' : '↺  Refresh OTP'}
          </button>
        </div>

        {/* Info note */}
        <div
          className="rounded-[10px] px-3.5 py-3 border text-[13px] leading-relaxed
                     animate-slideUp [animation-delay:140ms]"
          style={{
            background: 'var(--bg-surface)',
            borderColor: 'var(--nearu-border)',
            color: 'var(--text-secondary)',
          }}
        >
          The rider will enter this OTP into their app to verify your identity
          and start the ride. Live tracking begins once verified.
        </div>

        {/* Dev shortcut — remove before production */}
        <button
          onClick={onRideStarted}
          className="w-full py-3 rounded-[10px] text-[13px] font-medium border
                     transition-colors duration-200 active:scale-[0.98]"
          style={{
            background: 'transparent',
            borderColor: 'var(--nearu-border)',
            color: 'var(--text-secondary)',
          }}
        >
          [Dev] Simulate ride started →
        </button>

      </div>
    </div>
  );
}