import { useEffect, useState } from "react";
import { useAppointments } from "./hooks/useAppointments";
import { useMessages } from "./hooks/useMessages";
import { useMascotas } from "./hooks/useMascotas";
import { usePeluqueras } from "./hooks/usePeluqueras";
import { useAction } from "./context/ActionContext";
import { useSales} from "./hooks/useSales";
import { loginManual } from "./utils/manualLogin";

import AppointmentList from "./components/AppointmentList";
import AppointmentDetail from "./components/AppointmentDetail";
import ClientForm from "./components/ClientForm";
import Summary from "./components/Summary";
import ListaCitasPorDia from "./components/AppointmentByDay"
import UserModal from "./components/UserModal";
import MascotaModal from "./components/MascotaModal";
import SalesViewer from "./components/SalesViewer";
import MascotasViewer from "./components/MascotasViewer";
import LateralPanel from "./components/LateralPanel";
import WhatsAppAdmin from "./components/WhatsAppAdmin";
import AdminPeluqueras from "./components/AdminPeluqueras";

//import "./app.css";

export default function App() {

  if (!localStorage.getItem('isLogged')) {
    return <p> falta log </p>;
  }
  const [showForm, setShowForm] = useState(false);        // bool form de agregar cliente
  const [selectedUser, setSelectedUser] = useState(null); // estado selected para modal usuario
  const [selectedMascota, setSelectedMascota] = useState(null); 
  const [activeTab, setActiveTab] = useState('factura');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const { appointments, handleAddAppointment, handleSaveFacturas, fechaSeleccionada, setFechaSeleccionada, appointmentsDay, handleGetFacturasMoreInfo, FacturasInfo} = useAppointments(); // citas, factura, fetch
  const { contacts, msgsMore, handleGetMessByNum, handleSendMenssage, selectedContact, setSelectedContact, handleBotState} = useMessages(); // todo messages
  const { mascotasInfo, handleSetMascotasNotes, handleGetMascotasMoreInfo } = useMascotas();
  const { salesList, setSalesList } = useSales();
  const { listPeluqueras, handleAddPel, handleDeletePel } = usePeluqueras();
  
  const { error, loading } = useAction();

  // Función para cerrar el menú al elegir una opción
  const selectOption = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
    <div className="containerMain">
      <LateralPanel
        activeTab = {activeTab}
        options = {selectOption} 
        getMascotas = {handleGetMascotasMoreInfo}
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
            {showForm && <ClientForm onAdd={handleAddAppointment} setShowForm={setShowForm} />}
          </div>

          <div className="right">
            <AppointmentDetail
              appointments={appointments}
              onSaveAll={handleSaveFacturas}
              salesList={salesList}
              setSalesList={setSalesList}
              peluqueras={listPeluqueras}
            />
            <Summary 
              salesList={salesList}
              peluqueras={listPeluqueras} 
            />
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
              getFacturas={handleGetFacturasMoreInfo}
              loading={loading}
            />
          </div>
        </div> 
      )}
      {activeTab === 'mascotas' && ( 
        <div className="container" > 
          <div style={{width:'50vw'}} className="left" >
            <MascotasViewer
            data={mascotasInfo}
            getMascotas={handleGetMascotasMoreInfo}
            loading={loading}
            onSelectMascota={setSelectedMascota}
            />
          </div>
          <MascotaModal 
            mascota={selectedMascota} 
            onClose={() => setSelectedMascota(null)} 
            onUpdateNotes={handleSetMascotasNotes}
          />
        </div> 
      )}
      {activeTab === 'whatsApp' && (
        
        <div className="container" >
          <WhatsAppAdmin
          contacts={contacts}
          handleGetMessages={handleGetMessByNum}
          msgsMore={msgsMore}
          loading={loading}
          sendMsg={handleSendMenssage}
          selectedContact={selectedContact}
          setSelectedContact={setSelectedContact}
          handleBotState={handleBotState}
          />
        </div>

      )}
      {activeTab === 'others' && (
        <div className="container">
          <AdminPeluqueras
          listPeluqueras={listPeluqueras}
          addPeluquera={handleAddPel}
          deletePeluquera={handleDeletePel}
          />
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