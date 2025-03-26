import express from "express";
import passport from 'passport';
import { login } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);

// Google OAuth routes
router.get('/google', 
    passport.authenticate('google', { 
      scope: ['profile', 'email'] 
    })
  );
  
  router.get('/google/callback', 
    passport.authenticate('google', { 
      failureRedirect: '/login',
      successRedirect: 'http://localhost:3000/home' 
    })
  );

export default router;
