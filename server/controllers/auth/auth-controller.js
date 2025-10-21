// ✅ Load environment variables first
require('dotenv').config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const crypto = require("crypto");
const { sendResetEmail } = require("../../helpers/email");

/**
 * REGISTER USER
 */
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists with this email! Please try again.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(200).json({
      success: true,
      message: "Registration successful.",
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred during registration.",
    });
  }
};

/**
 * LOGIN USER
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.json({
        success: false,
        message: "User doesn't exist! Please register first.",
      });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.json({
        success: false,
        message: "Incorrect password! Please try again.",
      });

    // ✅ Use JWT_SECRET from .env
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        userName: user.userName,
      },
      process.env.CLIENT_SECRET_KEY,
      { expiresIn: "60m" }
    );

    res
      .cookie("token", token, { httpOnly: true, secure: false })
      .json({
        success: true,
        message: "Logged in successfully.",
        user: {
          email: user.email,
          role: user.role,
          id: user._id,
          userName: user.userName,
        },
      });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred during login.",
    });
  }
};

/**
 * LOGOUT USER
 */
const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};

/**
 * AUTH MIDDLEWARE
 */
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });

  try {
    const decoded = jwt.verify(token, process.env.CLIENT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
};

/**
 * FORGOT PASSWORD
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ message: "Please provide an email." });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don’t reveal user existence for security
      return res.status(200).json({
        message: "If an account exists, a reset link has been sent.",
      });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save to DB with expiry (1 hour)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    // Reset link
    const resetURL = `${process.env.FRONTEND_URL}/auth/reset-password/${resetToken}`;

    const html = `
      <p>Hello ${user.userName || ""},</p>
      <p>You requested a password reset. Click the link below to set a new password. This link will expire in 1 hour.</p>
      <p><a href="${resetURL}" target="_blank">${resetURL}</a></p>
      <p>If you didn’t request this, you can safely ignore this email.</p>
    `;

    await sendResetEmail({
      to: user.email,
      subject: "Password Reset - Shop",
      html,
    });

    res.status(200).json({
      message:
        "A reset link has been sent to your email address.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({
      message: "Error sending reset email.",
    });
  }
};

/**
 * RESET PASSWORD
 */
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token)
      return res.status(400).json({ message: "Invalid or missing token." });
    if (!password)
      return res.status(400).json({ message: "Please provide a new password." });

    // Hash token to match DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({
        message: "Token is invalid or has expired.",
      });

    // ✅ Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;

    // ✅ Clear reset token
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({
      message: "Password reset successful. You can now log in.",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({
      message: "Could not reset password.",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  forgotPassword,
  resetPassword,
};
