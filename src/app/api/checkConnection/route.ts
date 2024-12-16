// src/app/api/checkConnection/route.ts
import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server"; // Import NextResponse for returning responses

export async function GET() {
  try {
    console.log("Checking MongoDB connection...");
    const client = await clientPromise;
    const db = client.db();
    console.log("MongoDB connected to", db.databaseName);

    // Return a JSON response using NextResponse
    return NextResponse.json({
      message: "MongoDB connected successfully",
      dbName: db.databaseName,
    });
  } catch (error: unknown) {
    console.error("MongoDB connection failed:", error);

    // Type guard to check if error is an instance of Error
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: "MongoDB connection failed",
          error: error.message,
        },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        {
          message: "MongoDB connection failed",
          error: "Unknown error occurred",
        },
        { status: 500 }
      );
    }
  }
}
