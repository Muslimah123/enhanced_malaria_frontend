
// // File: src/components/Dashboard/Header.js               
import React, { useState, useEffect } from 'react';
import { Bell, User, ChevronDown } from 'lucide-react';
import { getNotifications, markNotificationRead } from '../../services/api';

const Header = ({ user, setIsProfileModalOpen, handleLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isNotificationsRead, setIsNotificationsRead] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      const unreadNotifications = data.filter(notification => !notification.read);
      setNotifications(unreadNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNotificationsClick = async () => {
    setShowNotifications(!showNotifications);

    if (!isNotificationsRead) {
      // Mark all unread notifications as read without clearing them from display
      const unreadNotifications = notifications.filter(notification => !notification.read);

      for (const notification of unreadNotifications) {
        await markNotificationRead(notification.id);
      }

      // Set state to indicate notifications have been marked as read
      setIsNotificationsRead(true);
    }
  };

  // Close the notifications dropdown and clear notifications
  const closeNotifications = () => {
    setShowNotifications(false);
    setNotifications([]); // Clear notifications only when dropdown is closed
    setIsNotificationsRead(false); // Reset the read status
  };

  return (
    <header className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <input 
            type="text" 
            placeholder="Search..." 
            className="border rounded-full py-2 px-4 w-64"
          />
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell 
              className="text-gray-600 cursor-pointer" 
              onClick={handleNotificationsClick}
            />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {notifications.length}
              </span>
            )}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <div 
                      key={index} 
                      className={`px-4 py-2 text-sm ${notification.read ? 'text-gray-500' : 'text-gray-700'} hover:bg-gray-100`}
                    >
                      {notification.message}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">No new notifications</div>
                )}
                <button 
                  onClick={closeNotifications} 
                  className="w-full text-center text-sm text-blue-500 hover:text-blue-700 py-2"
                >
                  Close
                </button>
              </div>
            )}
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 text-gray-600 focus:outline-none"
            >
              <User className="text-gray-600" />
              <span>{user?.username}</span>
              <ChevronDown size={16} />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <a 
                  href="#" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                  onClick={() => {
                    setIsProfileModalOpen(true);
                    setIsDropdownOpen(false);
                  }}
                >
                  Profile
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                <a 
                  href="#" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                  onClick={() => {
                    handleLogout();
                    setIsDropdownOpen(false);
                  }}
                >
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
