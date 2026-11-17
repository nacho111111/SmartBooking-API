import { formatTime } from "../../utils/dateFormatters";

function ListAppointment({appointments,onSelectUser}){
  return ( 
    <>
      {
        appointments.map((a, i) => (
          <tr key={a.id_cita} onClick={() => onSelectUser(a)}
            style={{ cursor: 'pointer' }}
          >
            <td>{a.nombre_usuario}</td>
            <td>
              {formatTime(a.hora_atencion)}
            </td>
            <td>{a.nombre_mascota}</td>
            <td>{a.descripcion}</td>
            <td>{a.tipo}</td>
            {/*<td>{a.id_cita}</td>*/}
          </tr>
        ))
      }
    </>
  )
}

function NoAppointment(){
  return (
    <tr>
      <td colSpan="5" className="text-center text-muted">
          No hay citas hoy.
      </td>
    </tr>
  )
}

export function AppointmentList({ appointments, onSelectUser }) {
  const hasAppointment = appointments?.length > 0;
  return (
    <table className="table-list">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Fecha</th>
          <th>Perro/Gato</th>
          <th>Descripcion</th>
          <th>Tipo</th>
          {/*<th>ID</th>*/}
        </tr>
      </thead>
      <tbody>
        {
          hasAppointment 
          ? <ListAppointment appointments={appointments} onSelectUser={onSelectUser}/>
          : <NoAppointment/>
        }
      </tbody>
    </table>
  );
}