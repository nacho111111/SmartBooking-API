import { pool } from "../db.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const getMascotas = asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
        "SELECT * FROM mascotas"
    );
    res.json(rows);
});

export const getMascota = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rows } = await pool.query(
        "SELECT * FROM mascotas WHERE id_cita = $1",
        [id]
    );
    if (rows.length === 0) {
        return res.status(201).json({ message: "Cita no encontrada" });
    }
    res.json(rows[0]);
});

export const updateMascota = asyncHandler(async (req, res) => {
    const { id, note } = req.body;
    const { rows } = await pool.query(`
        UPDATE mascotas 
        SET notas = $1 
        WHERE id_mascota = $2 
        RETURNING *`,
        [note, id]
    );
    if (rows.length === 0) {
        return res.status(404).json({ message: "Mascota no encontrada" });
    }
    res.status(200).json(rows[0]);
});

export const getMascotasFull = asyncHandler(async (req, res) => {
    const query = `
    SELECT 
        m.id_mascota,
        u.nombre_usuario, 
        u.telefono,
        m.nombre_mascota, 
        m.notas
    FROM mascotas m
    INNER JOIN usuarios u ON u.id_usuario = m.id_usuario;
`;
    const { rows } = await pool.query(query);
    res.json(rows);
});

export const getMascotasPaginadas = asyncHandler(async (req, res) => {

    const desde = parseInt(req.query.desde) || 1;
    const hasta = parseInt(req.query.hasta) || 10;

    const { nombre_mascota, nombre_usuario, telefono } = req.query; // filtros

    const limit = Math.max(0, hasta - desde + 1);
    const offset = Math.max(0, desde - 1);

    // filtros dinámicos
    const filters = [];
    const params = [];

    if (nombre_mascota) {
        params.push(`%${nombre_mascota}%`);
        filters.push(`m.nombre_mascota ILIKE $${params.length}`);
    }

    if (nombre_usuario) {
        params.push(`%${nombre_usuario}%`);
        filters.push(`u.nombre_usuario ILIKE $${params.length}`);
    }
    if (telefono) {
        params.push(`%${telefono}%`);
        filters.push(`u.telefono ILIKE $${params.length}`);
    }

    // paginación
    params.push(limit);
    params.push(offset);

    const query = `
        SELECT
            m.*,
            u.nombre_usuario,
            u.telefono,
            c.hora_atencion,
            c.peluquera,
            COUNT(*) OVER() AS total
        FROM mascotas m
        LEFT JOIN usuarios u 
            ON m.id_usuario = u.id_usuario
        LEFT JOIN LATERAL (
            SELECT hora_atencion, peluquera
            FROM citas
            WHERE id_mascota = m.id_mascota
            ORDER BY hora_atencion DESC
            LIMIT 1
        ) c ON true
            ${filters.length ? `WHERE ${filters.join(" AND ")}` : ""}
        ORDER BY m.id_mascota ASC
        LIMIT $${params.length - 1}
        OFFSET $${params.length}
    `;

    const { rows } = await pool.query(query, params);
    // extraer total 
    const total = rows.length > 0
        ? parseInt(rows[0].total)
        : 0;

    // quitar total de cada fila
    const mascotas = rows.map(({ total, ...m }) => m);

    res.status(200).json({
        total,
        desde,
        hasta,
        mascotas
    });
});