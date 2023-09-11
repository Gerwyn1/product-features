import asyncHandler from 'express-async-handler';
import fs from 'fs';
import reverse from 'buffer-reverse';
import { promisify } from 'util';
import path from 'path';

import ArtworkModel from "../models/artwork.js";

// const imageBuffer = fs.readFileSync('path/to/image.jpg');

const writeFileAsync = promisify(fs.writeFile);

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

  const uploadedImagePath = req.file.path; // './uploads/images/'
  const imageBuffer = await fs.promises.readFile(uploadedImagePath);

  // TESTING:
  // Reverse the contents of the image buffer
  const reversedImageBuffer = reverse(imageBuffer); // <Buffer d9 ff 7f ea a1 81 77 d4 50 e3 81 ba 2d c0 91 80 b9 ad 0e 31 f6 1d 99 d9 06 f2 f1 68 f5 41 ad f8 83 c1 55 5f f5 04 4a f8 37 bd d4 87 0b fe 09 fe be eb ... 856479 more bytes>
 
  // Determine the image format (e.g., JPEG) and file extension
const imageFormat = 'jpeg';
const fileExtension = 'jpg';

// Generate a filename with a unique name (you may customize this)
const filename = path.resolve('.', `reversed_image.${fileExtension}`);

// Save the reversed buffer to a file
await writeFileAsync(filename, reversedImageBuffer);

// Set the appropriate content type for the response
const contentType = `image/${imageFormat}`;

// Now, you can send the image as a response with the correct content type
// console.log(res.contentType(contentType))
res.contentType(contentType);
res.sendFile(filename);
res.end(filename);
















  const artwork = await ArtworkModel.create({
    title,
    artist,
    year,
    medium,
    description,
    image: imageBuffer
  });

  if (!artwork) {
    res.status(400);
    throw new Error('Invalid artwork data');
  }

  await artwork.save();

  // Cleanup: Remove the uploaded image file from the file system (if needed)
  await fs.promises.unlink(uploadedImagePath);

  // Exclude a specific field (e.g., "image") before sending the JSON response
  const artworkCopy = { ...artwork };
  delete artworkCopy._doc.image;

  res.status(201).json(artworkCopy._doc);
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