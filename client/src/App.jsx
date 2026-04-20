import { useEffect, useState } from "react";
import AppointmentList from "./components/AppointmentList";
import AppointmentDetail from "./components/AppointmentDetail";
import ClientForm from "./components/ClientForm";
import Summary from "./components/Summary";
import { createAppointmentWithUser } from "./services/appointmentService";
import { useAppointments } from "./hooks/useAppointments";
import UserModal from "./components/UserModal";
//import "./app.css";

export default function App() {
  const [showForm, setShowForm] = useState(false);      // bool form de agregar cliente
  const [selectedUser, setSelectedUser] = useState(null); // estado selected para modal usuario

  const { appointments, handleAddAppointment, handleSaveFacturas } = useAppointments(); // citas, factura, fetch
  
  return (
    <div className="container">
      <div className="left">
        <h3>Día de hoy</h3>

        <AppointmentList
          appointments={appointments}
          onSelectUser={setSelectedUser}
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

      <UserModal 
        user={selectedUser} 
        onClose={() => setSelectedUser(null)} 
      />
      
    </div>
  );
}