import { useState, useEffect } from "react";
import { createAppointmentWithUser } from "../services/appointmentService";
import { getAppointmentsByDay, postFacturas, putCitas, getFacturasMoreInfo, getHistoryNums, getMessByNum } from "../services/api";
import { useAction } from "./useAction";
import { dailyClean } from "../utils/dailyClean"

export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]); // citas hoy, user + cita
  // selector day
  const [appointmentsDay, setAppointmentsDay] = useState([]); // citas con select por dia
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
  const [FacturasInfo, setFacturasInfo] = useState([]); // facturas todo
  const [contacts, setContacts] = useState([]); //numeros wsp
  const [messages, setMessages] = useState([]); //msg wsp
  
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

  useEffect(() => {
    handleGetFacturasMoreInfo();
    handleGetHistNums();
  }, []);

  useEffect(() => { // actualiza lista factura
    dailyClean();
    const interval = setInterval(dailyClean, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const organizarDatosParaGuardar = (listaOriginal) => {
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
        //console.log(form);
        const nuevaCita = await createAppointmentWithUser(form);
        setAppointments((prev) => [...prev, nuevaCita]);
      },
      (error) => alert(error.message)
    )
  }

  const handleSaveFacturas = (lista) => {
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
  const handleGetFacturasMoreInfo = () => {
    run(async () => {
      const data = await getFacturasMoreInfo();
      setFacturasInfo(Array.isArray(data) ? data : [])
    })
  }
  const handleGetHistNums = () => {
    run(async () => {
      const data = await getHistoryNums();
      setContacts(Array.isArray(data) ? data : [])
    })
  }
  const handleGetMessByNum = (num) => {
    run(async ()=>{
      const data = await getMessByNum(num);
      setMessages(Array.isArray(data) ? data : [])
    })
  }
  
  
  return {
    appointments,
    handleAddAppointment,
    handleSaveFacturas,
    fechaSeleccionada,
    setFechaSeleccionada,
    appointmentsDay,
    FacturasInfo,
    loading,
    error,
    contacts,
    handleGetMessByNum,
    messages
  };
};