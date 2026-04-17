import { Router } from "express";
import { createUser, deleteUser, getUser, getUsers, updateUser } from "../controllers/users.controllers.js";
import { createCita, deleteCita, getCita, getCitas, getCitasDeUsuario, getCitasHoy, updateCita } from "../controllers/citas.controllers.js"
const router = Router();

router.get("/usuarios", getUsers);
router.post("/usuarios", createUser);
router.get("/usuarios/:id",getUser);
router.delete("/usuarios/:id",deleteUser);
router.put("/usuarios/:id", updateUser);

//citas
//fijas
router.get("/citas", getCitas);
router.get("/citas/hoy", getCitasHoy);
router.get("/usuarios/:id_usuario/citas", getCitasDeUsuario);
//dinamicas
router.get("/citas/:id",getCita);
router.post("/citas",createCita);
router.delete("/citas/:id",deleteCita);
router.put("/citas/:id",updateCita);

export default router;
