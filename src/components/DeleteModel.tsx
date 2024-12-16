// DeleteModal.tsx
import React from "react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (rowId: string) => void;
  itemName: string;
}
const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-black text-white w-96 p-6 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gold-700">Delete Item</h2>
          <p className="text-lg mt-2">
            Are you sure you want to delete{" "}
            <span className="font-bold text-gray-700">{itemName}</span>?
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            className="px-6 py-2 bg-gray-700 text-black rounded-lg hover:bg-gold-600 transition duration-200"
            onClick={() => onConfirm(itemName)} // Pass the itemName or ID as the argument
          >
            Yes, Delete
          </button>
          <button
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
