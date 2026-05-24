interface Props {
  riderName?: string;
  riderVehicle?: string;
  estimatedFare: number;
  dropoffLabel?: string;
}

export function InProgressRideScreen({
  riderName    = 'Your rider',
  riderVehicle,
  estimatedFare,
  dropoffLabel = 'Drop-off point',
}: Props) {
  const initials = riderName
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

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
          Ride in progress
        </span>
        <span
          className="text-[12px] font-medium px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(99,195,74,0.12)', color: '#63c34a' }}
        >
          ● In progress
        </span>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 gap-3.5 px-4 py-[18px]">

        {/* Live map placeholder */}
        <div
          className="relative rounded-xl h-[170px] border overflow-hidden
                     flex items-center justify-center animate-slideUp"
          style={{ background: 'var(--bg-elevated)', borderColor: 'var(--nearu-border)' }}
        >
          {/* Grid texture */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(var(--nearu-border) 1px,transparent 1px),' +
                'linear-gradient(90deg,var(--nearu-border) 1px,transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          />
          {/* Moving dot — rider position */}
          <div
            className="absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
            style={{
              background: 'var(--nearu-accent)',
              boxShadow: '0 0 0 6px var(--nearu-accent-subtle)',
            }}
          />
          {/* Destination marker */}
          <div
            className="absolute top-[35%] right-[20%] w-2.5 h-2.5 rounded-full border-2"
            style={{ background: '#63c34a', borderColor: '#fff' }}
          />
          {/* Live badge */}
          <div
            className="absolute top-2.5 right-2.5 text-[11px] font-medium
                       px-2 py-0.5 rounded-md border z-10"
            style={{
              background: 'rgba(99,195,74,0.15)',
              borderColor: 'rgba(99,195,74,0.3)',
              color: '#63c34a',
            }}
          >
            Live tracking
          </div>
          <span
            className="relative z-10 text-[12px] mt-10"
            style={{ color: 'var(--text-secondary)' }}
          >
            Navigating to your drop-off
          </span>
        </div>

        {/* Rider card */}
        <div
          className="flex items-center gap-3.5 rounded-xl px-4 py-3.5 border
                     animate-slideUp [animation-delay:50ms]"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--nearu-border)' }}
        >
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
        </div>

        {/* Trip info */}
        <div
          className="rounded-xl p-4 border animate-slideUp [animation-delay:90ms]"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--nearu-border)' }}
        >
          <div
            className="flex justify-between items-center py-1.5 border-b"
            style={{ borderColor: 'var(--nearu-border)' }}
          >
            <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
              Destination
            </span>
            <span className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
              {dropoffLabel}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-[14px] font-medium" style={{ color: 'var(--text-primary)' }}>
              Estimated fare
            </span>
            <span className="text-[20px] font-medium" style={{ color: 'var(--nearu-accent)' }}>
              Rs. {estimatedFare.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Waiting indicator */}
        <div
          className="flex items-center gap-3 rounded-[10px] px-3.5 py-3.5 border
                     animate-slideUp [animation-delay:120ms]"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--nearu-border)' }}
        >
          {/* Pulsing dot using animate-gradient from your CSS */}
          <div
            className="w-2 h-2 rounded-full flex-shrink-0 animate-gradient"
            style={{ background: 'var(--nearu-accent)' }}
          />
          <span className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>
            Waiting for rider to mark the trip as complete…
          </span>
        </div>

      </div>
    </div>
  );
}