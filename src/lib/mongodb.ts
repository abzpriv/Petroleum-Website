// lib/mongodb.ts
import { MongoClient } from "mongodb";

// Define a type for the global object to avoid TypeScript errors
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Ensure MongoDB URI is set
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  throw new Error("MongoDB URI not defined in environment variables");
}

const client = new MongoClient(mongoUri);

let clientPromise: Promise<MongoClient>;

// Use global variable in development to persist the connection across hot reloads
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = client.connect();
}

// Function to check MongoDB connection status
const checkConnection = async () => {
  try {
    const db = (await clientPromise).db();
    console.log("Connected to MongoDB:", db.databaseName);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("MongoDB connection failed:", error.message);
    } else {
      console.error("MongoDB connection failed: Unknown error");
    }
  }
};

// Optionally, you can call this function wherever you need to check the connection
// checkConnection();

export default clientPromise;
