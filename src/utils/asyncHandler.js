// Utility to handle asynchronous route handlers and catch errors
const asyncHandler = (requestHandler) => {
    // Returning the wrapped function so it can be used as middleware
    return (req, res, next) => {
        // Wrapping the asynchronous handler in a Promise to catch any errors
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err)); // Passing any error to the next middleware (error handler)
    }
}

export { asyncHandler };
