import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/auth/google/callback" // Must match backend URI
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists with Google ID
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        // Check if user exists with the same email (for existing users)
        user = await User.findOne({ email: profile.emails[0].value });
        
        if (!user) {
          // Create new user
          user = new User({
            googleId: profile.id,
            firstName: profile.name.givenName,
            email: profile.emails[0].value,
            picturePath: profile.photos[0].value,
            password: '', // No password needed for Google auth
            verified: true
          });
        } else {
          // Link Google account to existing user
          user.googleId = profile.id;
        }
        
        await user.save();
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));