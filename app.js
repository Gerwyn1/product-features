import express from 'express';
import cors from "cors";
import 'dotenv/config'
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';

import connectDB from './connectDb/connectDb.js';
import UserRoutes from './routes/user.js';
import RoomRoutes from './routes/room.js';
import ArtworkRoutes from './routes/artwork.js';
import GalleryRoutes from './routes/gallery.js';
import {notFound, errorHandler} from './middleware/errorMiddleware.js';

const app = express();
app.use(cors({credentials: true, origin: 'http://localhost:5173'}));
app.use(cookieParser());
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: false, limit: '10mb'}));
app.use(morgan("common"));
app.use('/uploads', express.static('uploads'));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.status(200).send('Hello World');
});

app.use('/api/users', UserRoutes);
app.use('/api/rooms', RoomRoutes);
app.use('/api/artworks', ArtworkRoutes);
app.use('/api/galleries', GalleryRoutes);

// connect db
(async () => {
  try {
    await connectDB(process.env.MONGO_URL, PORT);
  } catch (error) {
    console.error('An error occurred during database connection:', error);
  }
})();

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});