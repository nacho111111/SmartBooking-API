export default function AppointmentList({ appointments, onSelectUser }) {
  return (
    <table className="table-list">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Fecha</th>
          <th>Perro/Gato</th>
          <th>descripcion</th>
          <th>tipo</th>
          <th>ID</th>
        </tr>
      </thead>
      <tbody>
        {appointments.length > 0 ? (
          appointments.map((a, i) => (
            <tr key={i} onClick={() => onSelectUser(a)}
              style={{ cursor: 'pointer' }}
            >
              <td>{a.nombre_usuario}</td>
              <td>
                {new Date(a.hora_atencion).toLocaleTimeString('es-CL', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                })}
              </td>
              <td>{a.nombre_mascota}</td>
              <td>{a.descripcion}</td>
              <td>{a.tipo}</td>
              <td>{a.id_cita}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center text-muted">
                No hay citas hoy.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}