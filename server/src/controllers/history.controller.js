import { pool } from "../db.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { sendWhatsAppMessage } from "../external/whatsAppClient.js";
import { setMensaje } from "../services/dbService.js";

export const getHistoryNumbers = asyncHandler(async (req, res) => {
    const { rows } = await pool.query(`
        SELECT 
            ch.whatsapp_number, 
            u.nombre_usuario
        FROM chat_history ch
        LEFT JOIN usuarios u ON u.telefono = ch.whatsapp_number
        GROUP BY ch.whatsapp_number, u.nombre_usuario
        ORDER BY MAX(ch.created_at) DESC;`
    )
    res.json(rows);
});

export const getMessagesByNum = asyncHandler(async(req,res)=>{
    const { num } = req.params;
    const query = (`
        SELECT 
            ch.role, ch.content, ch.created_at, 
            u.nombre_usuario, u.bot_active, u.telefono
        FROM (
            SELECT * FROM chat_history 
            WHERE whatsapp_number = $1 
            ORDER BY created_at DESC 
            LIMIT 10
        ) ch
        JOIN usuarios u ON ch.whatsapp_number = u.telefono
        ORDER BY ch.created_at ASC;
    `
    )
    const { rows } = await pool.query(query,[num]) 

    const response = {
        nombre_usuario: rows[0].nombre_usuario,
        bot_active: rows[0].bot_active,
        telefono: rows[0].telefono,
        messages: rows.map(r => ({ role: r.role, content: r.content, created_at: r.created_at }))
    };
    res.json(response);
})

export const sendMessageManual = asyncHandler(async (req, res) => { // enviar mensage a whatsapp
    const { to, message } = req.body;

    if (!to || !message) {
        return res.status(400).json({ error: "Faltan datos (to o message)" });
    }

    // fetch a Meta
    const metaResponse = await sendWhatsAppMessage(to, message);

    // Si Meta responde
    if (metaResponse && metaResponse.messages) {
        setMensaje(to,"model",message)
        return res.status(200).json({ success: true });
    } else {
        console.error("Error de Meta:", metaResponse);
        return res.status(500).json({
            success: false,
            error: "La API de Meta no devolvió un ID de mensaje"
        });
    }
});