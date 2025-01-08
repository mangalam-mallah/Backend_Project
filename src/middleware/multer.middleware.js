import multer from 'multer';

// Configuring the storage settings for multer
const storage = multer.diskStorage({
    // Setting the destination directory for uploaded files
    destination: function (req, file, cb) {
        // Files will be stored in the "./public/temp" directory
        cb(null, "./public/temp");
    },
    // Setting the filename for uploaded files
    filename: function (req, file, cb) {
        // The file will be saved with its original name
        cb(null, file.originalname);
    }
});

// The `upload` object will use the `storage` configuration defined above
export const upload = multer({ 
    storage: storage 
});
