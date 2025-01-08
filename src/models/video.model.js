import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// Defining the video schema for the MongoDB collection
const videoSchema = new Schema(
    {
        // The video file URL (e.g., from Cloudinary)
        videoFile: {
            type: String, // URL of the video file
            required: true, 
        },
        
        // The thumbnail image URL (e.g., from Cloudinary)
        thumbnail: {
            type: String, // URL of the thumbnail image
            required: true, 
        },
        
        // The title of the video
        title: {
            type: String, 
            required: true, 
        },
        
        // The description of the video
        description: {
            type: String, 
            required: true, 
        },
        
        // The duration of the video in seconds (for example, 120 seconds)
        duration: {
            type: Number, // Duration of the video in seconds
            required: true, 
        },
        
        // The number of views the video has received
        views: {
            type: Number, 
            default: 0, // Default value is 0 views
        },
        
        // A flag to indicate whether the video is published or not
        isPublished: {
            type: Boolean,
            default: true, // Default value is true (published)
        },
        
        // The owner of the video (referring to the "User" model)
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User" // This references the "User" model
        }
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Applying the pagination plugin for aggregation queries
videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
