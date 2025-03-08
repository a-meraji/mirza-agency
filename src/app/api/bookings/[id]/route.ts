import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/app/lib/models";
import { FindUniqueOptions } from "@/app/lib/models/booking";

// GET a specific booking by ID (admin only)
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const options: FindUniqueOptions = {
      where: { id: params.id },
      include: { availableAppointment: true }
    };
    
    const booking = await db.booking.findUnique(options);
    
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    
    return NextResponse.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 });
  }
}

// PUT to update a booking (admin only)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { name, email, phone, notes, selectedServices } = await req.json();
    
    // Check if booking exists
    const existingBooking = await db.booking.findUnique({
      where: { id: params.id }
    });
    
    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    
    // Update booking
    const updatedBooking = await db.booking.update({
      where: { id: params.id },
      data: {
        name,
        email,
        phone,
        notes,
        selectedServices
      }
    });
    
    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}

// DELETE a booking (admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check if booking exists
    const existingBooking = await db.booking.findUnique({
      where: { id: params.id }
    });
    
    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    
    // Update the appointment to mark it as not booked
    await db.availableAppointment.update({
      where: { id: existingBooking.appointmentId },
      data: { isBooked: false }
    });
    
    // Delete the booking
    await db.booking.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
} 