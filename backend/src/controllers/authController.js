
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");
const { sendResetEmail } = require("../services/emailService");

// ======================================
// GENERATE JWT TOKEN
// ======================================
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

// ======================================
// STUDENT REGISTRATION
// ======================================
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Registration always creates a student.
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "student",
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during registration.",
    });
  }
};

// ======================================
// ROLE-BASED LOGIN
// ======================================
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password and role are required.",
      });
    }

    if (!["student", "teacher"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid login role.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `This account is registered as a ${user.role}. Please select ${user.role} login.`,
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login.",
    });
  }
};

// ======================================
// FORGOT PASSWORD
// ======================================
const forgotPassword = async (req, res) => {
  try {
    console.log("[Forgot Password] Request received");

    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required.",
      });
    }

    // Find registered student or teacher.
    const user = await User.findOne({ email });
    

    const genericMessage =
      "If an account exists with this email, a password reset link will be sent.";

    // Do not reveal whether the account exists.
    if (!user) {
      console.log("[Forgot Password] No matching account found.");

      return res.status(200).json({
        success: true,
        message: genericMessage,
      });
    }

    console.log(
      "[Forgot Password] Registered account found:",
      user.role
    );

    // Generate secure random reset token.
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store hashed token in MongoDB.
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Token expires after 15 minutes.
    user.resetPasswordExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await user.save({
      validateBeforeSave: false,
    });

    const frontendURL =
      process.env.FRONTEND_URL || "http://localhost:5174";

    const resetURL =
      `${frontendURL}/reset-password/${resetToken}`;

    console.log("[Forgot Password] Calling email service...");

    try {
      // Send reset link to registered email.
      await sendResetEmail(user.email, resetURL);

      console.log(
        "[Forgot Password] Email service completed successfully."
      );

      return res.status(200).json({
        success: true,
        message: genericMessage,
      });

    } catch (emailError) {
      console.error(
        "[Forgot Password] Email sending failed:",
        emailError
      );

      // Remove token if sending fails.
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save({
        validateBeforeSave: false,
      });

      return res.status(500).json({
        success: false,
        message: "Unable to send reset email. Please try again later.",
      });
    }

  } catch (error) {
    console.error("[Forgot Password] Server error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while requesting password reset.",
    });
  }
};

// ======================================
// RESET PASSWORD
// ======================================
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Reset token is required.",
      });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Both password fields are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    // Hash incoming token.
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with valid, unexpired token.
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset link is invalid or has expired.",
      });
    }

    // Update password with bcrypt.
    user.password = await bcrypt.hash(password, 10);

    // Invalidate token after successful reset.
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    console.log("[Reset Password] Password updated successfully.");

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. Please log in.",
    });

  } catch (error) {
    console.error("[Reset Password] Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while resetting password.",
    });
  }
};

// ======================================
// EXPORT CONTROLLERS
// ======================================
module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
