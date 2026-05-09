import pg from "pg";
import { db } from "./config.js"; 

pg.types.setTypeParser(1114, str => str); 
pg.types.setTypeParser(1184, str => str); 


const isLocal = process.env.NODE_ENV !== 'production';

const poolConfig = {
    // Si tienes DATABASE_URL (en Railway), úsala. Si no, usa el objeto 'db' de tu config.js
    ...(process.env.DATABASE_URL 
        ? { connectionString: process.env.DATABASE_URL } 
        : db),
    
    // El SSL solo es obligatorio en la nube (Railway). 
    // En local usualmente daría error, así que lo condicionamos.
    ssl: isLocal ? false : { rejectUnauthorized: false }
};

export const pool = new pg.Pool(poolConfig);

console.log(`DB conectada en modo: ${isLocal ? 'LOCAL' : 'PRODUCCIÓN'}`);

pool.on('connect', async (client) => {
    try {
        await client.query("SET timezone = 'America/Santiago'");
    } catch (err) {
        console.error('Error seteando la zona horaria:', err);
    }
});

pool.on('error', (err) => {
    console.error('Error inesperado en el pool de la DB:', err);
});