import connectDB from '@/lib/db';
import Announcement from '@/models/Announcement';
import { verifyTokenAndRole } from '@/lib/middleware';

export async function GET() {
  await connectDB();
  try {
    const announcements = await Announcement.find();
    return new Response(JSON.stringify({ data: announcements }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch announcements" }), { status: 500 });
  }
}

export async function POST(request) {
  await connectDB();

  const verify = verifyTokenAndRole('admin');
  const result = await verify(request);
  if (!result) {
    return result; // Ensure this returns a valid response if verification fails
  }

  try {
    const { title, description, date, link, imageurl } = await request.json(); // Include imageurl
    if (!title || !description || !date || !link || !imageurl) { // Validate imageurl
      return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
    }

    const newAnnouncement = await Announcement.create({ title, description, date, link, imageurl }); // Save imageurl
    return new Response(JSON.stringify({ message: "Announcement created successfully", announcement: newAnnouncement }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Failed to create announcement" }), { status: 500 });
  }
}

export async function PUT(request) {
  await connectDB();
  const verify = verifyTokenAndRole('admin');
  const result = await verify(request);

  if (result) {
    return result; // Ensure this returns a valid response if verification fails
  }

  try {
    const { id, title, description, date, link, imageurl } = await request.json(); // Include imageurl
    if (!id || !title || !description || !date || !link || !imageurl) { // Validate imageurl
      return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
    }

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(id, { title, description, date, link, imageurl }, { new: true }); // Save imageurl

    if (!updatedAnnouncement) {
      return new Response(JSON.stringify({ error: "Announcement not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Announcement updated successfully", announcement: updatedAnnouncement }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Failed to update announcement" }), { status: 500 });
  }
}


export async function DELETE(request) {
  await connectDB();
  const verify = verifyTokenAndRole('admin'||'superAdmin');
  const result = await verify(request);

  if (result) {
    return result; // Ensure this returns a valid response if verification fails
  }

  try {
    const { id } = await request.json();
    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), { status: 400 });
    }

    const deletedAnnouncement = await Announcement.findByIdAndDelete(id);

    if (!deletedAnnouncement) {
      return new Response(JSON.stringify({ error: "Announcement not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Announcement deleted successfully", announcement: deletedAnnouncement }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Failed to delete announcement" }), { status: 500 });
  }
}
