import { useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';

import type {
  RideScreen,
  ServiceType,
} from '../../components/ride/Ridestypes';

import { RequestRideScreen } from '../../components/ride/Requestridescreen';
import { PendingRideScreen } from '../../components/ride/Pendingridescreen';
import { AcceptedRideScreen } from '../../components/ride/Acceptedridescreen';
import { InProgressRideScreen } from '../../components/ride/Inprogressridescreen';
import { CompletedScreen } from '../../components/ride/Completedscreen';
import { RidesApi } from '../../../api/Ridesapi';

import Navbar from "../../components/layout/Navbar";
import { Sidebar } from "../../components/layout/Sidebar";


// Confirm complete screen

interface ConfirmProps {
  rideId: string;
  estimatedFare: number;
  onConfirmed: () => void;
  onDenied: () => void;
}

function ConfirmCompleteScreen({
  rideId,
  estimatedFare,
  onConfirmed,
  onDenied,
}: ConfirmProps) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);

    try {
      await RidesApi.studentConfirm(rideId);
    } catch {
      // proceed anyway
    } finally {
      onConfirmed();
    }
  }

  return (
    <div
      className="flex flex-col h-full animate-fadeIn"
      style={{
        background: 'var(--bg-base)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Topbar */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 border-b"
        style={{
          background: 'var(--bg-surface)',
          borderColor: 'var(--nearu-border)',
        }}
      >
        <span
          className="text-[17px] font-medium"
          style={{ color: 'var(--text-primary)' }}
        >
          Confirm completion
        </span>

        <span
          className="text-[12px] font-medium px-2.5 py-1 rounded-full"
          style={{
            background: 'rgba(232,76,110,0.12)',
            color: '#e84c6e',
          }}
        >
          Awaiting you
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-6">
        <div
          className="w-full max-w-md rounded-2xl p-6 border text-center animate-slideUp"
          style={{
            background: 'var(--bg-surface)',
            borderColor: 'var(--nearu-border)',
          }}
        >
          <div className="text-[48px] mb-3 leading-none">🏁</div>

          <h3
            className="text-[20px] font-medium mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Did your ride complete?
          </h3>

          <p
            className="text-[14px] leading-relaxed mb-5"
            style={{ color: 'var(--text-secondary)' }}
          >
            Your rider has marked this trip as complete.
            Please confirm to finalise and archive it.
          </p>

          {/* Receipt */}
          <div
            className="rounded-xl p-3.5 mb-5 text-left border"
            style={{
              background: 'var(--bg-elevated)',
              borderColor: 'var(--nearu-border)',
            }}
          >
            <div
              className="flex justify-between items-center py-1.5 border-b"
              style={{ borderColor: 'var(--nearu-border)' }}
            >
              <span
                className="text-[13px]"
                style={{ color: 'var(--text-secondary)' }}
              >
                Ride ID
              </span>

              <span
                className="text-[12px] font-medium"
                style={{
                  color: 'var(--text-primary)',
                  fontFamily: 'monospace',
                }}
              >
                {rideId.slice(0, 8)}…
              </span>
            </div>

            <div className="flex justify-between items-center pt-1.5">
              <span
                className="text-[13px]"
                style={{ color: 'var(--text-secondary)' }}
              >
                Total fare
              </span>

              <span
                className="text-[18px] font-medium"
                style={{ color: 'var(--nearu-accent)' }}
              >
                Rs. {estimatedFare.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5">
            <button
              onClick={onDenied}
              disabled={loading}
              className="flex-1 py-3 rounded-[10px] text-[14px] font-medium border
                         transition-opacity duration-150 active:scale-[0.98]
                         disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'rgba(232,76,110,0.12)',
                borderColor: 'rgba(232,76,110,0.25)',
                color: '#e84c6e',
              }}
            >
              No, still riding
            </button>

            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 py-3 rounded-[10px] text-[14px] font-medium text-white
                         transition-opacity duration-150 active:scale-[0.98]
                         disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'var(--nearu-accent)' }}
            >
              {loading ? 'Confirming…' : 'Yes, completed!'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// Shared ride state

interface ActiveRide {
  rideId: string;
  otpExpiresAt?: string;
  estimatedFare?: number;
  distanceKm?: number;
  serviceType?: ServiceType;
  otp?: string;
  riderName?: string;
  riderVehicle?: string;
  riderRating?: number;
  dropoffLabel?: string;
  latitude?: number;
  longitude?: number;
  distanceToPickupKm?: number;
}


// Layout wrapper

function RideLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--bg-base)',
      }}
    >
      <Sidebar activeSection="rides" />

      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <Navbar />

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}


// Rides Page

export default function RidesPage() {
  const [screen, setScreen] = useState<RideScreen>('request');

  const [ride, setRide] = useState<ActiveRide | null>(null);

  const hubRef = useRef<signalR.HubConnection | null>(null);

  // Connect SignalR once a ride is active

  useEffect(() => {
    if (!ride?.rideId) return;

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.nearusab.me/api';
    const hubBaseUrl = baseUrl.replace(/\/api\/?$/, '');
    const hubUrl = `${hubBaseUrl}/hubs/rides`;

    const conn = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () =>
          localStorage.getItem('auth_accessToken') ?? '',
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    hubRef.current = conn;

    // Ride state changes

    conn.on(
      'RideStateChanged',
      (data: { rideId: string; status: string }) => {
        if (data.rideId !== ride.rideId) return;

        switch (data.status) {
          case 'Accepted':
            setScreen('accepted');
            break;

          case 'Arrived':
            break;

          case 'InProgress':
            setScreen('in-progress');
            break;

          case 'CompletedByRider':
            setScreen('confirm-complete');
            break;

          case 'Completed':
            setScreen('completed');
            break;

          case 'Cancelled':
          case 'Expired':
          case 'OTPLocked':
            reset();
            break;
        }
      }
    );

    // OTP issued

    conn.on(
      'OtpIssued',
      (data: {
        rideId: string;
        otp: string;
        otpExpiresAt: string;
        riderName?: string;
        riderVehicle?: string;
        riderRating?: number;
      }) => {
        if (data.rideId !== ride.rideId) return;

        setRide(r =>
          r
            ? {
                ...r,
                otp: data.otp,
                otpExpiresAt: data.otpExpiresAt,
                riderName: data.riderName,
                riderVehicle: data.riderVehicle,
                riderRating: data.riderRating,
              }
            : r
        );
      }
    );
    
    // Live location updates
    
    conn.on(
      'LocationUpdated',
      (data: {
        rideId: string;
        latitude: number;
        longitude: number;
        distanceToPickupKm?: number;
      }) => {
        if (data.rideId !== ride.rideId) return;
        
        setRide(r =>
          r
            ? {
                ...r,
                latitude: data.latitude,
                longitude: data.longitude,
                distanceToPickupKm: data.distanceToPickupKm,
              }
            : r
        );
      }
    );

    conn.start().catch(console.error);

    return () => {
      conn.stop();
      hubRef.current = null;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ride?.rideId]);

  function reset() {
    setRide(null);
    setScreen('request');

    hubRef.current?.stop();
  }

  function handleRideCreated(
    rideId: string,
    otpExpiresAt?: string,
    estimatedFare?: number,
    distanceKm?: number,
    serviceType?: ServiceType,
  ) {
    setRide({
      rideId,
      otpExpiresAt,
      estimatedFare,
      distanceKm,
      serviceType,
    });

    setScreen('pending');
  }

  switch (screen) {
    case 'request':
      return (
        <RideLayout>
          <RequestRideScreen
            onRideCreated={handleRideCreated}
          />
        </RideLayout>
      );

    case 'pending':
      return (
        <RideLayout>
          <PendingRideScreen
            rideId={ride!.rideId}
            onAccepted={expiry => {
              setRide(r =>
                r ? { ...r, otpExpiresAt: expiry } : r
              );

              setScreen('accepted');
            }}
            onCancel={reset}
          />
        </RideLayout>
      );

    case 'accepted':
      return (
        <RideLayout>
          <AcceptedRideScreen
            rideId={ride!.rideId}
            otp={ride?.otp}
            otpExpiresAt={ride?.otpExpiresAt}
            riderName={ride?.riderName}
            riderVehicle={ride?.riderVehicle}
            riderRating={ride?.riderRating}
            distanceToPickupKm={ride?.distanceToPickupKm}
            onRideStarted={() => setScreen('in-progress')}
          />
        </RideLayout>
      );

    case 'in-progress':
      return <InProgressRideScreen
        riderName={ride?.riderName}
        riderVehicle={ride?.riderVehicle}
        estimatedFare={ride?.estimatedFare ?? 0}
        dropoffLabel={ride?.dropoffLabel}
        onRiderCompleted={() => setScreen('confirm-complete')}  // add this
      />;

    case 'confirm-complete':
      return (
        <RideLayout>
          <ConfirmCompleteScreen
            rideId={ride!.rideId}
            estimatedFare={ride?.estimatedFare ?? 0}
            onConfirmed={() => setScreen('completed')}
            onDenied={() => setScreen('in-progress')}
          />
        </RideLayout>
      );

    case 'completed':
      return (
        <RideLayout>
          <CompletedScreen
            rideId={ride!.rideId}
            serviceType={ride?.serviceType ?? 'PersonalRide'}
            riderName={ride?.riderName}
            distanceKm={ride?.distanceKm ?? 0}
            finalFare={ride?.estimatedFare ?? 0}
            onDone={reset}
          />
        </RideLayout>
      );

    default:
      return null;
  }
}