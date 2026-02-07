const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
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
app.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    User.findOne({ email: email })
    .then(user => {
        if(!user) {
            return res.send({ Status: "User not existed" })
        }
        const token = jwt.sign({ id: user._id }, "jwt_secret_key", { expiresIn: "1d" });
        
        // Setup Nodemailer Transporter
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MY_EMAIL,   // We will set this in Render later
                pass: process.env.MY_PASSWORD // We will set this in Render later
            }
        });

        // The actual link (pointing to your Netlify Frontend)
        // Make sure this matches your LIVE Netlify URL!
        const resetLink = `https://illustrious-melomakarona-b45ba5.netlify.app/reset-password/${user._id}/${token}`;

        var mailOptions = {
            from: process.env.MY_EMAIL,
            to: email,
            subject: 'Reset Password Link',
            text: `Click on the following link to reset your password: ${resetLink}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.send({ Status: "Error sending email" });
            } else {
                return res.send({ Status: "Success" });
            }
        });
    })
    .catch(err => res.send({ Status: "Error", err }));
});

// Reset Password
app.post("/reset-password/:token", async (req, res) => {
  res.json({ message: "Password updated successfully" });
});

app.listen(5000, () => { console.log("🚀 Server running on port 5000"); });