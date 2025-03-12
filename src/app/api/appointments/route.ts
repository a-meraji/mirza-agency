import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/models";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";

// Helper function to retry database operations
async function retryOperation<T>(operation: () => Promise<T>, maxRetries = 5, delay = 1000): Promise<T> {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Ensure DB connection is established before each attempt
      await dbConnect();
      
      // Check MongoDB connection state
      if (mongoose.connection.readyState !== 1) {
        console.log(`MongoDB not connected (state: ${mongoose.connection.readyState}), reconnecting...`);
        await dbConnect();
      }
      
      return await operation();
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt}/${maxRetries} failed:`, error);
      
      // If this is a connection error, try to reconnect
      if (error instanceof mongoose.Error.MongooseServerSelectionError || 
          (error instanceof Error && error.message.includes('buffering timed out'))) {
        console.log('Connection error detected, forcing reconnection...');
        // Force reconnection
        mongoose.connection.close();
        await dbConnect();
      }
      
      if (attempt < maxRetries) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        // Increase delay for next retry (exponential backoff)
        delay *= 2;
      }
    }
  }
  throw lastError;
}

// GET all available appointments
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const showAll = searchParams.get('showAll') === 'true';
    
    // Ensure DB connection is established
    await dbConnect();
    
    // For admin, we can show all appointments if requested
    // For regular users, only show available (not booked) appointments
    const appointments = await retryOperation(() => 
      db.availableAppointment.findMany({
        where: showAll ? {} : { isBooked: false },
        orderBy: [
          { date: 'asc' },
          { startTime: 'asc' }
        ],
        include: {
          booking: showAll // Include booking details for admin view
        }
      })
    );
    
    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json({ 
      error: "Failed to fetch appointments", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}

// POST to create a new available appointment (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Ensure DB connection is established
    await dbConnect();
    
    const { date, startTime, endTime, duration } = await req.json();
    
    if (!date || !startTime || !endTime || !duration) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const appointment = await retryOperation(() => 
      db.availableAppointment.create({
        data: {
          date: new Date(date),
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          duration: parseInt(duration),
          isBooked: false
        } as any // Type assertion to fix the type error
      })
    );
    
    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json({ 
      error: "Failed to create appointment", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
} 