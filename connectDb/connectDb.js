import mongoose from "mongoose";
import chalk from "chalk";

export async function connectDB(url) {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(chalk.cyan('Connected to database'));

    // Close the Mongoose connection when the Node.js process is terminated
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log(chalk.red('Database connection closed due to app termination'));
      process.exit(0);
    });

  } catch (error) {
    console.error(chalk.red('Failed to connect to the database:'), error);
    throw error;
  }
}