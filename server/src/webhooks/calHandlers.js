import { asyncHandler } from "../middlewares/asyncHandler.js";
import { handleCreate, handleReschedule, handleCancel } from "../controllers/cal.controller.js";


export const hookCitaCal = asyncHandler(async (req, res, next) => {
  res.status(200).json({ received: true });
  const payload = req.body;
  console.log("cal")
  // Cal.com evento
  if (payload.triggerEvent === "BOOKING_CREATED") {
    return await handleCreate(req,res,next);
  }
  else if (payload.triggerEvent === "BOOKING_RESCHEDULED"){
    return await handleReschedule(req,res,next);
  }
  else if (payload.triggerEvent === "BOOKING_CANCELLED"){
    return await handleCancel(req,res,next);
  }
});