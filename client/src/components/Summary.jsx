import { useState } from "react";

export default function Summary({ salesList , peluqueras}) {

  const [peluquerasLocal, setPeluquerasLocal] = useState(() => {
    const guardadas = localStorage.getItem("lista_peluqueras_Sumary");

    if (guardadas) {
      return JSON.parse(guardadas)
    }
    else {
      const iniciales = [peluqueras[0] || "", peluqueras[1] || ""];
      localStorage.setItem("lista_peluqueras_Summary", JSON.stringify(iniciales));
      return iniciales;
    }
  });

  const handleSetPeluqueras = (num,val) =>{
    let nuevasSeleccionadas = [...peluquerasLocal];
    
    if (num === 0) nuevasSeleccionadas[0] = val;
    if (num === 1) nuevasSeleccionadas[1] = val;

    setPeluquerasLocal(nuevasSeleccionadas);
    localStorage.setItem("lista_peluqueras_Sumary", JSON.stringify(nuevasSeleccionadas));
  }
  
  const totals = salesList.reduce(
    (acc, a) => {
      if (!a.total_final) return acc;
      acc.total += a.total_final;
      acc[a.tipo_pago] += a.total_final;

      return acc;
    },
    { efectivo: 0, tarjeta: 0, transferencia: 0, total: 0 }
  );

  const calcularTotalPeluquera = (nombrePeluquera) => {
    return salesList.reduce((acc, sale) => {
      if (sale.peluquera === nombrePeluquera && sale.total_peluqueria) {
        return acc + Number(sale.total_peluqueria);
      }
      return acc;
    }, 0);
  };

  const totalPeluqueraA = calcularTotalPeluquera(peluquerasLocal[0]);
  const totalPeluqueraB = calcularTotalPeluquera(peluquerasLocal[1]);
  const cincuentaPorCientoB = totalPeluqueraB * 0.5;

  return (
    <div className="summary">
      <div className="summary-container">
        <h4 className="summary-h4">Resumen Diario</h4>
        
        <div className="summary-div-flex">
          <span>Efectivo:</span>
          <span style={{ fontWeight: '500' }}>${totals.efectivo}</span>
        </div>

        <div className="summary-div-flex">
          <span>Tarjeta:</span>
          <span style={{ fontWeight: '500' }}>${totals.tarjeta}</span>
        </div>

        <div className="summary-div-flex">
          <span>Transferencia:</span>
          <span style={{ fontWeight: '500' }}>${totals.transferencia}</span>
        </div>

        <hr style={{ border: '0', borderTop: '1px dashed #6d76c7', margin: '10px 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '1.1rem'}}>
          <b>Total:</b>
          <b>${totals.total}</b>
        </div>
      </div>

      <div className="summary-container" >
        <h4 className="summary-h4">Peluqueras</h4>
        
        <div className="summary-div-flex" >
          
          {/* Columna Peluquera 1 */}
          <div className="flex-column-center">
            <label className="form-label" style={{ padding:'10px' }}>Peluquera A</label>
            <select 
              className="form-control"
              value={peluquerasLocal[0]} 
              onChange={(e) => handleSetPeluqueras(0,e.target.value)}
            >
              {peluqueras.map((nombre, index) => (
                <option key={index} value={nombre}>{nombre}</option>
              ))}
            </select>
            <div style={{ marginTop: '10px' }}>
              <p className="mb-0">Total: <b>${totalPeluqueraA}</b></p>
            </div>
          </div>

          {/* Columna Peluquera 2 */}
          <div className="flex-column-center">
            <label className="form-label" style={{ padding:'10px' }}>Peluquera B</label>
            <select 
              className="form-control"
              value={peluquerasLocal[1]} 
              onChange={(e) => handleSetPeluqueras(1,e.target.value)}
            >
              {peluqueras.map((nombre, index) => (
                <option key={index} value={nombre}>{nombre}</option>
              ))}
            </select>
            <div style={{ marginTop: '10px' }}>
              <p className="mb-1">Total: <b>${totalPeluqueraB}</b></p>
              <p className="text-success" style={{ fontSize: '0.95rem' }}>
                (50%): <b>${cincuentaPorCientoB}</b>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}