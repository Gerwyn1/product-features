import {
  roomSchema
} from "../models/room";

export const editDefaultRoomSize = (req, res, next) => {
  // Change default sizes by admin 
  return asyncHandler(async (req, res, next) => {
    roomSchema.statics.setSize = (small = roomSchema.path('ROOM_SIZE.small').defaultValue, medium = roomSchema.path('ROOM_SIZE.medium').defaultValue, large = roomSchema.path('ROOM_SIZE.large').defaultValue) => {
      roomSchema.path('ROOM_SIZE.small').defaultValue = small;
      roomSchema.path('ROOM_SIZE.medium').defaultValue = medium;
      roomSchema.path('ROOM_SIZE.large').defaultValue = large;
    }

  })
}