interface Props {
  riderName?: string;
  riderVehicle?: string;
  estimatedFare: number;
  dropoffLabel?: string;
  onRiderCompleted:()=> void;
}

export function InProgressRideScreen({
  riderName    = 'Your rider',
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
        background: '#0b0b0b',
        color: 'var(--text-primary)',
      }}
    >
      {/* TOP STATUS */}
      <div className="absolute top-5 left-0 right-0 flex justify-center">
        <div
          className="px-3 py-1 rounded-full text-[12px] font-medium"
          style={{
            background: 'rgba(99,195,74,0.12)',
            color: '#63c34a',
          }}
        >
          ● Ride in progress
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
            Your trip is ongoing
          </h2>
          <p className="text-[12px] text-white/50 mt-1">
            Live tracking active
          </p>
        </div>

        {/* LIVE STATUS CARD (replaces map box) */}
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
            Navigating to your destination
          </span>
        </div>

        {/* RIDER CARD */}
        <div
          className="flex items-center gap-3.5 rounded-2xl px-4 py-3 mb-5"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
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
        </div>

        {/* TRIP INFO */}
        <div
          className="rounded-2xl p-4 mb-5"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="flex justify-between py-2 border-b border-white/10">
            <span className="text-[13px] text-white/50">
              Destination
            </span>
            <span className="text-[13px] text-white/80 font-medium">
              {dropoffLabel}
            </span>
          </div>

          <div className="flex justify-between pt-3">
            <span className="text-[14px] font-medium">
              Estimated fare
            </span>
            <span className="text-[20px] font-semibold text-green-400">
              Rs. {estimatedFare.toFixed(2)}
            </span>
          </div>
        </div>

        {/* LIVE STATUS */}
        <div
          className="rounded-xl px-3.5 py-3 text-[13px] mb-4"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.55)',
          }}
        >
          Waiting for rider to complete the trip…
        </div>

        {/* DEV ONLY — remove before production */}
        {/* In production this screen changes automatically via SignalR when rider presses complete */}
        <button
          onClick={onRiderCompleted}
          className="w-full py-3 rounded-[10px] text-[13px] font-medium border
                    active:scale-[0.98] transition-all"
          style={{
            background:  'rgba(99,195,74,0.08)',
            borderColor: 'rgba(99,195,74,0.2)',
            color:       '#63c34a',
          }}>
          [Dev] Simulate rider completed →
        </button>

      </div>
    </div>
  );
}