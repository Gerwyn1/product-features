import asyncHandler from 'express-async-handler';

import RoomModel from '../models/room.js';

const getAllRooms = asyncHandler(async (req, res) => {
  const rooms = await RoomModel.find({});
  res.json(rooms);
})

const getSpecifiedRooms = asyncHandler(async (req, res) => {
  const roomSize = req.params?.roomSize;
  const prop = (isNaN(parseInt(roomSize)) ? 'size' : 'customSize');
  const rooms = await RoomModel.find({
    [prop]: roomSize
  }).exec();
  res.json(rooms);
})

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

export {
  createRoom,
  getAllRooms,
  getSpecifiedRooms
}