// Custom error class to handle API errors
class ApiError extends Error {
    // Constructor to initialize the error with specific properties
    constructor(
        statusCode, // HTTP status code (e.g., 404 for not found)
        message = "Something went wrong", // Error message (default is a generic message)
        errors = [], // Optional additional error details (e.g., validation errors)
        stack = "" // Optional custom stack trace
    ) {
        // Call the parent Error constructor with the message
        super(message);
        
        // Set up custom properties for this class
        this.data = null; // Placeholder for any extra data related to the error
        this.statusCode = statusCode; // HTTP status code of the error
        this.success = false; // Indicates that the operation was unsuccessful
        this.message = message; // The error message passed to the constructor
        this.errors = errors; // Additional error details (e.g., validation issues)

        // If a stack trace is provided, use it. Otherwise, capture the default stack trace
        if (stack) {
            this.stack = stack;
        } else {
            // Capture the stack trace if not provided
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// Exporting the ApiError class so it can be used in other modules
export { ApiError };
