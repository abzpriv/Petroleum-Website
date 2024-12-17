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
} from "react-icons/md"; // Using Material Design Icons

import DashboardAdmin from "./DashboardAdmin";

import PetrolPumpAllOrders from "./PetrolPumpAllOrders";
import InventoryDashboard from "./Inventory";
import InventeryInfo from "./InventeryInfo";
import InvenetryAgency from "./InvenetryAgency";
import AgencyHistoryInventory from "./AgencyHistoryInventory";
import OrdersComponent from "./OrdersComponent";

const MenuBar: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string>("home");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
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
        router.push("/");
      }, 2000);
    }
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case "home":
        return (
          <div className="w-full ml-20">
            <DashboardAdmin />
          </div>
        );
      case "agency-orders":
        return (
          <div className="w-full ml-20 overflow-hidden">
            <OrdersComponent />
          </div>
        );
      case "petrol-orders":
        return (
          <div className="w-full ml-20 overflow-hidden">
            <PetrolPumpAllOrders />
          </div>
        );
      case "inventory":
        return (
          <div className="w-full ml-20">
            <InventoryDashboard />
          </div>
        );
      case "info":
        return (
          <div className="w-full ml-20 overflow-hidden">
            <InventeryInfo />
          </div>
        );
      case "agency-inventory":
        return (
          <div className="w-full ml-20">
            <InvenetryAgency />
          </div>
        );
      case "agency-inventory-history":
        return (
          <div className="w-full ml-20 overflow-hidden">
            <AgencyHistoryInventory />
          </div>
        );
      case "logout":
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800 w-full min-h-screen p-4 flex">
      {/* Centered vertical icons section on the left */}
      <div className="fixed left-0 top-1/2 transform -translate-y-1/2 flex ml-5 flex-col items-center space-y-10">
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

      {renderComponent()}

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </div>
  );
};

export default MenuBar;
