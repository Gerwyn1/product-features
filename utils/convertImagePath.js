import sharp from 'sharp';
import fs from 'fs';
import {
  promisify
} from 'util';
import path from 'path';

const readFileAsync = promisify(fs.readFile);

const convertImagePath = async (file, userId, galleryId) => {
  if (file.fieldname === "artworkImage") {
    const imageTimestamp = file.filename.split(".").shift(); // '1694487585110'
    const imagePngPath = file.fieldname === "artworkImage" ? `uploads/users/user_${userId}/gallery_${galleryId}/artwork_${imageTimestamp}.png` : file.fieldname === "profileImage" ? '' : file.fieldname === "bannerImage" ? '' : null;

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
    console.log('12e12eke2ok')
    return imagePngPath;
  }

  // if (file.fieldname === "profileImage") {
  //   const imageTimestamp = file.filename.split(".").shift(); // '1694487585110'
  //   const imagePngPath =  `uploads/users/user_${userId}/gallery_${galleryId}/artwork_${imageTimestamp}.png`;
  //   const imageBuffer = await readFileAsync(file.path);
  //   await sharp(imageBuffer.buffer).png({palette: true}).toFile("./" + `${imagePngPath}`);
  //   return imagePngPath;
  // }

  // if (file.fieldname === "bannerImage") {
  //   const imageTimestamp = file.filename.split(".").shift(); // '1694487585110'
  //   const imagePngPath =  `uploads/users/user_${userId}/gallery_${galleryId}/artwork_${imageTimestamp}.png`;
  //   const imageBuffer = await readFileAsync(file.path);
  //   await sharp(imageBuffer.buffer).png({palette: true}).toFile("./" + `${imagePngPath}`);
  //   return imagePngPath;
  // }

}

export default convertImagePath;