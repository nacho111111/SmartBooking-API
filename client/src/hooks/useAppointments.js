import { useState, useEffect } from "react";
import { createAppointmentWithUser } from "../services/appointmentService";
import { getTodayAppointments, postFacturas } from "../services/api";

export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]); // citas hoy, user + cita
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getTodayAppointments();
        setAppointments(data);
      } catch (e) {
        console.error("Error al cargar citas:", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const asyncHandler = (fn, onError) => {
    return async (...args) => {
      try {
        return await fn(...args);
      } catch (error) {
        console.error(error);
        if (onError) onError(error);
      }
    };
  };

  const handleAddAppointment = asyncHandler( 
    async (form) => { 
      const nuevaCita = await createAppointmentWithUser(form);
      setAppointments((prev) => [...prev, nuevaCita]);
    },
    (error) => alert(error.message)
  )

  const handleSaveFacturas = asyncHandler(
    async (listaFacturas) => { 
      await postFacturas(listaFacturas);
      alert("Caja sincronizada 🚀");

      // borrador de LocalStorage
      //localStorage.removeItem("facturacion_borrador");
    },
    (error) => alert("Error al facturar: " + error.message)
  );

  const handleUpdate = (updated) => { //cliente, no se usa
    setAppointments(prev =>
      prev.map(a => (a.id === updated.id ? updated : a))
    );
  };
    
  return {
    appointments,
    loading,
    handleAddAppointment,
    handleUpdate,
    handleSaveFacturas
  };
};