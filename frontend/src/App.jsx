import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register"; // Import the new page
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-movie-black text-white font-sans">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />  {/* New Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;