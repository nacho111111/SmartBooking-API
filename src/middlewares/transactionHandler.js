import { pool } from "../db.js";

export const transactionHandler = (fn) => async (req, res, next) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        
        // Ejecutamos la lógica que le pasemos, pasándole el 'client'
        await fn(req, res, client);
        
        await client.query("COMMIT");

    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Transacción fallida, se hizo ROLLBACK:", error);
        // Pasamos el error al manejador de errores global de Express
        next(error); 
    } finally {
        client.release();
    }
};