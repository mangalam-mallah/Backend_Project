import dotenv from 'dotenv';
import connectDB from "./db/index.js";
import { app } from './app.js';

// Load environment variables from the .env file located in the 'env' folder
dotenv.config({
    path: './env' // Path to the .env file
});

// Attempt to connect to the database
connectDB()
    .then(() => {
        // Once the database connection is successful, set up the error handler for the app
        app.on("error", (error) => {
            console.log("ERRR:", error); // Log the error to the console
            throw error; // Throw the error to stop further processing
        });

        // Start the Express server, using the PORT from the environment variables or default to 8000
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is listening at port: ${process.env.PORT}`); // Log the success message
        });
    })
    .catch((err) => {
        // If MongoDB connection fails, log the failure
        console.log("MongoDB connection failed!!", err);
    });
