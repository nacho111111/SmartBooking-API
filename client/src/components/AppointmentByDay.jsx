import { useState, useEffect } from 'react';

const ListaCitasPorDia = ({onSelectUser, fechaSeleccionada, setFechaSeleccionada, appointmentsDay}) => {
  return (
    <div>
        <div className="mb-4">
            <label className="form-label">Filtrar por día:</label>
            <input 
            type="date" 
            className="form-control"
            value={fechaSeleccionada} 
            onChange={(e) => setFechaSeleccionada(e.target.value)}
            style={{ maxWidth: '200px' }}
            />
        </div>

        <table className="table">
            <thead>
            <tr>
                <th>Nombre</th>
                <th>Hora</th>
                <th>Mascota</th>
                <th>Descripción</th>
            </tr>
            </thead>
            <tbody>
            {appointmentsDay.length > 0 ? (
                appointmentsDay.map((a, i) => (
                <tr 
                    key={i} 
                    onClick={() => onSelectUser(a)}
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
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan="4" className="text-center text-muted">
                    No hay citas para este día.
                </td>
                </tr>
            )}
            </tbody>
        </table>
        </div>
  );
};

export default ListaCitasPorDia;