import mongoose from "mongoose";
import chalk from "chalk";

async function connectDB(url) {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(chalk.cyan('Connected to database'));

    // Close Mongoose connection when process is terminated
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

export default connectDB;