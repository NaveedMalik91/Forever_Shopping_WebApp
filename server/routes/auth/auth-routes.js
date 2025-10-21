const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  forgotPassword,
  resetPassword
} = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Register user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Logout user
router.post("/logout", logoutUser);

// Check authentication
router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    user,
  });
});

// Forgot password (send reset link via email)
router.post("/forgot-password", forgotPassword);

// Reset password (after clicking email link)
router.post("/reset-password/:token", resetPassword);

module.exports = router;
