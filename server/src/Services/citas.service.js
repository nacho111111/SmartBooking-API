import { pool } from "../db.js";

export const getCitasPorDia = async (dia) => {
    const query = `
        SELECT 
            u.nombre_usuario, 
            u.telefono, 
            c.hora_atencion 
        FROM citas c
        INNER JOIN usuarios u ON c.id_usuario = u.id_usuario
        WHERE c.hora_atencion::date = $1 
        AND (LOWER(c.estado) NOT IN ('cancelada', 'reagendada') OR c.estado IS NULL)
    `;

    const { rows } = await pool.query(query,[dia]);
    return rows;
};
export const updateCitas = async (client, citas) => {
    if (citas.length === 0) return;

    const values = [];

    const placeholders = citas.map((c, i) => {

        const idx = i * 3;

        values.push(
            c.asistio ?? null,
            c.peluquera || null,
            c.id_cita
        );

        return `($${idx + 1},$${idx + 2},$${idx + 3})`;

    }).join(",");

    await client.query(`
        UPDATE citas AS c
        SET
            asistio = COALESCE(v.asistio::bool, false),
            peluquera = COALESCE(v.peluquera, c.peluquera)
        FROM (
            VALUES ${placeholders}
        ) AS v(asistio, peluquera, id_cita)
        WHERE c.id_cita = v.id_cita::int
    `, values);
};