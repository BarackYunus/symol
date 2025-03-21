import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoConnect";
import User from "@/lib/models/User";

export async function POST(req) {
    try {
        await connectDB(); // Ensure DB connection

        const { name, username, phoneNumber, country } = await req.json();

        if (!name || !username || !phoneNumber || !country) {
            return NextResponse.json({ message: "Please fill in all fields." }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ username }, { phoneNumber }] });
        if (existingUser) {
            return NextResponse.json({ message: "Username or phone number already taken." }, { status: 400 });
        }

        // Create new user
        const newUser = new User({ name, username, phoneNumber, country });
        await newUser.save();

        return NextResponse.json({ message: "User registered successfully." }, { status: 201 });
    } catch (error) {
        console.error("Signup Error:", error);
        return NextResponse.json({ message: "Server error." }, { status: 500 });
    }
}
