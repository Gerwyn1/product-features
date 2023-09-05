import express from 'express';
import cors from "cors";

import http from 'http';

import { connectDB } from './connectDb/connectDb.js';

const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;
 
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});
 
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// app.set('view engine', 'ejs');
// app.use(express.static('public'));
// app.use(express.urlencoded({ extended: true }));


(async () => {
  try {
    await connectDB('mongodb+srv://gerwyn:1234@cluster0.h2ih3jr.mongodb.net/?retryWrites=true&w=majority', port);
    // Your code that depends on the database connection goes here
  } catch (error) {
    // Handle any errors that occurred during the database connection
    console.error('An error occurred during database connection:', error);
  }
})();