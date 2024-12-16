import { connectToDatabase } from "../../../../../utilities/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ message: "Invalid ID format" }), {
      status: 400,
    });
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
      return new Response(
        JSON.stringify({ message: "Inventory item not found" }),
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
      return new Response(
        JSON.stringify({ message: "Inventory item not found" }),
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

    return new Response(
      JSON.stringify({
        message: "Inventory item updated and stats adjusted successfully",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT handler:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
