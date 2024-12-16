import React, { useEffect, useState } from "react";
import {
  FaPlusCircle,
  FaTimes,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilePdf,
  FaCalendarAlt,
} from "react-icons/fa";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import DeleteModal from "./DeleteModel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrdersComponent: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      timeZone: "Asia/Karachi",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };

    const pakistanDate = today.toLocaleString("en-GB", options);
    return pakistanDate.split("/").reverse().join("-");
  });

  const [formData, setFormData] = useState({
    clientName: "",
    orderPlace: "",
    fuelType: "Diesel",
    liters: "",
    fuelPerLiterPrice: "",
    fuelPrice: "",
    paidAmount: "",
    pendingAmount: "",
    date: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const filteredOrders = orders
    .filter((order) =>
      order.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((order) =>
      selectedDate
        ? new Date(order.date).toISOString().split("T")[0] === selectedDate
        : true
    );

  const totalOrders = filteredOrders.length;

  // Get the current orders to display based on the page number
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  useEffect(() => {
    const fetchOrders = async () => {
      const agencyName = "Petrol";
      const response = await fetch(
        `/api/orderAgencyGet?agencyName=${agencyName}`
      );

      const data = await response.json();

      if (response.ok && data.orders) {
        setOrders(data.orders);
      } else {
        console.error("Failed to fetch orders:", data);
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedFormData = {
      ...formData,
      agencyName: "Petrol",
      date: new Date(formData.date).toISOString(),
    };

    try {
      let response;

      if (isEditMode && editIndex !== null && orders[editIndex]) {
        const orderId = orders[editIndex]._id;
        response = await fetch(`/api/orderUpdate/${orderId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedFormData),
        });
      } else if (!isEditMode) {
        response = await fetch("/api/agencyOrder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedFormData),
        });
      } else {
        alert("Cannot update order. Please try again.");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        toast.error("Failed to save order: " + (data.message || data.error));
        return;
      }

      const ordersResponse = await fetch(
        `/api/orderAgencyGet?agencyName=${formattedFormData.agencyName}`
      );
      const ordersData = await ordersResponse.json();

      if (ordersResponse.ok && Array.isArray(ordersData.orders)) {
        setOrders(ordersData.orders);
        toast.success(
          isEditMode
            ? "Order updated successfully!"
            : "Order added successfully!"
        );
      } else {
        toast.error("Could not fetch updated orders. Please refresh the page.");
      }

      resetForm();
      setIsFormOpen(false);
    } catch (error) {
      toast.error("Error submitting form");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditOrder = (index: number) => {
    const orderToEdit = orders[index];

    if (!orderToEdit) {
      toast.error("Order not found.");
      return;
    }

    setIsEditMode(true);
    setEditIndex(index);

    setFormData({
      clientName: orderToEdit.clientName || "",
      orderPlace: orderToEdit.orderPlace || "",
      fuelType: orderToEdit.fuelType || "Diesel",
      fuelPerLiterPrice: orderToEdit.fuelPerLiterPrice || "",
      liters: orderToEdit.liters || "",
      fuelPrice: orderToEdit.fuelPrice || "",
      paidAmount: orderToEdit.paidAmount || "",
      pendingAmount: orderToEdit.pendingAmount || "",
      date: orderToEdit.date
        ? new Date(orderToEdit.date).toISOString().split("T")[0]
        : "",
    });

    setIsFormOpen(true);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!orderId) return;
    try {
      const response = await fetch(`/api/deleteOrder/${orderId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(orders.filter((order) => order._id !== orderId));
        setDeleteModalOpen(false);
        toast.success("Order deleted successfully!");
      } else {
        toast.error("Failed to delete the order. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the order.");
    }
  };

  const openDeleteModal = (order: any) => {
    if (order && order._id) {
      setOrderToDelete(order);
      setDeleteModalOpen(true);
    } else {
      console.error("Invalid order data:", order);
    }
  };

  const resetForm = () => {
    setFormData({
      clientName: "",
      orderPlace: "",
      fuelType: "Diesel",
      liters: "",
      fuelPerLiterPrice: "",
      fuelPrice: "",
      paidAmount: "",
      pendingAmount: "",
      date: "",
    });
    setIsEditMode(false);
    setEditIndex(null);
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Add header
    doc.setFillColor(184, 134, 11); // Dark gold color
    doc.rect(0, 0, pageWidth, 30, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255); // White text
    doc.text("Nisar Petrol Service", pageWidth / 2, 20, { align: "center" });

    // Subtitle
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black text
    doc.text("Fuel Orders Report", pageWidth / 2, 45, { align: "center" });

    // Table headers and rows
    const headers = [
      "Client Name",
      "Order Place",
      "Order Date",

      "Liters",
      "Fuel PL Price",
      "Paid Amount",
      "Pending Amount",
      "Fuel Type",
    ];

    const rows = currentOrders.map((order) => [
      order.clientName,
      order.orderPlace,
      new Date(order.date).toLocaleDateString("en-GB"),
      order.liters,
      `${Number(order.fuelPerLiterPrice).toFixed(2)}PKR`,
      `${Number(order.paidAmount).toFixed(2)}PKR`,
      `${Number(order.pendingAmount).toFixed(2)}PKR`,

      order.fuelType,
    ]);

    // AutoTable
    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 50,
      theme: "grid",
      headStyles: {
        fillColor: [184, 134, 11], // Dark gold color
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
        valign: "middle",
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        halign: "center",
        valign: "middle",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 30, left: 10, right: 10, bottom: 30 },
    });

    // Footer with manual page count
    const totalPages = doc.internal.pages.length - 1; // Calculate total pages manually
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      const footerText = `Page ${i} of ${totalPages}`;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: "center" });

      // Decorative footer line
      doc.setDrawColor(184, 134, 11);
      doc.line(10, pageHeight - 15, pageWidth - 10, pageHeight - 15);
    }

    // Save the PDF
    doc.save("nisar_petrol_orders.pdf");
  };

  const fields = [
    "clientName",
    "orderPlace",
    "fuelPerLiterPrice",
    "liters",
    "fuelPrice",
    "paidAmount",
    "pendingAmount",
  ];

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setOrderToDelete(null);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  // Calculate the total pages
  const totalPages = Math.ceil(totalOrders / ordersPerPage);

  return (
    <div className="p-6 bg-gray-50 rounded-3xl shadow-lg  sm:w-96 md:w-auto">
      <ToastContainer />
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-between mb-4 gap-4 sm:gap-0">
        {/* Title and Total Orders */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
          <h2 className="text-lg sm:text-2xl font-semibold text-gray-800">
            All Agency Orders
          </h2>
          <span className="text-sm sm:text-base text-gray-600">
            Total Orders: <strong>{totalOrders}</strong>
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:gap-4 gap-2 items-center sm:items-stretch">
          {/* Search Input */}
          <div className="relative w-full sm:w-auto">
            <FaSearch className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400 text-sm sm:text-base" />
            <input
              type="text"
              placeholder="Search by Client Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-auto pl-9 pr-4 py-1 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Date Picker */}
          <div className="relative w-full sm:w-auto">
            <FaCalendarAlt className="absolute top-1/2 transform -translate-y-1/2 left-2 text-gray-400 text-sm sm:text-base" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full sm:w-auto pl-8 pr-4 py-1 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Add Order Button */}
          <button
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="text-sm sm:text-lg text-gray-700 hover:text-gray-400 flex items-center justify-center w-full sm:w-auto"
          >
            <FaPlusCircle className="mr-1 sm:mr-2 text-base sm:text-lg" /> Add
            Order
          </button>

          {/* Generate PDF Button */}
          <button
            onClick={generatePDF}
            className="text-sm sm:text-lg text-red-700 hover:text-red-500 flex items-center justify-center w-full sm:w-auto"
          >
            <FaFilePdf className="mr-1 sm:mr-2 text-base sm:text-lg" /> Generate
            PDF
          </button>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full sm:w-96 md:w-4/6 lg:w-4/6 max-h-screen overflow-y-auto relative">
            {/* Close Button */}
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-2 right-2 text-black text-2xl"
            >
              <FaTimes />
            </button>

            {/* Title */}
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700 text-center">
              {isEditMode ? "Edit Order" : "Add Order"}
            </h3>

            {/* Form */}
            <form onSubmit={handleFormSubmit}>
              {/* Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {fields
                  .filter((field: any) => field !== "pendingAmount")
                  .map((field: any) => (
                    <div className="mb-4" key={field}>
                      <label
                        htmlFor={field}
                        className="block text-gray-700 capitalize text-xs sm:text-sm"
                      >
                        {field.replace(/([A-Z])/g, " $1")}
                      </label>
                      <input
                        type={
                          field.includes("Price") ||
                          field.includes("Amount") ||
                          field === "liters"
                            ? "number"
                            : "text"
                        }
                        id={field}
                        name={field}
                        value={formData[field as keyof typeof formData]}
                        onChange={handleInputChange}
                        className="w-full p-1 sm:p-2 border border-gray-300 rounded-md text-xs sm:text-sm text-black placeholder-black"
                        placeholder={`Enter ${field}`}
                        required
                      />
                    </div>
                  ))}
              </div>

              {/* Pending Amount, Fuel Type, and Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 mt-6">
                <div>
                  <label
                    htmlFor="pendingAmount"
                    className="block text-gray-700 text-xs sm:text-sm"
                  >
                    Pending Amount
                  </label>
                  <input
                    type="number"
                    id="pendingAmount"
                    name="pendingAmount"
                    value={formData.pendingAmount}
                    onChange={handleInputChange}
                    className="w-full p-1 sm:p-2 border border-gray-300 rounded-md text-xs sm:text-sm text-black placeholder-black"
                    placeholder="Enter Pending Amount"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="fuelType"
                    className="block text-gray-700 text-xs sm:text-sm"
                  >
                    Fuel Type
                  </label>
                  <select
                    id="fuelType"
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleInputChange}
                    className="w-full p-1 sm:p-2 border border-gray-300 rounded-md text-xs sm:text-sm text-black placeholder-black"
                    required
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="KeroseneOil">Kerosene Oil</option>
                    <option value="NROil">NR Oil</option>
                    <option value="TyreOil">Tyre Oil</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="date"
                    className="block text-gray-700 text-xs sm:text-sm"
                  >
                    Order Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full p-1 sm:p-2 border border-gray-300 rounded-md text-xs sm:text-sm text-black placeholder-black"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full sm:w-80 bg-gray-700 text-white p-2 rounded-md hover:bg-gray-500 text-xs sm:text-sm"
                >
                  {isEditMode ? "Update Order" : "Add Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="text-left bg-gray-700 text-white">
              <th className="p-2 sm:p-3 border-b whitespace-nowrap">No:</th>
              <th className="p-2 sm:py-2 sm:px-4 border-b whitespace-nowrap">
                Client Name
              </th>
              <th className="p-2 sm:py-2 sm:px-4 border-b whitespace-nowrap">
                Order Place
              </th>
              <th className="p-2 sm:py-2 sm:px-4 border-b whitespace-nowrap">
                Fuel Type
              </th>
              <th className="p-2 sm:py-2 sm:px-4 border-b whitespace-nowrap">
                Liters
              </th>
              <th className="p-2 sm:py-2 sm:px-4 border-b whitespace-nowrap">
                Fuel Per Liter Price
              </th>
              <th className="p-2 sm:py-2 sm:px-4 border-b whitespace-nowrap">
                Fuel Price
              </th>
              <th className="p-2 sm:py-2 sm:px-4 border-b whitespace-nowrap">
                Paid Amount
              </th>
              <th className="p-2 sm:py-2 sm:px-4 border-b whitespace-nowrap">
                Pending Amount
              </th>
              <th className="p-2 sm:py-2 sm:px-4 border-b whitespace-nowrap">
                Date
              </th>
              <th className="p-2 sm:py-2 sm:px-4 border-b whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order, index) => (
              <tr key={order._id}>
                <td className="p-3 border-b text-black text-center align-middle">
                  {(currentPage - 1) * ordersPerPage + index + 1}
                </td>
                <td className="py-2 px-4 text-black text-center align-middle">
                  {order.clientName}
                </td>
                <td className="py-2 px-4 text-black text-center align-middle">
                  {order.orderPlace}
                </td>
                <td className="py-2 px-4 text-black text-center align-middle">
                  {order.fuelType}
                </td>
                <td className="py-2 px-4 text-black text-center align-middle">
                  {order.liters} Liters
                </td>
                <td className="py-2 px-4 text-black text-center align-middle">
                  {order.fuelPerLiterPrice} PKR
                </td>
                <td className="py-2 px-4 text-black text-center align-middle">
                  {order.fuelPrice} PKR
                </td>
                <td className="py-2 px-4 text-black text-center align-middle">
                  {order.paidAmount} PKR
                </td>
                <td className="py-2 px-4 text-black text-center align-middle">
                  {order.pendingAmount} PKR
                </td>
                <td className="py-2 px-4 text-black text-center align-middle">
                  {new Date(order.date).toLocaleDateString("en-GB")}
                </td>
                <td className="py-2 px-2 sm:px-4 text-center align-middle">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                    <button
                      onClick={() => handleEditOrder(index)}
                      className="text-green-600 hover:text-green-400 text-sm sm:text-base"
                      aria-label="Edit Order"
                    >
                      <FaEdit className="text-base sm:text-lg" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(order)}
                      className="text-red-600 hover:text-red-400 text-sm sm:text-base"
                      aria-label="Delete Order"
                    >
                      <FaTrash className="text-base sm:text-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-gray-500 disabled:text-gray-300"
        >
          Previous
        </button>
        <div className="text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-gray-500 disabled:text-gray-300"
        >
          Next
        </button>
      </div>

      {/* Delete Modal */}
      {deleteModalOpen && orderToDelete && (
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={() => {
            if (orderToDelete && orderToDelete._id) {
              handleDeleteOrder(orderToDelete._id);
            } else {
              console.error("Order ID is missing.");
            }
          }}
          itemName={orderToDelete ? orderToDelete._id : ""}
        />
      )}
    </div>
  );
};

export default OrdersComponent;
