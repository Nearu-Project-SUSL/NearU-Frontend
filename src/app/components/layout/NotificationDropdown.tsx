/**
 * NotificationDropdown.tsx
 *
 * Exports two components:
 *  - <NotificationPanel onClose?>   — the dropdown panel body (no bell button)
 *  - <NotificationDropdown>         — self-contained bell + panel (for pages like Rides.tsx)
 *
 * Both consume the global notificationStore (Zustand).
 * Receives real-time events from:
 *  - FCM foreground push (via useFcm hook in App-level)
 *  - SignalR hub events (via useRideHub / useStudentRideHub)
 *
 * Features
 * ────────
 * • Live unread badge count                    • Animated slide-down entrance
 * • Mark individual / all as read              • Per-type colour-coded icons
 * • Delete single / clear all                  • Relative timestamps (30 s auto-refresh)
 * • Click-to-navigate deep link                • Accessible empty state
 */

import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Bell, X, Check, CheckCheck,
  Package, Briefcase, Home as HomeIcon,
  Tag, Gift, Bike, AlertCircle, Trash2, ChevronRight, BellOff,
} from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import type { AppNotification, NotificationType } from '../../store/notificationStore';

// ─── Icon + colour meta ───────────────────────────────────────────────────────
const TYPE_META: Record<
  NotificationType,
  { Icon: React.ElementType; gradient: string; accent: string }
> = {
  ride:          { Icon: Bike,        gradient: 'from-cyan-500 to-blue-600',     accent: '#22d3ee' },
  order:         { Icon: Package,     gradient: 'from-orange-500 to-red-600',    accent: '#f97316' },
  job:           { Icon: Briefcase,   gradient: 'from-blue-500 to-indigo-600',   accent: '#6366f1' },
  accommodation: { Icon: HomeIcon,    gradient: 'from-purple-500 to-pink-600',   accent: '#a855f7' },
  deal:          { Icon: Tag,         gradient: 'from-green-500 to-emerald-600', accent: '#22c55e' },
  gift:          { Icon: Gift,        gradient: 'from-yellow-400 to-amber-500',  accent: '#facc15' },
  general:       { Icon: AlertCircle, gradient: 'from-gray-500 to-slate-600',    accent: '#94a3b8' },
};

// ─── Relative timestamp ───────────────────────────────────────────────────────
function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60)  return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ─── Single notification row ──────────────────────────────────────────────────
function NotificationRow({
  notif, onRead, onDelete, onNavigate,
}: {
  notif: AppNotification;
  onRead:    (id: string) => void;
  onDelete:  (id: string) => void;
  onNavigate:(notif: AppNotification) => void;
}) {
  const meta = TYPE_META[notif.type] ?? TYPE_META.general;
  const { Icon } = meta;

  return (
    <div
      onClick={() => {
        if (!notif.read) onRead(notif.id);
        if (notif.route) onNavigate(notif);
      }}
      className={`
        group relative flex gap-3 p-4 cursor-pointer transition-all duration-150
        border-b border-white/5 last:border-0
        hover:bg-white/[0.04]
        ${!notif.read ? 'bg-gradient-to-r from-cyan-500/5 to-transparent' : ''}
      `}
    >
      {/* Unread accent bar */}
      {!notif.read && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-10 rounded-r-full"
          style={{ background: meta.accent }}
        />
      )}

      {/* Type icon */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-md`}>
        <Icon className="w-5 h-5 text-white" />
      </div>

      {/* Text body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <p className={`text-sm font-semibold leading-snug truncate ${notif.read ? 'text-gray-300' : 'text-white'}`}>
            {notif.title}
          </p>
          {!notif.read && (
            <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1 animate-pulse" style={{ background: meta.accent }} />
          )}
        </div>
        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-1.5">
          {notif.message}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gray-600">{timeAgo(notif.createdAt)}</span>
          <div className="flex gap-2 sm:gap-0.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            {!notif.read && (
              <button title="Mark as read" onClick={(e) => { e.stopPropagation(); onRead(notif.id); }}
                className="p-2 sm:p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <Check className="w-4 h-4 sm:w-3.5 sm:h-3.5" style={{ color: meta.accent }} />
              </button>
            )}
            {notif.route && (
              <button title="Open" onClick={(e) => { e.stopPropagation(); onNavigate(notif); }}
                className="p-2 sm:p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <ChevronRight className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-gray-400" />
              </button>
            )}
            <button title="Delete" onClick={(e) => { e.stopPropagation(); onDelete(notif.id); }}
              className="p-2 sm:p-1.5 rounded-lg hover:bg-red-500/20 transition-colors">
              <Trash2 className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NotificationPanel — just the panel body (bell is external / caller-owned)
// ─────────────────────────────────────────────────────────────────────────────
export function NotificationPanel({ onClose }: { onClose?: () => void }) {
  const [, setTick] = useState(0);
  const navigate = useNavigate();

  const {
    notifications, markAsRead, markAllAsRead,
    deleteNotification, clearAll, unreadCount,
  } = useNotificationStore();

  const unread = unreadCount();

  // Tick every 30 s to refresh relative timestamps
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const handleNavigate = (notif: AppNotification) => {
    if (notif.route) navigate(notif.route);
    onClose?.();
  };

  return (
    <div
      className="w-full max-w-md sm:w-[380px] bg-[#0d0d0d]/97 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/70 overflow-hidden flex flex-col"
      style={{ animation: 'notifSlideDown 0.18s cubic-bezier(0.16,1,0.3,1) both' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">Notifications</h3>
          {unread > 0 && (
            <span className="px-1.5 py-0.5 bg-cyan-500/15 text-cyan-400 text-[10px] font-bold rounded-full border border-cyan-400/20">
              {unread} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unread > 0 && (
            <button onClick={markAllAsRead}
              className="flex items-center gap-1 px-2 py-1 text-[11px] text-cyan-400 hover:text-white hover:bg-cyan-500/15 rounded-lg transition-all">
              <CheckCheck className="w-3 h-3" /> All read
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-3.5 h-3.5 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Notification list */}
      <div className="max-h-[60vh] sm:max-h-[420px] overflow-y-auto notif-scroll flex-1">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-3">
            <div className="w-16 h-16 bg-white/[0.04] rounded-2xl flex items-center justify-center border border-white/[0.06]">
              <BellOff className="w-7 h-7 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-400 mb-1">You're all caught up!</p>
              <p className="text-xs text-gray-600">Ride updates, alerts, and deals will appear here.</p>
            </div>
          </div>
        ) : (
          notifications.map((n) => (
            <NotificationRow
              key={n.id}
              notif={n}
              onRead={markAsRead}
              onDelete={deleteNotification}
              onNavigate={handleNavigate}
            />
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-2.5 border-t border-white/[0.07] flex items-center justify-between bg-white/[0.02]">
          <span className="text-[11px] text-gray-600">
            {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          </span>
          <button onClick={clearAll}
            className="text-[11px] text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1">
            <Trash2 className="w-3 h-3" /> Clear all
          </button>
        </div>
      )}

      <style>{`
        @keyframes notifSlideDown {
          from { opacity:0; transform:translateY(-6px) scale(0.98); }
          to   { opacity:1; transform:translateY(0)    scale(1);    }
        }
        .notif-scroll { scrollbar-width: thin; scrollbar-color: rgba(34,211,238,.18) transparent; }
        .notif-scroll::-webkit-scrollbar { width: 3px; }
        .notif-scroll::-webkit-scrollbar-track { background: transparent; }
        .notif-scroll::-webkit-scrollbar-thumb { background: rgba(34,211,238,.18); border-radius:2px; }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NotificationDropdown — self-contained bell + panel
// Used by pages that render their own header (e.g. Rides.tsx)
// ─────────────────────────────────────────────────────────────────────────────
export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const unreadCount = useNotificationStore((s) => s.unreadCount());

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  return (
    <div className="relative" ref={wrapRef}>
      <button
        id="page-notification-bell-btn"
        aria-label="Open notifications"
        onClick={() => setIsOpen((o) => !o)}
        className={`
          relative p-2.5 rounded-xl border transition-all duration-200 group
          ${isOpen
            ? 'bg-cyan-400/15 border-cyan-400/50'
            : 'bg-white/5 border-white/10 hover:bg-cyan-400/10 hover:border-cyan-400/30'
          }
        `}
      >
        <Bell className={`w-5 h-5 transition-all group-hover:scale-110 ${isOpen ? 'text-cyan-400' : 'text-gray-400 group-hover:text-cyan-400'}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-gradient-to-br from-red-500 to-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/40 animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] sm:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-x-4 bottom-4 top-auto sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 z-[9999] flex justify-center sm:justify-start animate-slideUp">
            <NotificationPanel onClose={() => setIsOpen(false)} />
          </div>
        </>
      )}
    </div>
  );
}
