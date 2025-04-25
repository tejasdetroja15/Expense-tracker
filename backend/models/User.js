const mongoose = require('mongoose');

const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        profileImageUrl: { type: String, default: null },
        isEmailVerified: { type: Boolean, default: false },
        emailVerificationToken: { type: String },
        emailVerificationExpires: { type: Date },
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date },
        googleId: { type: String, sparse: true },
    },
    { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSalt(10); // Salt rounds
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare passwords
UserSchema.methods.comparePassword = async function (enteredPassword) {
    const start = Date.now();
    const isPasswordMatch = await bcrypt.compare(enteredPassword, this.password);
    const end = Date.now();
    // console.log(`Password comparison took ${end - start}ms`);
    return isPasswordMatch;
};

module.exports = mongoose.model("User", UserSchema);
