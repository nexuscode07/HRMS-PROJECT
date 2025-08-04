import { useState, useEffect } from 'react';
import { Notification } from '../employee/types';
// Removed demoNotifications import. Will use API fetch below.

const NotificationsPage  = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  useEffect(() => {
    fetch('/api/notifications/')
      .then(res => res.json())
      .then(data => setNotifications(data));
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">All Notifications</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No notifications found.</div>
        ) : (
          notifications.map((notification, idx) => (
            <div key={notification.id || idx} className="flex items-start space-x-4 p-4 hover:bg-gray-50 transition">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {notification.type === 'success' ? '✓' : '!'}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{notification.message}</p>
                  <span className="text-xs text-gray-400 ml-2">{new Date(notification.timestamp).toLocaleString()}</span>
                </div>
                <div className="mt-1 text-xs text-gray-500">{notification.read ? 'Read' : 'Unread'}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
