import { useState, useEffect } from "react";
import { createAppointmentWithUser } from "../services/appointmentService";
import { getAppointmentsByDay, postFacturas } from "../services/api";
import { useAction } from "./useAction";
import { dailyClean } from "../utils/dailyClean"

export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]); // citas hoy, user + cita

  // selector day
  const [appointmentsDay, setAppointmentsDay] = useState([]); // citas con select por dia
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
  
  const { loading, run, error } = useAction();

  useEffect(() => {
    let mounted = true;
    const hoy = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];

    run(async () => {
        const data = await getAppointmentsByDay(hoy);
        if (mounted) setAppointments(data);
      });
      return () => {
        mounted = false;
      };
  }, []);

  useEffect(() => {
    handleGetAppointmentsByDay(fechaSeleccionada);
  }, [fechaSeleccionada]);

  useEffect(() => { // actualiza lista factura
    dailyClean();
    const interval = setInterval(dailyClean, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddAppointment = (form) => {
    run(async () => { 
        //console.log(form);
        const nuevaCita = await createAppointmentWithUser(form);
        setAppointments((prev) => [...prev, nuevaCita]);
      },
      (error) => alert(error.message)
    )
  }

  const handleSaveFacturas = (listaFacturas) => {
    run (async () => { 
        await postFacturas(listaFacturas);
        alert("Caja sincronizada 🚀");
        // borrador de LocalStorage
        //localStorage.removeItem("facturacion_borrador");
      },
      {
        onError: (error) =>
        alert("Error al facturar: " + error.message),
    })
  };

  const handleGetAppointmentsByDay = (day) => {
    run(async () => {
      const data = await getAppointmentsByDay(day);
      setAppointmentsDay(Array.isArray(data) ? data : []);
    },
    (error) => alert(error.message)
    )   
  }
  
  return {
    appointments,
    handleAddAppointment,
    handleSaveFacturas,
    fechaSeleccionada,
    setFechaSeleccionada,
    appointmentsDay,
    loading,
    error
  };
};