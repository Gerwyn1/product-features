import express from "express";

import * as UserController from "../controllers/user.js";
import { protect } from '../middleware/authMiddleware.js';
import {ROLES_LIST} from "../config/roles_list.js";
import {checkUserRole} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/', UserController.registerUser);
router.post('/auth', UserController.authUser);
router.post('/logout', UserController.logoutUser);
router
  .route('/profile')
  .get(protect, checkUserRole(ROLES_LIST.user), UserController.getUserProfile)
  .put(protect, checkUserRole(ROLES_LIST.editor, ROLES_LIST.admin), UserController.updateUserProfile);

export default router;