// app/about/page.js

import React from 'react';
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import { cookies } from 'next/headers';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/server';

const Page = async () => {
  // Access cookies on the server side
  const cookieStore = cookies();
  const idToken = cookieStore.get('id_token'); // Replace with your actual cookie name
  const {isAuthenticated, getUser} = await getKindeServerSession(); // Correctly retrieve session

  const user = await getUser();

// console.log(user);

  // Check if the ID token exists and parse its payload if it's a JWT
//   const userData = idToken ? JSON.parse(atob(idToken.value.split('.')[1])) : null; // Decode the JWT payload

  return (
    <div>
      <h1>About Page</h1>
      {user ? (
        <>
        <div>
          <p>Your ID Token Payload:</p>
          <pre>{JSON.stringify(user.email, null, 2)}</pre> {/* Display the full payload */}
          <pre>{JSON.stringify(user.family_name, null, 2)}</pre> {/* Display the full payload */}
          <pre>{JSON.stringify(user.given_name, null, 2)}</pre> {/* Display the full payload */}
        </div>
        <button className='bg-blue-500 text-white px-4 py-2 rounded-md'>
            <LogoutLink>Logout</LogoutLink>
        </button>
        </>
        
      ) : (
        <p>No ID Token found. Please log in.</p>
      )}
    </div>
  );
};

export default Page;
