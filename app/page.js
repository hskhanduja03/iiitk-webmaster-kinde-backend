import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Link from "next/link";
import dotenv from 'dotenv';

dotenv.config();
console.log(process.env.MONGODB_URI);

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-lg w-full p-8 border border-gray-300 rounded-md shadow-md">
        <h1 className="text-3xl font-semibold mb-6 text-center">Welcome to Our Platform</h1>
        <p className="text-md text-center text-gray-700">
          Sign in or sign up using third-party authentication with <span className="text-gray-600 text-xl font-bold">Kinde</span>.
        </p>
        <p className="text-center text-gray-700 mb-8">
        (featuring <span className="text-gray-600 text-xl font-bold">2FA</span> for enhanced security)
        </p>
        <div className="flex flex-col space-y-4">
          <LoginLink>
            <button className="w-full bg-blue-500 text-white hover:bg-blue-600 py-2 border border-gray-500 rounded-md font-medium  transition duration-200">
              Sign In
            </button>
          </LoginLink>
          <RegisterLink>
            <button className="w-full py-2 border bg-green-500 text-white hover:bg-green-600 border-gray-500 rounded-md font-medium  transition duration-200">
              Sign Up
            </button>
          </RegisterLink>
          <Link href="/about">
            <button className="w-full py-2 border bg-orange-500 text-white hover:bg-bluorangee-600 border-gray-500 rounded-md font-medium  transition duration-200">
              About
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
