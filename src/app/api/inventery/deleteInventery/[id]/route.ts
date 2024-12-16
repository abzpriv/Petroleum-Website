import { connectToDatabase } from "../../../../../utilities/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function DELETE({ params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const { db } = await connectToDatabase();
    const objectId = new ObjectId(id);

    // Fetch the inventory item to get details before deletion
    const inventoryItem = await db
      .collection("inventory")
      .findOne({ _id: objectId });

    if (!inventoryItem) {
      return NextResponse.json(
        { message: "Inventory item not found" },
        { status: 404 }
      );
    }

    // Delete the inventory item
    const result = await db
      .collection("inventory")
      .deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Inventory item not found" },
        { status: 404 }
      );
    }

    // Decrement remaining petrol and diesel based on deleted inventory item
    const statsUpdateResult = await db.collection("stats").updateOne(
      {},
      {
        $inc: {
          totalPetrolAdded: -inventoryItem.totalPetrolAdded,
          totalDieselAdded: -inventoryItem.totalDieselAdded,
          remainingPetrol: -inventoryItem.totalPetrolAdded, // Decrement remaining petrol
          remainingDiesel: -inventoryItem.totalDieselAdded, // Decrement remaining diesel
        },
      }
    );

    console.log("Stats update result:", statsUpdateResult);

    // Recalculate stats if inventory is now empty
    const inventoryCount = await db.collection("inventory").countDocuments();
    if (inventoryCount === 0) {
      await db.collection("stats").updateOne(
        {},
        {
          $set: {
            remainingPetrol: 0,
            remainingDiesel: 0,
          },
        }
      );
      console.log("Inventory is empty, reset remaining values to 0.");
    }

    return NextResponse.json({
      message: "Inventory item deleted and stats updated successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      {
        status: 500,
      }
    );
  }
}
