import pg from "pg"
import { db } from "./config.js" 

pg.types.setTypeParser(1114, str => str); // timestamp sin zona
pg.types.setTypeParser(1184, str => str); // timestamptz

export const pool = new pg.Pool(db)

pool.on('connect', async (client) => {
    try {
        //await client.query("SET timezone = 'America/Santiago'");
    } catch (err) {
        console.error('Error seteando la zona horaria:', err);
    }
});

//const originalQuery = pool.query;
//pool.query = (...args) => {
//    console.log('EJECUTANDO QUERY:', args[0].split('\n')[0]); // Muestra la primera línea de la query
//    return originalQuery.apply(pool, args);
//};

//pool.query("SELECT NOW()").then(result => {
//    console.log(result)
//})