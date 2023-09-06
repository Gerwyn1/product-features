import express from "express";

import * as UserController from "../controllers/user.js";
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', UserController.registerUser);
router.post('/auth', UserController.authUser);
router.post('/logout', UserController.logoutUser);
router
  .route('/profile')
  .get(protect, UserController.getUserProfile)
  .put(protect, UserController.updateUserProfile);

// User Login
// router.post('/login', UserController.login);

// Change Password
router.put('/profile/password', (req, res) => {
  // Handle change password logic
});

export default router;