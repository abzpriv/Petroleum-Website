import React from "react";

interface EditInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updatedData: any) => void;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const EditPetrolInventeryModel: React.FC<EditInventoryModalProps> = ({
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
          {/* Total Petrol Added */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Total Petrol Added
            </label>
            <input
              type="number"
              className="w-full p-3 border-2 border-gray-300 text-black rounded-md"
              value={formData?.totalPetrolAdded || ""}
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
              className="w-full p-3 border-2 border-gray-300 text-black rounded-md"
              value={formData?.totalDieselAdded || ""}
              onChange={(e) =>
                handleInputChange("totalDieselAdded", Number(e.target.value))
              }
            />
          </div>

          {/* Agency Type */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Agency Type
            </label>
            <input
              type="text"
              className="w-full p-3 border-2 border-gray-300 text-black rounded-md"
              value={formData?.agencyType || ""}
              readOnly
            />
          </div>

          {/* Date (Read-Only) */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              className="w-full p-3 border-2 border-gray-300 text-black rounded-md"
              value={formData?.date || ""}
              readOnly
            />
          </div>

          {/* Bought By Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Bought By Name
            </label>
            <input
              type="text"
              className="w-full p-3 border-2 border-gray-300 text-black rounded-md"
              value={formData?.boughtByName || ""}
              onChange={(e) =>
                handleInputChange("boughtByName", e.target.value)
              }
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

export default EditPetrolInventeryModel;
