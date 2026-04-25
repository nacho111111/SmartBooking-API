import { pool } from "../db.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const getCitas = asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
        "SELECT * FROM citas ORDER BY hora_atencion ASC"
    );
    res.json(rows);
});

export const getCita = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rows } = await pool.query(
        "SELECT * FROM citas WHERE id_cita = $1",
        [id]
    );
    if (rows.length === 0) {
        return res.status(201).json({ message: "Cita no encontrada" });
    }
    res.json(rows[0]);
});

export const createCita = asyncHandler(async (req, res) => {
    const { id_usuario, hora_atencion, nombre_mascota, descripcion, peluquera, estado } = req.body;
    const { rows } = await pool.query(
        "INSERT INTO citas (id_usuario, hora_atencion, nombre_mascota, descripcion, peluquera, estado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [id_usuario, hora_atencion, nombre_mascota, descripcion, peluquera, estado]
    );
    res.status(201).json(rows[0]);
});

export const deleteCita = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rowCount } = await pool.query(
        "DELETE FROM citas WHERE id_cita = $1 RETURNING *", 
        [id]
    );

    if (rowCount === 0) {
        return res.status(404).json({ message: "Cita no encontrada" });
    }

    res.sendStatus(204);
});

export const updateCita = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { hora_atencion, nombre_mascota, descripcion , estado, peluquera} = req.body;
    const query = `
        UPDATE citas 
        SET 
            hora_atencion = COALESCE($1, hora_atencion), 
            nombre_mascota = COALESCE($2, nombre_mascota), 
            descripcion = COALESCE($3, descripcion), 
            estado = COALESCE($4, estado), 
            peluquera = COALESCE($5, peluquera) 
        WHERE id_cita = $6 
        RETURNING *`;
    const values = [hora_atencion || null, nombre_mascota || null, descripcion || null, estado || null, peluquera || null, id];

    const { rows } = await pool.query(query,values);
    if (rows.length === 0) {
        return res.status(404).json({ message: "Cita no encontrada" });
    }
    res.json(rows[0]);
});

// Obtener todas las citas de un usuario específico
export const getCitasDeUsuario = asyncHandler(async (req, res) => {
    
    const { id_usuario } = req.params;
    const { rows } = await pool.query(
        "SELECT * FROM citas WHERE id_usuario = $1 ORDER BY hora_atencion ASC", [id_usuario]);
    res.json(rows);
});

// Obtener citas programadas para el día de hoy con información del usuario
export const getCitasPorDia = asyncHandler(async (req, res) => {
    const { dia } = req.params;
    const query = `
        SELECT 
            c.id_cita,
            u.id_usuario ,
            u.nombre_usuario, 
            u.email, 
            u.telefono, 
            c.hora_atencion, 
            c.nombre_mascota, 
            c.descripcion
        FROM citas c
        INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
        WHERE c.hora_atencion::date = $1 
        ORDER BY c.hora_atencion ASC
    `;

    const { rows } = await pool.query(query,[dia]);
    res.json(rows);
});

export const updateCitas = asyncHandler(async (req, res) => {
    const citas = req.body; // array

    if (!Array.isArray(citas) || citas.length === 0) {
            return res.status(400).json({ message: "Se esperaba un array de citas" });
    }
    
    const values = [];
    const placeholders = citas.map((c, i) => {
        const idx = i * 6;

        values.push(
        c.hora_atencion || null,
        c.nombre_mascota || null,
        c.descripcion || null,
        c.asistio || null,
        c.peluquera || null,
        c.id_cita
        );

        return `($${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4}, $${idx + 5}, $${idx + 6})`;
    }).join(",");

    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        await client.query(`
            UPDATE citas AS c SET
                hora_atencion = COALESCE(v.hora_atencion::timestamp, c.hora_atencion),
                nombre_mascota = COALESCE(v.nombre_mascota, c.nombre_mascota),
                descripcion = COALESCE(v.descripcion, c.descripcion),
                asistio = COALESCE(v.asistio::bool, false),
                peluquera = COALESCE(v.peluquera, c.peluquera)
            FROM (
                VALUES ${placeholders}
            ) AS v(hora_atencion, nombre_mascota, descripcion, asistio, peluquera, id_cita)
            WHERE c.id_cita = v.id_cita::int
            `, values);
        await client.query("COMMIT");
        res.status(200).json({ message: "Caja sincronizada" });
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
});