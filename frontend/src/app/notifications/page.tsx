"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, MessageCircle, UserPlus, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";

interface Notification {
  _id: string;
  type: "message" | "request" | "system";
  content: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id?: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      setNotifications((prev) =>
        prev.map((n) =>
          id ? (n._id === id ? { ...n, isRead: true } : n) : { ...n, isRead: true }
        )
      );
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }

    if (notification.type === "message" && notification.relatedId) {
      router.push(`/chat/${notification.relatedId}`);
    } else if (notification.type === "request") {
      router.push("/requests");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case "request":
        return <UserPlus className="w-5 h-5 text-pink-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Bell className="w-6 h-6 mr-2" />
          Notifications
        </h1>
        {notifications.some((n) => !n.isRead) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAsRead()}
            className="text-xs"
          >
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {notifications.map((notification) => (
              <motion.div
                key={notification._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                onClick={() => handleNotificationClick(notification)}
              >
                <Card
                  className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                    !notification.isRead ? "bg-blue-50/50 border-blue-100" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        !notification.isRead ? "bg-white" : "bg-gray-100"
                      }`}
                    >
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${
                          !notification.isRead ? "font-semibold" : "text-gray-700"
                        }`}
                      >
                        {notification.content}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}{" "}
                        {new Date(notification.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
