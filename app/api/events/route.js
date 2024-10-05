// app/api/events/route.js
import connectDB from '@/lib/db';
import Event from '@/models/Event';
import { verifyTokenAndRole } from '@/lib/middleware';

export async function GET() {
  await connectDB();
  const events = await Event.find();
  return new Response(JSON.stringify({ data: events }), { status: 200 });
}

export async function POST(request) {
  await connectDB();
  const verify = verifyTokenAndRole('superAdmin');
  const result = await verify(request);

  if (result) {
    return result;
  }

  const { title, description, imageurl, date } = await request.json();
  const newEvent = await Event.create({ title, description, imageurl, date });
  return new Response(JSON.stringify({ message: "Event created successfully", event: newEvent }), { status: 201 });
}
