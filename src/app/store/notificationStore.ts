/**
 * notificationStore.ts
 *
 * Global Zustand store for the in-app notification centre.
 *
 * Notifications arrive from two channels:
 *  1. Firebase Cloud Messaging (FCM) — foreground push messages
 *  2. SignalR hub — RideStateChanged, NewRideAvailable events
 *
 * The store persists to localStorage so the notification history
 * survives page refreshes (capped at 50 most recent items).
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NotificationType =
  | 'ride'
  | 'order'
  | 'job'
  | 'accommodation'
  | 'deal'
  | 'gift'
  | 'general';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  /** ISO-8601 timestamp */
  createdAt: string;
  read: boolean;
  /** Optional deep-link route, e.g. "/rides" */
  route?: string;
  /** Optional rideId for ride-related notifications */
  rideId?: string;
}

interface NotificationState {
  notifications: AppNotification[];
  /** Push a new notification to the top of the list (max 50) */
  addNotification: (n: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  /** Total number of unread notifications */
  unreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],

      addNotification: (n) =>
        set((state) => {
          const newNotif: AppNotification = {
            ...n,
            id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            createdAt: new Date().toISOString(),
            read: false,
          };
          // Prepend and cap at 50 entries
          const updated = [newNotif, ...state.notifications].slice(0, 50);
          return { notifications: updated };
        }),

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      deleteNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      clearAll: () => set({ notifications: [] }),

      unreadCount: () => get().notifications.filter((n) => !n.read).length,
    }),
    {
      name: 'nearu-notifications', // localStorage key
      // Only persist the notifications array, not computed functions
      partialize: (state) => ({ notifications: state.notifications }),
    }
  )
);
