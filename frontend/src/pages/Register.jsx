import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://password-reset-api.onrender.com/register", { username, email, password });
      setMessage("✅ Account created! Redirecting...");
      setTimeout(() => navigate("/forgot-password"), 2000);
    } catch (err) {
      setMessage("❌ Error: " + (err.response?.data?.message || "Registration failed"));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-movie-black">
      <div className="bg-movie-gray p-8 rounded-lg shadow-2xl w-96 border border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-movie-yellow text-center">Create Account</h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input type="text" placeholder="Username" className="p-3 rounded bg-gray-900 border border-gray-700 text-white" onChange={(e) => setUsername(e.target.value)} required />
          <input type="email" placeholder="Email" className="p-3 rounded bg-gray-900 border border-gray-700 text-white" onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="p-3 rounded bg-gray-900 border border-gray-700 text-white" onChange={(e) => setPassword(e.target.value)} required />
          <button className="bg-movie-yellow text-black font-bold py-3 rounded hover:bg-yellow-400 transition">Sign Up</button>
        </form>
        {message && <p className="mt-4 text-center font-medium text-white">{message}</p>}
        <div className="mt-4 text-center">
             <Link to="/forgot-password" className="text-gray-400 text-sm hover:text-white">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;