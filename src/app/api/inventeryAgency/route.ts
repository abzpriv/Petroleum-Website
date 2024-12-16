import { connectToDatabase } from "../../../utilities/mongodb";
import { NextResponse } from "next/server";
import { ObjectId, WithId, Document } from "mongodb";

export async function POST(req: Request) {
  try {
    // Parse incoming request body
    const { date, fuelType, totalAdded, boughtBy } = await req.json();

    // Log the received data for debugging
    console.log("Received Data:", {
      date,
      fuelType,
      totalAdded,
      boughtBy,
    });

    // Convert totalAdded to a number to avoid the MongoDB error
    const totalAddedNum = Number(totalAdded);
    if (isNaN(totalAddedNum)) {
      return NextResponse.json(
        { message: "Invalid totalAdded value. It must be a number" },
        { status: 400 }
      );
    }

    // Validate date format
    const dateObject = new Date(date);
    if (isNaN(dateObject.getTime())) {
      return NextResponse.json(
        { message: "Invalid date format" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (totalAdded == null || !boughtBy || !fuelType) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Connect to MongoDB using the connectToDatabase utility
    const { db } = await connectToDatabase();
    const agencyInventoryCollection = db.collection("agencyInventory");
    const statsCollection = db.collection("statsAgency");

    // Create new inventory record
    const newInventory = {
      date: dateObject,
      fuelType,
      totalAdded: totalAddedNum, // Use the numeric value for totalAdded
      boughtBy,
    };

    // Insert the new inventory data into the collection
    const result = await agencyInventoryCollection.insertOne(newInventory);
    if (!result.acknowledged) {
      console.error("Failed to insert inventory data:", result);
      return NextResponse.json(
        { message: "Failed to add inventory to database" },
        { status: 500 }
      );
    }

    console.log("New inventory added to the database:", newInventory);

    // Fetch stats for updating
    let stats: WithId<Document> | null = await statsCollection.findOne({});
    if (!stats) {
      stats = {
        totalPetrolAdded: 0,
        totalDieselAdded: 0,
        totalKeroseneOilAdded: 0,
        totalNROilAdded: 0,
        totalTyreOilAdded: 0,
        remainingPetrol: 0,
        remainingDiesel: 0,
        remainingKeroseneOil: 0,
        remainingNROil: 0,
        remainingTyre: 0,
        _id: new ObjectId(),
      };
      await statsCollection.insertOne(stats);
      console.log("New stats record created.");
    }

    const sanitizedFuelType = fuelType.replace(/\s+/g, "");
    const updateFields: any = {
      $inc: {
        [`total${sanitizedFuelType}Added`]: totalAddedNum,
        [`remaining${sanitizedFuelType}`]: totalAddedNum,
      },
    };

    console.log("Updating stats collection...");
    const statsResult = await statsCollection.updateOne(
      { _id: stats._id },
      updateFields
    );

    console.log("Stats Update Result:", statsResult);

    return NextResponse.json(
      {
        message: "Inventory added successfully",
        inventory: newInventory,
        stats: {
          totalPetrolSold: stats.totalPetrolSold,
          totalDieselSold: stats.totalDieselSold,
          totalPetrolAdded: stats.totalPetrolAdded + totalAddedNum,
          totalDieselAdded: stats.totalDieselAdded + totalAddedNum,
          totalKeroseneOilAdded: stats.totalKeroseneOilAdded + totalAddedNum,
          totalNROilAdded: stats.totalNROilAdded + totalAddedNum,
          totalTyreOilAdded: stats.totalTyreOilAdded + totalAddedNum,
          remainingPetrol: stats.remainingPetrol + totalAddedNum,
          remainingDiesel: stats.remainingDiesel + totalAddedNum,
          remainingKeroseneOil: stats.remainingKeroseneOil + totalAddedNum,
          remainingNROil: stats.remainingNROil + totalAddedNum,
          remainingTyre: stats.remainingTyre + totalAddedNum,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error occurred while adding inventory:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Failed to add inventory", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Failed to add inventory", error: "Unknown error" },
      { status: 500 }
    );
  }
}
