import { pool } from "../db.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { transactionHandler } from "../middlewares/transactionHandler.js";

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
    const { id_usuario, hora_atencion, id_mascota, descripcion, peluquera, estado } = req.body;
    const { rows } = await pool.query(
        "INSERT INTO citas (id_usuario, hora_atencion, id_mascota, descripcion, peluquera, estado) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [id_usuario, hora_atencion, id_mascota, descripcion, peluquera, estado]
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
    const { hora_atencion, id_mascota, descripcion , estado, peluquera} = req.body;
    const query = `
        UPDATE citas 
        SET 
            hora_atencion = COALESCE($1, hora_atencion), 
            id_mascota = COALESCE($2, id_mascota), 
            descripcion = COALESCE($3, descripcion), 
            estado = COALESCE($4, estado), 
            peluquera = COALESCE($5, peluquera) 
        WHERE id_cita = $6 
        RETURNING *`;
    const values = [hora_atencion || null, id_mascota || null, descripcion || null, estado || null, peluquera || null, id];

    const { rows } = await pool.query(query,values);
    if (rows.length === 0) {
        return res.status(404).json({ message: "Cita no encontrada" });
    }
    res.json(rows[0]);
});

// Obtener todas las citas de un usuario específico
export const getCitasDeUsuario = asyncHandler(async (req, res) => { // revisar
    const { id_usuario } = req.params;
    const { rows } = await pool.query(
        "SELECT * FROM citas WHERE id_usuario = $1 ORDER BY hora_atencion ASC", [id_usuario]);
    res.json(rows);
});

// Obtener citas programadas para el día de hoy con información del usuario y mascota
export const getCitasPorDia = asyncHandler(async (req, res) => {
    const { dia, canceladas } = req.query;

    const canceladasClean = canceladas !== 'true' || 'True';
    var filter = "";
    if (!canceladasClean){
        filter = `AND (LOWER(c.estado) NOT IN ('cancelada', 'reagendada') OR c.estado IS NULL)`;
    }
    const query = `
    SELECT 
        c.id_cita,
        u.id_usuario,
        u.nombre_usuario, 
        u.email, 
        u.telefono, 
        c.hora_atencion, 
        m.nombre_mascota, 
        c.descripcion,  
        c.estado,
        c.tipo
    FROM citas c
    INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
    INNER JOIN mascotas m ON c.id_mascota = m.id_mascota
    WHERE c.hora_atencion::date = $1 
      ${filter}
    ORDER BY c.hora_atencion ASC
`;
    const { rows } = await pool.query(query,[dia]);
    res.json(rows);
});

export const createFullCita = transactionHandler (async(req, res, client) => {
    const {nombre_usuario, email, telefono, fecha, nombre_mascota, descripcion} = req.body;
    const telefonoClean = telefono.replace('+', '');
    // 1. usuario
    const userRes = await client.query(
      `INSERT INTO usuarios (nombre_usuario, email, telefono) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (telefono) 
       DO UPDATE SET email = EXCLUDED.email 
       RETURNING *`,
      [nombre_usuario, email, telefonoClean]
    );
    const user = userRes.rows[0];

    // 2. Mascota
    const mascotaRes = await client.query(
      `INSERT INTO mascotas (id_usuario, nombre_mascota) 
       VALUES ($1, $2) 
       ON CONFLICT (id_usuario, nombre_mascota) 
       DO UPDATE SET nombre_mascota = EXCLUDED.nombre_mascota
       RETURNING *`,
      [user.id_usuario, nombre_mascota]
    );
    const mascota = mascotaRes.rows[0];

    // 3. cita
    const citaRes = await client.query(
      `INSERT INTO citas (id_usuario, id_mascota, hora_atencion, descripcion) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [user.id_usuario, mascota.id_mascota, fecha, descripcion]
    );
    const cita = citaRes.rows[0];

    const data = {
        id_cita: cita.id_cita,
        id_usuario: cita.id_usuario,
        hora_atencion: cita.hora_atencion,
        descripcion: cita.descripcion,
        estado: cita.estado,
        nombre_mascota: mascota.nombre_mascota,
        nombre_usuario: user.nombre_usuario,
        email: user.email,
        telefono: user.telefonoClean
    }
    res.json(data);
})
