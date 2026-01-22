import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });
      setMessage("✅ Welcome back, " + res.data.username + "!");
      setTimeout(() => navigate("/"), 2000); // Redirect to Home after 2 seconds
    } catch (err) {
      setMessage("❌ Error: " + (err.response?.data?.message || "Login failed"));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-movie-black">
      <div className="bg-movie-gray p-8 rounded-lg shadow-2xl w-96 border border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-movie-yellow text-center">Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input type="email" placeholder="Email" className="p-3 rounded bg-gray-900 border border-gray-700 text-white" onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="p-3 rounded bg-gray-900 border border-gray-700 text-white" onChange={(e) => setPassword(e.target.value)} required />
          <button className="bg-movie-yellow text-black font-bold py-3 rounded hover:bg-yellow-400 transition">Login</button>
        </form>
        {message && <p className="mt-4 text-center font-medium text-white">{message}</p>}
        
        <div className="mt-4 flex flex-col gap-2 text-center">
             <Link to="/forgot-password" className="text-gray-400 text-sm hover:text-white">Forgot Password?</Link>
             <Link to="/register" className="text-gray-400 text-sm hover:text-white">New user? Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;