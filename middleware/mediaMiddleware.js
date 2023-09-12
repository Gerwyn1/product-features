import multer from "multer";
import path from 'path';

export const imageUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/images/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter(req, file, callback) {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
      callback(null, true);
    } else {
      callback(new Error("Unaccepted file type"));
    }
  }
});