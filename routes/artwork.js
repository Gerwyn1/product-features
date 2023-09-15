import express from "express";

import * as ArtworkController from "../controllers/artwork.js";
import {
  imageUpload
} from "../middleware/mediaMiddleware.js";

const router = express.Router();

// get specific artwork
router.get('/:id', ArtworkController.getArtwork);

// get all artworks
router.get('/', ArtworkController.getAllArtworks);

// create artwork
router.post('/', imageUpload.single('artworkImage'), ArtworkController.createArtwork);

// update artwork
router.patch('/:id', imageUpload.single('artworkImage'), ArtworkController.updateArtwork);

// delete artwork
router.delete('/:id', ArtworkController.deleteArtwork);

export default router;