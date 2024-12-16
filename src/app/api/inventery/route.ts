import { connectToDatabase } from "../../../utilities/mongodb";
import { ObjectId, WithId, Document } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parse incoming request body
    const {
      date,
      totalPetrolAdded,
      totalDieselAdded,
      agencyType,
      fuelAvailable,
      boughtByName,
    } = await req.json();

    // Log the received data for debugging
    console.log("Received Data:", {
      date,
      totalPetrolAdded,
      totalDieselAdded,
      agencyType,
      fuelAvailable,
      boughtByName,
    });

    // Validate date format
    const dateObject = new Date(date);
    if (isNaN(dateObject.getTime())) {
      return NextResponse.json(
        { message: "Invalid date format" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (totalPetrolAdded == null || totalDieselAdded == null || !boughtByName) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Connect to the database
    const { db } = await connectToDatabase();
    const inventoryCollection = db.collection("inventory");
    const statsCollection = db.collection("stats"); // Collection for stats tracking

    // Create new inventory record
    const newInventory = {
      date: dateObject,
      totalPetrolAdded,
      totalDieselAdded,
      agencyType,
      fuelAvailable,
      boughtByName,
    };

    // Insert the new inventory data into the collection
    const result = await inventoryCollection.insertOne(newInventory);
    if (!result.acknowledged) {
      return NextResponse.json(
        { message: "Failed to add inventory to database" },
        { status: 500 }
      );
    }

    // Fetch stats for updating
    const statsId = new ObjectId("6750d7d3ab44baeae6da118c"); // Fixed ObjectId for stats
    let stats: WithId<Document> | null = await statsCollection.findOne({
      _id: statsId,
    });

    // If stats are not found, create a new stats record
    if (!stats) {
      stats = {
        totalPetrolSold: 0,
        totalDieselSold: 0,
        totalPetrolAdded: 0,
        totalDieselAdded: 0,
        remainingPetrol: 0,
        remainingDiesel: 0,
        _id: statsId,
      };

      // Insert the new stats record
      await statsCollection.insertOne(stats);
      console.log("New stats record created.");
    }

    // Prepare update fields for stats collection
    const updateFields: any = {
      $inc: {
        totalPetrolAdded: totalPetrolAdded, // Increment petrol added
        totalDieselAdded: totalDieselAdded, // Increment diesel added
        remainingPetrol: totalPetrolAdded, // Increment remaining petrol
        remainingDiesel: totalDieselAdded, // Increment remaining diesel
      },
    };

    // Update the stats collection
    const statsResult = await statsCollection.updateOne(
      { _id: stats._id },
      updateFields,
      { upsert: true }
    );

    // Log the result of the update operation
    console.log("Stats Update Result:", statsResult);

    // Return the response with success message
    return NextResponse.json(
      {
        message: "Inventory added successfully",
        inventory: newInventory,
        stats: {
          totalPetrolSold: stats.totalPetrolSold,
          totalDieselSold: stats.totalDieselSold,
          totalPetrolAdded: stats.totalPetrolAdded + totalPetrolAdded,
          totalDieselAdded: stats.totalDieselAdded + totalDieselAdded,
          remainingPetrol: stats.remainingPetrol + totalPetrolAdded,
          remainingDiesel: stats.remainingDiesel + totalDieselAdded,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    // Log the error for debugging
    if (error instanceof Error) {
      console.error("Error adding inventory to MongoDB:", error);
      return NextResponse.json(
        { message: "Failed to add inventory", error: error.message },
        { status: 500 }
      );
    }

    // Handle unknown errors
    console.error("Unknown error:", error);
    return NextResponse.json(
      { message: "Failed to add inventory", error: "Unknown error" },
      { status: 500 }
    );
  }
}
