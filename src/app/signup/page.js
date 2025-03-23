"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import checkUsernameAvailability from "./lib/checkUsernameAvailability";
import connectWallet from "./lib/tonWalletConnect";
import { addUsernameListener } from "./lib/checkUsernameAvailability";
import countryData from "./lib/countryData";
import "./signup.css";
import Image from "next/image";
import countries from './lib/countryData';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        phoneNumber: "",
        country: "",
        gender: "",
    });

    const [usernameAvailable, setUsernameAvailable] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filteredCountries, setFilteredCountries] = useState(countries);
    const [countrySearch, setCountrySearch] = useState('');
    const [showCountryList, setShowCountryList] = useState(false);
    const router = useRouter();
    const [error, setError] = useState('');

    useEffect(() => {
        addUsernameListener(handleUsernameChange);
    }, []);

    useEffect(() => {
        if (countrySearch) {
            const filtered = countries.filter(country => 
                country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
                country.dialCode.includes(countrySearch)
            );
            setFilteredCountries(filtered);
        } else {
            setFilteredCountries(countries);
        }
    }, [countrySearch]);

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
            country: country.name,
            phoneNumber: country.dialCode
        });
        setShowCountryList(false);
        setCountrySearch('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            router.push('/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <div className="mt-1">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="telegramUsername" className="block text-sm font-medium text-gray-700">
                                Telegram Username
                            </label>
                            <div className="mt-1">
                                <input
                                    id="telegramUsername"
                                    name="telegramUsername"
                                    type="text"
                                    required
                                    value={formData.telegramUsername}
                                    onChange={(e) => setFormData({...formData, telegramUsername: e.target.value})}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                Country
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    placeholder="Search country..."
                                    value={countrySearch}
                                    onChange={(e) => {
                                        setCountrySearch(e.target.value);
                                        setShowCountryList(true);
                                    }}
                                    onFocus={() => setShowCountryList(true)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                {showCountryList && (
                                    <div className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                                        {filteredCountries.map((country) => (
                                            <div
                                                key={country.code}
                                                className="cursor-pointer hover:bg-gray-100 px-3 py-2"
                                                onClick={() => selectCountry(country)}
                                            >
                                                <span className="mr-2">{country.flag}</span>
                                                <span>{country.name}</span>
                                                <span className="text-gray-500 ml-2">{country.dialCode}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <div className="mt-1">
                                <input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    required
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                                Gender
                            </label>
                            <div className="mt-1">
                                <select
                                    id="gender"
                                    name="gender"
                                    required
                                    value={formData.gender}
                                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {loading ? 'Signing up...' : 'Sign up'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
