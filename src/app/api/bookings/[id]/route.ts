import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/models";
import { FindUniqueOptions } from "@/lib/models/booking";
import { connectToDatabase } from "@/lib/db";

// Helper function to handle errors consistently
function handleApiError(error: any, operation: string) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error(`Error ${operation} booking:`, error);
  return NextResponse.json({ 
    error: `Failed to ${operation} booking`,
    details: errorMessage 
  }, { status: 500 });
}

// GET a specific booking by ID (admin only)
export async function GET(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    // Ensure database connection is established
    await connectToDatabase();
    
    // Properly await and extract the ID parameter
    const id = params.id;
    
    if (!id) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }
    
    console.log(`GET request for booking ID: ${id}`);
    
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const options: FindUniqueOptions = {
      where: { id },
      include: { availableAppointment: true }
    };
    
    const booking = await db.booking.findUnique(options);
    
    if (!booking) {
      console.log(`Booking not found with ID: ${id}`);
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    
    return NextResponse.json(booking);
  } catch (error) {
    return handleApiError(error, "fetching");
  }
}

// PUT to update a booking (admin only)
export async function PUT(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    // Ensure database connection is established
    await connectToDatabase();
    
    // Properly await and extract the ID parameter
    const id = params.id;
    
    if (!id) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }
    
    console.log(`PUT request for booking ID: ${id}`);
    
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { name, email, phone, notes, selectedServices } = await req.json();
    
    // Check if booking exists
    const existingBooking = await db.booking.findUnique({
      where: { id },
      include: { availableAppointment: true }  // Include the appointment data
    });
    
    if (!existingBooking) {
      console.log(`Booking not found with ID: ${id}`);
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    
    console.log(`Updating booking with ID: ${id}`);
    
    // Update booking
    const updatedBooking = await db.booking.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        notes,
        selectedServices
      }
    });
    
    // Fetch the full booking with appointment data to return to the client
    const completeBooking = await db.booking.findUnique({
      where: { id },
      include: { availableAppointment: true }
    });
    
    console.log(`Successfully updated booking: ${id}`);
    return NextResponse.json(completeBooking);
  } catch (error) {
    return handleApiError(error, "updating");
  }
}

// DELETE a booking (admin only)
export async function DELETE(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    // Ensure database connection is established
    await connectToDatabase();
    
    // Properly await and extract the ID parameter
    const id = params.id;
    
    if (!id) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }
    
    console.log(`DELETE request for booking ID: ${id}`);
    
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check if booking exists
    const existingBooking = await db.booking.findUnique({
      where: { id }
    });
    
    if (!existingBooking) {
      console.log(`Booking not found with ID: ${id}`);
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    
    console.log(`Found booking with appointment ID: ${existingBooking.appointmentId}`);
    
    // Update the appointment to mark it as not booked
    await db.availableAppointment.update({
      where: { id: existingBooking.appointmentId },
      data: { isBooked: false }
    });
    
    console.log(`Marked appointment ${existingBooking.appointmentId} as not booked`);
    
    // Delete the booking
    await db.booking.delete({
      where: { id }
    });
    
    console.log(`Successfully deleted booking: ${id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error, "deleting");
  }
} 