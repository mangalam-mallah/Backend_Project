import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Defining the user schema for the MongoDB collection
const userSchema = new Schema(
    {
        // Username field with constraints: required, unique, lowercase, trimmed, and indexed
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        
        // Email field with constraints: required, unique, lowercase, trimmed
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        
        // Full name field, required and indexed
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        
        // Avatar field to store the URL of the avatar image (e.g., from Cloudinary)
        avatar: {
            type: String, // URL of the avatar image
            required: true,
        },
        
        // Cover image field to store the URL of the cover image (optional)
        coverImgae: {
            type: String, // URL of the cover image (e.g., from Cloudinary)
        },
        
        // Watch history array containing references to Video documents
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video" // Reference to the "Video" model
            },
        ],
        
        // Password field with a required validation
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        
        // Refresh token field (optional)
        refreshToken: {
            type: String,
        }
    },
    { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

// Pre-save middleware to hash the password before saving the user document
userSchema.pre("save", async function (next) {
    // If password is not modified, skip hashing
    if (!this.isModified("password")) return next();

    // Hash the password using bcrypt with a saltRounds value of 10
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to check if the provided password matches the stored hashed password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

// Method to generate an access token for the user
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET, // Secret for signing the access token
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY, // Expiry time for the access token
        }
    );
}

// Method to generate a refresh token for the user
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET, // Secret for signing the refresh token
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY, // Expiry time for the refresh token
        }
    );
}

// Exporting the User model based on the defined schema
export const User = mongoose.model("User", userSchema);
