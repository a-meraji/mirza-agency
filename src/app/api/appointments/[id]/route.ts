import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/app/lib/models";
import { connectToDatabase } from "@/app/lib/db";

// Helper function to handle errors consistently
function handleApiError(error: any, operation: string) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(`Error ${operation} appointment:`, error);
  return NextResponse.json({ 
    error: `Failed to ${operation} appointment`,
    details: errorMessage 
  }, { status: 500 });
}

// GET a specific appointment by ID
export async function GET(
  req: NextRequest, 
  context: { params: { id: string } }
) {
  try {
    // Ensure database connection is established
    await connectToDatabase();
    
    // Properly await and extract the ID parameter
    const params = context.params;
    const id = params.id;
    
    if (!id) {
      return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 });
    }
    
    console.log(`GET request for appointment ID: ${id}`);
    
    // Find the appointment
    const options = {
      where: { id },
      include: { booking: true }
    };
    
    const appointment = await db.availableAppointment.findUnique(options);
    
    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }
    
    return NextResponse.json(appointment);
  } catch (error) {
    return handleApiError(error, "fetching");
  }
}

// PUT to update an appointment (admin only)
export async function PUT(
  req: NextRequest, 
  context: { params: { id: string } }
) {
  try {
    // Ensure database connection is established
    await connectToDatabase();
    
    // Properly await and extract the ID parameter
    const params = context.params;
    const id = params.id;
    
    if (!id) {
      return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 });
    }
    
    console.log(`PUT request for appointment ID: ${id}`);
    
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { date, startTime, endTime, duration, isBooked } = await req.json();
    
    // Check if appointment exists
    const findOptions = {
      where: { id }
    };
    
    const existingAppointment = await db.availableAppointment.findUnique(findOptions);
    
    if (!existingAppointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }
    
    // Update appointment
    const updatedAppointment = await db.availableAppointment.update({
      where: { id },
      data: {
        date,
        startTime,
        endTime,
        duration,
        isBooked
      }
    });
    
    return NextResponse.json(updatedAppointment);
  } catch (error) {
    return handleApiError(error, "updating");
  }
}

// DELETE an appointment (admin only)
export async function DELETE(
  req: NextRequest, 
  context: { params: { id: string } }
) {
  try {
    // Ensure database connection is established
    await connectToDatabase();
    
    // Properly await and extract the ID parameter
    const params = context.params;
    const id = params.id;
    
    if (!id) {
      return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 });
    }
    
    console.log(`DELETE request for appointment ID: ${id}`);
    
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check if appointment exists
    const findOptions = {
      where: { id },
      include: { booking: true }
    };
    
    const existingAppointment = await db.availableAppointment.findUnique(findOptions);
    
    if (!existingAppointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }
    
    // Check if appointment is booked
    if (existingAppointment.isBooked) {
      return NextResponse.json({ 
        error: "Cannot delete booked appointment. Cancel the booking first."
      }, { status: 400 });
    }
    
    // Delete appointment
    await db.availableAppointment.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "deleting");
  }
} 