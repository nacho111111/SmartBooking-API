import { pool } from "../db.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const getHistoryNumbers = asyncHandler(async(req,res) => {
    const { rows } = await pool.query(
        `SELECT whatsapp_number 
         FROM chat_history 
         GROUP BY whatsapp_number 
         ORDER BY MAX(created_at) DESC;`
    )
    res.json(rows);
})

export const getMessagesByNum = asyncHandler(async(req,res)=>{
    const { num } = req.params;
    const { rows } = await pool.query(
        "SELECT role, content, created_at FROM chat_history WHERE whatsapp_number = $1 ORDER BY created_at ASC;",
        [num]
    )
    res.json(rows);
})