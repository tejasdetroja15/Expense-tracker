import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import Navbar from "./Navbar";
import SideMenu from "./Sidemenu";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar activeMenu={activeMenu} />

      {user && (
        <div className="flex flex-1 w-full">
          <div className="max-[1080px]:hidden w-64">
            <SideMenu activeMenu={activeMenu} />
          </div>

          <div className="flex-1 min-w-0 px-4 sm:px-6 md:px-8 lg:px-16 py-5 overflow-auto bg-gray-50">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;