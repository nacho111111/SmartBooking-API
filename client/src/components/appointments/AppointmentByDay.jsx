import { useState } from 'react';
import { formatTime } from "../../utils/dateFormatters";

function ListAppointmentsDay({onSelectUser, appointmentsDay}){
  return (
    <>
      {
        appointmentsDay.map((a, i) => (
          <tr 
            key={i} 
            onClick={() => onSelectUser(a)}
            style={{ cursor: 'pointer' }}
        >
            <td>{a.nombre_usuario}</td>
            <td>{formatTime(a.hora_atencion)}</td>
            <td>{a.nombre_mascota}</td>
            <td>{a.descripcion}</td>
            <td>{a.tipo}</td>
            <td>{a.estado}</td>
          </tr>
        ))
      }
    </>
  )
}

function NoAppointmentDay(){
  return (
    <tr>
      <td colSpan="6" className="text-center text-muted">
        No hay citas para este día.
      </td>
    </tr>
  )
}

export function AppointmentByDay({onSelectUser, appointmentsDay, handleGetByDay}) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const hasAppointmentsDay = appointmentsDay?.length > 0;
  const handleSelectFecha = (fecha) => { 
    if (fecha) {
      setFechaSeleccionada(fecha); 
      handleGetByDay(fecha);
    }
  }
  return (
    <div>
      <h4 className="mb-4">Historial citas</h4>
      <div style={{ display:'flex',justifyContent:'space-evenly', alignItems:'center' }} className="mb-4">
        <label className="form-label">Filtrar por día: </label>
          <input 
            type="date" 
            className="form-control"
            value={fechaSeleccionada} 
            onChange={(e) => handleSelectFecha(e.target.value)} 
            style={{ maxWidth: '200px' }}
          />
      </div>

      <table className="table-list">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Hora</th>
            <th>Perro/Gato</th>
            <th>Descripción</th>
            <th>Tipo</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {
            hasAppointmentsDay 
            ? <ListAppointmentsDay onSelectUser={onSelectUser} appointmentsDay={appointmentsDay} />
            : <NoAppointmentDay/>
          }
        </tbody>
      </table>
    </div>
  );
};