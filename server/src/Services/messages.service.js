import { pool } from "../db.js";

export const setMensaje =  async (whatsappNumber, role, content) => {
    const query = 'INSERT INTO chat_history (whatsapp_number, role, content) VALUES ($1, $2, $3)';
    await pool.query(query, [whatsappNumber, role, content]);
};

export const getMensajesByNumber = async (whatsappNumber, limit) => {
    const query = `
        SELECT role, content 
        FROM chat_history 
        WHERE whatsapp_number = $1 
        ORDER BY created_at DESC 
        LIMIT $2
    `;
    const { rows } = await pool.query(query, [whatsappNumber, limit]);
    return rows;
};
export const clearHistoryByNumber = async (num) => {
    const query = 'DELETE FROM chat_history WHERE whatsapp_number = $1';
    await pool.query(query, [num]);
};
export const getBotActive = async(id) => {
    const query = 'SELECT bot_active FROM usuarios WHERE id_usuario = $1'
    const { rows } = await pool.query(query, [id])

    if (rows.length === 0) {
        throw new Error(`Error de integridad: No se encontró el usuario con ID ${id} al consultar bot_active`);
    }
    return rows[0].bot_active;
};
export const getUserByNum = async(num) => {
    const query = 'SELECT id_usuario FROM usuarios WHERE telefono = $1'
    const { rows } = await pool.query(query,[num])
    return rows.length > 0 ? rows[0].id_usuario : null
};
export const setUser = async(num, name) => {
    const query = 'INSERT INTO usuarios (nombre_usuario, telefono) VALUES ($1, $2) RETURNING id_usuario'
    const { rows } = await pool.query(query,[name,num])
    return rows[0].id_usuario;
};

export const setBotsStatusByDate = async (dia, status) => {
    const query = `
        UPDATE usuarios 
        SET bot_active = $2
        WHERE id_usuario IN (
            SELECT id_usuario 
            FROM citas 
            WHERE hora_atencion::date = $1
        )
    `;
    try {
        const { rowCount } = await pool.query(query, [dia, status]);
        return { success: true };
    } catch (error) {
        console.error("Error al actualizar bots por fecha:", error);
        throw error;
    }
};