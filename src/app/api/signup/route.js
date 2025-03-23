import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { username, telegramUsername, phoneNumber, country, gender } = body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { username },
        { telegramUsername },
        { phoneNumber }
      ]
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Username, Telegram username, or phone number already exists' },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({
      username,
      telegramUsername,
      phoneNumber,
      country,
      gender
    });

    return NextResponse.json(
      { message: 'User created successfully', user },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Error creating user' },
      { status: 500 }
    );
  }
} 