const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");       // <--- ADD THIS
const nodemailer = require("nodemailer");  // <--- ADD THIS
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb+srv://admin:Aadhithya2026@cluster0.ym57j9z.mongodb.net/movie-reset-db?appName=Cluster0")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

// Register
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.json({ message: "User registered successfully!" });
  } catch (err) { res.status(500).json({ message: "Server error" }); }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    res.json({ message: "✅ Login successful!", username: user.username });
  } catch (err) { res.status(500).json({ message: "Server error" }); }
});

// Forgot Password 
// Forgot Password
app.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    User.findOne({ email: email })
    .then(user => {
        if(!user) {
            return res.send({ Status: "User not existed" })
        }
        
        // Generate Token
        const token = jwt.sign({ id: user._id }, "jwt_secret_key", { expiresIn: "1d" });
        
        // Setup Nodemailer Transporter
        const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com", // Brevo's server
            port: 587, // Standard secure port
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // CREATE THE LINK
        // IMPORTANT: Replace 'http://localhost:5173' with your actual Netlify URL in production
        const link = `https://illustrious-melomakarona-b45ba5.netlify.app/forgot-password/${user._id}/${token}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset Password Link',
            text: `Click the following link to reset your password: ${link}`
        };

        // Send the Mail
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                return res.send({ Status: "Error sending email" });
            } else {
                return res.send({ Status: "Success" });
            }
        });
    })
    .catch(err => res.send({ Status: err.message }));
});
// ... (your existing code ends above here)

// Define the port using the environment variable provided by Render
// If that variable isn't found (like on your local PC), it falls back to 3001
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});