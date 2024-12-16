import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../utilities/mongodb"; // Import the connection utility

export async function GET(req: Request) {
  try {
    // Connect to MongoDB using the reusable connection utility
    const { db } = await connectToDatabase();
    const statsCollection = db.collection("stats");

    // Fetch the latest stats data
    const stats = await statsCollection.findOne({}); // Fetch the first available stats

    if (!stats) {
      return NextResponse.json({ message: "Stats not found" }, { status: 404 });
    }

    // Return the fetched stats data
    return NextResponse.json(stats, { status: 200 });
  } catch (error: unknown) {
    // Handle errors in a more robust way
    if (error instanceof Error) {
      console.error("Error fetching stats:", error.message);
      return NextResponse.json(
        { message: "Error fetching stats", error: error.message },
        { status: 500 }
      );
    }

    console.error("Unexpected error:", error);
    return NextResponse.json(
      { message: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
