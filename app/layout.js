"use client";

import localFont from "next/font/local";
import "./globals.css";
import { useState, useEffect } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {
  const [isAdmin, setIsAdmin] = useState(true);
  const [message, setMessage] = useState("");
  const [showToggle, setShowToggle] = useState(true);
  
  useEffect(() => {
    const path = window.location.pathname;
    setShowToggle(path !== '/' && path !== '/about');
    
    const checkUserRole = async () => {
      try {
        const response = await fetch('/api/user/role'); // Adjust the endpoint as needed
        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.newRole === 'admin');
        } else {
          console.error('Error fetching user role:', response.status);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    // Call the async function
    checkUserRole();
  }, []);

  const toggleRole = async () => {
    const newRole = isAdmin ? 'superAdmin' : 'admin';
    setIsAdmin(!isAdmin);

    try {
      const response = await fetch('/api/user/changeMyRole', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Role changed successfully:', data);
        setMessage(`Role changed to ${newRole}`);
        
        // Reload the page after a short delay to let the message show
        setTimeout(() => {
          window.location.reload(); // Reload the page to reflect changes
        }, 1000);
      } else {
        const errorMessage = response.status === 404 
          ? 'User not found' 
          : 'Error changing role: Failed to change role';
        setMessage(errorMessage);
      }

      // Clear the message after 5 seconds
      setTimeout(() => {
        setMessage("");
      }, 5000);
    } catch (error) {
      console.error('Error changing role:', error);
      setMessage('Error changing role: No response from server');
      setTimeout(() => {
        setMessage("");
      }, 5000);
    }
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {showToggle && (
          <div className="absolute top-5 right-5">
            <button
              onClick={toggleRole}
              className="flex items-center px-4 py-2 border border-gray-300 rounded bg-white hover:bg-gray-200 transition duration-300"
            >
              <span className="mr-2">{isAdmin ? 'Admin' : 'Super Admin'}</span>
              <div className={`relative w-12 h-6 flex items-center bg-gray-300 rounded-full ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                <div className="w-6 h-6 bg-blue-500 rounded-full transition-all duration-300"></div>
              </div>
            </button>
            {message && (
              <div className="mt-2 text-red-600">{message}</div> // Change color for visibility
            )}
          </div>
        )}
        {children}
      </body>
    </html>
  );
}
