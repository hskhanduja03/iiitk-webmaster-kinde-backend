import connectDB from "@/lib/db.js";
import Event from "@/models/Event.js";
import { verifyTokenAndRole } from "@/lib/middleware";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  try {
    const events = await Event.find();
    return new Response(JSON.stringify({ data: events }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch events" }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  await connectDB();

  const verify = verifyTokenAndRole("superAdmin");
  const verificationResult = await verify(request);
  
  if (verificationResult !== true) {
    return NextResponse.json(verificationResult, { status: verificationResult.status }); 
  }

  try {
    const { title, description, imageurl, date } = await request.json();
    
    if (!title || !description || !date || !imageurl) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const newEvent = await Event.create({ title, description, date, imageurl });
    
    return NextResponse.json({
      message: "Event created successfully",
      event: newEvent,
    }, { status: 201 });
    
  } catch (error) {
    return NextResponse.json({
      error: error.message || "Failed to create event",
    }, { status: 500 });
  }
}

export async function PUT(request) {
  await connectDB();

  const verify = verifyTokenAndRole("superAdmin");
  const result = await verify(request);
  if (!result) {
    return result; 
  }

  try {
    const { id, title, description, imageurl, date } = await request.json();
    if (!id || !title || !description || !imageurl || !date) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { title, description, imageurl, date },
      { new: true }
    );
    if (!updatedEvent) {
      return new Response(JSON.stringify({ error: "Event not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        message: "Event updated successfully",
        event: updatedEvent,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to update event" }),
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  await connectDB();

  const verify = verifyTokenAndRole("superAdmin");
  const result = await verify(request);
  if (!result) {
    return result;
  }

  try {
    const { id } = await request.json();
    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), {
        status: 400,
      });
    }

    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return new Response(JSON.stringify({ error: "Event not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        message: "Event deleted successfully",
        event: deletedEvent,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to delete event" }),
      { status: 500 }
    );
  }
}
