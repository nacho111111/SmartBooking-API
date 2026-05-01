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
}
export const getUserByNum = async(num) => {
    const query = 'SELECT id_usuario FROM usuarios WHERE telefono = $1'
    const { rows } = await pool.query(query,[num])
    return rows.length > 0 ? rows[0].id_usuario : null
}
export const setUser = async(num, name) => {
    const query = 'INSERT INTO usuarios (nombre_usuario, telefono) VALUES ($1, $2) RETURNING id_usuario'
    const { rows } = await pool.query(query,[name,num])
    return rows[0].id_usuario;
}

//export const getLastAnswerModelByNum = async (num) => {
//    const query = `
//    SELECT content 
//    FROM chat_history 
//    WHERE whatsapp_number = $1 AND role = $2
//    ORDER BY created_at DESC LIMIT 1`
//    const { rows } = await pool.query(query,[num,"model"]);
//    return rows.length > 0 ? rows[0].content : null
//}