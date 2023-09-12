import express from "express";

import * as ArtworkController from "../controllers/artwork.js";
import {
  imageUpload
} from "../middleware/mediaMiddleware.js";

const router = express.Router();

router.get('/', ArtworkController.getAllArtworks);
router.post('/', imageUpload.single('artworkImage'), ArtworkController.createArtwork);
router.post('/:id', ArtworkController.updateArtwork);
router.delete('/:id', ArtworkController.deleteArtwork);

export default router;