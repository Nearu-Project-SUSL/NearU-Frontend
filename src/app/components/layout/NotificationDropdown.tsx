/**
 * NotificationDropdown.tsx  (Premium Redesign)
 *
 * Exports two components:
 *  - <NotificationPanel onClose?>   — the dropdown panel body (no bell button)
 *  - <NotificationDropdown>         — self-contained bell + panel (for pages like Rides.tsx)
 *
 * Both consume the global notificationStore (Zustand).
 *
 * Design Features
 * ────────────────
 * • Glassmorphism panel with multi-layered depth          • Fully mobile-responsive (bottom-sheet on mobile)
 * • Category filter tabs with animated active indicator   • Swipe-friendly touch targets (44px+)
 * • Per-type gradient icon chips + glow accents           • Micro-animation on unread badge
 * • Staggered list entrance animations                    • Smooth slide-up mobile sheet
 * • Premium empty state illustration                      • Rich hover/press states
 * • Accessible ARIA attributes throughout                 • Relative timestamps (30s refresh)
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import {
  Bell, X, Check, CheckCheck,
  Package, Briefcase, Home as HomeIcon,
  Tag, Gift, Bike, AlertCircle, Trash2, ChevronRight, BellOff,
  Sparkles,
} from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import type { AppNotification, NotificationType } from '../../store/notificationStore';

// ─── Design tokens ─────────────────────────────────────────────────────────────
const TYPE_META: Record<
  NotificationType,
  { Icon: React.ElementType; gradient: string; glow: string; accent: string; label: string }
> = {
  ride:          { Icon: Bike,        gradient: 'from-cyan-400 via-sky-500 to-blue-600',       glow: 'rgba(34,211,238,0.35)',   accent: '#22d3ee', label: 'Rides' },
  order:         { Icon: Package,     gradient: 'from-orange-400 via-amber-500 to-red-500',    glow: 'rgba(249,115,22,0.35)',   accent: '#f97316', label: 'Orders' },
  job:           { Icon: Briefcase,   gradient: 'from-violet-500 via-purple-500 to-indigo-600',glow: 'rgba(139,92,246,0.35)',   accent: '#8b5cf6', label: 'Jobs' },
  accommodation: { Icon: HomeIcon,    gradient: 'from-fuchsia-500 via-pink-500 to-rose-500',   glow: 'rgba(217,70,239,0.35)',   accent: '#d946ef', label: 'Stay' },
  deal:          { Icon: Tag,         gradient: 'from-emerald-400 via-green-500 to-teal-600',  glow: 'rgba(52,211,153,0.35)',   accent: '#34d399', label: 'Deals' },
  gift:          { Icon: Gift,        gradient: 'from-yellow-400 via-amber-400 to-orange-500', glow: 'rgba(251,191,36,0.35)',   accent: '#fbbf24', label: 'Gifts' },
  general:       { Icon: AlertCircle, gradient: 'from-slate-500 via-gray-500 to-zinc-600',     glow: 'rgba(100,116,139,0.35)', accent: '#94a3b8', label: 'General' },
};

const ALL_TYPES = Object.keys(TYPE_META) as NotificationType[];

// ─── Relative timestamp ────────────────────────────────────────────────────────
function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60)  return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ─── Single notification row ───────────────────────────────────────────────────
function NotificationRow({
  notif, index, onRead, onDelete, onNavigate,
}: {
  notif: AppNotification;
  index: number;
  onRead:    (id: string) => void;
  onDelete:  (id: string) => void;
  onNavigate:(notif: AppNotification) => void;
}) {
  const meta = TYPE_META[notif.type] ?? TYPE_META.general;
  const { Icon } = meta;
  const [pressing, setPressing] = useState(false);

  return (
    <div
      role="listitem"
      aria-label={notif.title}
      onMouseDown={() => setPressing(true)}
      onMouseUp={() => setPressing(false)}
      onMouseLeave={() => setPressing(false)}
      onTouchStart={() => setPressing(true)}
      onTouchEnd={() => setPressing(false)}
      onClick={() => {
        if (!notif.read) onRead(notif.id);
        if (notif.route) onNavigate(notif);
      }}
      className="notif-row group relative flex gap-3 p-3.5 sm:p-4 cursor-pointer select-none"
      style={{
        animationDelay: `${index * 40}ms`,
        transform: pressing ? 'scale(0.985)' : 'scale(1)',
        transition: 'transform 0.12s ease, background 0.15s ease',
      }}
    >
      {/* Unread left-accent bar */}
      {!notif.read && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] rounded-r-full"
          style={{ background: `linear-gradient(to bottom, ${meta.accent}, transparent)` }}
        />
      )}

      {/* Unread background shimmer */}
      {!notif.read && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(105deg, ${meta.accent}08 0%, transparent 60%)`,
          }}
        />
      )}

      {/* Type icon with glow */}
      <div className="relative flex-shrink-0 mt-0.5">
        <div
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-lg`}
          style={{ boxShadow: `0 4px 16px ${meta.glow}` }}
        >
          <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white drop-shadow-sm" />
        </div>
        {!notif.read && (
          <span
            className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0d0f1a] animate-pulse"
            style={{ background: meta.accent }}
          />
        )}
      </div>

      {/* Text body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <p className={`text-sm font-semibold leading-snug ${notif.read ? 'text-gray-400' : 'text-white'}`}>
            {notif.title}
          </p>
          <span className="text-[10px] text-gray-600 flex-shrink-0 mt-0.5 tabular-nums">
            {timeAgo(notif.createdAt)}
          </span>
        </div>
        <p className="text-[12px] sm:text-xs text-gray-500 leading-relaxed line-clamp-2">
          {notif.message}
        </p>

        {/* Action row */}
        <div className="flex items-center gap-1 mt-2">
          {notif.route && (
            <button
              title="Open"
              onClick={(e) => { e.stopPropagation(); onNavigate(notif); }}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-all"
              style={{
                background: `${meta.accent}18`,
                color: meta.accent,
                border: `1px solid ${meta.accent}30`,
              }}
            >
              View <ChevronRight className="w-2.5 h-2.5" />
            </button>
          )}
          <div className="ml-auto flex items-center gap-0.5">
            {!notif.read && (
              <button
                title="Mark as read"
                onClick={(e) => { e.stopPropagation(); onRead(notif.id); }}
                className="p-2 sm:p-1.5 rounded-xl transition-all active:scale-95"
                style={{ color: meta.accent }}
                onMouseEnter={(e) => (e.currentTarget.style.background = `${meta.accent}18`)}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              title="Delete"
              onClick={(e) => { e.stopPropagation(); onDelete(notif.id); }}
              className="p-2 sm:p-1.5 rounded-xl transition-all active:scale-95 text-gray-600 hover:text-red-400"
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.12)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Category filter pill ──────────────────────────────────────────────────────
function FilterPill({
  type, count, active, onClick,
}: {
  type: NotificationType | 'all';
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  const meta = type !== 'all' ? TYPE_META[type] : null;
  const label = type === 'all' ? 'All' : meta!.label;

  return (
    <button
      onClick={onClick}
      className="relative flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all duration-200 active:scale-95"
      style={active ? {
        background: meta ? `linear-gradient(135deg, ${meta.accent}28, ${meta.accent}14)` : 'rgba(255,255,255,0.12)',
        color: meta ? meta.accent : '#fff',
        border: `1px solid ${meta ? meta.accent + '40' : 'rgba(255,255,255,0.2)'}`,
        boxShadow: meta ? `0 0 12px ${meta.glow}` : 'none',
      } : {
        background: 'rgba(255,255,255,0.04)',
        color: '#64748b',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {label}
      {count > 0 && (
        <span
          className="px-1 min-w-[16px] h-4 flex items-center justify-center rounded-full text-[9px] font-bold"
          style={active ? {
            background: meta ? meta.accent : '#fff',
            color: meta ? '#000' : '#000',
          } : {
            background: 'rgba(255,255,255,0.1)',
            color: '#94a3b8',
          }}
        >
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NotificationPanel — panel body (bell is external / caller-owned)
// ─────────────────────────────────────────────────────────────────────────────
export function NotificationPanel({
  onClose,
  isMobileSheet = false,
}: {
  onClose?: () => void;
  isMobileSheet?: boolean;
}) {
  const [, setTick] = useState(0);
  const [activeFilter, setActiveFilter] = useState<NotificationType | 'all'>('all');
  const navigate = useNavigate();

  const {
    notifications, markAsRead, markAllAsRead,
    deleteNotification, clearAll, unreadCount,
  } = useNotificationStore();

  const unread = unreadCount();

  // Refresh relative timestamps every 30s
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const handleNavigate = useCallback((notif: AppNotification) => {
    if (notif.route) navigate(notif.route);
    onClose?.();
  }, [navigate, onClose]);

  // Derive filter counts
  const filterCounts = ALL_TYPES.reduce((acc, t) => {
    acc[t] = notifications.filter(n => n.type === t).length;
    return acc;
  }, {} as Record<NotificationType, number>);

  const visibleTypes = ALL_TYPES.filter(t => filterCounts[t] > 0);

  const filtered = activeFilter === 'all'
    ? notifications
    : notifications.filter(n => n.type === activeFilter);

  const filteredUnread = filtered.filter(n => !n.read).length;

  return (
    <div
      className={`notif-panel w-full flex flex-col ${isMobileSheet ? 'notif-panel-mobile' : ''}`}
      role="dialog"
      aria-label="Notifications"
      aria-modal="true"
    >
      {/* ── Top grab handle (mobile only) ────────── */}
      <div
        className="sm:hidden flex justify-center pt-3 pb-1 flex-shrink-0 cursor-pointer"
        onClick={onClose}
      >
        <div className="w-10 h-1 rounded-full bg-white/25 hover:bg-white/40 transition-colors" />
      </div>

      {/* ── Header ───────────────────────────────── */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5 border-b border-white/[0.07] flex-shrink-0">
        <div className="flex items-center gap-2.5">
          {/* Bell icon with animated ring */}
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/20 flex items-center justify-center">
              <Bell className="w-4 h-4 text-cyan-400" />
            </div>
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-75" />
            )}
          </div>
          <div>
            <h3 className="text-sm sm:text-[13px] font-bold text-white tracking-tight leading-none">
              Notifications
            </h3>
            <p className="text-[10px] text-gray-600 mt-0.5 leading-none">
              {unread > 0 ? `${unread} unread` : 'All caught up'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {filteredUnread > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-cyan-400 transition-all active:scale-95"
              style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.15)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(34,211,238,0.15)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(34,211,238,0.08)')}
            >
              <CheckCheck className="w-3 h-3" />
              <span className="hidden sm:inline">Mark all read</span>
              <span className="sm:hidden">All read</span>
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close notifications"
              className="p-2 rounded-xl text-gray-500 hover:text-gray-300 transition-all active:scale-95"
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Category filter tabs ──────────────────── */}
      {visibleTypes.length > 1 && (
        <div className="px-4 sm:px-5 py-2.5 border-b border-white/[0.05] flex-shrink-0">
          <div className="flex gap-1.5 overflow-x-auto notif-filter-scroll pb-0.5">
            <FilterPill
              type="all"
              count={notifications.length}
              active={activeFilter === 'all'}
              onClick={() => setActiveFilter('all')}
            />
            {visibleTypes.map(t => (
              <FilterPill
                key={t}
                type={t}
                count={filterCounts[t]}
                active={activeFilter === t}
                onClick={() => setActiveFilter(activeFilter === t ? 'all' : t)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Notification list ─────────────────────── */}
      <div className="flex-1 overflow-y-auto notif-scroll min-h-0 max-h-[55vh] sm:max-h-[400px]" role="list">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 px-6 text-center gap-4">
            {/* Premium empty state */}
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-white/[0.04] to-white/[0.02] border border-white/[0.08] flex items-center justify-center shadow-inner">
                <BellOff className="w-8 h-8 text-gray-700" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-400/20 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-cyan-400" />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-300 mb-1">
                {activeFilter === 'all' ? "You're all caught up!" : `No ${TYPE_META[activeFilter as NotificationType]?.label ?? ''} notifications`}
              </p>
              <p className="text-xs text-gray-600 leading-relaxed max-w-[200px] mx-auto">
                {activeFilter === 'all'
                  ? 'Ride updates, alerts & deals will appear here.'
                  : 'Try switching to a different category.'}
              </p>
            </div>
          </div>
        ) : (
          <div>
            {filtered.map((n, i) => (
              <NotificationRow
                key={n.id}
                notif={n}
                index={i}
                onRead={markAsRead}
                onDelete={deleteNotification}
                onNavigate={handleNavigate}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Footer ───────────────────────────────── */}
      {notifications.length > 0 && (
        <div className="px-4 sm:px-5 py-2.5 border-t border-white/[0.07] flex items-center justify-between flex-shrink-0 bg-white/[0.015]">
          <span className="text-[11px] text-gray-700 font-medium">
            {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 text-[11px] font-medium text-gray-600 hover:text-red-400 transition-colors active:scale-95"
          >
            <Trash2 className="w-3 h-3" />
            Clear all
          </button>
        </div>
      )}

      {/* ── Styles ───────────────────────────────── */}
      <style>{`
        /* Panel container */
        .notif-panel {
          background: linear-gradient(160deg,
            rgba(14,16,28,0.98) 0%,
            rgba(10,12,22,0.99) 100%
          );
          backdrop-filter: blur(32px) saturate(180%);
          -webkit-backdrop-filter: blur(32px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 20px;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04) inset,
            0 32px 80px rgba(0,0,0,0.75),
            0 8px 32px rgba(0,0,0,0.5),
            0 0 60px rgba(34,211,238,0.04);
          overflow: hidden;
        }

        .notif-panel-mobile {
          border-radius: 24px 24px 0 0 !important;
          border-bottom: none !important;
          border-left: none !important;
          border-right: none !important;
          border-top: 1px solid rgba(255,255,255,0.14) !important;
          max-height: 85vh;
          padding-bottom: calc(env(safe-area-inset-bottom, 16px) + 8px);
        }

        /* Notification row */
        .notif-row {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          animation: notifFadeIn 0.3s cubic-bezier(0.16,1,0.3,1) both;
        }
        .notif-row:last-child { border-bottom: none; }
        .notif-row:hover { background: rgba(255,255,255,0.03); }
        .notif-row:active { background: rgba(255,255,255,0.05); }

        /* Entrance animations */
        @keyframes notifFadeIn {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes notifSlideDown {
          from { opacity: 0; transform: translateY(-10px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes notifSlideUp {
          from { opacity: 0; transform: translateY(100%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes notifBackdropFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* Scrollbar */
        .notif-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(34,211,238,0.15) transparent;
          -webkit-overflow-scrolling: touch;
        }
        .notif-scroll::-webkit-scrollbar { width: 3px; }
        .notif-scroll::-webkit-scrollbar-track { background: transparent; }
        .notif-scroll::-webkit-scrollbar-thumb { background: rgba(34,211,238,0.15); border-radius: 3px; }
        .notif-scroll::-webkit-scrollbar-thumb:hover { background: rgba(34,211,238,0.3); }

        /* Filter scroll */
        .notif-filter-scroll {
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .notif-filter-scroll::-webkit-scrollbar { display: none; }

        /* Desktop panel entrance */
        .notif-desktop-enter { animation: notifSlideDown 0.2s cubic-bezier(0.16,1,0.3,1) both; }

        /* Mobile sheet & backdrop entrance */
        .notif-sheet-enter { animation: notifSlideUp 0.3s cubic-bezier(0.16,1,0.3,1) both; }
        .notif-backdrop-enter { animation: notifBackdropFadeIn 0.2s ease-out both; }
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

  // Close on outside click (desktop only — mobile uses full-screen backdrop)
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (window.innerWidth >= 640) {
        if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  // Lock scroll on mobile when open
  useEffect(() => {
    const isMobile = window.innerWidth < 640;
    if (isOpen && isMobile) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={wrapRef}>
      {/* Bell button */}
      <button
        id="page-notification-bell-btn"
        aria-label="Open notifications"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={() => setIsOpen(o => !o)}
        className="relative p-2.5 rounded-xl border transition-all duration-200 group active:scale-95"
        style={isOpen ? {
          background: 'rgba(34,211,238,0.12)',
          border: '1px solid rgba(34,211,238,0.4)',
        } : {
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.09)',
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.background = 'rgba(34,211,238,0.08)';
            e.currentTarget.style.border = '1px solid rgba(34,211,238,0.25)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.border = '1px solid rgba(255,255,255,0.09)';
          }
        }}
      >
        <Bell
          className={`w-5 h-5 transition-all duration-200 group-hover:scale-110 ${
            isOpen ? 'text-cyan-400' : 'text-gray-400 group-hover:text-cyan-400'
          }`}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              boxShadow: '0 0 10px rgba(239,68,68,0.5)',
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <>
          {/* Desktop dropdown */}
          <div
            className="hidden sm:block absolute top-full right-0 mt-2 z-[9999] w-[400px] notif-desktop-enter"
          >
            <NotificationPanel onClose={() => setIsOpen(false)} />
          </div>

          {/* Mobile bottom sheet rendered via Portal into document.body */}
          {typeof document !== 'undefined' && createPortal(
            <div className="sm:hidden fixed inset-0 z-[99999] pointer-events-auto">
              {/* Mobile backdrop */}
              <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm notif-backdrop-enter"
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
              />

              {/* Bottom Sheet */}
              <div
                className="absolute bottom-0 left-0 right-0 z-10 notif-sheet-enter max-h-[85vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <NotificationPanel onClose={() => setIsOpen(false)} isMobileSheet />
              </div>
            </div>,
            document.body
          )}
        </>
      )}
    </div>
  );
}
