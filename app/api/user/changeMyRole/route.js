import connectDB from "@/lib/db.js";
import User from "@/models/User";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server"; // Ensure this is imported

export async function POST(request) {
    const {getUser, isAuthenticated} = await getKindeServerSession();
    await connectDB();
    const userData = await getUser();

    const { role } = await request.json();

    const user = await User.findOne({ email: userData.email });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    try {
        user.role = role; // Set the new role
        await user.save(); // Save the user
        return NextResponse.json({ message: "Role changed successfully" }, { status: 200 }); // Success response
    } catch (error) {
        console.error('Error changing role:', error);
        return NextResponse.json({ error: "Failed to change role" }, { status: 500 });
    }
}
