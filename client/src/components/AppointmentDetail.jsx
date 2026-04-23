import { useEffect, useState } from "react";

export default function AppointmentDetail({ appointments , onSaveAll, salesList, setSalesList}) {
  
const actualizarLista = () => {
  //  localStorage.removeItem("facturacion_borrador");
  if (appointments.length === 0) return;

  const idsExistentes = new Set(salesList.map(f => f.id_cita));
  const nuevasCitas = appointments.filter(cita => !idsExistentes.has(cita.id_cita));

  if (nuevasCitas.length > 0) {

    const nuevasFacturas = nuevasCitas.map((cita) => ({
      id_cita: cita.id_cita,
      id_usuario: cita.id_usuario,
      total_peluqueria: 0,
      total_productos: 0,
      total_final: 0,
      tipo_pago: "efectivo",
    }));

    console.log(nuevasFacturas[3])

    setSalesList(prevList => [...prevList, ...nuevasFacturas]);

  }
};
  useEffect(() => {
    actualizarLista();
  }, [appointments]);

  // 3. Sincronizar con LocalStorage
  useEffect(() => {
    if (salesList.length > 0) {
      localStorage.setItem("facturacion_borrador", JSON.stringify(salesList));
    }
  }, [salesList]);

  // 4. Actualizador genérico
  const updateFactura = (index, field, value) => {
    const updated = [...salesList];
    
    if (field === "total_peluqueria" || field === "total_productos") {
      updated[index][field] = Number(value) || 0;
      // Cálculo automático del total final
      updated[index].total_final = 
        Number(updated[index].total_peluqueria) + Number(updated[index].total_productos);
    } else {
      updated[index][field] = value;
    }

    setSalesList(updated);
  };
  
  return (
    
    <div className="p-4">
      <h3>Panel de Facturación Diaria</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Servicio ($)</th>
            <th>Productos ($)</th>
            <th>Total</th>
            <th>Tipo Pago</th>
          </tr>
        </thead>
        <tbody>
          {salesList.map((f, i) => (
            <tr key={f.id_cita}>
              <td>
                <input
                  type="number"
                  value={f.total_peluqueria}
                  onChange={(e) => updateFactura(i, "total_peluqueria", e.target.value)}
                  placeholder="0"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={f.total_productos}
                  onChange={(e) => updateFactura(i, "total_productos", e.target.value)}
                  placeholder="0"
                />
              </td>
              <td><strong>${f.total_final}</strong></td>
              <td>
                <select 
                  value={f.tipo_pago} 
                  onChange={(e) => updateFactura(i, "tipo_pago", e.target.value)}
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {salesList.length > 0 && (
        <button onClick={() => onSaveAll(salesList)}>
          Finalizar y Guardar Caja
        </button>
      )}
    </div>
  );
}