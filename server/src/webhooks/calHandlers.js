import { asyncHandler } from "../middlewares/asyncHandler.js";
import { handleCreate, handleReschedule, handleCancel } from "../controllers/cal.controller.js";


export const hookCitaCal = asyncHandler(async (req, res) => {
    const payload = req.body;

  // Cal.com evento
  if (payload.triggerEvent === "BOOKING_CREATED") {
    handleCreate(req,res);
    return;
  }
  else if (payload.triggerEvent === "BOOKING_RESCHEDULED"){
    handleReschedule(req,res);
    return;
  }
  else if (payload.triggerEvent === "BOOKING_CANCELLED"){
    handleCancel(req,res);
    return;
  }

  res.status(200).send("Evento ignorado");
})

