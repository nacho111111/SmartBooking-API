import { pool } from "../db.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const getFacturas = asyncHandler(async (req, res) => {
    const { rows } = await pool.query(
        "SELECT * FROM facturas ORDER BY creado_el DESC"
    );
    res.json(rows);
});

export const getFactura = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rows } = await pool.query(
        "SELECT * FROM facturas WHERE id_factura = $1", 
        [id]
    );
    if (rows.length === 0) {
        return res.status(404).json({ message: "Factura no encontrada" });
    }
    res.json(rows[0]);
});

export const createFactura = asyncHandler(async (req, res) => {
    const { id_cita, id_usuario, total_peluqueria, total_productos, tipo_pago } = req.body;
    
    const query = `
        INSERT INTO facturas (id_cita, id_usuario, total_peluqueria, total_productos, tipo_pago)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id_cita) 
        DO UPDATE SET 
            total_peluqueria = EXCLUDED.total_peluqueria,
            total_productos = EXCLUDED.total_productos,
            tipo_pago = EXCLUDED.tipo_pago,
            creado_el = CURRENT_TIMESTAMP
        RETURNING *;
    `;
    
    const { rows } = await pool.query(query, [id_cita, id_usuario, total_peluqueria, total_productos, tipo_pago]);
    res.status(200).json(rows[0]); 
});

export const deleteFactura = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rowCount } = await pool.query(
        "DELETE FROM facturas WHERE id_factura = $1", 
        [id]
    );

    if (rowCount === 0) {
        return res.status(404).json({ message: "No se encontró la factura para eliminar" });
    }

    res.status(204).send();
});

export const updateFactura = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { id_cita, id_usuario, total_peluqueria, total_productos, tipo_pago } = req.body;

    const { rows } = await pool.query(
        `UPDATE facturas 
         SET id_cita = $1, id_usuario = $2, total_peluqueria = $3, total_productos = $4, tipo_pago = $5 
         WHERE id_factura = $6 
         RETURNING *`,
        [id_cita, id_usuario, total_peluqueria, total_productos, tipo_pago, id]
    );

    if (rows.length === 0) {
        return res.status(404).json({ message: "No se pudo actualizar, factura no encontrada" });
    }

    res.json(rows[0]);
});


export const createFacturas = asyncHandler(async (req, res) => { // bulk insert
    const facturas = req.body;

    if (!Array.isArray(facturas) || facturas.length === 0) {
        return res.status(400).json({ message: "Se esperaba un array de facturas" });
    }

    const values = [];
    const placeholders = facturas.map((f, i) => {
        const idx = i * 5;
        values.push(
            f.id_cita,
            f.id_usuario,
            f.total_peluqueria,
            f.total_productos,
            f.tipo_pago
        );

    return `($${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4}, $${idx + 5})`;
    }).join(",");

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query(`
            INSERT INTO facturas (id_cita, id_usuario, total_peluqueria, total_productos, tipo_pago)
            VALUES ${placeholders}
            ON CONFLICT (id_cita) DO UPDATE SET 
                total_peluqueria = EXCLUDED.total_peluqueria,
                total_productos = EXCLUDED.total_productos,
                tipo_pago = EXCLUDED.tipo_pago
            `, values);
        await client.query('COMMIT');
        res.status(200).json({ message: "Caja sincronizada" });
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
});

export const getFacturasMoreInfo = asyncHandler(async(req,res) =>{ // todas las facturas mas informacion adicional
    const query = 
    `SELECT 
        c.hora_atencion,
        c.asistio,
        c.peluquera,
        m.nombre_mascota,
        u.nombre_usuario,
        f.total_peluqueria,
        f.total_productos,
        f.total_final,
        f.tipo_pago
    FROM facturas f
    JOIN citas c ON f.id_cita = c.id_cita
    JOIN usuarios u ON c.id_usuario = u.id_usuario
    JOIN mascotas m ON m.id_mascota = c.id_mascota;`

    const { rows } = await pool.query(query);
    res.json(rows);
});

export const getFacturasPaginadas = asyncHandler(async(req,res) =>{
    const desde = parseInt(req.query.desde) || 1;
    const hasta = parseInt(req.query.hasta) || 10;

    const { hora_atencion, peluquera, nombre_usuario, telefono, mascota } = req.query; // filtros

    const limit = Math.max(0, hasta - desde + 1);
    const offset = Math.max(0, desde - 1);

    // filtros dinámicos
    const filters = [];
    const params = [];

    if (hora_atencion) {
        params.push(hora_atencion); 
        filters.push(`c.hora_atencion::date = $${params.length}`);
    }
    if (peluquera) {
        params.push(`%${peluquera}%`);
        filters.push(`c.peluquera ILIKE $${params.length}`);
    }
    if (nombre_usuario) {
        params.push(`%${nombre_usuario}%`);
        filters.push(`u.nombre_usuario ILIKE $${params.length}`);
    }
    if (telefono) {
        params.push(`%${telefono}%`);
        filters.push(`u.telefono ILIKE $${params.length}`);
    }
    if (mascota) {
        params.push(`%${mascota}%`);
        filters.push(`m.nombre_mascota ILIKE $${params.length}`);
    }

    // paginación
    params.push(limit);
    params.push(offset);

    const query =`
        SELECT 
            c.hora_atencion,
            c.asistio,
            c.peluquera,
            m.nombre_mascota,
            u.nombre_usuario,
            u.telefono,
            f.total_peluqueria,
            f.total_productos,
            f.total_final,
            f.tipo_pago,
            COUNT(*) OVER() AS total
        FROM facturas f
        JOIN citas c ON f.id_cita = c.id_cita
        JOIN usuarios u ON c.id_usuario = u.id_usuario
        JOIN mascotas m ON m.id_mascota = c.id_mascota
        ${filters.length ? `WHERE ${filters.join(" AND ")}` : ""}
        ORDER BY c.asistio ASC
        LIMIT $${params.length - 1}
        OFFSET $${params.length}
    ;`

    const { rows } = await pool.query(query, params);
    // extraer total 
    const total = rows.length > 0
        ? parseInt(rows[0].total)
        : 0;

    // quitar total de cada fila
    const facturas = rows.map(({ total, ...m }) => m);

    res.status(200).json({
        total,
        desde,
        hasta,
        facturas
    });
});
// id_cita, id_usuario, total_peluqueria, total_productos, tipo_pago
export const getFacturasPorDia = asyncHandler(async (req, res) => {
    const { dia } = req.params;
    const query = `
    SELECT 
        c.id_cita,
        u.id_usuario,
        f.total_peluqueria,
        f.total_productos,
        f.tipo_pago,
        c.asistio,
        c.peluquera
    FROM citas c
    INNER JOIN usuarios u ON u.id_usuario = c.id_usuario
    INNER JOIN facturas f ON f.id_cita = c.id_cita
    WHERE c.hora_atencion::date = $1 
      AND (LOWER(c.estado) NOT IN ('cancelada', 'reagendada') OR c.estado IS NULL)
    ORDER BY c.hora_atencion ASC
`;
    const { rows } = await pool.query(query,[dia]);
    res.json(rows);
});

export const getResumenMensualPeluquera = asyncHandler(async (req, res) => { 

    const { mes, peluquera } = req.query; 

    if (!mes || !peluquera) {
        return res.status(400).json({ message: "Faltan parámetros requeridos: mes y peluquera." });
    }
    

    const inicioMes = `${mes}-01 00:00:00`;

    const query = `
        SELECT 

            -- TODAS LAS CITAS

            COUNT(CASE WHEN c.asistio = true THEN 1 END) AS tot_asistieron,
            COUNT(CASE WHEN c.asistio = false THEN 1 END) AS tot_faltaron,
            COALESCE(SUM(f.total_peluqueria), 0) AS tot_bruto_peluqueria,
            COALESCE(SUM(f.total_productos), 0) AS tot_bruto_productos,
            COALESCE(SUM(f.total_final), 0) AS tot_bruto_total,
            COALESCE(SUM(CASE WHEN c.peluquera ILIKE $2 THEN f.total_final ELSE f.total_final * 0.5 END), 0) AS tot_neto_total,

            -- c.tipo != 'baño expres'

            COUNT(CASE WHEN c.tipo IS DISTINCT FROM 'baño expres' AND c.asistio = true THEN 1 END) AS norm_asistieron,
            COUNT(CASE WHEN c.tipo IS DISTINCT FROM 'baño expres' AND c.asistio = false THEN 1 END) AS norm_faltaron,
            COALESCE(SUM(CASE WHEN c.tipo IS DISTINCT FROM 'baño expres' THEN f.total_peluqueria ELSE 0 END), 0) AS norm_bruto_peluqueria,
            COALESCE(SUM(
                CASE 
                    WHEN c.tipo IS DISTINCT FROM 'baño expres' THEN 
                        CASE WHEN c.peluquera ILIKE $2 THEN f.total_peluqueria ELSE f.total_peluqueria * 0.5 END
                    ELSE 0 
                END
            ), 0) AS norm_neto_peluqueria,

            -- c.tipo = 'baño expres'

            COUNT(CASE WHEN c.tipo = 'baño expres' AND c.asistio = true THEN 1 END) AS bano_asistieron,
            COUNT(CASE WHEN c.tipo = 'baño expres' AND c.asistio = false THEN 1 END) AS bano_faltaron,
            COALESCE(SUM(CASE WHEN c.tipo = 'baño expres' THEN f.total_peluqueria ELSE 0 END), 0) AS bano_bruto_peluqueria,
            COALESCE(SUM(
                CASE 
                    WHEN c.tipo = 'baño expres' THEN 
                        CASE WHEN c.peluquera ILIKE $2 THEN f.total_peluqueria ELSE f.total_peluqueria * 0.5 END
                    ELSE 0 
                END
            ), 0) AS bano_neto_peluqueria

        FROM facturas f
        INNER JOIN citas c ON f.id_cita = c.id_cita
        WHERE c.hora_atencion >= $1::timestamp
          AND c.hora_atencion < $1::timestamp + INTERVAL '1 month';
    `;

    const { rows } = await pool.query(query, [inicioMes, peluquera]);
    const data = rows[0];
    // Formateamos la respuesta para enviarla limpia al frontend en React
    return res.status(200).json({
        total: {
            asistieron: parseInt(data.tot_asistieron, 10),
            faltaron: parseInt(data.tot_faltaron, 10),
            peluqueria: Math.round(parseFloat(data.tot_bruto_peluqueria)),
            productos: Math.round(parseFloat(data.tot_bruto_productos)),
            bruto: Math.round(parseFloat(data.tot_bruto_total)),
            neto: Math.round(parseFloat(data.tot_neto_total))
        },
        normales: {
            asistieron: parseInt(data.norm_asistieron, 10),
            faltaron: parseInt(data.norm_faltaron, 10),
            peluqueriaBr: Math.round(parseFloat(data.norm_bruto_peluqueria)),
            peluqueriaNe: Math.round(parseFloat(data.norm_neto_peluqueria))
        },
        solobano: {
            asistieron: parseInt(data.bano_asistieron, 10),
            faltaron: parseInt(data.bano_faltaron, 10),
            peluqueriaBr: Math.round(parseFloat(data.bano_bruto_peluqueria)),
            peluqueriaNe: Math.round(parseFloat(data.bano_neto_peluqueria))
        }
    });

});