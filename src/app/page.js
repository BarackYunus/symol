"use client"; 
import { useState, useEffect } from "react";
import Image from "next/image";
import LoginPage from "./login/page";

const BlinkingImage = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);
  const [count, setCount] = useState(0);
  const maxBlinks = 6; // Adjust number of blinks

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((prev) => !prev);
      setCount((prev) => prev + 1);
    }, 500); // Adjust blinking speed

    if (count >= maxBlinks) {
      clearInterval(interval);
      setTimeout(onComplete, 500); // Proceed to login page after blinking
    }

    return () => clearInterval(interval);
  }, [count]);

  return (
    <div className="blinking-container">
      <Image
        src="/favicon.png"
        alt="Blinking Logo"
        width={100}
        height={100}
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s" }}
        priority
      />
    </div>
  );
};

export default function MainPage() {
  const [showLogin, setShowLogin] = useState(false);

  return showLogin ? (
    <LoginPage /> // Replace with your login component
  ) : (
    <BlinkingImage onComplete={() => setShowLogin(true)} />
  );
}
