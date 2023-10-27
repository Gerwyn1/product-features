import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";

import GalleryModel from "../models/gallery.js";
import RoomModel from "../models/room.js";

const createGallery = expressAsyncHandler(async(req, res, next) => {
  const room = await RoomModel.findById(req.params.roomId);
  if (!room) {
    throw createHttpError(404, 'Room not found');
  }

  const {title, price, publish_type} = req.body;
  const gallery = await GalleryModel.create({
    title,
    price,
    publish_type,
    room_id: room
  });

  if (gallery) {
    res.status(201).json(gallery);
  } else {
    res.status(400);
    throw new Error('Invalid gallery data');
  }
 });

 const getGallery = expressAsyncHandler(async(req, res, next) => {
    const user = req.user;
    if (!user) {
      throw createHttpError(401, 'Not authorized, no user');
    }

    const gallery = await GalleryModel.findById(req.params.galleryId);
    if (!gallery) {
      throw createHttpError(404, 'Gallery not found');
    }

    res.status(200).json(gallery);
  })

  const getAllGalleries = expressAsyncHandler(async(req, res, next) => { 
    const user = req.user;
    if (!user) {
      throw createHttpError(401, 'Not authorized, no user');
    }

    const galleries = await GalleryModel.find({});
    res.status(200).json(galleries);
   })


 export {
    createGallery,
    getGallery,
    getAllGalleries
 }