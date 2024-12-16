import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../utilities/mongodb"; // Assuming this utility is created for DB connection
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    // Extract data from the request body
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
      agencyName,
    } = await req.json();

    const dateObject = new Date(date);

    // Check if the date is valid
    if (isNaN(dateObject.getTime())) {
      return NextResponse.json(
        { message: "Invalid date format" },
        { status: 400 }
      );
    }

    // Connect to MongoDB using the connectToDatabase utility
    const { db } = await connectToDatabase();
    const ordersCollection = db.collection("orders");
    const statsCollection = db.collection("stats");

    // Prepare new order document to insert into the orders collection
    const newOrder = {
      clientName,
      orderPlace,
      fuelType,
      liters,
      fuelPerLiterPrice,
      fuelPrice,
      paidAmount,
      pendingAmount,
      date: dateObject,
      agencyName,
    };

    // Insert the new order into the orders collection
    const result = await ordersCollection.insertOne(newOrder);

    // Convert fields to numbers to avoid any non-numeric issues
    const numericFuelPrice = Number(paidAmount);
    const numericPendingAmount = Number(pendingAmount);
    const numericLiters = Number(liters);

    // The fixed ObjectId for the stats document (you can change this to your specific needs)
    const statsId = new ObjectId("6750d7d3ab44baeae6da118c"); // Fixed ID

    // Prepare update fields to increment values in the stats collection
    const updateFields: any = {
      $inc: {
        totalOrdersCount: 1, // Increment the total order count by 1
        totalRevenue: numericFuelPrice, // Add the revenue from the order
        totalPendingAmount: numericPendingAmount, // Add the pending amount
      },
    };

    // Increment liters sold separately based on fuel type (Petrol/Diesel)
    if (fuelType === "Diesel") {
      updateFields.$inc.totalFuelSoldByDiesel = numericLiters;
    } else if (fuelType === "Petrol") {
      updateFields.$inc.totalFuelSoldByPetrol = numericLiters;
    }

    // Update the stats collection with the new fields
    await statsCollection.updateOne(
      { _id: statsId },
      updateFields,
      { upsert: true } // Create the document if it doesn't exist
    );

    // Fetch the updated stats document after the update
    const stats = await statsCollection.findOne({ _id: statsId });

    // Extract values, defaulting to 0 if stats are not found
    const totalOrdersCount = stats ? stats.totalOrdersCount : 0;
    const totalRevenue = stats ? stats.totalRevenue : 0;
    const totalPendingAmount = stats ? stats.totalPendingAmount : 0;
    const totalFuelSoldByPetrol = stats ? stats.totalFuelSoldByPetrol : 0;
    const totalFuelSoldByDiesel = stats ? stats.totalFuelSoldByDiesel : 0;

    // Return a successful response with the updated stats and new order details
    return NextResponse.json(
      {
        message: "Order added successfully",
        order: newOrder,
        totalOrdersCount,
        totalRevenue,
        totalPendingAmount,
        totalFuelSoldByPetrol,
        totalFuelSoldByDiesel,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Handle any errors that occur during the API call
    if (error instanceof Error) {
      console.error("Error adding order to MongoDB:", error);
      return NextResponse.json(
        { message: "Failed to add order", error: error.message },
        { status: 500 }
      );
    }

    console.error("Unknown error:", error);
    return NextResponse.json(
      { message: "Failed to add order", error: "Unknown error" },
      { status: 500 }
    );
  }
}
