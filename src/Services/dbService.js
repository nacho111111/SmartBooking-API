import { pool } from "../db.js";
import { asyncHandler } from "../middlewares/asyncHandler.js"

export const setMensaje = asyncHandler(async (whatsappNumber, role, content) => {
    const query = 'INSERT INTO chat_history (whatsapp_number, role, content) VALUES ($1, $2, $3)';
    await pool.query(query, [whatsappNumber, role, content]);
});

export const getMensajesByNumber = asyncHandler(async (whatsappNumber, limit) => {
    const query = `
        SELECT role, content 
        FROM chat_history 
        WHERE whatsapp_number = $1 
        ORDER BY created_at DESC 
        LIMIT $2
    `;
    const { rows } = await pool.query(query, [whatsappNumber, limit]);
    return rows;
});

export const clearHistoryByNumber = asyncHandler(async (whatsappNumber) => {
    const query = 'DELETE FROM chat_history WHERE whatsapp_number = $1';
    await pool.query(query, [whatsappNumber]);
});