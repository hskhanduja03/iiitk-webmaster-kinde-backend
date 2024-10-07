import connectDB from "@/lib/db.js";
import Event from "@/models/Event.js";
import { verifyTokenAndRole } from "@/lib/middleware";
import { NextResponse } from "next/server";

// Fetch all events (GET)
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

// Create a new event (POST)
// Create a new event (POST)
export async function POST(request) {
  await connectDB();

  // Pass only the request to the middleware
  const verify = verifyTokenAndRole("superAdmin");
  const verificationResult = await verify(request);
  
  // Check the result of the verification
  if (verificationResult !== true) {
    return NextResponse.json(verificationResult, { status: verificationResult.status }); // Return the error response if verification failed
  }

  try {
    const { title, description, imageurl, date } = await request.json();
    
    // Validate input fields
    if (!title || !description || !date || !imageurl) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Create the event
    const newEvent = await Event.create({ title, description, date, imageurl });
    
    // Return the success response
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

// Update an existing event (PUT)
// Update an existing event (PUT)
export async function PUT(request) {
  await connectDB();

  const verify = verifyTokenAndRole("superAdmin");
  const result = await verify(request);
  if (!result) {
    return result; // Return the error response from middleware if verification fails
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

// Delete an event (DELETE)
// Delete an event (DELETE)
export async function DELETE(request) {
  await connectDB();

  const verify = verifyTokenAndRole("superAdmin");
  const result = await verify(request);
  if (!result) {
    return result; // Return the error response from middleware if verification fails
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
