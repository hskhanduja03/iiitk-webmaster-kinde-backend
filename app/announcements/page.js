// app/about/page.js
import CreateAnnouncement from '@/app/components/CreateAnnouncement/page.js';

const AboutPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Announcement Page</h1>
      <CreateAnnouncement />
    </div>
  );
};

export default AboutPage;
