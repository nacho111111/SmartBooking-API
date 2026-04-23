import { useEffect, useState } from "react";
import AppointmentList from "./components/AppointmentList";
import AppointmentDetail from "./components/AppointmentDetail";
import ClientForm from "./components/ClientForm";
import Summary from "./components/Summary";
import ListaCitasPorDia from "./components/AppointmentByDay"
import { createAppointmentWithUser } from "./services/appointmentService";
import { useAppointments } from "./hooks/useAppointments";
import UserModal from "./components/UserModal";
//import "./app.css";

export default function App() {
  const [showForm, setShowForm] = useState(false);        // bool form de agregar cliente
  const [selectedUser, setSelectedUser] = useState(null); // estado selected para modal usuario

  const { appointments, handleAddAppointment, handleSaveFacturas, fechaSeleccionada, setFechaSeleccionada, appointmentsDay } = useAppointments(); // citas, factura, fetch
  
  const [salesList, setSalesList] = useState(() => {
    localStorage.removeItem("facturacion_borrador");
    const saved = localStorage.getItem("facturacion_borrador");
    // Si hay datos guardados, usarlos
    if (saved) return JSON.parse(saved);
    return [];
  });

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

        <div>
          <ListaCitasPorDia
           onSelectUser={setSelectedUser}
           fechaSeleccionada={fechaSeleccionada}
           setFechaSeleccionada={setFechaSeleccionada}
           appointmentsDay={appointmentsDay}
          />
        </div>
      </div>

      <div className="right">
        <AppointmentDetail
          appointments={appointments}
          onSaveAll={handleSaveFacturas}
          salesList={salesList}
          setSalesList={setSalesList}
        />
        <Summary salesList={salesList} />
      </div>

      <UserModal 
        user={selectedUser} 
        onClose={() => setSelectedUser(null)} 
      />
      
    </div>
  );
}