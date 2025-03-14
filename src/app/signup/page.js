"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import checkUsernameAvailability from "./lib/checkUsernameAvailability";
import connectWallet from "./lib/tonWalletConnect";
import { addUsernameListener } from "./lib/checkUsernameAvailability";
import countryData from "./lib/countryData";
import "./signup.css";

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        gender: "",
        phoneNumber: "",
        country: ""
    });

    const [usernameAvailable, setUsernameAvailable] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const router = useRouter();

    useEffect(() => {
        addUsernameListener(handleUsernameChange);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUsernameChange = async (e) => {
        let value = e.target.value;
        const validUsername = /^[a-zA-Z0-9_]*$/;
        if (!validUsername.test(value)) return;

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

    const handleCountryChange = (e) => {
        const query = e.target.value;
        setFormData((prev) => ({ ...prev, country: query }));
        
        if (query) {
            const matches = countryData.filter(c => c.name.toLowerCase().startsWith(query.toLowerCase()));
            setFilteredCountries(matches);
        } else {
            setFilteredCountries([]);
        }
    };

    const selectCountry = (country) => {
        setFormData({
            ...formData,
            country: country.name
        });
        setFilteredCountries([]);
    };

    const handleSignup = async () => {
        if (!formData.name || !formData.username || !formData.gender || !formData.phoneNumber || !formData.country) {
            alert("Please fill in all required fields.");
            return;
        }
        if (usernameAvailable === false) {
            alert("Username is already taken.");
            return;
        }
        console.log("Signup data:", formData);
        router.push("/explore/page.js");
    };

    return (
        <div className="signup-container">
            <h1>Signup</h1>
            <div className="input-group">
                <label>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="input-group">
                <label>Username:</label>
                <input type="text" name="username" value={formData.username} onChange={handleUsernameChange} required />
                {loading && <p>Checking availability...</p>}
                {usernameAvailable === false && <p style={{ color: "red" }}>Username is taken</p>}
                {usernameAvailable === true && <p style={{ color: "green" }}>Username is available</p>}
            </div>
            <div className="input-group">
                <label>Country:</label>
                <input type="text" name="country" value={formData.country} onChange={handleCountryChange} placeholder="Type to search..." required />
                {filteredCountries.length > 0 && (
                    <ul className="dropdown">
                        {filteredCountries.map((country) => (
                            <li key={country.code} onClick={() => selectCountry(country)}>{country.name}</li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="input-group">
                <label>Phone Number:</label>
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
            </div>
            <button onClick={handleSignup}>Signup</button>
            <button className="wallet-button" onClick={connectWallet}>Connect Wallet</button>
        </div>
    );
};

export default Signup;
