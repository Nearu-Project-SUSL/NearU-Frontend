/**
 * useGeolocation.ts
 * Wraps navigator.geolocation.watchPosition() with permission state tracking.
 * Returns the rider's live GPS coordinates.
 */
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import type { LocationCoords } from '../../api/riderService';

type PermissionState = 'prompt' | 'granted' | 'denied' | 'unsupported';

interface GeolocationState {
  coords: LocationCoords | null;
  error: string | null;
  permissionState: PermissionState;
  isTracking: boolean;
}

export function useGeolocation(enabled: boolean = true) {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    error: null,
    permissionState: 'prompt',
    isTracking: false,
  });

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setState((prev) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      if (prev.coords && prev.coords.latitude === lat && prev.coords.longitude === lng) {
        return prev;
      }
      return {
        ...prev,
        coords: {
          latitude: lat,
          longitude: lng,
        },
        error: null,
        permissionState: 'granted',
        isTracking: true,
      };
    });
  }, []);

  const handleError = useCallback((error: GeolocationPositionError) => {
    let message = 'Could not get your location.';
    let permState: PermissionState = 'denied';

    if (error.code === GeolocationPositionError.PERMISSION_DENIED) {
      message = 'Location permission denied. Please enable it in your browser settings to go online.';
      permState = 'denied';
    } else if (error.code === GeolocationPositionError.POSITION_UNAVAILABLE) {
      message = 'Location unavailable. Please check your GPS signal.';
      permState = 'prompt';
    } else if (error.code === GeolocationPositionError.TIMEOUT) {
      message = 'Location request timed out. Retrying...';
      permState = 'prompt';
    }

    toast.error(message, { duration: 5000 });
    setState((prev) => ({
      ...prev,
      error: message,
      permissionState: permState,
      isTracking: false,
    }));
  }, []);

  useEffect(() => {
    if (!enabled) return;

    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        permissionState: 'unsupported',
        error: 'Geolocation is not supported by this browser.',
      }));
      toast.error('Geolocation is not supported by this browser.');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );

    setState((prev) => ({ ...prev, isTracking: true }));

    return () => {
      navigator.geolocation.clearWatch(watchId);
      setState((prev) => ({ ...prev, isTracking: false }));
    };
  }, [enabled, handleSuccess, handleError]);

  return state;
}
