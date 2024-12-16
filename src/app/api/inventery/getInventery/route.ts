import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../utilities/mongodb";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");

    const dateFilter = dateParam ? new Date(dateParam) : null;

    // Connect to MongoDB using the utility function
    const { db } = await connectToDatabase();
    const inventoryCollection = db.collection("inventory");

    const query: any = {};
    if (dateFilter) {
      query.date = {
        $gte: dateFilter,
        $lt: new Date(dateFilter.getTime() + 86400000), // Filter for the same day
      };
    }

    // Fetch the inventory data based on the query filter
    const inventoryData = await inventoryCollection.find(query).toArray();

    // Return the fetched inventory data
    return NextResponse.json(inventoryData);
  } catch (error) {
    console.error("Error fetching inventory data:", error);
    return NextResponse.json(
      { message: "Failed to fetch inventory data" },
      { status: 500 }
    );
  }
}
