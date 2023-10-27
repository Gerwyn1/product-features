import sharp from 'sharp';
import fs from 'fs';
import {
  promisify
} from 'util';
import path from 'path';

const readFileAsync = promisify(fs.readFile);

const convertImagePath = async (file, userId, galleryId) => {
  const artworkTimestamp = file.fieldname === 'artworkImage' ? file.filename.split(".").shift() : null; // '1694487585110'

  const imagePngPath = file.fieldname === "artworkImage" ?
    `uploads/users/user_${userId}/gallery_${galleryId}/artwork_${artworkTimestamp}.png` :
    file.fieldname === "profileImage" ? `uploads/users/user_${userId}/profile/profile_image.png` :
    file.fieldname === "bannerImage" ? `uploads/users/user_${userId}/profile/banner_image.png` :
    null;

  const directoryPath = path.dirname(imagePngPath);
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, {
      recursive: true
    });
  }

  const imageBuffer = await readFileAsync(file.path);

  await sharp(imageBuffer.buffer).png({
    palette: true
  }).toFile("./" + `${imagePngPath}`);

  return imagePngPath;
}

export default convertImagePath;