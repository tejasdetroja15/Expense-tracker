import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { ThemeContext } from "../../context/ThemeContext";
import Navbar from "./Navbar";
import SideMenu from "./Sidemenu";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar activeMenu={activeMenu} />

      {user && (
        <div className="flex flex-1 w-full">
          <div className="max-[1080px]:hidden w-64">
            <SideMenu activeMenu={activeMenu} />
          </div>

          <div className={`flex-1 p-5 overflow-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;