import { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, Package, Briefcase, Home as HomeIcon, Tag, Gift, Bike, AlertCircle, Trash2 } from 'lucide-react';

interface Notification {
  id: string;
  type: 'order' | 'job' | 'accommodation' | 'deal' | 'gift' | 'ride' | 'general';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const notificationIcons = {
  order: Package,
  job: Briefcase,
  accommodation: HomeIcon,
  deal: Tag,
  gift: Gift,
  ride: Bike,
  general: AlertCircle,
};

const notificationColors = {
  order: 'from-orange-500 to-red-600',
  job: 'from-blue-500 to-indigo-600',
  accommodation: 'from-purple-500 to-pink-600',
  deal: 'from-green-500 to-emerald-600',
  gift: 'from-yellow-400 to-yellow-600',
  ride: 'from-cyan-500 to-blue-600',
  general: 'from-gray-500 to-gray-700',
};

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'order',
      title: 'Order Delivered',
      message: 'Your food order from Campus Café has been delivered',
      time: '5 min ago',
      read: false,
    },
    {
      id: '2',
      type: 'job',
      title: 'New Job Posted',
      message: 'Part-time Library Assistant position available',
      time: '1 hour ago',
      read: false,
    },
    {
      id: '3',
      type: 'deal',
      title: 'Flash Sale!',
      message: '50% off on all study materials today only',
      time: '2 hours ago',
      read: false,
    },
    {
      id: '4',
      type: 'accommodation',
      title: 'Room Available',
      message: 'New accommodation near campus just listed',
      time: '3 hours ago',
      read: true,
    },
    {
      id: '5',
      type: 'ride',
      title: 'Ride Confirmed',
      message: 'Your tuk ride to campus is confirmed for 8:00 AM',
      time: '5 hours ago',
      read: true,
    },
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-yellow-400/10 hover:bg-yellow-400/20 rounded-xl border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 group"
      >
        <Bell className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition-transform" />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-red-500/50">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-400/30 rounded-2xl shadow-2xl shadow-yellow-400/20 overflow-hidden z-50 animate-slideDown">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-yellow-400/20 bg-black/30">
            <div>
              <h3 className="text-lg font-bold text-yellow-400">Notifications</h3>
              <p className="text-xs text-gray-400">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-yellow-400/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-yellow-400/50" />
                </div>
                <p className="text-gray-400 text-center">No notifications yet</p>
                <p className="text-gray-500 text-sm text-center mt-1">
                  We'll notify you when something arrives
                </p>
              </div>
            ) : (
              <div className="divide-y divide-yellow-400/10">
                {notifications.map((notification) => {
                  const Icon = notificationIcons[notification.type];
                  const colorGradient = notificationColors[notification.type];

                  return (
                    <div
                      key={notification.id}
                      className={`group relative p-4 hover:bg-yellow-400/5 transition-all cursor-pointer ${
                        !notification.read ? 'bg-yellow-400/5' : ''
                      }`}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${colorGradient} flex items-center justify-center shadow-lg`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className={`text-sm font-semibold ${
                              !notification.read ? 'text-yellow-400' : 'text-gray-300'
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0 mt-1 animate-pulse"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{notification.time}</span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!notification.read && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                  className="p-1 hover:bg-yellow-400/10 rounded transition-colors"
                                  title="Mark as read"
                                >
                                  <Check className="w-4 h-4 text-yellow-400" />
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="p-1 hover:bg-red-500/10 rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-yellow-400/20 bg-black/30">
              <button
                onClick={clearAll}
                className="w-full py-2 text-sm text-gray-400 hover:text-red-400 transition-colors"
              >
                Clear All Notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(250, 204, 21, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(250, 204, 21, 0.5);
        }
      `}</style>
    </div>
  );
}
