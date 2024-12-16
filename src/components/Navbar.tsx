"use client";

import React from "react";
import Link from "next/link";
const Navbar: React.FC = () => {
  return (
    <nav className="bg-transparent shadow-md p-4 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-yellow-500">
            Nisar Petroleum
          </h1>
        </div>

        <div className="flex items-center">
          <Link href="/login">
            <button className="bg-yellow-500 text-black font-semibold text-lg px-6 py-3 rounded-full hover:bg-yellow-400 transition-all">
              Login
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
