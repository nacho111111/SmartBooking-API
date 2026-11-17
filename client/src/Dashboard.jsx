// hook
import { useState } from "react";
import { useAppointments } from "./hooks/useAppointments";
import { useMessages } from "./hooks/useMessages";
import { useMascotas } from "./hooks/useMascotas";
import { usePeluqueras } from "./hooks/usePeluqueras";
import { useAction } from "./context/ActionContext";
import { useSales} from "./hooks/useSales";

// components
import { AppointmentList } from "./components/appointments/AppointmentList";
import { AppointmentDetail } from "./components/appointments/AppointmentDetail";
import { ClientForm } from "./components/ClientForm";
import { Summary } from "./components/Summary";
import { AppointmentByDay } from "./components/appointments/AppointmentByDay";
import { UserModal } from "./components/modals/UserModal";
import { MascotaModal } from "./components/modals/MascotaModal";
import { SalesViewer } from "./components/SalesViewer";
import { MascotasViewer } from "./components/MascotasViewer";
import { LateralPanel } from "./components/modals/LateralPanel";
import { WhatsAppAdmin } from "./components/WhatsAppAdmin";
import { AdminPeluqueras } from "./components/AdminPeluqueras";
import { SummaryMonth } from "./components/SummaryMonth";
import { DailyCleanModal } from "./components/modals/DailyCleanModal";
import { SummaryDayMonth } from "./components/SummaryDayMonth";

export default function Dashboard() {
  const [showForm, setShowForm] = useState(false);        // bool form de agregar cliente
  const [selectedUser, setSelectedUser] = useState(null); // estado selected para modal usuario
  const [selectedMascota, setSelectedMascota] = useState(null); 
  const [activeTab, setActiveTab] = useState('factura');
  
  const { appointments, handleAddAppointment, handleSaveFacturas, appointmentsDay, handleGetAppointmentsByDay, handleGetFacturasMoreInfo, facturasInfo, handleGetResumeFacturas, resumeFacturas, handleGetDailyPayMonth, dailyPayMonth} = useAppointments(); // citas, factura, fetch
  const { contacts, msgsMore, handleGetMessByNum, handleSendMenssage, selectedContact, setSelectedContact, handleBotState, handleGetHistNums} = useMessages(); // todo messages
  const { mascotasInfo, handleSetMascotasNotes, handleGetMascotasMoreInfo } = useMascotas();
  const { salesList, handleSyncAppointments, handlerUpdateFactura, dailyCleanHandlers} = useSales();
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
              peluqueras={listPeluqueras}
              handlerUpdate={handlerUpdateFactura}
              handleSync={handleSyncAppointments}
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
            <AppointmentByDay
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
          <div style={{width:'50vw', height:'900px'}} className="left" >
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
          <div className="left"> {/*style={{width:'50vw'}*/}
            <SummaryMonth
            facturas = {resumeFacturas}
            handleGetResume = {handleGetResumeFacturas}
            peluqueras={listPeluqueras}
            />
          </div>

          <div className="right">
            <SummaryDayMonth 
            yearMonth={dailyPayMonth} 
            handleDayMonth={handleGetDailyPayMonth} 
            peluqueras={listPeluqueras}/>
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
      <DailyCleanModal
        isOpen={dailyCleanHandlers.isCleanModalOpen }
        pendientes={dailyCleanHandlers.dailyCleanData.pendientes}
        onConfirm ={dailyCleanHandlers.handleConfirmClean}
        onCancel={dailyCleanHandlers.handleCancelClean}
      />
      
    </div>
  </>
  );
}