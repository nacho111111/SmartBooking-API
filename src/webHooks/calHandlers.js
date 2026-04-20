import { pool } from "../db.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { handleCreate, handleReschedule, handleCancel } from "../controllers/cal.controller.js";


export const hookCitaCal = asyncHandler(async (req, res) => {
    const payload = req.body;

  // Cal.com evento
  if (payload.triggerEvent === "BOOKING_CREATED") {
    const client = await pool.connect();
    handleCreate(req,res,client);
    return;
  }
  else if (payload.triggerEvent === "BOOKING_RESCHEDULED"){
    const client = await pool.connect();
    handleReschedule(req,res,client);
    return;
  }
  else if (payload.triggerEvent === "BOOKING_CANCELLED"){
    const client = await pool.connect();
    handleCancel(req,res,client);
    return;
  }

  res.status(200).send("Evento ignorado");
})

