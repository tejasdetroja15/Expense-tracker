import React, { useState, useContext } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import SideMenu from "./Sidemenu";
import { ThemeContext } from "../../context/ThemeContext";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <div className={`flex justify-between items-center ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border-b shadow-sm px-4 py-3`}>
      <div className="flex items-center gap-3">
        {/* Menu Button for Mobile View */}
        <button
          className={`block lg:hidden ${darkMode ? 'text-white' : 'text-gray-800'} hover:bg-opacity-10 hover:bg-gray-500 p-1 rounded-md transition-colors`}
          onClick={() => setOpenSideMenu(!openSideMenu)}
        >
          {openSideMenu ? (
            <HiOutlineX className="text-2xl" />
          ) : (
            <HiOutlineMenu className="text-2xl" />
          )}
        </button>

        {/* Title */}
        <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Expense Tracker
        </h2>
      </div>

      {/* Dark Mode Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className={`flex items-center justify-center w-10 h-10 rounded-full ${
          darkMode 
            ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
            : 'bg-gray-100 text-blue-600 hover:bg-gray-200'
        } transition-all duration-300 shadow-md`}
        aria-label="Toggle dark mode"
      >
        {darkMode ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
      </button>

      {/* Side Menu - Mobile View */}
      {openSideMenu && (
        <div className={`fixed top-[57px] left-0 w-64 h-screen ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl z-40`}>
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;