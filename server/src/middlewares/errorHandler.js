export const errorHandler = (err, req, res, next) => {
    //const isDev = process.env.NODE_ENV === "development";

    const errorMessage = err.message || "Internal Server Error";
    const statusCode = Number(err.status) || 500;
    console.error(`[Error ${statusCode}]: ${errorMessage}`);

    if (res.headersSent) { // evita duplicados de res
        return next(err);
    }

    res.status(statusCode).json({
        error: true,
        message: errorMessage
    });
}; 