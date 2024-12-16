import { connectToDatabase } from "../../../utilities/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    console.log("Received email:", email);
    console.log("Received password:", password);

    // Connect to MongoDB using the connectToDatabase utility
    const { db } = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Fetch the user from the database
    const user = await usersCollection.findOne({ email });
    console.log("User from DB:", user);

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Ensure password and user.passwordHash are strings
    if (typeof password !== "string" || typeof user.password !== "string") {
      console.error("Password or stored password hash is not a string");
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log("Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Successful login - you can set cookies or JWT here if required
    return NextResponse.json({ message: "Login successful" }, { status: 200 });
  } catch (error: unknown) {
    // Error handling
    if (error instanceof Error) {
      console.error("Error during login:", error.message);
      return NextResponse.json(
        { message: "Internal server error", error: error.message },
        { status: 500 }
      );
    }

    console.error("Unknown error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: "Unknown error" },
      { status: 500 }
    );
  }
}
