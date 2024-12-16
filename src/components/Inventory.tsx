import React, { useState, useEffect } from "react";
import Loader from "./Loader";

const PetrolInventory: React.FC = () => {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // State for inventory data
  const [inventoryData, setInventoryData] = useState<any>(null);
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch inventory data
  const fetchInventoryData = async () => {
    setError(null);

    try {
      const date = new Date().toLocaleDateString("en-CA");
      console.log("Request Date:", date);

      const inventoryResponse = await fetch(
        `/api/inventery/getInventery?date=${date}`
      );
      if (!inventoryResponse.ok) {
        throw new Error("Failed to fetch inventory data");
      }
      const inventoryData = await inventoryResponse.json();
      setInventoryData(inventoryData);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  const fetchStatsData = async () => {
    setError(null);

    try {
      const statsResponse = await fetch("/api/stats");
      if (!statsResponse.ok) {
        throw new Error("Failed to fetch stats data");
      }
      const statsData = await statsResponse.json();
      console.log("🚀 ~ fetchStatsData ~ statsData:", statsData);
      setStatsData(statsData);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Ensure loading starts
      await Promise.all([fetchInventoryData(), fetchStatsData()]);
      setTimeout(() => setLoading(false), 5000);
    };

    fetchData();
  }, []);

  const overallRevenue = statsData?.totalRevenue || 0;
  const pendingRevenue = statsData?.totalPendingAmount || 0;

  const totalFuelAvailable =
    (statsData?.remainingPetrol || 0) - (statsData?.totalFuelSoldByPetrol || 0);

  const totalDieselAvailable =
    (statsData?.remainingDiesel || 0) - (statsData?.totalFuelSoldByDiesel || 0);

  const totalDieselAdded = inventoryData?.[0]?.totalDieselAdded || 0;
  const totalDieselSold = statsData?.totalFuelSoldByDiesel || 0;
  const totalPetrolAdded = inventoryData?.[0]?.totalPetrolAdded || 0;
  const totalPetrolSold = statsData?.totalFuelSoldByPetrol || 0;

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 font-bold text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen flex rounded-3xl flex-col items-center justify-center">
      <div className="w-full max-w-4xl sm:max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <header className="bg-gray-600 text-white text-center py-4 sm:py-6 text-xl sm:text-2xl font-bold">
          Petrol Pump Fuel Inventory Dashboard
          <div className="text-sm font-normal mt-2">Date: {today}</div>
        </header>
        {/* Inventory Stats */}
        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Total Petrol */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 text-center shadow-md">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
              Total Petrol
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-2">
              {totalFuelAvailable} Liters
            </p>
          </div>
          {/* Total Diesel */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 text-center shadow-md">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
              Total Diesel
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-2">
              {totalDieselAvailable} Liters
            </p>
          </div>
          {/* Petrol Sold */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 text-center shadow-md">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
              Total Petrol Sold
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-2">
              {totalPetrolSold} Liters
            </p>
          </div>
          {/* Diesel Sold */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 text-center shadow-md">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
              Total Diesel Sold
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-2">
              {totalDieselSold} Liters
            </p>
          </div>
          {/* Total Petrol Added */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 text-center shadow-md">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
              Total Petrol Added
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-indigo-600 mt-2">
              {totalPetrolAdded} Liters
            </p>
          </div>
          {/* Total Diesel Added */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 text-center shadow-md">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
              Total Diesel Added
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-indigo-600 mt-2">
              {totalDieselAdded} Liters
            </p>
          </div>
          {/* Overall Revenue */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 text-center shadow-md">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
              Overall Revenue
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-purple-600 mt-2">
              {overallRevenue} PKR
            </p>
          </div>
          {/* Pending Revenue */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 text-center shadow-md">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
              Pending Revenue
            </h3>
            <p className="text-2xl sm:text-3xl font-bold text-red-600 mt-2">
              {pendingRevenue} PKR
            </p>
          </div>
        </div>
        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-200 text-center py-4 sm:py-6">
          <p className="text-gray-500 text-sm sm:text-base">
            &copy; 2024 Fuel Station Inventory Management
          </p>
        </footer>
      </div>
    </div>
  );
};

export default PetrolInventory;
