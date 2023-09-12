import fs from 'fs';
import {
  promisify
} from 'util';
import asyncHandler from 'express-async-handler';
import sharp from 'sharp';

import ArtworkModel from "../models/artwork.js";

const readFileAsync = promisify(fs.readFile);
// const writeFileAsync = promisify(fs.writeFile);
// const unlinkFileAsync = promisify(fs.unlink);

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

  if (!req.file) {
    res.status(404);
    throw new Error('Image not found');
  }

  const imagePath = req.file.path; // C:/Users/gerwy/AppData/Local/Temp/1694514790547.jpg
  const imageTimestamp = imagePath.replace(/\\/g, "/").split("/").pop().split(".").shift(); // '1694487585110'
  const imageDestinationPath = "/uploads/images/" + imageTimestamp + ".png";
  const imageBuffer = await readFileAsync(imagePath);
  await sharp(imageBuffer.buffer).png({palette: true}).toFile("./" + `${imageDestinationPath}`)

  const artwork = await ArtworkModel.create({
    title,
    artist,
    year,
    medium,
    description,
    image: imageDestinationPath
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
    image
  } = req.body;

  if (artwork) {
    artwork.title = title || artwork.title;
    artwork.artist = artist || artwork.artist;
    artwork.year = year || artwork.year;
    artwork.medium = medium || artwork.medium;
    artwork.description = description || artwork.description;
    artwork.image = image || artwork.image;

    const updatedArtwork = await artwork.save();

    res.json({
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
  getAllArtworks,
  createArtwork,
  updateArtwork,
  deleteArtwork
}