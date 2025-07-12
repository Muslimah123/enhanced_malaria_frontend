
// File: src/components/Modals/UserProfileModal.js
import React from 'react';
import { X, User, Mail, Shield, ExternalLink, Edit, LogOut } from 'lucide-react';

const UserProfileModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  // Determine role-based styling
  const getRoleBadge = (role) => {
    const roleConfig = {
      'admin': { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: <Shield size={14} className="mr-1.5" /> },
      'doctor': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <User size={14} className="mr-1.5" /> },
      'technician': { color: 'bg-green-100 text-green-800 border-green-200', icon: <User size={14} className="mr-1.5" /> },
      'staff': { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: <User size={14} className="mr-1.5" /> },
    };
    
    const config = roleConfig[role.toLowerCase()] || roleConfig.staff;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.icon}
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">User Profile</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        {/* Profile Content */}
        <div className="p-6">
          {/* Profile Avatar & Name */}
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 rounded-full p-4 mr-4">
              <User size={36} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{user.username}</h3>
              <div className="mt-1">{getRoleBadge(user.role)}</div>
            </div>
          </div>
          
          {/* Profile Details */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email Address</p>
                  <p className="text-gray-800 font-medium">{user.email}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Access Level</p>
                  <p className="text-gray-800 font-medium">{user.role}</p>
                </div>
              </div>
            </div>
            
            {/* Additional user details can be added here */}
            {user.department && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Department</p>
                <p className="text-gray-800 font-medium">{user.department}</p>
              </div>
            )}
            
            {user.lastLogin && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Last Login</p>
                <p className="text-gray-800 font-medium">{new Date(user.lastLogin).toLocaleString()}</p>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button 
              className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              onClick={() => window.location.href = `/profile/settings`}
            >
              <Edit size={16} className="mr-2" />
              Edit Profile
            </button>
            <button 
              className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              onClick={onClose}
            >
              <ExternalLink size={16} className="mr-2" />
              View Details
            </button>
          </div>
          
          <button 
            onClick={onClose}
            className="w-full mt-3 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;