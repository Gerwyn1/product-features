import asyncHandler from 'express-async-handler';

import RoomModel from '../models/room.js';

const createRoom = asyncHandler(async (req, res) => {
    const {
      size,
      customSize
    } = req.body;

    const prop = (customSize ? 'customSize' : 'size');

    const room = await RoomModel.create({
      [prop]: customSize ? customSize : size
    });

    if (!room || !customSize) {
      res.status(400);
      throw new Error('Invalid room data');
    }
    res.status(201).json(room);
  })

export {
  createRoom
}