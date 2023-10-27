import asyncHandler from 'express-async-handler';
import RoomModel from '../models/room.js';
import {
  roomSchema
} from '../models/room.js';

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

  const room = await RoomModel.create({
    ...(customSize ? {
      customSize
    } : {
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
  // console.log('PATCH REQUEST: ')
  // console.log('--------------------------------------------------')

  // console.log('BEFORE MODIFY ROOM_SIZE')
  
  // console.log(roomSchema.path('ROOM_SIZE.small').defaultValue)
  // console.log(roomSchema.path('ROOM_SIZE.medium').defaultValue)
  // console.log(roomSchema.path('ROOM_SIZE.large').defaultValue)

  // update schema default room sizes
  roomSchema.statics.updateSchemaDefaultRoomSizes(
    Math.floor(Math.random() * (25 - 10 + 1)) + 10,
    Math.floor(Math.random() * (45 - 30 + 1)) + 30,
    Math.floor(Math.random() * (65 - 50 + 1)) + 50
);

  // console.log('AFTER MODIFY ROOM_SIZE')

  // console.log(roomSchema.path('ROOM_SIZE.small').defaultValue)
  // console.log(roomSchema.path('ROOM_SIZE.medium').defaultValue)
  // console.log(roomSchema.path('ROOM_SIZE.large').defaultValue)


  // update database default room sizes
  await roomSchema.statics.updateDatabaseDefaultRoomSizes();
    
    // setTimeout(() => console.log('__________________________________________________'), 500)
    
    res.status(200).json({
      message: 'Room sizes updated successfully'
    });
});

export {
  getRoom,
  getAllRooms,
  getSpecificRooms,
  createRoom,
  deleteRoom,
  updateRoomSizes
}