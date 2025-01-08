// Class to structure API response in a consistent format
class ApiResponse {
    // Constructor to initialize the response with status, data, and message
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode; // The HTTP status code (e.g., 200, 400, etc.)
        this.data = data; // The data to be returned in the response (could be an object, array, etc.)
        this.message = message; // A message describing the response (defaults to "Success")
        this.success = statusCode < 400; // success is true if the status code is less than 400 (i.e., a successful request)
    }
}

// Exporting the ApiResponse class so it can be used in other modules
export { ApiResponse };
