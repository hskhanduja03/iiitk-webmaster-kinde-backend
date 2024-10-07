import React from 'react';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { cookies } from 'next/headers';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/server';
// import User from '@/models/User';

const Page = async () => {
  // Access cookies on the server side
  const cookieStore = cookies();
  // const idToken = cookieStore.get('id_token');
  const { getUser } = await getKindeServerSession(); 

  const user = await getUser();

  // Check if the user exists before accessing properties
  if (!user) {
    return (
      <div>
        <h1>About Page</h1>
        <p>No ID Token found. Please log in.</p>
      </div>
    );
  }

  // Fetch user data based on email
  // const userData = await User.findOne({ email: user.email });

  return (
    <div>
      <h1>About Page</h1>
      <div>
        <p>Your ID Token Payload:</p>
        <pre>{JSON.stringify(user.email, null, 2)}</pre> 
        <pre>{JSON.stringify(user.family_name, null, 2)}</pre> 
        <pre>{JSON.stringify(user.given_name, null, 2)}</pre> 
        {/* <pre className='text-red-500 text-xl'>Your current role is: <b>{userData?.role}</b> </pre>  */}
      </div>
      <button className='bg-red-500 text-white px-4 py-2 rounded-md'>
        <LogoutLink>Logout</LogoutLink>
      </button>
      <button className='bg-purple-500 text-white px-4 py-2 rounded-md ml-10'>
        <a href="/events">Events</a>
      </button>
      <button className='bg-cyan-500 text-white px-4 py-2 rounded-md ml-10'>
        <a href="/announcements">Announcements</a>
      </button>
    </div>
  );
};

export default Page;
