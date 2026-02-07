import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // REMINDER: Make sure this URL matches your Render Backend
        axios.post('https://reset-5alc.onrender.com/forgot-password', { email })
        .then(res => {
            if(res.data.Status === "Success") {
                alert("Check your email for the reset link!");
                navigate('/login');
            } else {
                alert(res.data.Status);
            }
        }).catch(err => console.log(err));
    }

    return (
        // TAILWIND STYLING:
        // flex, justify-center, items-center -> Centers the card
        // bg-black/50 -> Adds a dim overlay if needed, or matches your theme
        <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 border border-gray-700">
                <h4 className="text-2xl font-bold mb-4 text-center">Forgot Password</h4>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-300 font-bold mb-2">
                            <strong>Email</strong>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            autoComplete="off"
                            name="email"
                            className="w-full px-3 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-200">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;