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
  console.log('PATCH REQUEST: ')
  console.log('--------------------------------------------------')

  console.log('BEFORE MODIFY ROOM_SIZE')
  

  console.log(roomSchema.path('ROOM_SIZE.small').defaultValue)
  console.log(roomSchema.path('ROOM_SIZE.medium').defaultValue)
  console.log(roomSchema.path('ROOM_SIZE.large').defaultValue)

  roomSchema.add({
    // Add or modify fields as needed
    ROOM_SIZE: {
      small: {
        type: Number,
        default: Math.floor(Math.random() * (25 - 10 + 1)) + 10
      },
      medium: {
        type: Number,
        default: Math.floor(Math.random() * (45 - 30 + 1)) + 30
      },
      large: {
        type: Number,
        default: Math.floor(Math.random() * (65 - 50 + 1)) + 50
      }
    },
  });

  console.log('AFTER MODIFY ROOM_SIZE')

  console.log(roomSchema.path('ROOM_SIZE.small').defaultValue)
  console.log(roomSchema.path('ROOM_SIZE.medium').defaultValue)
  console.log(roomSchema.path('ROOM_SIZE.large').defaultValue)



  try {
    await RoomModel.updateMany({}, {
      $set: {
        ROOM_SIZE: {
          small: roomSchema.path('ROOM_SIZE.small').defaultValue,
          medium: roomSchema.path('ROOM_SIZE.medium').defaultValue,
          large: roomSchema.path('ROOM_SIZE.large').defaultValue
        }
      }
    }, {
      upsert: true
    });
    await RoomModel.updateMany({
      sizeName: "small"
    }, {
      $set: {
        sizeValue: roomSchema.path('ROOM_SIZE.small').defaultValue,
      }
    }, {
      upsert: true
    });
    await RoomModel.updateMany({
      sizeName: "medium"
    }, {
      $set: {
        sizeValue: roomSchema.path('ROOM_SIZE.medium').defaultValue,
      }
    }, {
      upsert: true
    });
    await RoomModel.updateMany({
      sizeName: "large"
    }, {
      $set: {
        sizeValue: roomSchema.path('ROOM_SIZE.large').defaultValue,
      }
    }, {
      upsert: true
    });
    
    setTimeout(() => console.log('__________________________________________________'), 500)
    
   
    res.status(200).json({
      message: 'Room sizes updated successfully'
    });
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