import { useEffect } from "react";

function ListSales({salesList, peluqueras, handlerUpdate}){
  const handleNumberChange = (index, field, rawValue) => {
    const numericValue = rawValue === "" ? 0 : parseInt(rawValue, 10);
    handlerUpdate(index, field, isNaN(numericValue) ? 0 : numericValue);
  };
  return (
    <>
    {
      salesList.map((f, i) => (
        <tr key={f.id_cita}>
          {/*<td>{f.id_cita}</td>*/}
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
              onChange={(e) => handleNumberChange(i, "total_peluqueria", e.target.value)}
              onFocus={(e) => {if (f.total_peluqueria === 0) e.target.select()}}
            />
          </td>
          <td>
            <input
              type="number"
              value={f.total_productos}
              onChange={(e) => handleNumberChange(i, "total_productos", e.target.value)}
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
    }
    </>
  )
}

function NoSales(){
  return (
    <tr>
      <td colSpan="6" className="text-center text-muted">
          No hay facturas hoy.
      </td>
    </tr>
  )
}

export function AppointmentDetail({ appointments , onSaveAll, salesList, peluqueras, handlerUpdate, handleSync}) {
  const hasSales = salesList?.length > 0;
  useEffect(() => {
    handleSync(appointments,peluqueras);
  }, [appointments]);
  
  return (
    <div className="p-4">
      <h3>Panel de Facturación Diaria</h3>
      <table className="table-form">
        <thead>
          <tr>
            {/*<th>ID</th>*/}
            <th>Asistió</th>
            <th>Peluquera </th>
            <th>Servicio($)</th>
            <th>Productos($)</th>
            <th>Total</th>
            <th>Tipo Pago</th>
          </tr>
        </thead>
        <tbody>
          { 
            hasSales
            ? <ListSales salesList={salesList} peluqueras={peluqueras} handlerUpdate={handlerUpdate}/>  
            : <NoSales/>
          }
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