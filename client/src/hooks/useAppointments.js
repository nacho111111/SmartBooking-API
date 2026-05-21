import { useState, useEffect } from "react";
import { postCitaFull, getAppointmentsByDay, postFacturas, putCitas, getFacturasMoreInfo } from "../services/api";
import { useAction } from "../context/ActionContext";

export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]); // citas hoy, user + cita
  // selector day
  const [appointmentsDay, setAppointmentsDay] = useState([]); // citas con select por dia
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
  const [FacturasInfo, setFacturasInfo] = useState([]); // facturas todo
  
  const { run } = useAction();

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

  useEffect(() => {
    handleGetFacturasMoreInfo();
  }, []);

  const organizarDatosParaGuardar = (listaOriginal) => { // citas y facturas
    return listaOriginal.reduce(
      (acc, { id_cita, asistio, peluquera, id_usuario, tipo_pago, total_peluqueria, total_productos }) => {

        acc.listaCitas.push({ id_cita, asistio, peluquera });
        acc.listaFacturas.push({ id_cita, id_usuario, tipo_pago, total_peluqueria, total_productos });

        return acc;
      },
      { listaCitas: [], listaFacturas: [] }
    );
    // Retornamos ambas listas en un solo objeto
  return { listaCitas, listaFacturas };
  };

  const handleAddAppointment = (form) => {
    run(async () => { 
        const nuevaCita = await postCitaFull(form);
        setAppointments((prev) => [...prev, nuevaCita]);
      },
      (error) => alert(error.message)
    )
  }

  const handleSaveFacturas = (lista) => { // facuras y actualiza citas
    run (async () => { 
        const { listaCitas, listaFacturas } = organizarDatosParaGuardar(lista)
        await postFacturas(listaFacturas);
        await putCitas(listaCitas);

        handleGetFacturasMoreInfo(); // actualiza lista de facturas 
        alert("Caja sincronizada 🚀");
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
  const handleGetFacturasMoreInfo = (desde, hasta, filtros) => {
    run(async () => {
      const data = await getFacturasMoreInfo(desde, hasta, filtros);
      setFacturasInfo(data)
    })
  }
 
  return {
    appointments,
    handleAddAppointment,
    handleSaveFacturas,
    fechaSeleccionada,
    setFechaSeleccionada,
    appointmentsDay,
    handleGetFacturasMoreInfo,
    FacturasInfo
  };
};