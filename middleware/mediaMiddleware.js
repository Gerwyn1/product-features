import multer from "multer";
import path from 'path';

export const imageUpload = multer({
  storage: multer.diskStorage({
    // destination: function (req, file, cb) {
    //   cb(null, './uploads/images/'); // changes "C:/Users/[user]/AppData/Local/Temp/1694514790547.jpg" to "./uploads/images/1694514790547.jpg"
    // },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    console.log(file.mimetype)
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/webp" || file.mimetype === "image/jfif") {
      cb(null, true);
    } else {
      console.error('image file rejected!');
      cb(new Error("Unaccepted file type"));
    }
  }
});