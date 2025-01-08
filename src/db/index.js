import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

/**
 * Asynchronous function to establish a connection to the MongoDB database.
 * 
 * This function:
 * - Uses the `mongoose.connect` method to connect to the MongoDB database using the URI stored
 *   in the `MONGODB_URI` environment variable and appends the database name.
 * - Logs a success message with the host name when the connection is established successfully.
 * - Catches and logs any connection errors and exits the process with a failure code (1) if the connection fails.
 */
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected !!! DB_HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection error", error);
        process.exit(1); // Exit the process with failure code if connection fails
    }
};

// Exporting the connectDB function to be used in other parts of the application
export default connectDB;
