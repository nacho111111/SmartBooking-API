import { useState, useEffect } from "react";
import { postCitaFull, getAppointmentsByDay, getFacturasMoreInfo, getResumeFacturas, postSincronizarCaja } from "../services/api";
import { useAction } from "../context/ActionContext";

export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]); // citas hoy, user + cita
  // selector day
  const [appointmentsDay, setAppointmentsDay] = useState([]); // citas con select por dia
  const [facturasInfo, setFacturasInfo] = useState([]); // facturas todo
  const [resumeFacturas, setResumeFactura] = useState(""); // resume de mes
  
  const { run } = useAction();

  useEffect(() => {
    let mounted = true;
    const hoy = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];

    run(async () => {
        const data = await getAppointmentsByDay(hoy, false);
        if (mounted) setAppointments(data);
      });
      return () => {
        mounted = false;
      };
  }, []);

  const handleAddAppointment = (form) => {
    run(async () => { 
      const nuevaCita = await postCitaFull(form);
      
      setAppointments((prev) => {
      const listaActualizada = [...prev, nuevaCita];
        listaActualizada.sort((a, b) => {
          return a.hora_atencion.localeCompare(b.hora_atencion);
        });
        return listaActualizada;
      });
    })
  }
  const handleSaveFacturas = (lista) => { // facuras y actualiza citas
    run(async () => { 
        await postSincronizarCaja(lista)
        alert("Caja sincronizada 🚀");
      })
  };

  const handleGetAppointmentsByDay = (day) => {
    run(async () => {
      const data = await getAppointmentsByDay(day, true);
      setAppointmentsDay(Array.isArray(data) ? data : []);
    })   
  }
  const handleGetFacturasMoreInfo = (desde, hasta, filtros) => {
    run(async () => {
      const data = await getFacturasMoreInfo(desde, hasta, filtros);
      setFacturasInfo(data);
    })
  }
  const handleGetResumeFacturas = (mes, peluquera) => {
    run(async () => {
      if (!mes || !peluquera) return
      const data = await getResumeFacturas(mes, peluquera);
      setResumeFactura(data);
    })
  }
 
  return {
    appointments,
    handleAddAppointment,
    handleSaveFacturas,
    appointmentsDay,
    handleGetFacturasMoreInfo,
    facturasInfo,
    handleGetAppointmentsByDay,
    handleGetResumeFacturas,
    resumeFacturas
  };
};