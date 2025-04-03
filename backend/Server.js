import dotenv from "dotenv";
dotenv.config(); // Load environment variables

import express from "express";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import { Strategy as GitHubStrategy } from "passport-github2";

// Debugging environment variables
console.log("GitHub Client ID:", process.env.GITHUB_CLIENT_ID);
console.log("GitHub Client Secret:", process.env.GITHUB_CLIENT_SECRET);

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(session({ secret: "random_secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Configure GitHub OAuth strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/github/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// GitHub Auth Routes
app.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    const user = {
      id: req.user.id,
      name: req.user.username, // Using 'name' to match Google structure
      avatar: req.user.photos[0].value,
    };
    console.log("User object to send:", user); // Log what we're sending
    const queryString = new URLSearchParams(user).toString();
    res.redirect(`http://localhost:5173/employees?${queryString}`);
  }
);

// Start the server
app.listen(5000, () => console.log("Server running on port 5000"));