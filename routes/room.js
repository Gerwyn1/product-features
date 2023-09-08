import express from "express";
import * as RoomController from "../controllers/room.js";

const router = express.Router();

// Route to create a new room with custom size
router.get('/', RoomController.getAllRooms);
router.get('/:roomSize', RoomController.getSpecifiedRooms);
router.post('/', RoomController.createRoom);

export default router;