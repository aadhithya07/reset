import React, { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';

function ResetPassword() {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const {id, token} = useParams();

    const handleSubmit = (e) => {
        e.preventDefault();
        // REMINDER: Make sure this URL matches your Render Backend
        axios.post(`https://reset-5alc.onrender.com/reset-password/${id}/${token}`, { password })
        .then(res => {
            if(res.data.Status === "Success") {
                navigate('/login');
            } else {
                alert(res.data.Status);
            }
        }).catch(err => console.log(err));
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 border border-gray-700">
                <h4 className="text-2xl font-bold mb-4 text-center">Reset Password</h4>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-300 font-bold mb-2">
                            <strong>New Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            autoComplete="off"
                            name="password"
                            className="w-full px-3 py-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-200">
                        Update
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;