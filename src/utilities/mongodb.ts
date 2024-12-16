// utils/mongodb.ts
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  throw new Error("MongoDB URI is not defined in the .env.local file");
}

let client: MongoClient;
let db: any;

export const connectToDatabase = async () => {
  if (client && db) {
    return { client, db }; // Return the existing connection if already established
  }

  client = new MongoClient(MONGO_URI);
  await client.connect();
  db = client.db(); // Connect to the database

  return { client, db };
};
