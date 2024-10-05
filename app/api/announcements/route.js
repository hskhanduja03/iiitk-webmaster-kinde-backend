// app/api/announcements/route.js
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

  if (result) {
    return result;
  }

  try {
    const { title, description, date, link } = await request.json();
    const newAnnouncement = await Announcement.create({ title, description, date, link });
    return new Response(JSON.stringify({ message: "Announcement created successfully", announcement: newAnnouncement }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to create announcement" }), { status: 500 });
  }
}

export async function PUT(request) {
  await connectDB();
  const verify = verifyTokenAndRole('admin');
  const result = await verify(request);

  if (result) {
    return result;
  }

  try {
    const { id, title, description, date, link } = await request.json();
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(id, { title, description, date, link }, { new: true });

    return new Response(JSON.stringify({ message: "Announcement updated successfully", announcement: updatedAnnouncement }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update announcement" }), { status: 500 });
  }
}

export async function DELETE(request) {
  await connectDB();
  const verify = verifyTokenAndRole('admin');
  const result = await verify(request);

  if (result) {
    return result;
  }

  try {
    const { id } = await request.json();
    const deletedAnnouncement = await Announcement.findByIdAndDelete(id);

    return new Response(JSON.stringify({ message: "Announcement deleted successfully", announcement: deletedAnnouncement }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete announcement" }), { status: 500 });
  }
}
