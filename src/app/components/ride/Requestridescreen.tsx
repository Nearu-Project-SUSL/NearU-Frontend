import { useState } from 'react';
import type { FareEstimate, ServiceType } from '../../components/ride/Ridestypes';
import { RidesApi } from '../../../api/Ridesapi';

interface Props {
  onRideCreated: (
    rideId: string,
    otpExpiresAt?: string,
    estimatedFare?: number,
    distanceKm?: number,
    serviceType?: ServiceType,
  ) => void;
}

const SERVICES: { type: ServiceType; label: string; icon: string }[] = [
  { type: 'PersonalRide',  label: 'Personal ride',  icon: '🛵' },
  { type: 'FoodDelivery',  label: 'Food delivery',  icon: '🍱' },
  { type: 'GroceryPickup', label: 'Grocery pickup', icon: '🛒' },
];

// Replace with real map picker — these are Sabaragamuwa Uni coords
const PICKUP_LAT  = 6.3793,  PICKUP_LNG  = 80.8558;
const DROPOFF_LAT = 6.3821,  DROPOFF_LNG = 80.8601;

export function RequestRideScreen({ onRideCreated }: Props) {
  const [service,      setService]      = useState<ServiceType>('PersonalRide');
  const [pickupLabel,  setPickupLabel]  = useState('');
  const [dropoffLabel, setDropoffLabel] = useState('');
  const [details,      setDetails]      = useState('');
  const [estimate,     setEstimate]     = useState<FareEstimate | null>(null);
  const [confirmed,    setConfirmed]    = useState(false);
  const [estimating,   setEstimating]   = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState('');

  async function handleEstimate() {
    if (!pickupLabel.trim() || !dropoffLabel.trim()) {
      setError('Please enter both pickup and drop-off locations.');
      return;
    }
    setError('');
    setEstimating(true);
    try {
      const res = await RidesApi.getEstimate(PICKUP_LAT, PICKUP_LNG, DROPOFF_LAT, DROPOFF_LNG);
      setEstimate(res.data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Could not get estimate.');
    } finally {
      setEstimating(false);
    }
  }

  async function handleRequest() {
    if (!estimate || !confirmed) {
      setError('Please get a fare estimate and confirm it first.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await RidesApi.createRequest({
        serviceType: service,
        details: { note: details },
        pickupLatitude:   PICKUP_LAT,
        pickupLongitude:  PICKUP_LNG,
        dropoffLatitude:  DROPOFF_LAT,
        dropoffLongitude: DROPOFF_LNG,
        confirmEstimate: true,
      });
      onRideCreated(
        res.data.rideId,
        res.data.otpExpiresAt,
        res.data.estimatedFare,
        res.data.distanceKm,
        res.data.serviceType,
      );
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create request.');
    } finally {
      setLoading(false);
    }
  }

  return (
    // animate-fadeIn comes from your global CSS keyframes
    <div className="flex flex-col min-h-screen animate-fadeIn"
      style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>

      {/* Topbar */}
      <div className="sticky top-0 z-10 flex items-center px-5 py-3 border-b"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--nearu-border)' }}>
        <span className="text-[17px] font-medium" style={{ color: 'var(--text-primary)' }}>
          Request a ride
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 gap-3.5 px-4 py-[18px] overflow-y-auto">

        {/* ── Service type ── */}
        <div className="rounded-xl p-4 border animate-slideUp"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--nearu-border)' }}>
          <p className="text-[11px] uppercase tracking-widest mb-3"
            style={{ color: 'var(--text-secondary)' }}>
            Service type
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            {SERVICES.map(s => (
              <button
                key={s.type}
                onClick={() => { setService(s.type); setEstimate(null); setConfirmed(false); }}
                className="flex flex-col items-center gap-1.5 rounded-[10px] py-3.5 px-2
                           border transition-all duration-200 cursor-pointer"
                style={{
                  background:   service === s.type ? 'var(--nearu-accent-subtle)' : 'var(--bg-elevated)',
                  borderColor:  service === s.type ? 'var(--nearu-accent)'         : 'var(--nearu-border)',
                }}
              >
                <span className="text-[22px] leading-none">{s.icon}</span>
                <span className="text-[12px]"
                  style={{ color: service === s.type ? 'var(--nearu-accent)' : 'var(--text-secondary)' }}>
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Locations ── */}
        <div className="rounded-xl p-4 border animate-slideUp [animation-delay:50ms]"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--nearu-border)' }}>
          <p className="text-[11px] uppercase tracking-widest mb-3"
            style={{ color: 'var(--text-secondary)' }}>
            Locations
          </p>
          <div className="flex flex-col gap-2.5">

            {/* Pickup */}
            <div>
              <label className="block text-[13px] mb-1.5 font-normal"
                style={{ color: 'var(--text-secondary)' }}>
                Pickup point
              </label>
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: 'var(--text-secondary)' }} />
                <input
                  className="flex-1 rounded-lg px-3 py-2.5 text-[14px] border outline-none
                             transition-colors duration-200
                             focus:border-[var(--nearu-accent)]"
                  style={{
                    background: 'var(--bg-elevated)',
                    borderColor: 'var(--nearu-border)',
                    color: 'var(--text-primary)',
                  }}
                  placeholder="e.g. Faculty of Computing"
                  value={pickupLabel}
                  onChange={e => setPickupLabel(e.target.value)}
                />
              </div>
            </div>

            {/* Drop-off */}
            <div>
              <label className="block text-[13px] mb-1.5 font-normal"
                style={{ color: 'var(--text-secondary)' }}>
                Drop-off point
              </label>
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: 'var(--nearu-accent)' }} />
                <input
                  className="flex-1 rounded-lg px-3 py-2.5 text-[14px] border outline-none
                             transition-colors duration-200
                             focus:border-[var(--nearu-accent)]"
                  style={{
                    background: 'var(--bg-elevated)',
                    borderColor: 'var(--nearu-border)',
                    color: 'var(--text-primary)',
                  }}
                  placeholder="e.g. University canteen"
                  value={dropoffLabel}
                  onChange={e => setDropoffLabel(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Additional details ── */}
        <div className="rounded-xl p-4 border animate-slideUp [animation-delay:100ms]"
          style={{ background: 'var(--bg-surface)', borderColor: 'var(--nearu-border)' }}>
          <p className="text-[11px] uppercase tracking-widest mb-3"
            style={{ color: 'var(--text-secondary)' }}>
            Additional details (optional)
          </p>
          <textarea
            className="w-full rounded-lg px-3 py-2.5 text-[14px] border outline-none
                       resize-none h-[72px] transition-colors duration-200
                       focus:border-[var(--nearu-accent)]"
            style={{
              background: 'var(--bg-elevated)',
              borderColor: 'var(--nearu-border)',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
            }}
            placeholder="Any special instructions for your rider..."
            value={details}
            onChange={e => setDetails(e.target.value)}
          />
        </div>

        {/* ── Fare estimate ── */}
        {estimate && (
          <div className="rounded-xl p-4 border animate-slideDown"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--nearu-border)' }}>
            <p className="text-[11px] uppercase tracking-widest mb-3"
              style={{ color: 'var(--text-secondary)' }}>
              Fare estimate
            </p>

            {[
              { label: 'Distance',     value: `${estimate.distanceKm.toFixed(2)} km` },
              { label: 'Base fare',    value: `Rs. ${estimate.baseFare.toFixed(2)}` },
              { label: 'Rate per km',  value: `Rs. ${estimate.ratePerKm.toFixed(2)}` },
            ].map(row => (
              <div key={row.label}
                className="flex justify-between items-center py-1.5 border-b"
                style={{ borderColor: 'var(--nearu-border)' }}>
                <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>{row.label}</span>
                <span className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>{row.value}</span>
              </div>
            ))}

            <div className="flex justify-between items-center pt-2 mt-1">
              <span className="text-[14px] font-medium" style={{ color: 'var(--text-primary)' }}>
                Total estimate
              </span>
              <span className="text-[20px] font-medium" style={{ color: 'var(--nearu-accent)' }}>
                Rs. {estimate.estimatedFare.toFixed(2)}
              </span>
            </div>

            {/* Confirm checkbox */}
            <div className="flex items-center gap-2 mt-3">
              <input
                type="checkbox"
                id="confirm-est"
                checked={confirmed}
                onChange={e => setConfirmed(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
                style={{ accentColor: 'var(--nearu-accent)' }}
              />
              <label htmlFor="confirm-est"
                className="text-[13px] font-normal cursor-pointer"
                style={{ color: 'var(--text-secondary)' }}>
                I confirm this fare estimate
              </label>
            </div>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="rounded-lg px-3.5 py-2.5 text-[13px] border animate-slideDown"
            style={{
              background: 'rgba(232,76,110,0.12)',
              borderColor: 'rgba(232,76,110,0.25)',
              color: '#e84c6e',
            }}>
            {error}
          </div>
        )}

        {/* ── Get estimate button ── */}
        <button
          onClick={handleEstimate}
          disabled={estimating}
          className="w-full py-3 rounded-[10px] text-[15px] font-medium border
                     transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                     active:scale-[0.98]"
          style={{
            background: 'transparent',
            borderColor: 'var(--nearu-border)',
            color: 'var(--text-primary)',
          }}
        >
          {estimating ? 'Calculating…' : 'Get fare estimate'}
        </button>

        {/* ── Request ride button ── */}
        <button
          onClick={handleRequest}
          disabled={!estimate || !confirmed || loading}
          className="w-full py-3 rounded-[10px] text-[15px] font-medium text-white
                     transition-opacity duration-150 disabled:opacity-50 disabled:cursor-not-allowed
                     active:scale-[0.98]"
          style={{ background: 'var(--nearu-accent)' }}
        >
          {loading ? 'Submitting…' : 'Request ride'}
        </button>

      </div>
    </div>
  );
}