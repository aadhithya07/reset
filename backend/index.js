const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SibApiV3Sdk = require('sib-api-v3-sdk'); // <-- 1. Added Brevo SDK
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

// Forgot Password (UPDATED WITH BREVO SDK)
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    
    try {
        const user = await User.findOne({ email: email });
        if(!user) {
            return res.send({ Status: "User not existed" });
        }
        
        // Generate Token
        const token = jwt.sign({ id: user._id }, "jwt_secret_key", { expiresIn: "1d" });
        
        // Link mapping to your React frontend
        const link = `https://illustrious-melomakarona-b45ba5.netlify.app/reset_password/${user._id}/${token}`;

        // Setup Brevo API
        const defaultClient = SibApiV3Sdk.ApiClient.instance;
        const apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_API_KEY; // Must be in your .env / Render Env

        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

        sendSmtpEmail.sender = { email: "aadhithya799@gmail.com", name: "Movie App Support" };
        sendSmtpEmail.to = [{ email: email }];
        sendSmtpEmail.subject = "Reset Password Link";
        
        // Sending as a clickable HTML link
        sendSmtpEmail.htmlContent = `
            <h3>Password Reset Request</h3>
            <p>Click the link below to reset your password:</p>
            <a href="${link}" style="display:inline-block; padding:10px 20px; color:white; background-color:blue; text-decoration:none; border-radius:5px;">Reset My Password</a>
            <br><br>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p>${link}</p>
        `;

        // Send Mail
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("✅ Reset email sent successfully to: " + email);
        return res.send({ Status: "Success" });

    } catch (err) {
        console.error("❌ Error sending email:", err.response ? err.response.text : err.message);
        return res.send({ Status: "Error sending email" });
    }
});

// Reset Password Route (MOVED OUTSIDE)
app.post('/reset-password/:id/:token', (req, res) => {
    const {id, token} = req.params;
    const {password} = req.body;

    jwt.verify(token, "jwt_secret_key", (err, decoded) => {
        if(err) {
            return res.json({Status: "Error with token"});
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
});

// 4. Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});