const express = require("express");
const { protect } = require("../middlewares/AuthMiddleware");
const { 
    loginUser, 
    getUserInfo, 
    registerUser, 
    verifyEmail, 
    resendOTP, 
    forgotPassword, 
    verifyResetOTP,
    resetPassword, 
    googleCallback 
} = require("../controllers/authController");
const { upload } = require("../middlewares/uploadMiddleware");
const passport = require("../config/passport");
const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendOTP);

router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);

router.get("/google", passport.authenticate("google", { 
    scope: ["profile", "email"],
    prompt: "select_account" // Always show Google account selector
}));

router.get("/google/callback", 
    (req, res, next) => {
        passport.authenticate("google", { 
            failureRedirect: `${process.env.FRONTEND_URL}/login?error=Authentication failed`,
            session: false 
        })(req, res, next);
    },
    googleCallback
);

router.get("/getUser", protect, getUserInfo);

router.post("/upload-image", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
});

module.exports = router;


