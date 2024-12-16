import React, { useState, useEffect } from "react";
import { MdCalendarToday } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import InventeryModal from "./InventeryModel"; // Ensure this import path is correct
import DeleteModal from "./DeleteModel"; // Ensure this import path is correct
import { FaEdit, FaTrash } from "react-icons/fa";
import Loader from "./Loader";
import { toast } from "react-toastify"; // Import the toast library
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toast notifications
import EditPetrolInventeryModel from "./EditPetrolInventeryModel";

const InventeryInfo: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statsData, setStatsData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteItemName, setDeleteItemName] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<any>(null);

  const fetchInventoryData = async (date: Date | null) => {
    setError(null);
    try {
      const dateParam = date ? format(date, "yyyy-MM-dd") : "";
      const response = await fetch(
        `/api/inventery/getInventery?date=${dateParam}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch inventory data");
      }
      const data = await response.json();
      setInventoryData(data);
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
      setStatsData(statsData);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchInventoryData(selectedDate), fetchStatsData()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData(); // Fetch both inventory and stats data when the component mounts
  }, [selectedDate]);

  const handleAddInventory = (newData: any) => {
    const newEntry = {
      date: format(new Date(), "yyyy-MM-dd"),
      ...newData,
    };
    setInventoryData((prevData) => [...prevData, newEntry]);
  };

  const handleDeleteClick = (itemId: string) => {
    setDeleteItemName(itemId); // Set the MongoDB ObjectId (not a custom ID)
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async (itemId: string) => {
    try {
      const response = await fetch(`/api/inventery/deleteInventery/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      // Close the delete modal
      setIsDeleteModalOpen(false);

      // Show success toast
      toast.success("Inventory item deleted successfully");

      // Optionally refresh the data after deletion
      fetchData();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete item");
    }
  };

  const handleEditClick = (item: any) => {
    setEditFormData({
      ...item,
      date: format(new Date(item.date), "yyyy-MM-dd"), // Ensure it's in the correct format
    });
    setIsEditModalOpen(true);
  };
  const updateInventory = async (updatedData: any) => {
    console.log("Updated Data being sent:", updatedData); // Debugging log
    try {
      const response = await fetch(
        `/api/inventery/updateInventery/${updatedData._id}`, // Ensure `_id` is correct
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update inventory");
      }

      toast.success("Inventory updated successfully");
    } catch (err) {
      console.error("Error in updateInventory:", err);
      toast.error("Failed to update inventory");
    }
  };

  const renderDailyData = () => {
    if (error) {
      return (
        <tr>
          <td colSpan={11} className="text-center py-2 text-sm text-red-600">
            {error}
          </td>
        </tr>
      );
    }

    if (inventoryData.length === 0) {
      return (
        <tr>
          <td colSpan={11} className="text-center py-2 text-sm">
            No data available
          </td>
        </tr>
      );
    }

    return inventoryData.map((row, index) => (
      <tr key={index}>
        <td className="py-2 px-2 sm:px-4 text-center text-xs sm:text-sm whitespace-nowrap">
          {format(new Date(row.date), "yyyy-MM-dd")}
        </td>
        <td className="py-2 px-2 sm:px-4 text-center text-xs sm:text-sm whitespace-nowrap">
          {row.boughtByName}
        </td>
        <td className="py-2 px-2 sm:px-4 text-center text-xs sm:text-sm whitespace-nowrap">
          {statsData?.totalFuelSoldByPetrol || 0}
        </td>
        <td className="py-2 px-2 sm:px-4 text-center text-xs sm:text-sm whitespace-nowrap">
          {row.totalPetrolAdded}
        </td>
        <td className="py-2 px-2 sm:px-4 text-center text-xs sm:text-sm whitespace-nowrap">
          {row.totalDieselAdded}
        </td>
        <td className="py-2 px-2 sm:px-4 text-center text-xs sm:text-sm whitespace-nowrap">
          {statsData?.totalFuelSoldByDiesel || 0}
        </td>
        <td className="py-2 px-2 sm:px-4 text-center text-xs sm:text-sm whitespace-nowrap">
          {row.agencyType}
        </td>
        <td className="py-2 px-2 sm:px-4 text-center text-xs sm:text-sm whitespace-nowrap">
          <button
            className="text-green-600 hover:text-green-400"
            onClick={() => handleEditClick(row)}
          >
            <FaEdit />
          </button>
          <button
            className="text-red-600 hover:text-red-400 ml-3"
            onClick={() => handleDeleteClick(row._id)}
          >
            <FaTrash />
          </button>
        </td>
      </tr>
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 rounded-3xl shadow-lg">
      <div className="flex justify-between items-center mb-4 flex-wrap">
        <h2 className="text-lg sm:text-xl font-semibold text-black w-full sm:w-auto mb-2 sm:mb-0 text-center sm:text-left">
          Inventory History
        </h2>
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-start">
          <MdCalendarToday className="text-xl sm:text-2xl text-black" />
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            className="border border-gray-300 rounded-md p-1 text-black w-full sm:w-auto text-sm sm:text-base"
            dateFormat="dd MMMM yyyy"
          />
          <button
            className="bg-gray-700 text-white py-1.5 px-3 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 mt-2 sm:mt-0 w-26 sm:w-auto text-xs sm:text-base"
            onClick={() => setIsModalOpen(true)}
          >
            Add Inventory
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between mb-4 items-center sm:items-start">
        <div className="text-sm sm:text-base text-black mb-2 sm:mb-0 text-center sm:text-left w-full sm:w-auto">
          <strong>Overall Revenue:</strong> {statsData?.totalRevenue || 0} PKR
        </div>
        <div className="text-sm sm:text-base text-black text-center sm:text-left w-full sm:w-auto">
          <strong>Pending Revenue:</strong> {statsData?.totalPendingAmount || 0}{" "}
          PKR
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg table-auto sm:table-fixed">
          <thead>
            <tr className="bg-gray-700 text-white text-[10px] sm:text-sm">
              <th className="py-1 px-2 sm:px-4 text-center text-[10px] sm:text-sm whitespace-nowrap">
                Date
              </th>
              <th className="py-1 px-2 sm:px-4 text-center text-[10px] sm:text-sm whitespace-nowrap">
                Bought By Name
              </th>
              <th className="py-1 px-2 sm:px-4 text-center text-[10px] sm:text-sm whitespace-nowrap">
                Petrol Sold
              </th>
              <th className="py-1 px-2 sm:px-4 text-center text-[10px] sm:text-sm whitespace-nowrap">
                Petrol Added
              </th>
              <th className="py-1 px-2 sm:px-4 text-center text-[10px] sm:text-sm whitespace-nowrap">
                Diesel Added
              </th>
              <th className="py-1 px-2 sm:px-4 text-center text-[10px] sm:text-sm whitespace-nowrap">
                Diesel Sold
              </th>
              <th className="py-1 px-2 sm:px-4 text-center text-[10px] sm:text-sm whitespace-nowrap">
                Agency Type
              </th>
              <th className="py-1 px-2 sm:px-4 text-center text-[10px] sm:text-sm whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-black text-xs sm:text-sm">
            {renderDailyData()}
          </tbody>
        </table>
      </div>

      <InventeryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddInventory}
      />

      <EditPetrolInventeryModel
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={async (updatedData) => {
          // Optimistically update the UI
          setInventoryData((prevData) =>
            prevData.map((item) =>
              item._id === updatedData._id ? { ...item, ...updatedData } : item
            )
          );

          try {
            await updateInventory(updatedData); // Sync with the server
            toast.success("Inventory updated successfully");
          } catch (error) {
            console.error("Failed to update inventory:", error);
            toast.error("Failed to update inventory");
            fetchData(); // Revert to server data if the update fails
          } finally {
            setIsEditModalOpen(false); // Close the modal
          }
        }}
        formData={editFormData}
        setFormData={setEditFormData}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={deleteItemName || ""}
      />
    </div>
  );
};

export default InventeryInfo;
