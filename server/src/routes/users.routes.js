import { Router } from "express";
import { createUser, deleteUser, getUser, getUsers, updateUser, setBotActive } from "../controllers/users.controllers.js";
import { createCita, deleteCita, getCita, getCitas, getCitasDeUsuario, getCitasPorDia, updateCita, updateCitas, createFullCita } from "../controllers/citas.controllers.js"
import { createFactura, createFacturas, deleteFactura, getFactura, getFacturas, updateFactura, getFacturasMoreInfo } from "../controllers/facturas.controllers.js"
import { getMascotasPaginadas, getMascotasFull, updateMascota } from "../controllers/mascotas.controllers.js";
import { hookCitaCal } from "../webhooks/calHandlers.js"
import { whatsAppVerify } from "../webhooks/whatsAppVerify.js"
import { whatsAppAnswers } from "../webhooks/whatsAppAnswers.js"
import { getHistoryNumbers, getMessagesByNum, sendMessageManual } from "../controllers/history.controller.js"
import { auth, cookieAuth } from "../middlewares/auth.js";
import cors from 'cors';

const router = Router();

//webhooks
//cal
router.post("/webhooks/cal", cors({ origin: '*' }),hookCitaCal);
//whatsapp
router.get("/webhooks/whatsapp", whatsAppVerify);
router.post("/webhooks/whatsapp", whatsAppAnswers);

router.post("/api/login",auth)
router.use(cookieAuth) // middleware auth

router.get("/usuarios" ,getUsers);
router.post("/usuarios" ,createUser);
router.get("/usuarios/:id" ,getUser);
router.delete("/usuarios/:id",deleteUser);
router.put("/usuarios/:id" ,updateUser);

//citas

router.get("/citas", getCitas);
router.put("/citas/multi", updateCitas);
router.post("/citas/full", createFullCita);
router.get("/citas/dia/:dia", getCitasPorDia);
router.get("/usuarios/:id_usuario/citas", getCitasDeUsuario);

router.get("/citas/:id", getCita);
router.post("/citas", createCita);
router.delete("/citas/:id", deleteCita);
router.put("/citas/:id", updateCita);

//facturas
router.get("/facturas", getFacturas);
router.post("/facturas/multi", createFacturas);
router.get("/facturas/info", getFacturasMoreInfo);

router.get("/facturas/:id", getFactura);
router.post("/facturas", createFactura);
router.delete("/facturas", deleteFactura);
router.put("/facturas", updateFactura);

//mascotas
router.get("/mascotas", getMascotasPaginadas)
router.get("/mascotas/info",getMascotasFull);
router.patch("/mascotas", updateMascota)

//whatsapp
router.post("/messages/send", sendMessageManual)

//chat_history
router.get("/contacts", getHistoryNumbers)   
router.get("/messages/:num", getMessagesByNum)

router.patch("/botactive/:num", setBotActive)

import { pool } from "../db.js";

router.get("/histori", async(req,res) => {
    const { rows } = await pool.query(`
            SELECT * FROM chat_history 
        `);
    res.json(rows);
    } 
)

export default router;
