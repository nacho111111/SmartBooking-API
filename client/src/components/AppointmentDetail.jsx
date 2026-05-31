import { useEffect, useState } from "react";

export default function AppointmentDetail({ appointments , onSaveAll, salesList, peluqueras, handlerUpdate, handleSync}) {
  
  useEffect(() => {
    handleSync(appointments,peluqueras);
  }, [appointments]);
  
  return (
    <div className="p-4">
      <h3>Panel de Facturación Diaria</h3>
      <table className="table-form">
        <thead>
          <tr>
            <th>ID</th>
            <th>Asistió</th>
            <th>Peluquera </th>
            <th>Servicio($)</th>
            <th>Productos($)</th>
            <th>Total</th>
            <th>Tipo Pago</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length > 0 ? (
          salesList.map((f, i) => (
            
            <tr key={f.id_cita}>
              <td>{f.id_cita}</td>
              <td>
                <select 
                  value={f.asistio} 
                  onChange={(e) => handlerUpdate(i, "asistio", e.target.value)}
                >
                  <option value={true}>Si</option>
                  <option value={false}>No</option>
                </select>
              </td>
              <td>
                <select 
                  value={f.peluquera} 
                  onChange={(e) => handlerUpdate(i, "peluquera", e.target.value)}
                >
                  {peluqueras.map((nombre, index) => (
                    <option key={index} value={nombre}>{nombre}</option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  value={f.total_peluqueria}
                  onChange={(e) => {
                    const val = e.target.value;
                    const numericValue = val === "" ? 0 : parseInt(val, 10);
                    handlerUpdate(i, "total_peluqueria", numericValue)
                  }}
                  onFocus={(e) => {if (f.total_productos === 0) e.target.select()}}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={f.total_productos}
                  onChange={(e) => {
                    const val = e.target.value;
                    const numericValue = val === "" ? 0 : parseInt(val, 10);
                    handlerUpdate(i, "total_productos", numericValue)
                  }}
                  onFocus={(e) => {if (f.total_productos === 0) e.target.select()}}
                />
              </td>
              <td><strong>${f.total_final}</strong></td>
              <td>
                <select 
                  value={f.tipo_pago} 
                  onChange={(e) => handlerUpdate(i, "tipo_pago", e.target.value)}
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                </select>
              </td>
              
            </tr>
          ))
          ) : (
            <tr>
            <td colSpan="6" className="text-center text-muted">
                No hay facturas hoy.
            </td>
            </tr>
            )}
        </tbody>
      </table>

      {salesList.length > 0 && (
        <button onClick={() => onSaveAll(salesList)}>
          Guardar Todo
        </button>
      )}
    </div>
  );
}