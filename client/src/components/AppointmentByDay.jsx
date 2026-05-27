import { useState, useEffect } from 'react';

const ListaCitasPorDia = ({onSelectUser, appointmentsDay, handleGetByDay}) => {
     const [fechaSeleccionada, setFechaSeleccionada] = useState('');

    const handleSelectFecha = (e) => { 
        const nuevaFecha = e.target.value;
        setFechaSeleccionada(nuevaFecha); 
        handleGetByDay(nuevaFecha);
    }
    return (
    <div>
        <h4 className="mb-4">Historial citas</h4>
        <div style={{ display:'flex', justifyContent:'space-evenly',alignItems:'center' }} className="mb-4">
            <label className="form-label">Filtrar por día: </label>
                <input 
                type="date" 
                className="form-control"
                value={fechaSeleccionada} 
                onChange={handleSelectFecha}
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
                    <td>{a.tipo}</td>
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan="5" className="text-center text-muted">
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