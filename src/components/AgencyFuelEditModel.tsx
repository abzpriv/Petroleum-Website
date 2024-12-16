import React from "react";

interface EditInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updatedData: any) => void;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const AgencyFuelEditModel: React.FC<EditInventoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
}) => {
  const handleInputChange = (field: string, value: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Edit Inventory
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Fuel Type */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Fuel Type
            </label>
            <select
              className="w-full p-3 border-2 border-gray-300 text-black rounded-md"
              value={formData?.fuelType || ""}
              onChange={(e) => handleInputChange("fuelType", e.target.value)}
            >
              <option value="Petrol	">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="KeroseneOil">Kerosene Oil</option>
              <option value="NROil">NR Oil</option>
              <option value="TyreOil">Tyre Oil</option>
              {/* Add more fuel types as needed */}
            </select>
          </div>

          {/* Total Fuel Added */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Total{" "}
              {formData?.fuelType
                ? formData.fuelType.charAt(0).toUpperCase() +
                  formData.fuelType.slice(1)
                : "Fuel"}{" "}
              Added
            </label>
            <input
              type="number"
              className="w-full p-3 border-2 border-gray-300 text-black rounded-md"
              value={formData?.totalAdded || ""}
              onChange={(e) =>
                handleInputChange("totalAdded", Number(e.target.value))
              }
            />
          </div>

          {/* Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              className="w-full p-3 border-2 border-gray-300 text-black rounded-md"
              value={formData?.date || ""}
              onChange={(e) => handleInputChange("date", e.target.value)}
              readOnly
            />
          </div>

          {/* Bought By */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Bought By
            </label>
            <input
              type="text"
              className="w-full p-3 border-2 border-gray-300 text-black rounded-md"
              value={formData?.boughtBy || ""}
              onChange={(e) => handleInputChange("boughtBy", e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="bg-gray-300 text-black py-2 px-4 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-gray-700 text-white py-2 px-4 rounded-md"
            onClick={handleSubmit}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgencyFuelEditModel;
