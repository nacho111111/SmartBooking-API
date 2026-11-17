import React, {useState } from "react";

export function DailyCleanModal({ isOpen, pendientes, onConfirm, onCancel }){
  if (!isOpen) return null;
  const [modal, setModal] = useState(false);
  return (
    <div>
    <div className="modal-overlay" >
      <div className="modal-container" style={{width:'auto', maxWidth: 'max-content'}} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>⚠ se han detectado citas sin guardar</h3>
        </div>

        <table className="table-form" style={{width:'auto'}}>
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
            {pendientes.length > 0 ? (
            pendientes.map((f, i) => (
              <tr key={f.id_cita}>
                <td>{f.id_cita}</td>
                <td>{f.asistio}</td>
                <td>{f.peluquera}</td>
                <td>{f.total_peluqueria}</td>
                <td>{f.total_productos}</td>
                <td>{f.total_final}</td>
                <td>{f.tipo_pago}</td>
              </tr>
            ))):(
              <tr>
                <td colSpan="6" className="text-center text-muted">
                    No hay facturas hoy.
                </td>
              </tr>
              )}
          </tbody>
        </table>
        <div className="pagination">
            <button type="submit" onClick={onConfirm}>Guardar</button>
            <button type="submit" onClick={(e) => {setModal(true)}}>Borrar dia anterior</button>
        </div>
      </div>
      
    </div>
    {modal == true && (
      <div className="modal-overlay" >
        <div className="modal-container" style={{width:'auto', maxWidth: 'max-content'}} onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>⚠ esta accion es irreversible seguro de que quiere borrar estas citas?</h3>
          </div>
          <div className="pagination mb-0">
              <button type="submit" onClick={(e) => {setModal(false)}}>Calcelar</button>
              <button type="submit" onClick={onCancel}>Borrar dia anterior</button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};