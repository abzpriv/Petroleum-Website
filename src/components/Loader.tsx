"use client";

import React from "react";
import Lottie from "lottie-react";
import animationData from "../assets/lottiefile/Animation - 1733432499934.json"; // Path to your Lottie animation

const Loader: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-30 backdrop-blur z-50">
      <Lottie
        animationData={animationData}
        loop={true}
        autoplay={true}
        style={{
          width: "250px",
          height: "250px",
          maxWidth: "none",
          maxHeight: "none",
        }}
      />
    </div>
  );
};

export default Loader;
