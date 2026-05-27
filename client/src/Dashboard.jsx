import { useEffect, useState } from "react";
import { useAppointments } from "./hooks/useAppointments";
import { useMessages } from "./hooks/useMessages";
import { useMascotas } from "./hooks/useMascotas";
import { usePeluqueras } from "./hooks/usePeluqueras";
import { useAction } from "./context/ActionContext";
import { useSales} from "./hooks/useSales";

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
import SummaryMonth from "./components/SummaryMonth";


export default function Dashboard() {
  const [showForm, setShowForm] = useState(false);        // bool form de agregar cliente
  const [selectedUser, setSelectedUser] = useState(null); // estado selected para modal usuario
  const [selectedMascota, setSelectedMascota] = useState(null); 
  const [activeTab, setActiveTab] = useState('factura');
  
  const { appointments, handleAddAppointment, handleSaveFacturas, appointmentsDay, handleGetAppointmentsByDay, handleGetFacturasMoreInfo, facturasInfo, handleGetResumeFacturas, resumeFacturas} = useAppointments(); // citas, factura, fetch
  const { contacts, msgsMore, handleGetMessByNum, handleSendMenssage, selectedContact, setSelectedContact, handleBotState, handleGetHistNums} = useMessages(); // todo messages
  const { mascotasInfo, handleSetMascotasNotes, handleGetMascotasMoreInfo } = useMascotas();
  const { salesList, setSalesList } = useSales();
  const { listPeluqueras, handleAddPel, handleDeletePel } = usePeluqueras();
  
  const { error, loading } = useAction();

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
            appointmentsDay={appointmentsDay}
            handleGetByDay={handleGetAppointmentsByDay}
            />
          </div>

          <div className="right" >
            <SalesViewer
              data={facturasInfo}
              handleGetFacturas={handleGetFacturasMoreInfo}
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
          handleGetHistNums={handleGetHistNums}
          />
        </div>

      )}
      {activeTab === 'resume' && (
        <div className="container">
          <div style={{width:'50vw'}} className="left">
            <SummaryMonth
            facturas = {resumeFacturas}
            handleGetResume = {handleGetResumeFacturas}
            peluqueras={listPeluqueras}
            />
          </div>
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