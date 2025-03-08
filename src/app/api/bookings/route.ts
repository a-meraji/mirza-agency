import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/app/lib/models";
import dbConnect from "@/app/lib/mongodb";
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

// GET all bookings (admin only)
export async function GET(req: NextRequest) {
  try {
    // Ensure DB connection is established
    await dbConnect();
    
    // Get session with retry
    let session;
    try {
      session = await getServerSession(authOptions);
    } catch (error) {
      console.error("Error getting session:", error);
      return NextResponse.json({ 
        error: "Authentication error", 
        details: error instanceof Error ? error.message : String(error) 
      }, { status: 401 });
    }
    
    // Check if user is authenticated
    if (!session) {
      console.log("Authentication failed: No session found");
      return NextResponse.json({ 
        error: "Authentication required",
        message: "Please log in to access this resource" 
      }, { status: 401 });
    }
    
    // Check if user is admin
    if (session.user.role !== 'admin') {
      console.log(`User ${session.user.email} attempted to access admin-only endpoint with role: ${session.user.role}`);
      return NextResponse.json({ error: "Admin privileges required" }, { status: 403 });
    }
    
    const bookings = await retryOperation(() => 
      db.booking.findMany({
        include: {
          availableAppointment: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    );
    
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json({ 
      error: "Failed to fetch bookings", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}

// POST to create a new booking
export async function POST(req: NextRequest) {
  try {
    // Ensure DB connection is established
    await dbConnect();
    
    const { appointmentId, name, email, phone, notes, selectedServices } = await req.json();
    
    if (!appointmentId || !name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // Check if appointment exists and is not already booked
    const appointment = await retryOperation(() => 
      db.availableAppointment.findUnique({
        where: { id: appointmentId }
      })
    );
    
    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }
    
    if (appointment.isBooked) {
      return NextResponse.json({ error: "Appointment is already booked" }, { status: 400 });
    }
    
    // Create booking and update appointment in a transaction
    const result = await retryOperation(() => 
      db.$transaction([
        db.booking.create({
          data: {
            name,
            email,
            phone,
            notes,
            selectedServices,
            appointmentId
          } as any // Type assertion to fix the type error
        }),
        db.availableAppointment.update({
          where: { id: appointmentId },
          data: { isBooked: true }
        })
      ])
    );
    
    return NextResponse.json({ 
      success: true, 
      booking: result[0],
      appointment: result[1]
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ 
      error: "Failed to create booking", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
} 