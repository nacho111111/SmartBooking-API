import { pool } from "../db.js";

export const upsertFacturas = async (client, facturas) => {
    if (facturas.length === 0) return;

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
        return `($${idx + 1},$${idx + 2},$${idx + 3},$${idx + 4},$${idx + 5})`;
    }).join(",");

    await client.query(`
        INSERT INTO facturas
        (
            id_cita,
            id_usuario,
            total_peluqueria,
            total_productos,
            tipo_pago
        )
        VALUES ${placeholders}
        ON CONFLICT (id_cita)
        DO UPDATE SET
            total_peluqueria = EXCLUDED.total_peluqueria,
            total_productos = EXCLUDED.total_productos,
            tipo_pago = EXCLUDED.tipo_pago
    `, values);
};
