import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../../utilities/mongodb";

export async function DELETE(req: Request) {
  console.log("Request URL:", req.url);

  // Extract the orderId from the URL path
  const url = new URL(req.url);
  const orderId = url.pathname.split("/").pop(); // Extracts the last part of the URL

  console.log("Received orderId:", orderId); // Log the orderId to check

  if (!orderId) {
    // If orderId is not provided, return an error
    return NextResponse.json(
      { message: "Order ID is required" },
      { status: 400 }
    );
  }

  try {
    // Convert the orderId to ObjectId (MongoDB uses ObjectId for _id fields)
    const objectId = new ObjectId(orderId);

    // Connect to MongoDB using the utility function
    const { db } = await connectToDatabase();
    const ordersCollection = db.collection("orders");
    const statsCollection = db.collection("stats"); // Assuming the stats collection is named "stats"

    // Fetch the order to get its data before deletion
    const order = await ordersCollection.findOne({ _id: objectId });

    // If the order is not found, return an error
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Prepare the statistics update
    const updateStats: { [key: string]: number } = {};

    // Decrement totalRevenue (using paidAmount from the order)
    updateStats["totalRevenue"] = order.paidAmount;

    // Decrement totalPendingAmount (using pendingAmount from the order)
    updateStats["totalPendingAmount"] = order.pendingAmount;

    // Decrement totalFuelSoldByDiesel or totalFuelSoldByPetrol based on fuelType
    if (order.fuelType === "Diesel") {
      updateStats["totalFuelSoldByDiesel"] = order.liters;
    } else if (order.fuelType === "Petrol") {
      updateStats["totalFuelSoldByPetrol"] = order.liters;
    }

    // Decrement totalOrdersCount
    updateStats["totalOrdersCount"] = 1;

    // Update the stats collection by decrementing the relevant fields
    await statsCollection.updateOne(
      {}, // Assuming the stats document is a single document without any filters
      {
        $inc: {
          totalRevenue: -updateStats["totalRevenue"],
          totalPendingAmount: -updateStats["totalPendingAmount"],
          totalFuelSoldByDiesel: -updateStats["totalFuelSoldByDiesel"] || 0,
          totalFuelSoldByPetrol: -updateStats["totalFuelSoldByPetrol"] || 0,
          totalOrdersCount: -updateStats["totalOrdersCount"],
        },
      }
    );

    // Delete the order by its ObjectId
    const deleteResult = await ordersCollection.deleteOne({ _id: objectId });

    // If no order was deleted, return an error
    if (deleteResult.deletedCount === 0) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Return success message
    return NextResponse.json(
      { message: "Order deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    // Error handling
    if (error instanceof Error) {
      console.error("Error deleting order from MongoDB:", error);
      return NextResponse.json(
        { message: "Failed to delete order", error: error.message },
        { status: 500 }
      );
    }

    console.error("Unknown error:", error);
    return NextResponse.json(
      { message: "Failed to delete order", error: "Unknown error" },
      { status: 500 }
    );
  }
}
