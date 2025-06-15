import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./Sidemenu";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div className="flex justify-between items-center bg-white border-gray-300 border-b shadow-sm px-4 py-3">
      <div className="flex items-center gap-3">
        {/* Menu Button for Mobile View */}
        <button
          className="block lg:hidden text-gray-800 hover:bg-opacity-10 hover:bg-gray-500 p-1 rounded-md transition-colors"
          onClick={() => setOpenSideMenu(!openSideMenu)}
        >
          {openSideMenu ? (
            <HiOutlineX className="text-2xl" />
          ) : (
            <HiOutlineMenu className="text-2xl" />
          )}
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800">
          Expense Tracker
        </h2>
      </div>

      {/* Side Menu - Mobile View */}
      {openSideMenu && (
        <div className="fixed top-[57px] left-0 w-64 h-screen bg-white shadow-xl z-40">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;