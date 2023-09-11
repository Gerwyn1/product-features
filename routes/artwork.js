import express from "express";

import * as ArtworkController from "../controllers/artwork.js";
const router = express.Router();

router.get('/', ArtworkController.getAllArtworks);
router.post('/', ArtworkController.createArtwork);
router.post('/:id', ArtworkController.updateArtwork);
router.delete('/:id', ArtworkController.deleteArtwork);

export default router;