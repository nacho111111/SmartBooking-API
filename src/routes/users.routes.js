import { Router } from "express";
import { createUser, deleteUser, getUser, getUsers, updateUser } from "../controllers/users.controllers.js";
import { createCita, deleteCita, getCita, getCitas, getCitasDeUsuario, getCitasPorDia, updateCita } from "../controllers/citas.controllers.js"
import { createFactura, createFacturas, deleteFactura, getFactura, getFacturas, updateFactura } from "../controllers/facturas.controllers.js"
import { hookCitaCal } from "../webhooks/calHandlers.js"
import { whatsAppVerify } from "../webhooks/whatsAppVerify.js"
import { whatsAppAnswers } from "../webhooks/whatsAppAnswers.js"

const router = Router();

router.get("/usuarios", getUsers);
router.post("/usuarios", createUser);
router.get("/usuarios/:id",getUser);
router.delete("/usuarios/:id",deleteUser);
router.put("/usuarios/:id", updateUser);

//citas
//fijas
router.get("/citas", getCitas);
router.get("/citas/dia/:dia", getCitasPorDia);
router.get("/usuarios/:id_usuario/citas", getCitasDeUsuario);
//dinamicas
router.get("/citas/:id", getCita);
router.post("/citas", createCita);
router.delete("/citas/:id", deleteCita);
router.put("/citas/:id", updateCita);

//facturas
router.get("/facturas", getFacturas);
router.post("/facturas/multi", createFacturas)
router.get("/facturas/:id", getFactura);
router.post("/facturas", createFactura);
router.delete("/facturas", deleteFactura);
router.put("/facturas", updateFactura);

//webhooks
//cal
router.post("/webhooks/cal", hookCitaCal);
//whatsapp
router.get("/webhooks/whatsapp", whatsAppVerify);
router.post("/webhooks/whatsapp", whatsAppAnswers);

export default router;
