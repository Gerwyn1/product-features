import express from "express";
import multer from 'multer';
import path from 'path'

import * as ArtworkController from "../controllers/artwork.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/images/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter

});

router.get('/', ArtworkController.getAllArtworks);
router.post('/', upload.single('artworkImage'), ArtworkController.createArtwork);
router.post('/:id', ArtworkController.updateArtwork);
router.delete('/:id', ArtworkController.deleteArtwork);

export default router;