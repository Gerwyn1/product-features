import express from "express";

import * as GalleryController from "../controllers/gallery.js";

import { protect } from '../middleware/authMiddleware.js';
import {ROLES_LIST} from "../config/roles_list.js";
import {checkUserRole} from "../middleware/authMiddleware.js";

const router = express.Router();

// create gallery
router.post('/:roomId', protect, checkUserRole(ROLES_LIST.user), GalleryController.createGallery);

// get specific gallery
router.get('/:galleryId', protect, checkUserRole(ROLES_LIST.user), GalleryController.getGallery);

// get all galleries
router.get('/', protect, checkUserRole(ROLES_LIST.user), GalleryController.getAllGalleries);

// update
// router.patch('/:id', imageUpload.single('artworkImage'), ArtworkController.updateArtwork);

// delete
// router.delete('/:id', ArtworkController.deleteArtwork);

export default router;