"use client";

import React from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const DashboardAdmin: React.FC = () => {
  const fuelData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Diesel",
        data: [300, 400, 350, 500, 600, 450],
        backgroundColor: "#ffb400",
      },
      {
        label: "Petrol",
        data: [200, 250, 300, 450, 500, 400],
        backgroundColor: "#ff6347",
      },
    ],
  };

  const revenueData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Revenue",
        data: [5000, 8000, 7500, 9000, 11000, 10000],
        borderColor: "#4CAF50",
        fill: false,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="rounded-3xl h-full bg-gray-50 p-4 md:p-8 w-full">
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Fuel Available */}
        <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 flex items-center justify-between transition-all hover:shadow-2xl hover:scale-105">
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
              Total Fuel Available
            </h3>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-500">
              1,200,000 L
            </p>
          </div>
          <div className="text-3xl sm:text-4xl md:text-5xl text-yellow-500">
            <i className="fas fa-gas-pump"></i>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 flex items-center justify-between transition-all hover:shadow-2xl hover:scale-105">
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
              Total Customers
            </h3>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-500">
              1,500
            </p>
          </div>
          <div className="text-3xl sm:text-4xl md:text-5xl text-yellow-500">
            <i className="fas fa-users"></i>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 flex items-center justify-between transition-all hover:shadow-2xl hover:scale-105">
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
              Total Revenue
            </h3>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-500">
              75,000 PKR
            </p>
          </div>
          <div className="text-3xl sm:text-4xl md:text-5xl text-yellow-500">
            <i className="fas fa-dollar-sign"></i>
          </div>
        </div>

        {/* Total Fuel Sold */}
        <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 flex items-center justify-between transition-all hover:shadow-2xl hover:scale-105">
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
              Total Fuel Sold
            </h3>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-500">
              50,000 L
            </p>
          </div>
          <div className="text-3xl sm:text-4xl md:text-5xl text-yellow-500">
            <i className="fas fa-truck"></i>
          </div>
        </div>

        {/* Pending Revenue */}
        <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 flex items-center justify-between transition-all hover:shadow-2xl hover:scale-105">
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
              Pending Revenue
            </h3>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-500">
              5,000 PKR
            </p>
          </div>
          <div className="text-3xl sm:text-4xl md:text-5xl text-red-500">
            <i className="fas fa-clock"></i>
          </div>
        </div>

        {/* Total Revenue Collected */}
        <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6 flex items-center justify-between transition-all hover:shadow-2xl hover:scale-105">
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
              Revenue Collected
            </h3>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-500">
              70,000 PKR
            </p>
          </div>
          <div className="text-3xl sm:text-4xl md:text-5xl text-green-500">
            <i className="fas fa-check-circle"></i>
          </div>
        </div>
      </div>

      {/* Progress Bars for Fuel Sold & Revenue Collected */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Fuel Sold Progress
          </h3>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full">
              <div
                className="bg-yellow-500 text-xs font-medium text-yellow-100 text-center p-1 leading-none rounded-full"
                style={{ width: "75%" }}
              >
                75% Fuel Sold
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Revenue Collected Progress
          </h3>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full">
              <div
                className="bg-green-500 text-xs font-medium text-green-100 text-center p-1 leading-none rounded-full"
                style={{ width: "93%" }}
              >
                93% Revenue Collected
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Graphs: Fuel vs Sold & Revenue */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Fuel Available vs Sold Graph */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
            Fuel Available vs Sold
          </h2>
          <div className="mt-4">
            <Bar
              data={fuelData}
              options={{
                responsive: true,
                plugins: { legend: { position: "top" } },
                maintainAspectRatio: false,
              }}
              height={200}
            />
          </div>
        </div>

        {/* Revenue Over Time Graph */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
            Revenue Over Time
          </h2>
          <div className="mt-4">
            <Line
              data={revenueData}
              options={{
                responsive: true,
                plugins: { legend: { position: "top" } },
                maintainAspectRatio: false,
              }}
              height={200}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
