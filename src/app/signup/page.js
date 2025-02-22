"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import checkUsernameAvailability from "/lib/checkUsernameAvailability";
import connectWallet from "/lib/tonWalletConnect";

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        gender: "",
        phoneNumber: "",
        profilePicture: null,
    });
    const [usernameAvailable, setUsernameAvailable] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUsernameChange = async (e) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, username: value }));
        if (!value) return setUsernameAvailable(null);
        
        setLoading(true);
        try {
            const available = await checkUsernameAvailability(value);
            setUsernameAvailable(available);
        } catch (error) {
            console.error("Error checking username availability:", error);
            setUsernameAvailable(null);
        }
        setLoading(false);
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, profilePicture: e.target.files[0] }));
    };

    const handleSignup = async () => {
        if (!formData.name || !formData.username || !formData.gender || !formData.phoneNumber) {
            alert("Please fill in all required fields.");
            return;
        }
        
        if (usernameAvailable === false) {
            alert("Username is already taken.");
            return;
        }
        
        // Store information in the database (mock logic)
        console.log("Signup data:", formData);
        
        router.push("/explore/page.js");
    };

    return (
        <div>
            <h1>Signup</h1>
            <div>
                <label>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
                <label>Username:</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleUsernameChange}
                    className={usernameAvailable === false ? "shake" : ""}
                    required
                />
                {loading && <p>Checking availability...</p>}
                {usernameAvailable === false && <p style={{ color: "red" }}>Username is taken</p>}
                {usernameAvailable === true && <p style={{ color: "green" }}>Username is available</p>}
            </div>
            <div>
                <label>Gender:</label>
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>
            <div>
                <label>Phone Number:</label>
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
            </div>
            <div>
                <label>Profile Picture:</label>
                <input type="file" onChange={handleFileChange} />
            </div>
            <div>
                <button onClick={connectWallet}>Connect Wallet</button>
            </div>
            <div>
                <button onClick={handleSignup}>Signup</button>
            </div>
            <style jsx>{`
                .shake {
                    animation: shake 0.5s;
                    animation-iteration-count: 3;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    50% { transform: translateX(5px); }
                    75% { transform: translateX(-5px); }
                }
            `}</style>
        </div>
    );
};

export default Signup;
