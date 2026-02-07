const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// 1. Connect to MongoDB
mongoose.connect("mongodb+srv://admin:Aadhithya2026@cluster0.ym57j9z.mongodb.net/movie-reset-db?appName=Cluster0")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// 2. Define User Model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

// 3. Routes

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
        // Reset Password Route
app.post('/reset-password/:id/:token', (req, res) => {
    const {id, token} = req.params;
    const {password} = req.body;

    jwt.verify(token, "jwt_secret_key", (err, decoded) => {
        if(err) {
            return res.json({Status: "Error with token"})
        } else {
            bcrypt.hash(password, 10)
            .then(hash => {
                User.findByIdAndUpdate({_id: id}, {password: hash})
                .then(u => res.send({Status: "Success"}))
                .catch(err => res.send({Status: err}))
            })
            .catch(err => res.send({Status: err}))
        }
    })
})
        
        // Generate Token
        const token = jwt.sign({ id: user._id }, "jwt_secret_key", { expiresIn: "1d" });
        
        // Setup Nodemailer
        const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Link (Update with your live Frontend URL)
        const link = `https://illustrious-melomakarona-b45ba5.netlify.app/reset_password/${user._id}/${token}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset Password Link',
            text: `Click the following link to reset your password: ${link}`
        };

        // Send Mail
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

// 4. Start Server
// This MUST be outside of all routes
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});