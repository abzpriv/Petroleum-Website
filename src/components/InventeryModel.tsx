import React, { useState } from "react";
import axios from "axios";

interface InventeryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InventeryData) => void;
}

interface InventeryData {
  totalPetrolAdded: number | undefined;
  totalDieselAdded: number | undefined;

  agencyType: string;
  date: string;
  fuelAvailable: string;
  boughtByName: string;
}

const InventeryModal: React.FC<InventeryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<InventeryData>({
    totalPetrolAdded: undefined,
    totalDieselAdded: undefined,

    agencyType: "Petrol Pump",
    date: "",
    fuelAvailable: "Yes",
    boughtByName: "",
  });

  const handleInputChange = (
    field: keyof InventeryData,
    value: number | string
  ) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/inventery", formData);
      if (response.status === 201) {
        alert("Inventory added successfully!");
        onSubmit(formData); // Pass the data to parent component
        onClose(); // Close the modal
      } else {
        alert("Failed to add inventory");
      }
    } catch (error) {
      console.error("Error submitting inventory data:", error);
      alert("Failed to save inventory data");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Inventory Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Total Petrol Added */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Total Petrol Added
            </label>
            <input
              type="number"
              className="w-full p-3 border-2 border-gray-300 rounded-md text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={formData.totalPetrolAdded || ""}
              onChange={(e) =>
                handleInputChange("totalPetrolAdded", Number(e.target.value))
              }
            />
          </div>

          {/* Total Diesel Added */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Total Diesel Added
            </label>
            <input
              type="number"
              className="w-full p-3 border-2 border-gray-300 rounded-md text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={formData.totalDieselAdded || ""}
              onChange={(e) =>
                handleInputChange("totalDieselAdded", Number(e.target.value))
              }
            />
          </div>

          {/* Fixed Agency Type */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Agency Type
            </label>
            <input
              type="text"
              className="w-full p-3 border-2 border-gray-300 rounded-md text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={formData.agencyType}
              readOnly
            />
          </div>

          {/* Total Petrol Available */}

          {/* Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              className="w-full p-3 border-2 border-gray-300 rounded-md text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
            />
          </div>

          {/* Bought By Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Bought By Name
            </label>
            <input
              type="text"
              className="w-full p-3 border-2 border-gray-300 rounded-md text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={formData.boughtByName}
              onChange={(e) =>
                handleInputChange("boughtByName", e.target.value)
              }
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-4">
          <button
            className="bg-gray-700 text-white py-3 px-6 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className="bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventeryModal;
