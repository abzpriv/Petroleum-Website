"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // For client-side navigation
import { toast, ToastContainer } from "react-toastify"; // Toastify
import "react-toastify/dist/ReactToastify.css"; // Toastify styles

import {
  MdDashboard,
  MdAssignment,
  MdBusiness,
  MdInventory,
  MdExitToApp,
  MdInfo,
  MdHistory,
  MdStorage,
  MdMenu,
  MdClose, // Add hamburger menu icon for mobile
} from "react-icons/md"; // Using Material Design Icons

import DashboardAdmin from "./DashboardAdmin";
import PetrolPumpAllOrders from "./PetrolPumpAllOrders";
import InventoryDashboard from "./InventoryDashboard";
import InventeryInfo from "./InventeryInfo";
import InvenetryAgency from "./InvenetryAgency";
import AgencyHistoryInventory from "./AgencyHistoryInventory";
import OrdersComponent from "./OrdersComponent";

const MenuBar: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string>("home");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false); // State for mobile menu toggle
  const router = useRouter(); // For redirecting

  // UseEffect to check logged-in status, only after component is mounted on the client
  useEffect(() => {
    if (typeof document !== "undefined") {
      const isLoggedIn = document.cookie.includes("isLoggedIn=true");
      if (!isLoggedIn) {
        router.push("/login"); // Redirect to login if not logged in
      }
    }
  }, [router]);

  // Handle Logout
  const handleLogout = () => {
    if (typeof document !== "undefined") {
      document.cookie =
        "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      toast.success("You are logged out!");

      setTimeout(() => {
        router.push("/"); // Redirect after logging out
      }, 2000);
    }
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "home":
        return <DashboardAdmin />;
      case "agency-orders":
        return <OrdersComponent />;
      case "petrol-orders":
        return <PetrolPumpAllOrders />;
      case "inventory":
        return <InventoryDashboard />;
      case "info":
        return <InventeryInfo />;
      case "agency-inventory":
        return <InvenetryAgency />;
      case "agency-inventory-history":
        return <AgencyHistoryInventory />;
      case "logout":
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800 w-full min-h-screen p-4 flex">
      {/* Mobile Menu Toggle at the top */}
      <div className="lg:hidden flex items-center justify-start fixed top-4 left-4 z-50">
        {!menuOpen && (
          <MdMenu
            className="text-white text-3xl cursor-pointer"
            onClick={() => setMenuOpen(true)}
          />
        )}
      </div>
      <div
        className={`lg:hidden fixed top-4 left-14 z-50 ${
          menuOpen ? "block" : "hidden"
        }`}
      >
        <MdClose
          className="text-white text-4xl cursor-pointer bg-black p-2 rounded-full"
          onClick={() => setMenuOpen(false)} // Close the mobile menu
        />
      </div>

      {/* Sidebar Menu for Desktop */}
      <div
        className={`lg:flex lg:flex-col lg:space-y-10 fixed left-0 top-1/2 transform -translate-y-1/2 ${
          menuOpen ? "block" : "hidden"
        } lg:h-auto lg:bg-transparent p-4 rounded-lg transition-all w-64 z-40`}
      >
        {/* Items aligned left center on the desktop */}
        <div className="flex flex-col items-start space-y-4 lg:space-y-10">
          <div
            className="relative group"
            onClick={() => setActiveComponent("home")}
          >
            <MdDashboard className="text-white text-4xl cursor-pointer hover:text-gray-200 transition-all" />
            <span className="absolute left-full ml-2 opacity-0 group-hover:opacity-100 text-white bg-gray-800 text-xs rounded-md px-2 py-1 transition-all">
              Home
            </span>
          </div>

          <div
            className="relative group"
            onClick={() => setActiveComponent("agency-orders")}
          >
            <MdAssignment className="text-white text-4xl cursor-pointer hover:text-gray-200 transition-all" />
            <span className="absolute left-full ml-2 opacity-0 group-hover:opacity-100 text-white bg-gray-800 text-xs rounded-md px-2 py-1 transition-all">
              Agency Orders
            </span>
          </div>

          <div
            className="relative group"
            onClick={() => setActiveComponent("petrol-orders")}
          >
            <MdBusiness className="text-white text-4xl cursor-pointer hover:text-gray-200 transition-all" />
            <span className="absolute ml-2 opacity-0 group-hover:opacity-100 text-white bg-gray-800 text-xs rounded-md px-2 py-1 transition-all">
              Petrol Orders
            </span>
          </div>

          <div
            className="relative group"
            onClick={() => setActiveComponent("inventory")}
          >
            <MdInventory className="text-white text-4xl cursor-pointer hover:text-gray-200 transition-all" />
            <span className="absolute left-full ml-2 opacity-0 group-hover:opacity-100 text-white bg-gray-800 text-xs rounded-md px-2 py-1 transition-all">
              Petrol Pump Inventory
            </span>
          </div>
          <div
            className="relative group"
            onClick={() => setActiveComponent("info")}
          >
            <MdInfo className="text-white text-3xl cursor-pointer hover:text-gray-200 transition-all" />
            <span className="absolute left-full ml-2 opacity-0 group-hover:opacity-100 text-white bg-gray-800 text-xs rounded-md px-2 py-1 transition-all">
              Petrol Pump Inventory History
            </span>
          </div>

          <div
            className="relative group"
            onClick={() => setActiveComponent("agency-inventory")}
          >
            <MdStorage className="text-white text-4xl cursor-pointer hover:text-gray-200 transition-all" />
            <span className="absolute left-full ml-2 opacity-0 group-hover:opacity-100 text-white bg-gray-800 text-xs rounded-md px-2 py-1 transition-all">
              Agency Inventory
            </span>
          </div>

          <div
            className="relative group"
            onClick={() => setActiveComponent("agency-inventory-history")}
          >
            <MdHistory className="text-white text-4xl cursor-pointer hover:text-gray-200 transition-all" />
            <span className="absolute left-full ml-2 opacity-0 group-hover:opacity-100 text-white bg-gray-800 text-xs rounded-md px-2 py-1 transition-all">
              Agency Inventory History
            </span>
          </div>

          <div className="relative group" onClick={handleLogout}>
            <MdExitToApp className="text-white text-3xl cursor-pointer hover:text-gray-200 transition-all" />
            <span className="absolute left-full ml-2 opacity-0 group-hover:opacity-100 text-white bg-gray-800 text-xs rounded-md px-2 py-1 transition-all">
              Logout
            </span>
          </div>
        </div>
      </div>

      {/* Separate Mobile Menu with Full Height Background */}
      <div
        className={`lg:hidden fixed left-0 top-0 ${
          menuOpen ? "block backdrop-blur-sm" : "hidden"
        } bg-gray-700 h-full p-4 z-40`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          {" "}
          {/* Center vertically */}
          <div
            className="relative group"
            onClick={() => setActiveComponent("home")}
          >
            <MdDashboard className="text-white text-4xl cursor-pointer hover:text-gray-200 transition-all" />
            <span className="absolute left-full ml-2 opacity-0 group-hover:opacity-100 text-white bg-gray-800 text-xs rounded-md px-2 py-1 transition-all">
              Home
            </span>
          </div>
          <div
            className="relative group"
            onClick={() => setActiveComponent("agency-orders")}
          >
            <MdAssignment className="text-white text-4xl cursor-pointer hover:text-gray-200 transition-all" />
            <span className="absolute left-full ml-2 opacity-0 group-hover:opacity-100 text-white bg-gray-800 text-xs rounded-md px-2 py-1 transition-all">
              Agency Orders
            </span>
          </div>
          <div
            className="relative group"
            onClick={() => setActiveComponent("petrol-orders")}
          >
            <MdBusiness className="text-white text-4xl cursor-pointer hover:text-gray-200 transition-all" />
            <span className="absolute left-full ml-2 opacity-0 group-hover:opacity-100 text-white bg-gray-800 text-xs rounded-md px-2 py-1 transition-all">
              Petrol Orders
            </span>
          </div>
          <div
            className="relative group"
            onClick={() => setActiveComponent("inventory")}
          >
            <MdInventory className="text-white text-4xl cursor-pointer hover:text-gray-200 transition-all" />
            <span className="absolute left-full ml-2 opacity-0 group-hover:opacity-100 text-white bg-gray-800 text-xs rounded-md px-2 py-1 transition-all">
              Petrol Pump Inventory
            </span>
          </div>
          <div
            className="relative group"
            onClick={() => setActiveComponent("info")}
          >
            <MdInfo className="text-white text-3xl cursor-pointer hover:text-gray-200 transition-all" />
            <span className="absolute left-full ml-2 opacity-0 group-hover:opacity-100 text-white bg-gray-800 text-xs rounded-md px-2 py-1 transition-all">
              Petrol Pump Inventory History
            </span>
          </div>
          <div
            className="relative group"
            onClick={() => setActiveComponent("agency-inventory")}
          >
            <MdStorage className="text-white text-4xl cursor-pointer hover:text-gray-200 transition-all" />
            <span className="absolute left-full ml-2 opacity-0 group-hover:opacity-100 text-white bg-gray-800 text-xs rounded-md px-2 py-1 transition-all">
              Agency Inventory
            </span>
          </div>
          <div
            className="relative group"
            onClick={() => setActiveComponent("agency-inventory-history")}
          >
            <MdHistory className="text-white text-4xl cursor-pointer hover:text-gray-200 transition-all" />
            <span className="absolute left-full ml-2 opacity-0 group-hover:opacity-100 text-white bg-gray-800 text-xs rounded-md px-2 py-1 transition-all">
              Agency Inventory History
            </span>
          </div>
          <div className="relative group" onClick={handleLogout}>
            <MdExitToApp className="text-white text-3xl cursor-pointer hover:text-gray-200 transition-all" />
            <span className="absolute left-full ml-2 opacity-0 group-hover:opacity-100 text-white bg-gray-800 text-xs rounded-md px-2 py-1 transition-all">
              Logout
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full sm:ml-0 lg:ml-20 mt-14 lg:mt-0">
        {renderComponent()}
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </div>
  );
};

export default MenuBar;
