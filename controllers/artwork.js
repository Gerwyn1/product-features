import asyncHandler from 'express-async-handler';

import ArtworkModel from "../models/artwork.js";
import convertImagePath from '../utils/convertImagePath.js';

const getArtwork = asyncHandler(async (req, res) => {
  const artwork = await ArtworkModel.findOne({_id : req.params?.id});
  if (!artwork) {
    res.status(404);
    throw new Error('Artwork not found');
  }
  
  res.status(200).json(artwork);
});

const getAllArtworks = asyncHandler(async (_, res) => {
  const artworks = await ArtworkModel.find({});
  res.status(200).json(artworks);
});

const createArtwork = asyncHandler(async (req, res) => {
  const {
    title,
    artist,
    year,
    medium,
    description,
  } = req.body;
  
  const file = req.file;

  if (!file) {
    res.status(404);
    throw new Error('Image not found');
  }

  const imagePngPath = await convertImagePath(file); // '/uploads/images/1694575721155.png'

  const artwork = await ArtworkModel.create({
    title,
    artist,
    year,
    medium,
    description,
    image: imagePngPath
  });

  if (!artwork) {
    res.status(400);
    throw new Error('Invalid artwork data');
  }

  await artwork.save();

  res.status(201).json(artwork);
});

const updateArtwork = asyncHandler(async (req, res) => {
  const artwork = await ArtworkModel.findById(req.params.id);
  const {
    title,
    artist,
    year,
    medium,
    description,
  } = req.body;

  const file = req.file;

  if (!file) {
    res.status(404);
    throw new Error('Image not found');
  }

  const imagePngPath = await convertImagePath(file); // '/uploads/images/1694575721155.png'

  if (artwork) {
    artwork.title = title || artwork.title;
    artwork.artist = artist || artwork.artist;
    artwork.year = year || artwork.year;
    artwork.medium = medium || artwork.medium;
    artwork.description = description || artwork.description;
    artwork.image = imagePngPath || artwork.image;

    const updatedArtwork = await artwork.save();

    res.status(200).json({
      _id: updatedArtwork._id,
      title: updatedArtwork.title,
      artist: updatedArtwork.artist,
      year: updatedArtwork.year,
      medium: updatedArtwork.medium,
      description: updatedArtwork.description,
      image: updatedArtwork.image
    });
  } else {
    res.status(404);
    throw new Error('Artwork not found');
  }
});

const deleteArtwork = asyncHandler(async (req, res) => {
  const result = await ArtworkModel.deleteOne({
    _id: req.params.id
  });

  if (result.deletedCount === 0) {
    res.status(404);
    throw new Error('Artwork not found');
  }

  res.status(200).json({
    message: 'Artwork successfully deleted'
  });
});

export {
  getArtwork,
  getAllArtworks,
  createArtwork,
  updateArtwork,
  deleteArtwork
}