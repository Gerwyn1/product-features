import asyncHandler from "express-async-handler";

import {
  roomSchema
} from "../models/room.js";

export const editDefaultRoomSize = (small = roomSchema.path('ROOM_SIZE.small').defaultValue, medium = roomSchema.path('ROOM_SIZE.medium').defaultValue, large = roomSchema.path('ROOM_SIZE.large').defaultValue) => {
  // Change default sizes by admin
  return asyncHandler(async (req, res, next) => {
    roomSchema.path('ROOM_SIZE.small').defaultValue = small;
    roomSchema.path('ROOM_SIZE.medium').defaultValue = medium;
    roomSchema.path('ROOM_SIZE.large').defaultValue = large;
  })
}