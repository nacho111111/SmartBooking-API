
export const PORT = (process.env.PORT || 3000)
export const db = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    options:"-c timezone=America/Santiago"
};

