import { useEffect, useState } from "react";
import AppointmentList from "./components/AppointmentList";
import AppointmentDetail from "./components/AppointmentDetail";
import ClientForm from "./components/ClientForm";
import Summary from "./components/Summary";
import { createAppointmentWithUser } from "./services/appointmentService";
import { useAppointments } from "./hooks/useAppointments";
import "./app.css";

export default function App() {
  const [selected, setSelected] = useState(null);       // selectes de un user de la lista
  const [showForm, setShowForm] = useState(false);      // bool form de agregar cliente

  const { appointments, handleAddAppointment, handleSaveFacturas } = useAppointments(); // citas, factura, fetch
  
  return (
    <div className="container">
      <div className="left">
        <h3>Día de hoy</h3>

        <AppointmentList
          appointments={appointments}
          onSelect={setSelected}
        />

        <button onClick={() => setShowForm(!showForm)}>
          + Agregar cliente
        </button>
        {showForm && <ClientForm onAdd={handleAddAppointment} />}
      </div>

      <div className="right">
        <AppointmentDetail
          appointments={appointments}
          onSaveAll={handleSaveFacturas}
        />
        <Summary appointments={appointments} />
      </div>
      
    </div>
  );
}