// const User = require("../modals/userModal");

// const express = require("express");
// const router = express.Router();

// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// // Register
// exports.registerUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Please provide an email and password." });
//     }

//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists." });
//     }

//     // const hashedPassword = await bcrypt.hash(password, 10);
//     console.log("userData", email, password);
//     const user = new User({ email, password: password });
//     await user.save();

//     res.status(201).json({
//       data: user,
//       // userRoles: userRole,
//       message: "User registered successfully.",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Registration failed." });
//   }
// };

// exports.loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });

//     console.log(email);

//     if (!user) {
//       return res.status(401).json({ message: "Invalid email or password." });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Invalid email or password." });
//     }
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
//     let userRoles = "";

//     if (email === "meromail123@gmail.com" && password === "123456783") {
//       console.log("admin");
//       userRoles = "ADMIN";
//     } else {
//       userRoles = "USER";
//       console.log("non admin");
//     }

//     console.log("userRoles", userRoles, "role");

//     res.json({ token, user: user, userRoles: userRoles });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Login failed." });
//   }
// };
// const User = require("../modals/userModal");

const nodemailer = require("nodemailer");
const crypto = require("crypto");
const User = require("../modals/userModal");

const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const transporter = nodemailer.createTransport({
  service: "Gmail", // You can change this to your email provider
  auth: {
    user: "baivabbidari876@gmail.com", // Replace with your email
    pass: "djuw xkgi vbpi vwqc",
  },
});

// Register
exports.registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide an email and password." });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({
      data: user,
      // userRoles: userRole,
      message: "User registered successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed." });
  }
};

exports.loginUser = async (req, res) => {
  console.log("hello datas");
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    console.log(user.password, password, "password hitted");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid email or password hai." });
    }
    const token = jwt.sign({ userId: user._id }, "4Kq#W%L9gT!z7&$xP@jR");
    let userRoles = "";

    // if (email === "meromail123@gmail.com" && password === "123456783") {
    //   console.log("admin");
    //   userRoles = "ADMIN";
    // } else {
    //   userRoles = "USER";
    // }

    res.json({ token, user: user, userRoles: userRoles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed." });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Please provide an email." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set token and expiry on the user model
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    const resetUrl = `http://localhost:3010/#/reset-password/${resetToken}`;

    const mailOptions = {
      from: "baivabbidari876@gmail.com",
      to: user.email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Click the link to reset your password: ${resetUrl}. If you didn't request this, ignore this email.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Password reset email sent. Please check your inbox.",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to process forgot password request." });
  }
};
