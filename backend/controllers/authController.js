const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService');
const { generateOTP, generateResetToken, hashToken } = require('../utils/tokenUtils');
const passport = require('passport');

//Generate JWT Token
const generateToken = (id) => {
    const secretKey = process.env.JWT_SECRET;
    
    if (!secretKey) {
        console.error("JWT_SECRET is undefined!");
        throw new Error("JWT_SECRET environment variable is not set");
    }
    
    // console.log("JWT_SECRET length in authController:", secretKey.length);
    return jwt.sign({ id }, secretKey, { expiresIn: '30d' });
};

exports.registerUser = async (req, res) => {
    const { fullName, email, password, profileImageUrl } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const otp = generateOTP();
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // OTP expires in 10 minutes

        const user = new User({
            fullName,
            email,
            password,
            profileImageUrl,
            emailVerificationToken: otp,
            emailVerificationExpires: otpExpiry,
            isEmailVerified: false
        });

        await user.save();

        const emailSent = await sendVerificationEmail(email, otp);
        if (!emailSent) {
            console.error("Failed to send verification email");
            return res.status(500).json({ message: "Failed to send verification email" });
        }

        res.status(201).json({
            message: "Registration successful. Please verify your email.",
            email: email,
            requireVerification: true
        });

    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.verifyEmail = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    try {
        const user = await User.findOne({ 
            email,
            emailVerificationToken: otp,
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired verification code" });
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        const token = generateToken(user._id);
        
        res.status(200).json({ 
            message: "Email verified successfully",
            token: token,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profileImageUrl: user.profileImageUrl,
            }
        });
    } catch (error) {
        console.error("Error verifying email:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


exports.resendOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ message: "Email is already verified" });
        }

        // Generate new OTP
        const otp = generateOTP();
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // OTP expires in 10 minutes

        // Update user with new OTP
        user.emailVerificationToken = otp;
        user.emailVerificationExpires = otpExpiry;
        await user.save();

        // Send verification email
        const emailSent = await sendVerificationEmail(email, otp);
        if (!emailSent) {
            return res.status(500).json({ message: "Failed to send verification email" });
        }

        res.status(200).json({ message: "Verification code sent successfully" });
    } catch (error) {
        console.error("Error resending OTP:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }
    try {
        // console.time("Login Process");
        const user = await User.findOne({ email });
        // console.timeEnd("Login Process");

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordMatch = await user.comparePassword(password);
        // console.log("Password Match:", isPasswordMatch);

        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check if email is verified
        if (!user.isEmailVerified) {
            return res.status(403).json({ 
                message: "Email not verified", 
                email: user.email,
                requireVerification: true
            });
        }

        res.json({
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profileImageUrl: user.profileImageUrl,
            },
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate OTP for password reset
        const otp = generateOTP();
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // OTP expires in 10 minutes

        // Save OTP to user
        user.resetPasswordToken = otp;
        user.resetPasswordExpires = otpExpiry;
        await user.save();

        // Send password reset OTP email
        const emailSent = await sendPasswordResetEmail(email, otp);
        if (!emailSent) {
            return res.status(500).json({ message: "Failed to send password reset OTP" });
        }

        res.status(200).json({ 
            message: "Password reset OTP sent to your email",
            email: email
        });
    } catch (error) {
        console.error("Error in forgot password:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.verifyResetOTP = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    try {
        const user = await User.findOne({
            email,
            resetPasswordToken: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Generate temporary token for password reset
        const resetToken = generateResetToken();
        user.resetPasswordToken = resetToken;
        await user.save();

        res.status(200).json({
            message: "OTP verified successfully",
            resetToken: resetToken
        });
    } catch (error) {
        console.error("Error verifying reset OTP:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { resetToken, newPassword, confirmPassword } = req.body;

    if (!resetToken || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        const user = await User.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        // Update password
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ 
            message: "Password reset successful. Please login with your new password.",
            email: user.email
        });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.googleCallback = async (req, res) => {
  try {
    console.log('User data in callback:', JSON.stringify(req.user, null, 2));
    console.log('Profile picture URL:', req.user.photos?.[0]?.value);

    if (!req.user) {
      console.error("Google OAuth error: req.user is undefined");
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=Authentication failed`);
    }

    let user = await User.findOne({ googleId: req.user.id });

    if (!user) {
      user = await User.findOne({ email: req.user.emails[0].value });

      if (user) {
        user.googleId = req.user.id;
        if (req.user.photos && req.user.photos[0] && !user.profileImageUrl) {
          user.profileImageUrl = req.user.photos[0].value;
        }
        await user.save();
      } else {
        user = await User.create({
          fullName: req.user.displayName,
          email: req.user.emails[0].value,
          password: Math.random().toString(36).slice(-8), 
          profileImageUrl: req.user.photos && req.user.photos[0] ? req.user.photos[0].value : null,
          googleId: req.user.id,
          isEmailVerified: true, 
        });
      }
    }

    const token = generateToken(user._id);

    const userData = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
    };

    const redirectUrl = `${process.env.FRONTEND_URL}/auth/google/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`;
    console.log('Redirecting to:', redirectUrl);

    // Redirect to frontend with token and user data
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Google OAuth error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(error.message)}`);
  }
};

//get user info
exports.getUserInfo = async (req, res) => {
    try{
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    }catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
