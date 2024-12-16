// src/app/api/inventery/updateInventery/[id]/route.ts
import { connectToDatabase } from "../../../../../utilities/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server"; // Import NextRequest and NextResponse

export async function PUT(req: NextRequest) {
  // Extract the 'id' from the URL path
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop(); // Extract the dynamic 'id' part from the URL

  if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid or missing ID format" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const { totalPetrolAdded, totalDieselAdded, boughtByName, agencyType } =
      body;

    const { db } = await connectToDatabase();
    const objectId = new ObjectId(id);

    const existingItem = await db
      .collection("inventory")
      .findOne({ _id: objectId });
    if (!existingItem) {
      return NextResponse.json(
        { message: "Inventory item not found" },
        { status: 404 }
      );
    }

    const petrolDiff =
      (totalPetrolAdded || 0) - (existingItem.totalPetrolAdded || 0);
    const dieselDiff =
      (totalDieselAdded || 0) - (existingItem.totalDieselAdded || 0);

    const result = await db.collection("inventory").updateOne(
      { _id: objectId },
      {
        $set: {
          totalPetrolAdded,
          totalDieselAdded,
          boughtByName,
          agencyType,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Inventory item not found" },
        { status: 404 }
      );
    }

    await db.collection("stats").updateOne(
      {},
      {
        $inc: {
          totalPetrolAdded: petrolDiff,
          totalDieselAdded: dieselDiff,
          remainingPetrol: petrolDiff,
          remainingDiesel: dieselDiff,
        },
      },
      { upsert: true }
    );

    return NextResponse.json(
      { message: "Inventory item updated and stats adjusted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT handler:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
