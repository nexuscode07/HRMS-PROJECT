import React from 'react';

// Removed demoNotifications import. Will use API fetch below.
import { Notification } from '../employee/types';

const NotificationsPage: React.FC = () => {
  // Ensure type compatibility for 'type' property
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  React.useEffect(() => {
    fetch('/api/notifications/')
      .then(res => res.json())
      .then(data => setNotifications(data));
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 max-w-4xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <span className="flex w-10 h-10 bg-blue-600 text-white rounded-full items-center justify-center text-2xl">🔔</span>
            Notifications
          </h2>
          <button className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition">Mark all as read</button>
        </div>
        <div className="divide-y divide-gray-100">
          {notifications.length === 0 ? (
            <div className="text-center text-gray-500 py-12 text-lg">No notifications found.</div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-6 py-6 group transition bg-opacity-50 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold shadow ${notification.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {notification.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-lg text-gray-900">{notification.name}</span>
                    <span className="text-xs text-gray-400 ml-4 whitespace-nowrap">{notification.time}</span>
                  </div>
                  <div className="text-base text-gray-700 mt-1 flex items-center gap-2">
                    {notification.type === 'success' && <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>}
                    {notification.type === 'error' && <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>}
                    {notification.message}
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    {notification.action && (
                      <button className="text-sm px-4 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-medium transition">
                        {notification.action}
                      </button>
                    )}
                    {!notification.read && (
                      <span className="inline-block px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">New</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
