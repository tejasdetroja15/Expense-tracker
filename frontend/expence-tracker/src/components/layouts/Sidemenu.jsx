import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { ThemeContext } from '../../context/ThemeContext';
import { SIDE_MENU_DATA } from '../../../utils/data';
import CharAvatar from '../Cards/CharAvatar';

const Sidemenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === '/logout') {
      handleLogout();
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
    <div className={`w-64 h-[calc(100vh-57px)] ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } border-r px-4 py-6`}>
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

        <h5 className={`${darkMode ? 'text-white' : 'text-gray-800'} font-medium text-lg`}>
          {user?.fullName || "User"}
        </h5>
      </div>

      {/* Menu Items */}
      <div className="space-y-2">
        {SIDE_MENU_DATA.map((item, index) => (
          <button
            key={`menu_${index}`}
            className={`w-full flex items-center gap-4 text-[15px] py-3 px-5 rounded-lg transition-all duration-200 ${
              activeMenu === item.name
                ? "text-white bg-primary shadow-md"
                : darkMode 
                  ? "text-gray-300 hover:bg-gray-700" 
                  : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => handleClick(item.link)}
          >
            <item.icon className="text-xl" />
            <span>{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidemenu;