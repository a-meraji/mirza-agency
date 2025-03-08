import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/app/lib/models";
import { FindUniqueOptions } from "@/app/lib/models/availableAppointment";

// GET a specific appointment by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const options: FindUniqueOptions = {
      where: { id: params.id },
      include: { booking: true }
    };
    
    const appointment = await db.availableAppointment.findUnique(options);
    
    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }
    
    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return NextResponse.json({ error: "Failed to fetch appointment" }, { status: 500 });
  }
}

// PUT to update an appointment (admin only)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { date, startTime, endTime, duration } = await req.json();
    
    if (!date || !startTime || !endTime || !duration) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // Check if appointment exists
    const findOptions: FindUniqueOptions = {
      where: { id: params.id },
      include: { booking: true }
    };
    
    const existingAppointment = await db.availableAppointment.findUnique(findOptions);
    
    if (!existingAppointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }
    
    // Don't allow modifying a booked appointment's date/time
    if (existingAppointment.isBooked) {
      return NextResponse.json({ error: "Cannot modify a booked appointment's time" }, { status: 400 });
    }
    
    const updatedAppointment = await db.availableAppointment.update({
      where: { id: params.id },
      data: {
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        duration: parseInt(duration)
      }
    });
    
    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
  }
}

// DELETE an appointment (admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check if appointment exists
    const findOptions: FindUniqueOptions = {
      where: { id: params.id },
      include: { booking: true }
    };
    
    const existingAppointment = await db.availableAppointment.findUnique(findOptions);
    
    if (!existingAppointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }
    
    // Don't allow deleting a booked appointment
    if (existingAppointment.isBooked) {
      return NextResponse.json({ error: "Cannot delete a booked appointment" }, { status: 400 });
    }
    
    await db.availableAppointment.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json({ error: "Failed to delete appointment" }, { status: 500 });
  }
} 