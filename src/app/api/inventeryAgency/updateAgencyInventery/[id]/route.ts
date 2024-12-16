import { connectToDatabase } from "../../../../../utilities/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Validate ObjectId
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid ObjectId" }, { status: 400 });
  }

  try {
    // Parse the request body
    const { date, fuelType, totalAdded, boughtBy } = await req.json();
    const totalAddedNum = Number(totalAdded);

    // Validate input data
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

    // Ensure required fields are provided
    if (!fuelType || !boughtBy) {
      return NextResponse.json(
        { message: "Missing required fields: fuelType or boughtBy" },
        { status: 400 }
      );
    }

    // Connect to MongoDB using the utility
    const { db } = await connectToDatabase();
    const agencyInventoryCollection = db.collection("agencyInventory");

    // Find the existing inventory item
    const existingInventory = await agencyInventoryCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!existingInventory) {
      return NextResponse.json(
        { message: "Inventory not found" },
        { status: 404 }
      );
    }

    // Update the inventory with the new data
    const updateFields = {
      $set: {
        totalAdded: totalAddedNum,
        fuelType,
        boughtBy,
        date: dateObject,
      },
    };

    const updateResult = await agencyInventoryCollection.updateOne(
      { _id: new ObjectId(id) },
      updateFields
    );

    if (!updateResult.modifiedCount) {
      return NextResponse.json(
        { message: "Failed to update existing inventory" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Inventory updated successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error occurred while updating inventory:", error);
    return NextResponse.json(
      {
        message: "Failed to update inventory",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
