import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`https://illustrious-melomakarona-b45ba5.netlify.app/forgot-password/${token}`, { newPassword: password });
      setMessage("✅ " + res.data.message);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setMessage("❌ Error: " + (err.response?.data?.message || "Invalid Token"));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-movie-black">
      <div className="bg-movie-gray p-8 rounded-lg shadow-2xl w-96 border border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-movie-yellow text-center">New Password</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-gray-400 text-sm">Enter New Password</label>
          <input
            type="password"
            className="p-3 rounded bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-movie-yellow"
            placeholder="********"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="bg-green-600 text-white font-bold py-3 rounded hover:bg-green-500 transition">
            Update Password
          </button>
        </form>
        {message && <p className="mt-4 text-center font-medium text-white">{message}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;