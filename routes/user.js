import express from "express";

import * as UserController from "../controllers/user.js";
import { protect } from '../middleware/authMiddleware.js';
import {ROLES_LIST} from "../config/roles_list.js";
import {checkUserRole} from "../middleware/authMiddleware.js";
import { requestVerificationCodeRateLimit } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

// get all users
router.get('/', protect, checkUserRole(ROLES_LIST.moderator, ROLES_LIST.admin), UserController.getAllUsers);

// request account verification code
router.post("/verification-code", requestVerificationCodeRateLimit, UserController.requestEmailVerificationCode);

// request reset pw code
router.post("/reset-password-code", requestVerificationCodeRateLimit, UserController.requestResetPasswordCode);

router.post("/reset-password", UserController.resetPassword);

// register user
router.post('/', UserController.registerUser);

// login user
router.post('/auth', UserController.authUser);

// logout user
router.post('/logout', protect, UserController.logoutUser);

// delete user
router.delete('/:id', protect, checkUserRole(ROLES_LIST.admin), UserController.deleteUser);

// get user profile & update user profile
router
.route('/profile')
.get(protect, checkUserRole(ROLES_LIST.user), UserController.getUserProfile)
.patch(protect, checkUserRole(ROLES_LIST.editor, ROLES_LIST.admin), UserController.updateUserProfile);

router.patch('/disable/:id', protect, checkUserRole(ROLES_LIST.admin), UserController.disableUser);


export default router;