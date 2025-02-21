"use client"; // Required to use hooks like useState and useRouter in Next.js App Router

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import "./login.css"; // Add CSS file

const LoginPage = () => {
  const [phoneOrUsername, setPhoneOrUsername] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="login-container">
      <Image src="/favicon.png" alt="Your Image" width={100} height={100} />
      <h1 className="title">symol</h1>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="phoneOrUsername">Phone Number/Username</label>
          <input
            type="text"
            id="phoneOrUsername"
            value={phoneOrUsername}
            onChange={(e) => setPhoneOrUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="verificationCode">Verification Code</label>
          <input
            type="text"
            id="verificationCode"
            value={verificationCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
              setVerificationCode(value);
            }}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={5}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Have you not an account? <Link href="/signup">Sign up</Link>
      </p>
    </div>
  );
};

export default LoginPage;
