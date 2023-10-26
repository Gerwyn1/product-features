import sharp from 'sharp';
import fs from 'fs';
import {
  promisify
} from 'util';

const readFileAsync = promisify(fs.readFile);

const convertImagePath = async (file, userId) => {
  const imageTimestamp = file.filename.split(".").shift(); // '1694487585110'
  const imagePngPath =  `/uploads/images/${imageTimestamp}.png`;
  const imageBuffer = await readFileAsync(file.path);
  await sharp(imageBuffer.buffer).png({palette: true}).toFile("./" + `${imagePngPath}`);
  return imagePngPath;
}

export default convertImagePath;