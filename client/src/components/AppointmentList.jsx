export default function AppointmentList({ appointments, onSelect }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Teléfono</th>
          <th>Fecha</th>
          <th>Mascota</th>
          <th>descripcion</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((a, i) => (
          <tr key={i} onClick={() => onSelect(a)}>
            <td>{a.nombre}</td>
            <td>{a.email}</td>
            <td>{a.telefono}</td>
            <td>
              {new Date(a.hora_atencion).toLocaleTimeString('es-CL', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
              })}
            </td>
            <td>{a.nombre_mascota}</td>
            <td>{a.descripcion}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}