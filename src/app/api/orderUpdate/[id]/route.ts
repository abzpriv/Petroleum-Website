import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { connectToDatabase } from "../../../../utilities/mongodb"; // Import the utility function for DB connection

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const orderId = url.pathname.split("/").pop();

    // Check if orderId is valid
    if (!orderId || !ObjectId.isValid(orderId)) {
      return NextResponse.json(
        { message: "Invalid or missing orderId" },
        { status: 400 }
      );
    }

    // Extract the fields from the request body
    const {
      clientName,
      orderPlace,
      fuelType,
      liters,
      fuelPerLiterPrice,
      fuelPrice,
      paidAmount,
      pendingAmount,
      date,
    } = await req.json();

    // Parse date to Date object
    const dateObject = new Date(date);
    if (isNaN(dateObject.getTime())) {
      return NextResponse.json(
        { message: "Invalid date format" },
        { status: 400 }
      );
    }

    // Connect to MongoDB using the connectToDatabase utility
    const { db } = await connectToDatabase();
    const ordersCollection = db.collection("orders");

    // Prepare updated order object
    const updatedOrder = {
      clientName,
      orderPlace,
      fuelType,
      liters,
      fuelPerLiterPrice,
      fuelPrice,
      paidAmount,
      pendingAmount,
      date: dateObject,
      timestamp: new Date(), // Track when the update was made
    };

    // Update the order document by orderId
    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: updatedOrder }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Order updated successfully", order: updatedOrder },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error updating order in MongoDB:", error);
      return NextResponse.json(
        { message: "Failed to update order", error: error.message },
        { status: 500 }
      );
    }

    console.error("Unknown error:", error);
    return NextResponse.json(
      { message: "Failed to update order", error: "Unknown error" },
      { status: 500 }
    );
  }
}
