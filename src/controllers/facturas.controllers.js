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
        "SELECT * FROM facturas WHERE id_factua = $1", 
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
        "DELETE FROM facturas WHERE id_factua = $1", 
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
         WHERE id_factua = $6 
         RETURNING *`,
        [id_cita, id_usuario, total_peluqueria, total_productos, tipo_pago, id]
    );

    if (rows.length === 0) {
        return res.status(404).json({ message: "No se pudo actualizar, factura no encontrada" });
    }

    res.json(rows[0]);
});


export const createFacturas = asyncHandler(async (req, res) => {
    const facturas = req.body; // Array [{}, {}, ...]

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        for (let f of facturas) {
            await client.query(
                `INSERT INTO facturas (id_cita, id_usuario, total_peluqueria, total_productos, tipo_pago)
                 VALUES ($1, $2, $3, $4, $5)
                 ON CONFLICT (id_cita) DO UPDATE SET 
                 total_peluqueria = EXCLUDED.total_peluqueria,
                 total_productos = EXCLUDED.total_productos,
                 tipo_pago = EXCLUDED.tipo_pago`,
                [f.id_cita, f.id_usuario, f.total_peluqueria, f.total_productos, f.tipo_pago]
            );
        }
        await client.query('COMMIT');
        res.status(200).json({ message: "Caja sincronizada" });
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
});