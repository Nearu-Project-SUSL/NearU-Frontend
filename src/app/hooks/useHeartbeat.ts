/**
 * useHeartbeat.ts
 * Background heartbeat loop — sends rider GPS coords to the backend
 * every `intervalMs` milliseconds while a ride is active.
 * Automatically stops when disabled or on unmount.
 */
import { useEffect, useRef } from 'react';
import riderService from '../../api/riderService';
import type { LocationCoords } from '../../api/riderService';

interface UseHeartbeatOptions {
  rideId: string | null;
  coords: LocationCoords | null;
  /** Whether heartbeats should currently be active. Defaults to false. */
  enabled?: boolean;
  /** Interval in milliseconds between heartbeats. Defaults to 10,000 (10s). */
  intervalMs?: number;
}

export function useHeartbeat({
  rideId,
  coords,
  enabled = false,
  intervalMs = 10_000,
}: UseHeartbeatOptions) {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const coordsRef = useRef<LocationCoords | null>(coords);

  // Keep coordsRef fresh without restarting the interval
  useEffect(() => {
    coordsRef.current = coords;
  }, [coords]);

  useEffect(() => {
    if (!enabled || !rideId) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const sendBeat = async () => {
      if (!coordsRef.current) return;
      try {
        await riderService.sendHeartbeat(rideId, coordsRef.current);
      } catch {
        // Silently fail — heartbeats are best-effort
      }
    };

    // Send immediately on activation, then repeat
    sendBeat();
    timerRef.current = setInterval(sendBeat, intervalMs);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [enabled, rideId, intervalMs]);
}
