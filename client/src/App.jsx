import { useEffect, useState } from "react";
import AppointmentList from "./components/AppointmentList";
import AppointmentDetail from "./components/AppointmentDetail";
import ClientForm from "./components/ClientForm";
import Summary from "./components/Summary";
import ListaCitasPorDia from "./components/AppointmentByDay"
import { createAppointmentWithUser } from "./services/appointmentService";
import { useAppointments } from "./hooks/useAppointments";
import UserModal from "./components/UserModal";
import SalesViewer from "./components/SalesViewer";
import FacturacionDashboard from "./components/LateralPanel";
//import "./app.css";

export default function App() {
  const [showForm, setShowForm] = useState(false);        // bool form de agregar cliente
  const [selectedUser, setSelectedUser] = useState(null); // estado selected para modal usuario

  const { appointments, handleAddAppointment, handleSaveFacturas, fechaSeleccionada, setFechaSeleccionada, appointmentsDay, FacturasInfo } = useAppointments(); // citas, factura, fetch
  
  const [activeTab, setActiveTab] = useState('factura');
  // Función para cerrar el menú al elegir una opción
  const selectOption = (tab) => {
    setActiveTab(tab);
  };

  const [salesList, setSalesList] = useState(() => {
    //localStorage.removeItem("facturacion_borrador");
    const saved = localStorage.getItem("facturacion_borrador");
    // Si hay datos guardados, usarlos
    if (saved) return JSON.parse(saved);
    return [];
  });

  return (
    <>
    <div className="containerMain">
      <FacturacionDashboard
        activeTab = {activeTab}
        options = {selectOption} 
      />
      {activeTab === 'factura' && (  
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
              salesList={salesList}
              setSalesList={setSalesList}
            />
            <Summary salesList={salesList} />
          </div>
        </div>
      )}
      {activeTab === 'filtros' && ( 
        <div className="container" > 
          <div className="left" >
            <ListaCitasPorDia
            onSelectUser={setSelectedUser}
            fechaSeleccionada={fechaSeleccionada}
            setFechaSeleccionada={setFechaSeleccionada}
            appointmentsDay={appointmentsDay}
            />
          </div>

          <div className="right" >
            <SalesViewer
              data={FacturasInfo}
            />
          </div>
        </div> 
      )}
      <UserModal 
        user={selectedUser} 
        onClose={() => setSelectedUser(null)} 
      />
      
    </div>
  </>
  );
}