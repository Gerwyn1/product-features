import express from "express";

import * as UserController from "../controllers/user.js";
import { protect } from '../middleware/authMiddleware.js';
import {ROLES_LIST} from "../config/roles_list.js";
import {checkUserRole} from "../middleware/authMiddleware.js";
import { requestVerificationCodeRateLimit } from "../middleware/rateLimitMiddleware.js";
import {imageUpload} from "../middleware/mediaMiddleware.js";

const router = express.Router();

// get all users
router.get('/', protect, checkUserRole(ROLES_LIST.moderator, ROLES_LIST.admin, ROLES_LIST.user), UserController.getAllUsers);

// request email verification code
router.post("/send-email-code", requestVerificationCodeRateLimit, UserController.requestEmailVerificationCode);

// verify email
router.patch("/verify-email", UserController.verifyEmail);

// request reset password code
router.post("/reset-password-code", requestVerificationCodeRateLimit, UserController.requestResetPasswordCode);

// reset user password
router.patch("/reset-password", UserController.resetPassword);

// check if user password has expired
router.post("/is-password-expired", UserController.isPasswordExpired);

// register user
router.post('/', imageUpload.fields([
  { name: 'profile_image', maxCount: 1 },
  { name: 'banner_image', maxCount: 1 },
]),  UserController.registerUser);

// login user
router.post('/auth', UserController.authUser);

// logout user
router.post('/logout', protect, UserController.logoutUser);

// delete user
router.delete('/:id', protect, checkUserRole(ROLES_LIST.admin), UserController.deleteUser);

// get user profile & update user profile
router
.route('/profile/:userId')
.get(UserController.getUserProfile)
.patch(protect, checkUserRole(ROLES_LIST.editor, ROLES_LIST.admin, ROLES_LIST.user), imageUpload.fields([
  { name: 'profile_image', maxCount: 1 },
  { name: 'banner_image', maxCount: 1 },
]), UserController.updateUserProfile);

// disable user
router.patch('/disable/:id', protect, checkUserRole(ROLES_LIST.admin), UserController.disableUser);

// Change password expiry date
router.patch('/change-password-expiry', protect, checkUserRole(ROLES_LIST.admin, ROLES_LIST.user), UserController.changePasswordExpiry);

export default router;