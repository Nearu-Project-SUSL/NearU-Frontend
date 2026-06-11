import React, { useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { useNotificationStore } from '../../store/notificationStore';

import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  Stack,
  Container,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircleOutline as CheckCircleIcon,
} from '@mui/icons-material';

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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: 'var(--bg-base)',
        color: 'var(--text-primary)',
        animation: 'fadeIn 0.5s ease-out',
      }}
    >
      {/* Topbar */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2.5,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'var(--nearu-border)',
          bgcolor: 'var(--bg-surface)',
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 500, color: 'var(--text-primary)' }}
        >
          Confirm completion
        </Typography>

        <Chip
          label="Awaiting you"
          size="small"
          sx={{
            bgcolor: 'rgba(232,76,110,0.12)',
            color: '#e84c6e',
            fontWeight: 500,
            fontSize: '12px',
          }}
        />
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: 3 }}>
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 400,
            borderRadius: 4,
            p: 3,
            border: '1px solid',
            borderColor: 'var(--nearu-border)',
            textAlign: 'center',
            bgcolor: 'var(--bg-surface)',
            animation: 'slideUp 0.5s ease-out',
          }}
        >
          <Box sx={{ fontSize: 48, mb: 1.5, lineHeight: 1 }}>🏁</Box>

          <Typography
            variant="h6"
            sx={{ fontWeight: 500, mb: 1, color: 'var(--text-primary)' }}
          >
            Did your ride complete?
          </Typography>

          <Typography
            variant="body2"
            sx={{ mb: 3, color: 'var(--text-secondary)', lineHeight: 1.6 }}
          >
            Your rider has marked this trip as complete.
            Please confirm to finalise and archive it.
          </Typography>

          {/* Receipt */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              p: 2,
              mb: 3,
              textAlign: 'left',
              border: '1px solid',
              borderColor: 'var(--nearu-border)',
              bgcolor: 'var(--bg-elevated)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1,
                borderBottom: '1px solid',
                borderColor: 'var(--nearu-border)',
              }}
            >
              <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                Ride ID
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  fontFamily: 'monospace',
                }}
              >
                {rideId.slice(0, 8)}…
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
              <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                Total fare
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: 'var(--nearu-accent)' }}
              >
                Rs. {estimatedFare.toFixed(2)}
              </Typography>
            </Box>
          </Paper>

          {/* Actions */}
          <Stack direction="row" spacing={1.5}>
            <Button
              fullWidth
              variant="outlined"
              onClick={onDenied}
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2.5,
                fontSize: '14px',
                fontWeight: 500,
                color: '#e84c6e',
                borderColor: 'rgba(232,76,110,0.25)',
                bgcolor: 'rgba(232,76,110,0.12)',
                '&:hover': {
                  bgcolor: 'rgba(232,76,110,0.2)',
                  borderColor: 'rgba(232,76,110,0.4)',
                },
                textTransform: 'none',
              }}
            >
              No, still riding
            </Button>

            <Button
              fullWidth
              variant="contained"
              onClick={handleConfirm}
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2.5,
                fontSize: '14px',
                fontWeight: 500,
                color: 'white',
                bgcolor: 'var(--nearu-accent)',
                '&:hover': {
                  bgcolor: 'var(--nearu-accent)',
                  opacity: 0.9,
                },
                textTransform: 'none',
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Yes, completed!'}
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Box>
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
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        bgcolor: 'var(--bg-base)',
      }}
    >
      <Sidebar activeSection="rides" />

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <Navbar />

        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}


// Rides Page

export default function RidesPage() {
  const [screen, setScreen] = useState<RideScreen>('request');

  const [ride, setRide] = useState<ActiveRide | null>(null);


  const addNotification = useNotificationStore((s) => s.addNotification);

  // Connect SignalR once a ride is active

  // HTTP Short Polling for Ride State and Location
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
      (data: { rideId: string; status: string; otp?: string; otpExpiresAt?: string  }) => {
        if (data.rideId !== ride.rideId) return;

        // Push every status change to the notification bell
        const STATUS_BELL: Record<string, { title: string; message: string }> = {
          Accepted:            { title: '🛵 Rider Accepted',            message: 'Your rider is on the way to pick you up.' },
          RiderEnRoute:        { title: '🛵 Rider En Route',            message: 'Your rider is heading to your pickup point.' },
          RiderArrived:        { title: '📍 Rider Arrived!',            message: 'Your rider is waiting at the pickup point.' },
          InProgress:          { title: '🚦 Ride Started',             message: 'You are on your way. Enjoy your ride!' },
          CompletedByRider:    { title: '✅ Trip Done — Confirm?',     message: 'Your rider marked the trip complete. Please confirm.' },
          PendingConfirmation: { title: '⏳ Awaiting Confirmation',    message: 'Please open the app to confirm the trip.' },
          Completed:           { title: '🎉 Ride Completed!',          message: 'Hope you had a great ride! Thank you for using NearU.' },
          Cancelled:           { title: '❌ Ride Cancelled',           message: 'The ride has been cancelled.' },
          Expired:             { title: '⏰ Ride Expired',             message: 'No rider accepted your request. Please try again.' },
        };
        const bellData = STATUS_BELL[data.status];
        if (bellData) {
          addNotification({
            type: 'ride',
            title: bellData.title,
            message: bellData.message,
            route: '/rides',
            rideId: data.rideId,
          });
        }

        switch (data.status) {
          case 'Accepted':
            setRide(r => r ? {
            ...r,
            otp: data.otp,
            otpExpiresAt: data.otpExpiresAt,
          } : r);
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
      } catch (error) {
        console.error('Error polling ride status', error);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ride?.rideId, screen]);

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
            onAccepted={(expiry) => {         
              setRide(r =>
                r ? { ...r, otpExpiresAt: expiry} : r  
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