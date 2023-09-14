import asyncHandler from 'express-async-handler';

import RoomModel from '../models/room.js';
import { roomSchema } from '../models/room.js';

const getRoom = asyncHandler(async (req, res) => {
  const room = await RoomModel.findOne({
    _id: req.params?.id
  });

  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }

  const roomSize = room.customSize ? room.customSize : room.size;

  res.status(200).json({
    _id: room._id,
    size: roomSize
  });
});

const getAllRooms = asyncHandler(async (_, res) => {
  
  const rooms = await RoomModel.find({});
  res.status(200).json(rooms);
});

const getSpecificRooms = asyncHandler(async (req, res) => {
  const roomSize = req.params?.roomSize;

  const prop = (isNaN(parseInt(roomSize)) ? 'size' : 'customSize');
  const rooms = await RoomModel.find({
    [prop]: roomSize
  }).exec();

  if (rooms.length === 0) {
    res.status(404);
    throw new Error('No matching rooms found')
  }

  res.status(200).json(rooms);
});

const createRoom = asyncHandler(async (req, res) => {
  const {
    sizeName,
    sizeValue,
    customSize,
  } = req.body;

  // if (req.user.roles.includes('admin')) {
  //   RoomModel.setSize(15, 25, 35);
  // }
  RoomModel.setSize(152, undefined, 300);

  console.log(roomSchema.path('ROOM_SIZE.large').defaultValue)

  const room = await RoomModel.create({
    ...( customSize ? {customSize} : {
      sizeName,
      sizeValue
    }),
  });

  if (!room || (!sizeName && !sizeValue && !customSize)) {
    res.status(400);
    throw new Error('Missing room data');
  }

  res.status(201).json(room);
});

const deleteRoom = asyncHandler(async (req, res) => {
  const result = await RoomModel.deleteOne({
    _id: req.params.id
  });

  if (result.deletedCount === 0) {
    res.status(404);
    throw new Error('Room not found');
  }

  res.status(200).json({
    message: 'Room successfully deleted'
  });
});

const updateRoomSizes = asyncHandler(async (req, res) => {
  try {
    await RoomModel.updateMany(
      { sizeName: 'small' },
      { $set: { sizeValue: 15 } },
      { upsert: true }
    );

    await RoomModel.updateMany(
      { sizeName: 'medium' },
      { $set: { sizeValue: 25 } },
      { upsert: true }
    );

    await RoomModel.updateMany(
      { sizeName: 'large' },
      { $set: { sizeValue: 35 } },
      { upsert: true }
    );

    res.status(200).json({message:'Room sizes created/updated successfully'});
  } catch (error) {
    res.status(500);
    throw new Error('Error updating room sizes');
  }
});

export {
  getRoom,
  getAllRooms,
  getSpecificRooms,
  createRoom,
  deleteRoom,
  updateRoomSizes
}