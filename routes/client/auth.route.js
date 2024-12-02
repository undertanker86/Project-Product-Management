const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/auth.controller");

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Configure Passport with Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.googleClientID,
      clientSecret: process.env.googleClientSecret,
      callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // You can store only the essential info, such as the Google ID
      const user = {
        accessToken,
        profile,
      };
      return done(null, user);  // Pass user object to session
    }
  )
);

// Google authentication route
router.get("/", controller.ok);  // Check if Google credentials are loaded
router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback route after successful authentication
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/auth/failure' }), controller.callBack);

module.exports = router;
