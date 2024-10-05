import { NextResponse } from "next/server";
import jwksClient from "jwks-rsa";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing
import User from "@/models/User.js"; // Import your Mongoose User model
import dbConnect from "@/lib/db.js"; // Import the db connection utility

// JWKS client configuration
const client = jwksClient({
  jwksUri: `${process.env.KINDE_ISSUER_URL}/.well-known/jwks.json`,
});

export async function POST(req) {
  try {
    // Connect to MongoDB
    await dbConnect();

    // Get the token from the request
    const token = await req.text();

    // Decode the token
    const jwtDecoded = jwt.decode(token, { complete: true });

    if (!jwtDecoded) {
      return NextResponse.json({
        status: 500,
        statusText: "Error decoding JWT",
      });
    }

    const { header } = jwtDecoded;
    const { kid } = header;

    // Verify the token
    const key = await client.getSigningKey(kid);
    const signingKey = key.getPublicKey();
    const event = jwt.verify(token, signingKey);

    // Handle various events
    switch (event?.type) {
      case "user.created": {
        // Extract user data from event
        const user = event.data.user;
        const username = "kinde" + user.id;
        const email = user.email;
        const name = user.first_name + " " + user.last_name || null;

        // Check if user already exists (to avoid duplicate entries)
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          console.log("User already exists");
          break;
        }

        // Generate a secure hashed password
        const plainPassword = "kindepassword" + user.id + "123456"; // Example password logic
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);

        // Create the user in MongoDB with hashed password
        const newUser = await User.create({
          username,
          email,
          name,
          password: hashedPassword, // Save the hashed password
        });

        break;
      }
      default:
        console.log("Event not handled:", event.type);
        break;
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
  }

  return NextResponse.json({ status: 200, statusText: "Success" });
}
