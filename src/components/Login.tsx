"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./Navbar";
import Loader from "./Loader"; // Import your Loader component

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false); // To track if the component is mounted in the client
  const router = useRouter();

  useEffect(() => {
    // This will only run in the browser (client-side)
    setIsClient(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const loaderTimeout = setTimeout(() => {
      setLoading(false);
    }, 10000);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Login failed. Please try again.");
        return;
      }

      // No "Remember Me" logic, just set the login cookie
      if (isClient) {
        document.cookie = `isLoggedIn=true; path=/;`;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Error logging in:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    } finally {
      clearTimeout(loaderTimeout);
    }
  };

  return (
    <div className="bg-white">
      <Navbar />
      <div className="bg-gray-50 min-h-screen flex justify-center items-center p-6">
        <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center text-yellow-500 mb-6">
            Login to Nisar Petroleum
          </h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-2 p-3 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full mt-2 p-3 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between mb-6">
              <a
                href="#"
                className="text-sm text-yellow-500 hover:text-yellow-600"
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {/* Show the loader when loading is true */}
      {loading && <Loader />}
    </div>
  );
};

export default Login;
