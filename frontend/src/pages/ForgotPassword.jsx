import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(""); // Stores success or error message
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    try {
      // 1. Send the request to your Render Backend
      const res = await axios.post("https://reset-5alc.onrender.com/forgot-password", { email });

      // 2. Check the "Status" sent by the backend
      // Your backend sends { Status: "Success" } or { Status: "User not existed" }
      if (res.data.Status === "Success") {
        setMessage("✅ Email sent! Check your inbox (and spam folder).");
        
        // Optional: Redirect to login after 3 seconds
        setTimeout(() => {
           navigate("/login");
        }, 3000);
        
      } else {
        // If the user doesn't exist, show the backend's error message
        setMessage("❌ " + res.data.Status);
      }
      
    } catch (err) {
      // 3. Handle Network Errors (like 500 Server Error)
      console.log(err);
      setMessage("❌ Error: Could not send email. Check console.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-96 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-yellow-400 text-center">Reset Password</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-gray-400 text-sm">Registered Email</label>
          <input
            type="email"
            className="p-3 rounded bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-yellow-400"
            placeholder="example@mail.com"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
          <button className="bg-yellow-400 text-black font-bold py-3 rounded hover:bg-yellow-500 transition">
            Send Reset Link
          </button>
        </form>

        {/* Display the message here */}
        {message && (
          <p className={`mt-4 text-center font-medium ${message.includes("✅") ? "text-green-400" : "text-red-400"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;