import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { SIDE_MENU_DATA } from '../../../utils/data';
import CharAvatar from '../Cards/CharAvatar';
import LogoutAlert from '../LogoutAlert';

const Sidemenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  const handleClick = (route) => {
    if (route === '/logout') {
      setShowLogoutAlert(true);
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate('/login');
  };

  return (
    <div className="w-64 h-[calc(100vh-57px)] bg-white border-gray-200 border-r px-4 py-6">
      {/* Profile Section */}
      <div className="flex flex-col items-center justify-center gap-3 mb-8">
        {user?.profileImageUrl ? (
          <img
            src={user?.profileImageUrl || ''}
            alt="Profile"
            className="w-20 h-20 bg-slate-400 rounded-full object-cover shadow-md border-2 border-opacity-20 border-white"
          />
        ) : (
          <CharAvatar
            fullName={user?.fullName || "User"}
            width="w-20"
            height="h-20"
            style="text-xl"
          />
        )}

        <h5 className="text-gray-800 font-medium text-lg">
          {user?.fullName || "User"}
        </h5>
      </div>

      {/* Menu Items */}
      <div className="space-y-2">
        {SIDE_MENU_DATA.map((item, index) => (
          <button
            key={index}
            onClick={() => handleClick(item.link)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
              activeMenu === item.link
                ? 'bg-[#9810FA] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <item.icon className="text-xl" />
            <span>{item.name}</span>
          </button>
        ))}
      </div>

      {/* Logout Alert Modal */}
      {showLogoutAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Logout</h3>
              <button
                onClick={() => setShowLogoutAlert(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <LogoutAlert onLogout={handleLogout} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidemenu;