import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../utilities/mongodb"; // Assuming this utility is created for DB connection

export async function GET(req: Request) {
  console.log("Request URL:", req.url);

  // The `req.url` doesn't include the full URL (only the path), so we must manually add the host
  const url = new URL(req.url, `http://${req.headers.get("host")}`); // Manually construct the full URL
  const agencyName = url.searchParams.get("agencyName"); // Extract query parameter

  console.log("Received agencyName:", agencyName); // Log the agencyName to check

  if (!agencyName) {
    // If agencyName is not provided, return an error
    return NextResponse.json(
      { message: "Agency name is required" },
      { status: 400 }
    );
  }

  try {
    // Connect to MongoDB using the connectToDatabase utility
    const { db } = await connectToDatabase();
    const ordersCollection = db.collection("orders");

    // Fetch all orders specific to the agencyName
    const orders = await ordersCollection.find({ agencyName }).toArray();

    // Return the orders data
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: unknown) {
    // Error handling
    if (error instanceof Error) {
      console.error("Error fetching orders data from MongoDB:", error);
      return NextResponse.json(
        { message: "Failed to fetch orders data", error: error.message },
        { status: 500 }
      );
    }

    console.error("Unknown error:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders data", error: "Unknown error" },
      { status: 500 }
    );
  }
}
