// app/api/test/route.js
import connectDB from '@/lib/db';

export async function GET() {
  await connectDB();
  return new Response(JSON.stringify("test ok"), { status: 200 });
}
