import express from 'express';
import cors from "cors";

import connectDB from './connectDb/connectDb.js';
import UserRoutes from './routes/user.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const port = 3000;

app.get('/', (req, res) => {
  res.status(200).send('Hello World');
});

app.use('/api/users', UserRoutes);

// connect db
(async () => {
  try {
    await connectDB('mongodb+srv://gerwyn:1234@cluster0.h2ih3jr.mongodb.net/?retryWrites=true&w=majority', port);
  } catch (error) {
    console.error('An error occurred during database connection:', error);
  }
})();

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});