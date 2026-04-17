import { pool } from "../db.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const getCitas = asyncHandler(async (req, res) => {
    const { rows } = await pool.query("SELECT * FROM citas ORDER BY hora_atencion ASC");
    res.json(rows);
});

export const getCita = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM citas WHERE id = $1", [id]);
    if (rows.length === 0) {
        return res.status(404).json({ message: "Cita no encontrada" });
    }
    res.json(rows[0]);
});

export const createCita = asyncHandler(async (req, res) => {
    const { id_usuario, hora_atencion, nombre_mascota, descripcion } = req.body;
    const { rows } = await pool.query(
        "INSERT INTO citas (id_usuario, hora_atencion, nombre_mascota, descripcion) VALUES ($1, $2, $3, $4) RETURNING *",
        [id_usuario, hora_atencion, nombre_mascota, descripcion]
    );
    res.status(201).json(rows[0]);
});

export const deleteCita = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rowCount } = await pool.query("DELETE FROM citas WHERE id = $1 RETURNING *", [id]);
    if (rowCount === 0) {
        return res.status(404).json({ message: "Cita no encontrada" });
    }
    res.sendStatus(204);
});

export const updateCita = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { hora_atencion, nombre_mascota, descripcion } = req.body;
    const { rows } = await pool.query(
        "UPDATE citas SET hora_atencion = TO_TIMESTAMP($1, 'DD/MM/YYYY HH24:MI:SS'), nombre_mascota = $2, descripcion = $3 WHERE id = $4 RETURNING *",
        [hora_atencion, nombre_mascota, descripcion, id]
    );
    if (rows.length === 0) {
        return res.status(404).json({ message: "Cita no encontrada" });
    }
    res.json(rows[0]);

});

// Obtener todas las citas de un usuario específico
export const getCitasDeUsuario = asyncHandler(async (req, res) => {
    
    const { id_usuario } = req.params;
    const { rows } = await pool.query("SELECT * FROM citas WHERE id_usuario = $1 ORDER BY hora_atencion ASC", [id_usuario]);
    res.json(rows);
});

// Obtener citas programadas para el día de hoy con información del usuario
export const getCitasHoy = asyncHandler(async (req, res) => {
    const query = `
        SELECT 
            u.nombre, 
            u.email, 
            u.telefono, 
            c.hora_atencion, 
            c.nombre_mascota, 
            c.descripcion
        FROM citas c
        INNER JOIN usuarios u ON c.id_usuario = u.id
        WHERE c.hora_atencion::date = CURRENT_DATE 
        ORDER BY c.hora_atencion ASC
    `;

    const { rows } = await pool.query(query);
    res.json(rows);
});
