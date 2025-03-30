'use client'

import { Bell } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateNotification } from "../../api/mutations/update-notification";
import { useSession } from "../../hooks/use-session";
import type { TNotification } from "schema";
import { getNotifications } from "../../api/queries/get-notifications";

type Tab = "incoming" | "saved";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("incoming");
  const [notifications, setNotifications] = useState<TNotification[]>([]);
  const { session } = useSession();

  const fetchNotifications = async () => {
    if (!session?.userId) return;
    
    const result = await getNotifications(session.userId, {
      isSaved: activeTab === "saved",
    });
    
    if (result.success && result.notifications) {
      setNotifications(result.notifications);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    if (!session?.userId) return;
    
    await updateNotification({
      id,
      userId: session.userId,
      isRead: true,
    });
    
    fetchNotifications();
  };

  const handleSaveNotification = async (id: number) => {
    if (!session?.userId) return;
    
    await updateNotification({
      id,
      userId: session.userId,
      isSaved: true,
    });
    
    fetchNotifications();
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            fetchNotifications();
          }
        }}
        className="relative p-2 hover:bg-gray-100 rounded-full"
      >
        <Bell className="w-6 h-6" />
        {notifications.some(n => !n.isRead) && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => {
                  setActiveTab("incoming");
                  fetchNotifications();
                }}
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  activeTab === "incoming"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Incoming
              </button>
              <button
                onClick={() => {
                  setActiveTab("saved");
                  fetchNotifications();
                }}
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  activeTab === "saved"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Saved
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 ${
                        !notification.isRead ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-medium">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {notification.message}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          {!notification.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Mark as read
                            </button>
                          )}
                          {activeTab === "incoming" && (
                            <button
                              onClick={() => handleSaveNotification(notification.id)}
                              className="text-xs text-gray-600 hover:text-gray-800"
                            >
                              Save
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 