import CreateAnnouncement from '@/app/components/CreateAnnouncement/page.js';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
const AboutPage = async () => {
  await connectDB(); 

  const { getUser, isAuthenticated } = await getKindeServerSession();

  if (!isAuthenticated) {
    redirect('/login');
  }

  const user = await getUser();
  
  if (!user || !user.email) {
    return <p className="text-red-600">Invalid user session. Please log in again.</p>;
  }

  const userData = await User.findOne({ email: user.email });

  if (!userData) {
    return <p className="text-red-600">User not found.</p>;
  }

  if (userData.role !== 'superAdmin' && userData.role !== 'admin') {
    return <p className="text-red-600">You do not have permission to view this page.</p>;
  }
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Announcement Page</h1>
      <CreateAnnouncement />
    </div>
  );
};

export default AboutPage;
