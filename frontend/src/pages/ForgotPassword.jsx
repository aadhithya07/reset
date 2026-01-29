import { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post("https://reset-5alc.onrender.com/forgot-password", { email });
      setMessage("✅ " + res.data.message);
    } catch (err) {
      setMessage("❌ Error: " + (err.response?.data?.message || "Something went wrong"));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-movie-black">
      <div className="bg-movie-gray p-8 rounded-lg shadow-2xl w-96 border border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-movie-yellow text-center">Reset Password</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-gray-400 text-sm">Registered Email</label>
          <input
            type="email"
            className="p-3 rounded bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-movie-yellow"
            placeholder="example@mail.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="bg-movie-yellow text-black font-bold py-3 rounded hover:bg-yellow-400 transition">
            Send Reset Link
          </button>
        </form>
        {message && <p className="mt-4 text-center font-medium text-white">{message}</p>}
      </div>
    </div>
  );
}

export default ForgotPassword;