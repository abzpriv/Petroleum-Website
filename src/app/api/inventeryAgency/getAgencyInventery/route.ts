import { connectToDatabase } from "../../../../utilities/mongodb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Extract search parameters from the URL
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");

    // Convert the date filter if provided
    const dateFilter = dateParam ? new Date(dateParam) : null;

    // Connect to the database using the utility
    const { db } = await connectToDatabase();
    const inventoryCollection = db.collection("agencyInventory");

    // Build the query object
    const query: any = {};
    if (dateFilter) {
      query.date = {
        $gte: dateFilter,
        $lt: new Date(dateFilter.getTime() + 86400000), // Filters for the date range
      };
    }

    // Fetch the inventory data based on the query
    const inventoryData = await inventoryCollection.find(query).toArray();

    // Return the fetched inventory data
    return NextResponse.json(inventoryData);
  } catch (error) {
    // Log the error for debugging
    console.error("Error fetching inventory data:", error);

    // Return an error response
    return NextResponse.json(
      { message: "Failed to fetch inventory data" },
      { status: 500 }
    );
  }
}
