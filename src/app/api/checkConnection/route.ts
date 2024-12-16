// app/api/checkConnection/route.ts
import clientPromise from "../../../lib/mongodb";

export async function GET(req: Request, res: Response) {
  try {
    console.log("Checking MongoDB connection...");
    const client = await clientPromise;
    const db = client.db();
    console.log("MongoDB connected to", db.databaseName);
    return new Response(
      JSON.stringify({
        message: "MongoDB connected successfully",
        dbName: db.databaseName,
      }),
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("MongoDB connection failed:", error);

    // Type guard to check if error is an instance of Error
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({
          message: "MongoDB connection failed",
          error: error.message,
        }),
        { status: 500 }
      );
    } else {
      return new Response(
        JSON.stringify({
          message: "MongoDB connection failed",
          error: "Unknown error occurred",
        }),
        { status: 500 }
      );
    }
  }
}
