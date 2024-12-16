import { useState, useEffect } from "react";
import axios from "axios"; // Make sure to import axios

interface AgencyInventeryModelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void; // You can adjust the type of formData based on your data structure
}

const AgencyInventeryModel: React.FC<AgencyInventeryModelProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [selectedFuel, setSelectedFuel] = useState<string | null>(null);
  const [totalAdded, setTotalAdded] = useState<number | string>("");
  const [boughtBy, setBoughtBy] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const handleFuelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFuel(e.target.value);
    setTotalAdded(""); // Reset total added and bought by when changing fuel type
    setBoughtBy("");
  };

  const handleSubmit = async () => {
    const formData = {
      date,
      fuelType: selectedFuel,
      totalAdded,
      boughtBy,
    };

    try {
      const response = await axios.post("/api/inventeryAgency", formData);

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

  useEffect(() => {
    if (!isOpen) {
      // Reset the form when modal is closed
      setSelectedFuel(null);
      setTotalAdded("");
      setBoughtBy("");
      setDate("");
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg w-full relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold text-center mb-6 text-yellow-700">
              Fuel Management
            </h2>

            {/* Date input */}
            <div className="mb-4">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-black"
              />
            </div>

            {/* Fuel Type Dropdown */}
            <div className="mb-4">
              <label
                htmlFor="fuel-type"
                className="block text-sm font-medium text-gray-700"
              >
                Fuel Type
              </label>
              <select
                id="fuel-type"
                value={selectedFuel || ""}
                onChange={handleFuelChange}
                className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-black"
              >
                <option value="">Select Fuel Type</option>
                <option value="Diesel">Diesel</option>
                <option value="Petrol">Petrol</option>
                <option value="KeroseneOil">Kerosene Oil</option>
                <option value="NROil">NR Oil</option>
                <option value="TyreOil">Tyre Oil</option>
              </select>
            </div>

            {/* Conditional Inputs based on Fuel Type */}
            {selectedFuel && (
              <>
                <div className="mb-4">
                  <label
                    htmlFor="total-added"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Total {selectedFuel} Added
                  </label>
                  <input
                    type="number"
                    id="total-added"
                    value={totalAdded}
                    onChange={(e) => setTotalAdded(e.target.value)}
                    className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-black"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="bought-by"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Bought By
                  </label>
                  <input
                    type="text"
                    id="bought-by"
                    value={boughtBy}
                    onChange={(e) => setBoughtBy(e.target.value)}
                    className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-black"
                  />
                </div>
              </>
            )}

            {/* Submit Button */}
            <div className="text-center">
              <button
                onClick={handleSubmit}
                className="mt-4 px-6 py-2 bg-yellow-700 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AgencyInventeryModel;
