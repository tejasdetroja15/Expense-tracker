const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:"https://expense-tracker-ze3o.onrender.com/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Debug log the full profile
        console.log('Google Profile Data:', JSON.stringify({
          id: profile.id,
          displayName: profile.displayName,
          emails: profile.emails,
          photos: profile.photos,
          _json: profile._json
        }, null, 2));

        // Validate required profile data
        if (!profile || !profile.id) {
          console.error("Missing profile ID");
          return done(new Error("Missing profile ID"));
        }
        if (!profile.displayName) {
          console.error("Missing display name");
          return done(new Error("Missing display name"));
        }
        if (!profile.emails || !profile.emails.length) {
          console.error("Missing emails array");
          return done(new Error("Missing email information"));
        }
        if (!profile.emails[0] || !profile.emails[0].value) {
          console.error("Missing email value");
          return done(new Error("Invalid email information"));
        }

        const email = profile.emails[0].value;
        const profileImageUrl = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

        // Check if user already exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // Update profile image if it's available and user doesn't have one
          if (profileImageUrl && !user.profileImageUrl) {
            user.profileImageUrl = profileImageUrl;
            await user.save();
          }
          return done(null, {
            id: profile.id,
            displayName: profile.displayName,
            emails: profile.emails,
            photos: profile.photos
          });
        }

        // Check if user exists with the same email
        user = await User.findOne({ email });

        if (user) {
          // Update existing user with Google ID and profile image
          user.googleId = profile.id;
          if (profileImageUrl && !user.profileImageUrl) {
            user.profileImageUrl = profileImageUrl;
          }
          await user.save();
          return done(null, {
            id: profile.id,
            displayName: profile.displayName,
            emails: profile.emails,
            photos: profile.photos
          });
        }

        // Create new user
        user = await User.create({
          fullName: profile.displayName,
          email: email,
          password: Math.random().toString(36).slice(-8), // Random password
          profileImageUrl: profileImageUrl,
          googleId: profile.id,
          isEmailVerified: true, // Google emails are pre-verified
        });

        return done(null, {
          id: profile.id,
          displayName: profile.displayName,
          emails: profile.emails,
          photos: profile.photos
        });
      } catch (error) {
        console.error("Error in Google Strategy:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport; 