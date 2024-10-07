// pages/api/user/role.js
import connectDB from "@/lib/db.js";
import User from "@/models/User";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server"; 

export async function GET(request) {
    const { getUser } = await getKindeServerSession();
    await connectDB();
    
    try {
        const userData = await getUser();

        if (!userData) {
            return NextResponse.json({ error: "User is not authenticated" }, { status: 401 });
        }

        const user = await User.findOne({ email: userData.email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ newRole: user.role }, { status: 200 });
    } catch (error) {
        console.error('Error fetching role:', error);
        return NextResponse.json({ error: "Failed to fetch role" }, { status: 500 });
    }
}
