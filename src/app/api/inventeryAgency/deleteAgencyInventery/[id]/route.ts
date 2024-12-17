import { connectToDatabase } from "../../../../../utilities/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  // Extract the 'id' from the URL
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop(); // Extract 'id' from the path

  // Validate the ID
  if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: "Invalid or missing ID format" },
      { status: 400 }
    );
  }

  try {
    const { db } = await connectToDatabase();
    const objectId = new ObjectId(id);

    // Fetch the inventory item to get details before deletion
    const inventoryItem = await db
      .collection("agencyInventory")
      .findOne({ _id: objectId });

    if (!inventoryItem) {
      return NextResponse.json(
        { message: "Inventory item not found" },
        { status: 404 }
      );
    }

    // Delete the inventory item
    const result = await db
      .collection("agencyInventory")
      .deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Inventory item not found" },
        { status: 404 }
      );
    }

    // Check which fuelType was deleted and update the stats accordingly
    const fuelType = inventoryItem.fuelType;
    const totalAdded = inventoryItem.totalAdded;

    const updateFields: any = {
      $inc: {},
    };

    // Decrement relevant fields based on the fuelType
    if (fuelType === "Petrol" && totalAdded !== 0) {
      updateFields.$inc = {
        totalPetrolAdded: -totalAdded,
        remainingPetrol: -totalAdded,
      };
    } else if (fuelType === "Diesel" && totalAdded !== 0) {
      updateFields.$inc = {
        totalDieselAdded: -totalAdded,
        remainingDiesel: -totalAdded,
      };
    } else if (fuelType === "KeroseneOil" && totalAdded !== 0) {
      updateFields.$inc = {
        totalKeroseneOilAdded: -totalAdded,
        remainingKeroseneOil: -totalAdded,
      };
    } else if (fuelType === "NROil" && totalAdded !== 0) {
      updateFields.$inc = {
        totalNROilAdded: -totalAdded,
        remainingNROil: -totalAdded,
      };
    } else if (fuelType === "TyreOil" && totalAdded !== 0) {
      updateFields.$inc = {
        totalTyreOilAdded: -totalAdded,
        remainingTyre: -totalAdded,
      };
    }

    // Update stats if applicable
    if (Object.keys(updateFields.$inc).length > 0) {
      await db.collection("statsAgency").updateOne({}, updateFields);
    }

    // Recalculate stats if inventory is now empty
    const inventoryCount = await db
      .collection("agencyInventory")
      .countDocuments();

    if (inventoryCount === 0) {
      await db.collection("statsAgency").updateOne(
        {},
        {
          $set: {
            remainingPetrol: 0,
            remainingDiesel: 0,
            remainingKeroseneOil: 0,
            remainingNROil: 0,
            remainingTyre: 0,
          },
        }
      );
    }

    return NextResponse.json(
      {
        message: "Inventory item deleted and stats updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
