const jwt = require("jsonwebtoken"); 
const User = require("../models/User");
require("dotenv").config(); // Ensure dotenv is loaded

exports.protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            console.error("Authorization header missing");
            return res.status(401).json({ message: "Not authorized, no token provided" });
        }

        const secretKey = process.env.JWT_SECRET;
        if (!secretKey) {
            console.error("JWT_SECRET is undefined in middleware!");
            return res.status(500).json({ message: "Server configuration error" });
        }

        console.log("Received Token:", token);
        console.log("JWT_SECRET length in AuthMiddleware:", secretKey.length);

        const decoded = jwt.verify(token, secretKey);
        console.log("Decoded User ID:", decoded.id);

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            console.error("User not found in database!");
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("JWT verification error:", error);
        return res.status(401).json({ message: "Not authorized, invalid token" });
    }
};
