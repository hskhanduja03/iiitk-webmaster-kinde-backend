import Image from "next/image";
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import dotenv from 'dotenv';
import Link from "next/link";
dotenv.config();
console.log(process.env.MONGODB_URI);

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-blue-600">Welcome to Our Platform</h1>
      <div className="flex space-x-4">
        <LoginLink>
          <button className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-300">
            Sign In
          </button>
        </LoginLink>
        <RegisterLink>
          <button className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 transition duration-300">
            Sign Up
          </button>
        </RegisterLink>
        <button className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600 transition duration-300">
            <Link href="/about">About</Link>
          </button>
      </div>
    </div>
  );
}
