const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const emailService = require("../services/emailService");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.create({ name, email, password, role });
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, is_active: true });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ is_active: true }).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      is_active: true,
    }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    // Check if user is updating their own profile or is an admin
    if (req.user.role !== "admin" && req.user._id.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You can only update your own profile" });
    }

    const user = await User.findOne({ _id: userId, is_active: true });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Don't allow role updates unless admin
    if (req.body.role && req.user.role !== "admin") {
      delete req.body.role;
    }

    // Don't update password through this endpoint
    delete req.body.password;

    Object.assign(user, req.body);
    await user.save();
    res.json({ ...user.toJSON(), password: undefined });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProfileWithPassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { currentPassword, newPassword, ...userData } = req.body;

    // Check if user is updating their own profile or is an admin
    if (req.user.role !== "admin" && req.user._id.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You can only update your own profile" });
    }

    const user = await User.findOne({ _id: userId, is_active: true });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Never allow role updates through this endpoint
    delete userData.role;

    // If password update is requested, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          error: "Current password is required to set a new password",
        });
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }

      // Set the new password
      user.password = newPassword;
    }

    // Update other user data
    Object.assign(user, userData);
    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    // Check if user is deleting their own account or is an admin
    if (req.user.role !== "admin" && req.user._id.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You can only delete your own account" });
    }

    const user = await User.findOneAndUpdate(
      { _id: userId, is_active: true },
      { is_active: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Request password reset
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token and set to user model
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save reset token and expiry to user document
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // Create reset URL
    const resetUrl = `http://localhost:5173/api/auth/reset-password/${resetToken}`;

    // Send email
    const emailSent = await emailService.sendPasswordResetEmail(
      user.email,
      resetUrl
    );

    if (!emailSent) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return res.status(500).json({ message: "Error sending email" });
    }

    res.status(200).json({
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset password using token
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "New password is required" });
    }

    // Hash the token from URL
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with matching token and valid expiry
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token is invalid or has expired" });
    }

    // Update password and clear reset fields
    user.password = password; // Assuming you hash passwords in a pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
