import asyncHandler from 'express-async-handler';

import RoomModel from '../models/room.js';

const getRoom = asyncHandler(async (req, res) => {
  const room = await RoomModel.findOne({_id : req.params?.id});
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

const getAllRooms = asyncHandler(async (_,res) => {
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
    size,
    customSize
  } = req.body;

  const prop = (customSize ? 'customSize' : 'size');

  const room = await RoomModel.create({
    [prop]: customSize ? customSize : size
  });

  if (!room || (!customSize && !size)) {
    res.status(400);
    throw new Error('Invalid room data');
  }
  res.status(201).json(room);
});

const deleteRoom = asyncHandler(async (req, res) => {
  const result = await RoomModel.deleteOne({_id: req.params.id});

  if (result.deletedCount === 0) {
    res.status(404);
    throw new Error('Room not found');
  }

  res.status(200).json({message: 'Room successfully deleted'});
});

export {
  getRoom,
  getAllRooms,
  getSpecificRooms,
  createRoom,
  deleteRoom
}