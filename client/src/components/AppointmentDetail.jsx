import { useEffect, useState } from "react";

export default function AppointmentDetail({ appointments , onSaveAll}) {
  
  const [localList, setLocalList] = useState(() => {
    const saved = localStorage.getItem("facturacion_borrador");
    // Si hay datos guardados, usarlos
    if (saved) return JSON.parse(saved);
    return [];
  });
  

  useEffect(() => {
  //localStorage.removeItem("facturacion_borrador");

  const actualizarLista = () => {

    if (appointments.length === 0) return;

    const idsExistentes = new Set(localList.map(f => f.id_cita));
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

      setLocalList(prevList => [...prevList, ...nuevasFacturas]);
    }
  };
  actualizarLista();
}, [appointments]);

  // 3. Sincronizar con LocalStorage
  useEffect(() => {
    if (localList.length > 0) {
      localStorage.setItem("facturacion_borrador", JSON.stringify(localList));
    }
  }, [localList]);

  // 4. Actualizador genérico
  const updateFactura = (index, field, value) => {
    const updated = [...localList];
    
    if (field === "total_peluqueria" || field === "total_productos") {
      updated[index][field] = Number(value) || 0;
      // Cálculo automático del total final
      updated[index].total_final = 
        Number(updated[index].total_peluqueria) + Number(updated[index].total_productos);
    } else {
      updated[index][field] = value;
    }

    setLocalList(updated);
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
          {localList.map((f, i) => (
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

      {localList.length > 0 && (
        <button onClick={() => onSaveAll(localList)}>
          Finalizar y Guardar Caja
        </button>
      )}
    </div>
  );
}