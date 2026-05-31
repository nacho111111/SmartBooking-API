import { upsertFacturas } from "../Services/facturas.service.js";
import { updateCitas } from "../Services/citas.service.js";
import { transactionHandler } from "../middlewares/transactionHandler.js";

export const sincronizarCaja = transactionHandler(async (req, res, client) => {
    const lista = req.body;
    if (!Array.isArray(lista)) {
        return res.status(400).json({
            message: "Se esperaba un array"
        });
    }
    const facturas = [];
    const citas = [];

    for (const item of lista) {

        facturas.push({
            id_cita: item.id_cita,
            id_usuario: item.id_usuario,
            total_peluqueria: item.total_peluqueria,
            total_productos: item.total_productos,
            tipo_pago: item.tipo_pago
        });
        citas.push({
            id_cita: item.id_cita,
            asistio: item.asistio,
            peluquera: item.peluquera
        });
    }
    await upsertFacturas(client, facturas);
    await updateCitas(client, citas);

    res.status(200).json({
        message: "Caja sincronizada 🚀"
    });
});
