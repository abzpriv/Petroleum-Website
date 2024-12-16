"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Image1 from "../assets/LandingImage4.jpg";
import Image2 from "../assets/LandingImage3.jpg";
import Image3 from "../assets/LandingImage5.jpg";
import Navbar from "./Navbar";

const LandingPage: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const images = [Image1, Image2, Image3];

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
        setFadeIn(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white text-gray-900 min-h-screen font-sans">
      <Navbar />
      {/* Hero Section */}
      <header className="relative h-screen bg-cover bg-center parallax-effect">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent h-full flex flex-col justify-center items-center">
          <div
            className={`absolute inset-0 transition-opacity duration-1000 ${
              fadeIn ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-black bg-opacity-60 filter blur-sm" />
            {/* Darker, subtle blurred overlay with higher opacity for a darker effect */}
            <Image
              src={images[currentImage]}
              alt="Hero Image"
              layout="fill"
              objectFit="cover"
              className="absolute inset-0 filter blur-sm brightness-75"
            />
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold text-yellow-500 z-10 uppercase tracking-widest text-center animate__animated animate__fadeIn animate__delay-1s">
            Nisar Petroleum
          </h1>
          <p className="mt-4 md:mt-6 text-2xl md:text-3xl max-w-2xl text-center z-10 text-white">
            Revolutionizing Fuel Management with Precision and Innovation
          </p>
          <button className="mt-8 px-12 py-6 bg-yellow-600 z-10 hover:bg-yellow-500 text-black font-semibold text-xl rounded-full shadow-2xl transition-all transform hover:scale-105">
            Get Started
          </button>
        </div>
      </header>

      {/* About Section */}
      <section className="py-20 px-6 md:px-20 bg-gray-100">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-yellow-500 uppercase mb-8">
            Why Choose Us
          </h2>
          <p className="mt-4 text-gray-700 max-w-3xl mx-auto text-lg">
            At Nisar Petroleum, we provide state-of-the-art fuel management
            systems designed to streamline operations, optimize resources, and
            ensure complete transparency. Your trust fuels our passion.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {[
            {
              title: "Reliable Service",
              description:
                "Maximum uptime and reliability with cutting-edge technology.",
            },
            {
              title: "Advanced Analytics",
              description: "Real-time data insights and reporting tools.",
            },
            {
              title: "Customer Support",
              description:
                "Dedicated 24/7 support to ensure smooth operations.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 p-8 rounded-lg shadow-lg hover:scale-105 transition-transform transform hover:shadow-xl"
            >
              <h3 className="text-2xl font-semibold text-yellow-500 mb-4">
                {item.title}
              </h3>
              <p className="text-gray-700">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-20 bg-gray-100">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-yellow-500 uppercase mb-8">
            Key Features
          </h2>
          <p className="mt-4 text-gray-700 max-w-3xl mx-auto text-lg">
            Explore the advanced features of Nisar Petroleum's fuel management
            system.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {[
            "Fuel Inventory Tracking",
            "Real-Time Monitoring",
            "Automated Reports",
            "Secure Transactions",
            "Mobile Integration",
            "Eco-Friendly Solutions",
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-lg shadow-md hover:scale-105 transition-transform transform hover:shadow-xl"
            >
              <h3 className="text-xl font-semibold text-yellow-500 mb-2">
                {feature}
              </h3>
              <p className="text-gray-700">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-center">
        <h2 className="text-4xl font-bold">
          Ready to Elevate Your Fuel Management?
        </h2>
        <p className="mt-4 text-lg">
          Join the Nisar Petroleum family today and experience unparalleled
          innovation.
        </p>
        <button className="mt-6 px-8 py-4 bg-black text-yellow-500 font-semibold text-lg rounded-full shadow-lg hover:bg-gray-800 transition-all">
          Contact Us
        </button>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400 text-center">
        <p>&copy; 2024 Nisar Petroleum. All Rights Reserved.</p>
        <p>Privacy Policy | Terms of Service</p>
      </footer>
    </div>
  );
};

export default LandingPage;
