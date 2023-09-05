import express from "express";
import * as UserController from "../controllers/user.js";

const router = express.Router();

// User Registration
router.post("/register", UserController.register)

// User Login
router.post('/login', (req, res) => {
  // Handle user login logic
});

// User Logout
router.post('/logout', (req, res) => {
  // Handle user logout logic
});

// User Profile
router.get('/profile', (req, res) => {
  // Handle user profile retrieval logic
});

// Change Password
router.put('/profile/password', (req, res) => {
  // Handle change password logic
});

export default router;