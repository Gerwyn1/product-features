import express from 'express';
import cors from "cors";
import 'dotenv/config'
import cookieParser from 'cookie-parser';
import morgan from 'morgan';


import connectDB from './connectDb/connectDb.js';
import UserRoutes from './routes/user.js';
import RoomRoutes from './routes/room.js';
import ArtworkRoutes from './routes/artwork.js';
import {notFound, errorHandler} from './middleware/errorMiddleware.js';

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.status(200).send('Hello World');
});

app.use('/api/users', UserRoutes);
app.use('/api/rooms', RoomRoutes);
app.use('/api/artworks', ArtworkRoutes);

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