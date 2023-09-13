import express from "express";

import * as RoomController from "../controllers/room.js";
import { protect } from '../middleware/authMiddleware.js';
import {checkUserRole} from "../middleware/authMiddleware.js";
import { ROLES_LIST } from "../config/roles_list.js";

const router = express.Router();

// get specific room
router.get('/:id', RoomController.getRoom);

// get specific room(s)
router.get('/size/:roomSize', RoomController.getSpecificRooms);

// get all rooms
router.get('/', RoomController.getAllRooms);

// create room
router.post('/', protect, checkUserRole(ROLES_LIST.user, ROLES_LIST.moderator, ROLES_LIST.admin), RoomController.createRoom);

// delete room
router.delete('/:id', protect, checkUserRole(ROLES_LIST.moderator, ROLES_LIST.admin),RoomController.deleteRoom);

export default router;