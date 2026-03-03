import { useState, useEffect } from "react";
import { Bell, X, Check, Info, AlertCircle, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

interface Notification {
  id: string;
  type: "success" | "info" | "warning" | "update";
  title: string;
  message: string;
  time: string;
  read: boolean;
  created_at?: string;
}

export function Notifications() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Add viewport meta tag to prevent zooming
  useEffect(() => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "viewport";
      meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
      document.head.appendChild(meta);
    }
  }, []);

  // Fetch notifications from Supabase
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .eq("read", false) // Only fetch unread notifications
        .order("created_at", { ascending: false });

      if (error) {
        // If table doesn't exist, silently use mock data (no error logging)
        if (error.code === "PGRST205" || error.code === "42P01") {
          setNotifications(getMockNotifications());
          setLoading(false);
          return;
        }
        // Only log unexpected errors
        console.error("Error fetching notifications:", error);
        setNotifications(getMockNotifications());
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        const formattedNotifications = data.map((notif) => ({
          id: notif.id,
          type: notif.type as "success" | "info" | "warning" | "update",
          title: notif.title,
          message: notif.message,
          time: getTimeAgo(notif.created_at),
          read: notif.read,
          created_at: notif.created_at,
        }));
        setNotifications(formattedNotifications);
      } else {
        // No unread notifications - set empty array
        setNotifications([]);
      }
      setLoading(false);
    } catch (error) {
      // Silently use mock data on any error
      setNotifications(getMockNotifications());
      setLoading(false);
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return `${Math.floor(seconds / 604800)} weeks ago`;
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id: string) => {
    // If it's a mock notification, just update local state
    if (id.startsWith("mock-")) {
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      return;
    }

    try {
      // Update in Supabase
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", id);

      if (error && error.code !== "PGRST205" && error.code !== "42P01") {
        console.error("Error marking notification as read:", error);
        return;
      }

      // Update local state
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      // Silently fail for mock data
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    // For mock notifications, also save to localStorage
    const mockNotificationIds = notifications
      .filter(n => n.id.startsWith("mock-"))
      .map(n => n.id);
    
    if (mockNotificationIds.length > 0) {
      const readNotifications = JSON.parse(localStorage.getItem("readNotifications") || "[]");
      const updatedReadNotifications = [...new Set([...readNotifications, ...mockNotificationIds])];
      localStorage.setItem("readNotifications", JSON.stringify(updatedReadNotifications));
      
      // Filter out read mock notifications
      setNotifications([]);
      return;
    }

    // Update local state first
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    // Try to update in Supabase (silently fail if table doesn't exist)
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user.id)
        .eq("read", false);

      // Silently ignore table not found errors
      if (error && error.code !== "PGRST205" && error.code !== "42P01") {
        console.error("Error marking all as read:", error);
      }
      
      // After marking all as read, clear the notifications list since we only show unread
      setNotifications([]);
    } catch (error) {
      // Silently fail for mock data
      setNotifications([]);
    }
  };

  const deleteNotification = async (id: string) => {
    // If it's a mock notification, just update local state
    if (id.startsWith("mock-")) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      return;
    }

    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id);

      if (error && error.code !== "PGRST205" && error.code !== "42P01") {
        console.error("Error deleting notification:", error);
        return;
      }

      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      // Silently fail for mock data
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <Check className="w-5 h-5 text-green-400" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-400" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case "update":
        return <TrendingUp className="w-5 h-5 text-pink-400" />;
      default:
        return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  const getMockNotifications = (): Notification[] => {
    // Check localStorage for read notifications
    const readNotifications = JSON.parse(localStorage.getItem("readNotifications") || "[]");
    
    const allMockNotifications = [
      {
        id: "mock-1",
        type: "success" as const,
        title: "Welcome to ZYNX CAPITAL!",
        message: "Your account has been successfully created. Start your trading journey today!",
        time: "Just now",
        read: false,
      },
      {
        id: "mock-2",
        type: "info" as const,
        title: "Complete Your Profile",
        message: "Add your trading experience and preferences to get personalized recommendations.",
        time: "5 min ago",
        read: false,
      },
      {
        id: "mock-3",
        type: "update" as const,
        title: "New Challenge Available",
        message: "$100K funding challenge is now available. Apply now to get funded!",
        time: "2 hours ago",
        read: false,
      },
    ];
    
    // Filter out notifications that have been marked as read
    return allMockNotifications.filter(notif => !readNotifications.includes(notif.id));
  };

  return (
    <div className="relative z-[60]">
      {/* Bell Icon Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.div>
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[100]"
            />

            {/* Dropdown Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed sm:absolute mt-2 left-1/2 -translate-x-1/2 w-[90vw] sm:w-80 max-w-sm bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800 z-[101] overflow-hidden"
            >
              {/* Header */}
              <div className="p-3 sm:p-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-white">
                    Notifications
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-400">
                    {unreadCount} unread
                  </p>
                </div>
                {unreadCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={markAllAsRead}
                    className="text-[10px] sm:text-xs text-pink-400 hover:text-pink-300 font-medium whitespace-nowrap px-2 py-1"
                  >
                    Mark all read
                  </motion.button>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-[60vh] sm:max-h-[70vh] overflow-y-auto">
                {loading ? (
                  <div className="p-6 sm:p-8 text-center">
                    <Bell className="w-8 h-8 sm:w-12 sm:h-12 text-slate-700 mx-auto mb-2 sm:mb-3" />
                    <p className="text-xs sm:text-sm text-slate-400">Loading notifications...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-6 sm:p-8 text-center">
                    <Bell className="w-8 h-8 sm:w-12 sm:h-12 text-slate-700 mx-auto mb-2 sm:mb-3" />
                    <p className="text-xs sm:text-sm text-slate-400">No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-3 sm:p-4 hover:bg-slate-800/50 transition-colors ${
                          !notification.read ? "bg-slate-800/30" : ""
                        }`}
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          {/* Icon */}
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
                              {getIcon(notification.type)}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4
                                className={`text-xs sm:text-sm font-medium leading-tight ${
                                  !notification.read
                                    ? "text-white"
                                    : "text-slate-300"
                                }`}
                              >
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <span className="flex-shrink-0 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-500 rounded-full mt-1" />
                              )}
                            </div>
                            <p className="text-[11px] sm:text-sm text-slate-400 mt-0.5 sm:mt-1 leading-snug">
                              {notification.message}
                            </p>
                            <p className="text-[10px] sm:text-xs text-slate-500 mt-1 sm:mt-2">
                              {notification.time}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                            {!notification.read && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 sm:p-1.5 text-slate-400 hover:text-pink-400 transition-colors"
                                title="Mark as read"
                              >
                                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </motion.button>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 sm:p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                              title="Delete"
                            >
                              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}