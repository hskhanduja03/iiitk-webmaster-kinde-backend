import CreateEvent from '@/app/components/CreateEvent/page.js';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import User from '@/models/User';
import connectDB from '@/lib/db'; // Adjust the path to your connection utility
import { redirect } from 'next/navigation';

const EventPage = async () => {
  await connectDB(); // Ensure database connection

  const { getUser, isAuthenticated } = await getKindeServerSession();

  if (!isAuthenticated) {
    // Use the `redirect` function from `next/navigation` for handling redirects in Next.js 13+
    redirect('/login');
  }

  const user = await getUser();
  
  // Check if user is null or if it doesn't have an email property
  if (!user || !user.email) {
    return <p className="text-red-600">Invalid user session. Please log in again.</p>;
  }

  const userData = await User.findOne({ email: user.email });

  if (!userData) {
    return <p className="text-red-600">User not found.</p>;
  }

  if (userData.role !== 'superAdmin') {
    return <p className="text-red-600">You do not have permission to view this page.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Event Page</h1>
      <CreateEvent />
    </div>
  );
};

export default EventPage;
