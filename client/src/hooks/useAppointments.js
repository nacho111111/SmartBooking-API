import { useState, useEffect } from "react";
import { postCitaFull, getAppointmentsByDay, getFacturasMoreInfo, getResumeFacturas, postSincronizarCaja, getDailyPayMonth } from "../services/api";
import { useAction } from "../context/ActionContext";

export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]); // citas hoy, user + cita
  // selector day
  const [appointmentsDay, setAppointmentsDay] = useState([]); // citas con select por dia
  const [facturasInfo, setFacturasInfo] = useState([]); // facturas todo
  const [resumeFacturas, setResumeFactura] = useState(""); // resume de mes
  const [dailyPayMonth, setDailyPayMonth] = useState(""); // resumen por dia de pagos
  
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
      // fecha de hoy 
        const hoyStr = new Date().toLocaleDateString('sv-SE'); 
        //Combinar la fecha actual  "2026-04-22T14:30"
        const fechaA = `${hoyStr}T${form.fecha}`;
        // fecha y hora unificadas
        const formConFecha = {
            ...form,
            fecha: fechaA
        }; 
      
      const nuevaCita = await postCitaFull(formConFecha);
      
      setAppointments((prev) => {
      const listaActualizada = [...prev, nuevaCita];
        listaActualizada.sort((a, b) => {
          return a.hora_atencion.localeCompare(b.hora_atencion);
        });
        return listaActualizada;
      });
    },{successMessage : "Usuario ingresado con exito"})
  }
  const handleSaveFacturas = (lista) => { // facuras y actualiza citas
    run(async () => { 
        await postSincronizarCaja(lista)
        localStorage.setItem("caja_sincronizada", "true");
      },{successMessage : "Caja sincronizada"})
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
  const handleGetDailyPayMonth = (yearMonth,peluquera) => {
    run(async () => {
      if (!yearMonth || !peluquera) return
      const data = await getDailyPayMonth(yearMonth,peluquera);
      setDailyPayMonth(data)
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
    resumeFacturas,
    handleGetDailyPayMonth,
    dailyPayMonth
  };
};