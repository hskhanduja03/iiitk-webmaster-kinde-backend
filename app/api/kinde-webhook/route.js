import { NextResponse } from "next/server";
import jwksClient from "jwks-rsa";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; 
import User from "@/models/User.js"; 
import connectDB from "@/lib/db.js"; 

const client = jwksClient({
  jwksUri: `${process.env.KINDE_ISSUER_URL}/.well-known/jwks.json`,
});

export async function POST(req) {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();
    console.log("Database connected successfully");

    console.log("Retrieving token from the request body...");
    const token = await req.text();

    console.log("Decoding JWT...");
    const jwtDecoded = jwt.decode(token, { complete: true });

    if (!jwtDecoded) {
      console.error("Error: JWT decoding failed");
      return NextResponse.json({
        status: 500,
        statusText: "Error decoding JWT",
      });
    }

    const { header } = jwtDecoded;
    const { kid } = header;

    console.log("Verifying token with JWKS...");
    const key = await client.getSigningKey(kid);
    const signingKey = key.getPublicKey();

    const event = jwt.verify(token, signingKey);

    switch (event?.type) {
      case "user.created": {
        console.log("Handling 'user.created' event...");

        const user = event.data.user;

        const username = "kinde" + user.id;
        const email = user.email;
        const name = user.first_name + " " + user.last_name || null;

        console.log("Checking if user already exists in the database...");
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          console.log("User already exists in the database, skipping creation.");
          break;
        }

        console.log("Generating hashed password...");
        const plainPassword = "kindepassword" + user.id + "123456"; 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);

        console.log("Creating new user in the database...");
        const newUser = await User.create({
          username,
          email,
          name,
          password: hashedPassword, 
        });

        break;
      }
      default:
        console.log("Event not handled:", event.type);
        break;
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error occurred:", err.message);
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
  }

  return NextResponse.json({ status: 200, statusText: "Success" });
}
