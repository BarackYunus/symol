import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    await connectDB();
    
    const { identifier } = await request.json();

    // Find user by username, telegram username, or phone number
    const user = await User.findOne({
      $or: [
        { username: identifier },
        { telegramUsername: identifier },
        { phoneNumber: identifier }
      ]
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Here you would typically:
    // 1. Generate a Telegram login code
    // 2. Send it to the user's Telegram account
    // 3. Wait for verification
    // For now, we'll just return success

    return NextResponse.json({
      message: 'Login successful',
      user: {
        username: user.username,
        telegramUsername: user.telegramUsername
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Error during login' },
      { status: 500 }
    );
  }
} 