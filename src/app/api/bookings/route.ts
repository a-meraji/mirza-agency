import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/app/lib/models";
import dbConnect from "@/app/lib/mongodb";
import { connectToDatabase } from "@/app/lib/db";
import mongoose from "mongoose";

// Helper function to retry database operations
async function retryOperation<T>(operation: () => Promise<T>, maxRetries = 5, delay = 1000): Promise<T> {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Make sure database connection is established before each attempt
      await connectToDatabase();
      
      return await operation();
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt}/${maxRetries} failed:`, error);
      
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
    await connectToDatabase();
    
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
    await connectToDatabase();
    
    const { appointmentId, name, email, phone, notes, selectedServices } = await req.json();
    
    if (!appointmentId || !name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // Check if appointment exists and is not already booked
    try {
      console.log(`Looking up appointment with ID: ${appointmentId}`);
      
      // Use findById directly instead of findUnique for more reliability
      const appointment = await retryOperation(() => 
        db.availableAppointment.findById({ id: appointmentId })
      );
      
      if (!appointment) {
        console.error(`Appointment with ID ${appointmentId} not found`);
        return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
      }
      
      console.log(`Found appointment:`, JSON.stringify(appointment, null, 2));
      
      if (appointment.isBooked) {
        return NextResponse.json({ error: "Appointment is already booked" }, { status: 400 });
      }
      
      // Create booking and update appointment in a transaction
      console.log(`Starting transaction to book appointment ${appointment.id}`);
      try {
        const bookingData = {
          name,
          email,
          phone,
          notes,
          selectedServices,
          appointmentId: appointment.id // Use the confirmed ID from the found appointment
        };
        
        console.log(`Creating booking with data:`, JSON.stringify(bookingData, null, 2));
        
        const result = await retryOperation(() => 
          db.$transaction([
            db.booking.create({
              data: bookingData as any // Type assertion to fix the type error
            }),
            db.availableAppointment.update({
              id: appointment.id, // Use the id format that works with the model
              data: { isBooked: true }
            })
          ])
        );
        
        console.log(`Transaction completed successfully`);
        return NextResponse.json({ 
          success: true, 
          booking: result[0],
          appointment: result[1]
        });
      } catch (error) {
        console.error(`Error during booking transaction:`, error);
        return NextResponse.json({ 
          error: `Error creating booking: ${error instanceof Error ? error.message : 'Unknown error'}` 
        }, { status: 500 });
      }
    } catch (error) {
      console.error(`Error looking up appointment:`, error);
      return NextResponse.json({ 
        error: `Error looking up appointment: ${error instanceof Error ? error.message : 'Unknown error'}` 
      }, { status: 500 });
    }
  } catch (error) {
    console.error(`Error looking up appointment:`, error);
    return NextResponse.json({ 
      error: `Error looking up appointment: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 });
  }
} 