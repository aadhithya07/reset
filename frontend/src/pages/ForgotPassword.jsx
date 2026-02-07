import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // REPLACE THIS URL WITH YOUR DEPLOYED RENDER BACKEND URL
        // Example: https://my-movie-app.onrender.com/forgot-password
        axios.post('https://reset-5alc.onrender.com/', { email })
        .then(res => {
            if(res.data.Status === "Success") {
                alert("Check your email for the reset link!");
                navigate('/login');
            } else {
                alert(res.data.Status); // Show error like "User not existed"
            }
        }).catch(err => console.log(err));
    }

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h4>Forgot Password</h4>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Email</strong>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            autoComplete="off"
                            name="email"
                            className="form-control rounded-0"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-0">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;