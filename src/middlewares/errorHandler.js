export const errorHandler = (err, req, res, next) => {
    console.error(err);

    const isDev = process.env.NODE_ENV === "development";

    res.status(err.status || 500).json({
        message: isDev ? err.message : "Internal Server Error"
    });
}; 