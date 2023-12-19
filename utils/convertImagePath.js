import sharp from 'sharp';
import fs from 'fs';
import {
  promisify
} from 'util';
import path from 'path';

const readFileAsync = promisify(fs.readFile);

const convertImagePath = async (file, userId, galleryId) => {
  console.log(file)
  const artworkTimestamp = file.fieldname === 'artworkImage' ? file.filename.split(".").shift() : null; // '1694487585110'
  const imagePngPath = file.fieldname === "artworkImage" ?
    `/uploads/users/user_${userId}/gallery_${galleryId}/artwork_${artworkTimestamp}.png` :
    file.fieldname === "profile_image" ? `uploads/users/profile/profile_image.png` :
    file.fieldname === "banner_image" ? `uploads/users/profile/banner_image.png` :
    null;


  // const imagePngPath = file.fieldname === "artworkImage" ?
  //   `uploads/users/user_${userId}/gallery_${galleryId}/artwork_${artworkTimestamp}.png` :
  //   file.fieldname === "profile_image" ? `uploads/users/user_${userId}/profile/profile_image.png` :
  //   file.fieldname === "banner_image" ? `uploads/users/user_${userId}/profile/banner_image.png` :
  //   null;

  const directoryPath = path.dirname(imagePngPath);
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, {
      recursive: true
    });
  }

  console.log('directory path', directoryPath)

  // const imageBuffer = await readFileAsync(file.path);
  const imageBuffer = await readFileAsync(file.path);

  console.log('image buffer', imageBuffer)

  await sharp(imageBuffer.buffer).png({
    palette: true
  }).toFile("./" + `${imagePngPath}`);

  return imagePngPath;
}

export default convertImagePath;