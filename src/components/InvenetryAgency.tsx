import React, { useState, useEffect } from "react";
import Loader from "./Loader";
import { FaOilCan, FaFireAlt, FaDollarSign } from "react-icons/fa"; // Icon imports

const InvenetryAgency: React.FC = () => {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [inventoryData, setInventoryData] = useState<any>(null);
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventoryData = async () => {
    setError(null);

    try {
      const date = new Date().toLocaleDateString("en-CA");
      console.log("Request Date:", date);

      const inventoryResponse = await fetch(
        `/api/inventeryAgency/getAgencyInventery?date=${date}`
      );
      if (!inventoryResponse.ok) {
        throw new Error("Failed to fetch inventory data");
      }
      const inventoryData = await inventoryResponse.json();
      console.log("🚀 ~ fetchInventoryData ~ inventoryData:", inventoryData);
      setInventoryData(inventoryData);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  const fetchStatsData = async () => {
    setError(null);

    try {
      const statsResponse = await fetch("/api/stats/agencyStats");
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
      setLoading(true);
      await Promise.all([fetchInventoryData(), fetchStatsData()]);
      setTimeout(() => setLoading(false), 5000);
    };

    fetchData();
  }, []);

  const overallRevenue = statsData?.totalRevenue || 0;
  const pendingRevenue = statsData?.totalPendingAmount || 0;

  const totalFuelAvailable =
    (statsData?.remainingPetrol || 0) - (statsData?.totalFuelSoldByPetrol || 0);

  const totalKeroseneFuelAvailable =
    (statsData?.remainingKeroseneOil || 0) -
    (statsData?.totalFuelSoldByKeroseneOil || 0);
  const totalNRFuelAvailable =
    (statsData?.remainingNROil || 0) - (statsData?.totalFuelSoldByNROil || 0);

  const totalDieselAvailable =
    (statsData?.remainingDiesel || 0) - (statsData?.totalFuelSoldByDiesel || 0);
  const totalFuelSoldByKeroseneOil = statsData?.totalFuelSoldByKeroseneOil || 0;
  const totalTyreAvailable =
    (statsData?.remainingTyreOil || 0) -
    (statsData?.totalFuelSoldByTyreOil || 0);
  const totalTyreOilSold = statsData?.totalFuelSoldByTyreOil || 0;

  const totalFuelSoldByNROil = statsData?.totalFuelSoldByNROil || 0;
  const totalDieselSold = statsData?.totalFuelSoldByDiesel || 0;
  const totalPetrolSold = statsData?.totalFuelSoldByPetrol || 0;
  const totalKeroseneOilAdded =
    inventoryData?.find((item: any) => item.fuelType === "KeroseneOil")
      ?.totalAdded || 0;

  const totalNRAdded =
    inventoryData?.find((item: any) => item.fuelType === "NROil")?.totalAdded ||
    0;
  const totalPetrolAdded =
    inventoryData?.find((item: any) => item.fuelType === "Petrol")
      ?.totalAdded || 0;
  const totalDieselAdded =
    inventoryData?.find((item: any) => item.fuelType === "Diesel")
      ?.totalAdded || 0;

  const totalTyreOilAdded =
    inventoryData?.find((item: any) => item.fuelType === "TyreOil")
      ?.totalAdded || 0;
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
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen rounded-3xl flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl bg-white shadow-2xl rounded-3xl overflow-hidden">
        {/* Header */}
        <header className="bg-gray-700 text-white text-center py-6 text-xl sm:text-3xl font-semibold">
          Agency Fuel Inventory Dashboard
          <div className="text-sm font-normal mt-2">Date: {today}</div>
        </header>

        {/* Inventory Stats */}
        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Total Petrol */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <h3 className="text-sm sm:text-xl font-semibold text-gray-700">
              Total Petrol <FaOilCan className="text-blue-500 inline ml-2" />
            </h3>
            <p className="text-3xl sm:text-4xl font-bold text-blue-600 mt-2">
              {totalFuelAvailable} Liters
            </p>
          </div>
          {/* Total Diesel */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <h3 className="text-sm sm:text-xl font-semibold text-gray-700">
              Total Diesel <FaOilCan className="text-yellow-500 inline ml-2" />
            </h3>
            <p className="text-3xl sm:text-4xl font-bold text-yellow-600 mt-2">
              {totalDieselAvailable} Liters
            </p>
          </div>
          {/* Petrol Sold */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <h3 className="text-sm sm:text-xl font-semibold text-gray-700">
              Total Petrol Sold{" "}
              <FaFireAlt className="text-green-500 inline ml-2" />
            </h3>
            <p className="text-3xl sm:text-4xl font-bold text-green-600 mt-2">
              {totalPetrolSold} Liters
            </p>
          </div>
          {/* Diesel Sold */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <h3 className="text-sm sm:text-xl font-semibold text-gray-700">
              Total Diesel Sold{" "}
              <FaFireAlt className="text-green-500 inline ml-2" />
            </h3>
            <p className="text-3xl sm:text-4xl font-bold text-green-600 mt-2">
              {totalDieselSold} Liters
            </p>
          </div>
          {/* Total Petrol Added */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <h3 className="text-sm sm:text-xl font-semibold text-gray-700">
              Total Petrol Added{" "}
              <FaOilCan className="text-indigo-500 inline ml-2" />
            </h3>
            <p className="text-3xl sm:text-4xl font-bold text-indigo-600 mt-2">
              {totalPetrolAdded} Liters
            </p>
          </div>
          {/* Total Diesel Added */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <h3 className="text-sm sm:text-xl font-semibold text-gray-700">
              Total Diesel Added{" "}
              <FaOilCan className="text-indigo-500 inline ml-2" />
            </h3>
            <p className="text-3xl sm:text-4xl font-bold text-indigo-600 mt-2">
              {totalDieselAdded} Liters
            </p>
          </div>
          {/* Total Kerosene Oil */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <h3 className="text-sm sm:text-xl font-semibold text-gray-700">
              Total Kerosene Oil 🛢️
            </h3>
            <p className="text-3xl sm:text-4xl font-bold text-blue-600 mt-2">
              {totalKeroseneFuelAvailable} Liters
            </p>
          </div>
          {/* Total Kerosene Oil Sold */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <h3 className="text-sm sm:text-xl font-semibold text-gray-700">
              Total Kerosene Oil Sold 🔥
            </h3>
            <p className="text-3xl sm:text-4xl font-bold text-green-600 mt-2">
              {totalFuelSoldByKeroseneOil} Liters
            </p>
          </div>
          {/* Total Kerosene Oil Added */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <h3 className="text-sm sm:text-xl font-semibold text-gray-700">
              Total Kerosene Oil Added
              <FaOilCan className="text-indigo-500 inline ml-2" />
            </h3>
            <p className="text-3xl sm:text-4xl font-bold text-indigo-600 mt-2">
              {totalKeroseneOilAdded} Liters
            </p>
          </div>

          {/* Total NR Oil */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <h3 className="text-sm sm:text-xl font-semibold text-gray-700">
              Total NR Oil 🛢️
            </h3>
            <p className="text-3xl sm:text-4xl font-bold text-blue-600 mt-2">
              {totalNRFuelAvailable} Liters
            </p>
          </div>
          {/* Total NR Oil Sold */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <h3 className="text-sm sm:text-xl font-semibold text-gray-700">
              Total NR Sold 🔥
            </h3>
            <p className="text-3xl sm:text-4xl font-bold text-green-600 mt-2">
              {totalFuelSoldByNROil} Liters
            </p>
          </div>
          {/* Total NR Oil Added */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <h3 className="text-sm sm:text-xl font-semibold text-gray-700">
              Total NR Added
              <FaOilCan className="text-indigo-500 inline ml-2" />
            </h3>
            <p className="text-3xl sm:text-4xl font-bold text-indigo-600 mt-2">
              {totalNRAdded} Liters
            </p>
          </div>

          {/* Total Tyre Oil */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <h3 className="text-sm sm:text-xl font-semibold text-gray-700">
              Total Tyre Oil 🛢️
            </h3>
            <p className="text-3xl sm:text-4xl font-bold text-blue-600 mt-2">
              {totalTyreAvailable} Liters
            </p>
          </div>
          {/* Total Tyre Oil Sold */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <h3 className="text-sm sm:text-xl font-semibold text-gray-700">
              Total Tyre Oil Sold 🔥
            </h3>
            <p className="text-3xl sm:text-4xl font-bold text-green-600 mt-2">
              {totalTyreOilSold} Liters
            </p>
          </div>
          {/* Total Tyre Oil Added */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <h3 className="text-sm sm:text-xl font-semibold text-gray-700">
              Total Tyre Oil Added
              <FaOilCan className="text-indigo-500 inline ml-2" />
            </h3>
            <p className="text-3xl sm:text-4xl font-bold text-indigo-600 mt-2">
              {totalTyreOilAdded} Liters
            </p>
          </div>

          {/* Revenue Cards */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <h3 className="text-sm sm:text-xl font-semibold text-gray-700">
              Overall Revenue{" "}
              <div className="text-purple-500 inline ml-2">PKR </div>
            </h3>
            <p className="text-3xl sm:text-4xl font-bold text-purple-600 mt-2">
              {overallRevenue} PKR
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <h3 className="text-sm sm:text-xl font-semibold text-gray-700">
              Pending Revenue{" "}
              <div className="text-red-500 inline ml-2">PKR </div>
            </h3>
            <p className="text-3xl sm:text-4xl font-bold text-red-600 mt-2">
              {pendingRevenue} PKR
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-200 text-center py-4">
          <p className="text-gray-500 text-sm">
            &copy; 2024 Fuel Station Inventory Management
          </p>
        </footer>
      </div>
    </div>
  );
};
export default InvenetryAgency;
