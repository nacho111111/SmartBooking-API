import { useEffect, useState } from "react";

export default function AppointmentDetail({ appointments , onSaveAll, salesList, setSalesList, peluqueras}) {
  
  const idsExistentes = new Set(appointments.map(f => f.id_cita));

  const actualizarLista = () => {
    if (!appointments || appointments.length === 0) {
      return;
    }
    
    setSalesList(prevList => {
      const listaSegura = Array.isArray(prevList) ? prevList : [];

      const ventasFiltradas = listaSegura.filter(
        factura => idsExistentes.has(factura.id_cita)
      );

      const idsExistentesEnVentas = new Set(
        ventasFiltradas.map(f => f.id_cita)
      );

      const nuevasCitas = appointments.filter(
        cita => !idsExistentesEnVentas.has(cita.id_cita)
      );
      const ordenIdsCorrecto = appointments.map(c => c.id_cita);

      const ordenEstaCorrecto = ventasFiltradas.length === listaSegura.length && 
        ventasFiltradas.every((factura, index) => factura.id_cita === ordenIdsCorrecto[index]);
      // no hay cambios en la lista 
      if (nuevasCitas.length === 0 && ordenEstaCorrecto) {
        return listaSegura;
      }

      let listaFinal = [...ventasFiltradas];
        
      if (nuevasCitas.length > 0) {
        const nuevasFacturas = nuevasCitas.map((cita) => ({
          asistio: true,
          peluquera: peluqueras?.[0] || "Sin asignar",
          id_cita: cita.id_cita,
          id_usuario: cita.id_usuario,
          total_peluqueria: 0,
          total_productos: 0,
          total_final: 0,
          tipo_pago: "efectivo",
        }));
        listaFinal = [...listaFinal, ...nuevasFacturas];  
      }

      listaFinal.sort((a, b) => ordenIdsCorrecto.indexOf(a.id_cita) - ordenIdsCorrecto.indexOf(b.id_cita));
      return listaFinal;
    })
  };
  useEffect(() => {
    actualizarLista();
  }, [appointments]);

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
      <table className="table-form">
        <thead>
          <tr>
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
              <td>
                <select 
                  value={f.asistio} 
                  onChange={(e) => updateFactura(i, "asistio", e.target.value)}
                >
                  <option value={true}>Si</option>
                  <option value={false}>No</option>
                </select>
              </td>
              <td>
                <select 
                  value={f.peluquera} 
                  onChange={(e) => updateFactura(i, "peluquera", e.target.value)}
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
                    updateFactura(i, "total_peluqueria", numericValue)
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
                    updateFactura(i, "total_productos", numericValue)
                  }}
                  onFocus={(e) => {if (f.total_productos === 0) e.target.select()}}
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