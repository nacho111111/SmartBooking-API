import React, { useState, useEffect } from 'react';

const SummaryMonth = ({ facturas, handleGetResume, peluqueras}) => {
    const [mesSeleccionado, setMesSeleccionado] = useState('2026-05');
    const [peluqueraSelec, setPeluqueraSelec] = useState(peluqueras[0]);

    useEffect(() => {
        if (mesSeleccionado && peluqueraSelec) {
            handleGetResume(mesSeleccionado, peluqueraSelec);
        }
    }, [mesSeleccionado, peluqueraSelec]);
    // valores por defecto
    const data = facturas || {
        total: { asistieron: 0, faltaron: 0, peluqueria: 0, productos: 0, bruto: 0, neto: 0 },
        normales: { asistieron: 0, faltaron: 0, peluqueriaBr: 0, peluqueriaNe: 0 },
        solobano: { asistieron: 0, faltaron: 0, peluqueriaBr: 0, peluqueriaNe: 0 }
    };
    
    // asistencia
    const calcularAsistencia = (asistieron, faltaron) => {
        const totalCitas = asistieron + faltaron;
        if (totalCitas === 0) return '0%';
        return `${Math.round((asistieron / totalCitas) * 100)}%`;
    };
    

    const handleChange = (mes, peluquera) => {
        console.log("change")
        const nuevoMes = mes ? mes : mesSeleccionado;
        const nuevaPeluquera = peluquera ? peluquera : peluqueraSelec;

        if (mes) setMesSeleccionado(mes);
        if (peluquera) setPeluqueraSelec(peluquera);
    };

    return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' ,alignItems: 'center'}}>
      
      {/* SELECCIONADOR DE MES */}
      <div className="summary-container row" >
        <div className="column">
            <label className="form-label" style={{ fontWeight: '600', marginBottom: '5px', display: 'block' }}>
            Mes de Rendimiento
            </label>
            <input 
            type="month" 
            className="form-control" 
            value={mesSeleccionado} 
            onChange={(e) => handleChange(e.target.value, null)} 
            />
        </div>
        <div className="column">
            <label className="form-label"  style={{ fontWeight: '600', marginBottom: '5px', display: 'block' }}>
                Peluquera</label>
            <select 
            className="form-control"
            value={peluqueraSelec} 
            onChange={(e) => handleChange(null, e.target.value)}
            >
            {peluqueras.map((nombre, index) => (
            <option key={index} value={nombre}>{nombre}</option>
            ))}
            </select>
          </div>
      </div>

      {/* CONTENEDOR GRILLA 2x2 */}
      <div className="summary-grid-2x2">
        
        {/* CAJA ARRIBA (2x1) - RESUMEN GENERAL TOTAL */}
        <div className="summary-container grid-col-span-2">
          <h4 className="summary-h4">Resumen General Mensual (Todo)</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <div className="summary-div-flex" style={{ padding: '4px 0' }}>
                <span>Subtotal Peluquería:</span>
                <span style={{ fontWeight: '500' }}>${data.total.peluqueria.toLocaleString('es-CL')}</span>
              </div>
              <div className="summary-div-flex" style={{ padding: '4px 0' }}>
                <span>Subtotal Productos:</span>
                <span style={{ fontWeight: '500' }}>${data.total.productos.toLocaleString('es-CL')}</span>
              </div>
              <div className="summary-div-flex" style={{ padding: '4px 0', borderTop: '1px solid #eee', marginTop: '5px' }}>
                <span>Total Bruto General:</span>
                <span style={{ fontWeight: '600' }}>${data.total.bruto.toLocaleString('es-CL')}</span>
              </div>
            </div>

            <div style={{ borderLeft: '1px dashed #6d76c7', paddingLeft: '15px' }}>
              <div className="summary-div-flex" style={{ padding: '4px 0' }}>
                <span>Asistieron:</span>
                <span>{data.total.asistieron}</span>
              </div>
              <div className="summary-div-flex" style={{ padding: '4px 0' }}>
                <span>Faltaron (No asistió):</span>
                <span>{data.total.faltaron}</span>
              </div>
              <div className="summary-div-flex" style={{ padding: '4px 0', marginTop: '5px' }}>
                <span>Tasa Asistencia:</span>
                <span style={{ fontWeight: '600' }}>{calcularAsistencia(data.total.asistieron, data.total.faltaron)}</span>
              </div>
            </div>
          </div>

          <hr style={{ border: '0', borderTop: '1px dashed #6d76c7', margin: '12px 0' }} />

          <div className="summary-div-flex" style={{ fontSize: '1.15rem' }}>
            <b>Total Líquido Estimado (Neto):</b>
            <b className="text-success">${data.total.neto.toLocaleString('es-CL')}</b>
          </div>
        </div>

        {/* CAJA ABAJO IZQUIERDA (1x1) - SOLO BAÑO */}
        <div className="summary-container">
          <h4 className="summary-h4" style={{ borderBottom: '2px solid #6d76c7', paddingBottom: '5px' }}>
            Citas: Solo Baño
          </h4>
          
          <div className="summary-div-flex" style={{ padding: '2px 0' }}>
            <span>Peluquería bruto:</span>
            <span>${data.solobano.peluqueriaBr.toLocaleString('es-CL')}</span>
          </div>

          <div className="summary-div-flex" style={{ padding: '2px 0' }}>
            <span>Monto Neto Líquido:</span>
            <span className="text-success" style={{ fontWeight: '600' }}>
              ${data.solobano.peluqueriaNe.toLocaleString('es-CL')}
            </span>
          </div>

          <hr style={{ border: '0', borderTop: '1px dashed #6d76c7', margin: '10px 0' }} />

          <div className="summary-div-flex" style={{ fontSize: '0.9rem', color: '#555' }}>
            <span>Asistencia Fiel:</span>
            <span>{data.solobano.asistieron} / {data.solobano.asistieron + data.solobano.faltaron}</span>
          </div>

          <div className="summary-div-flex" style={{ marginTop: '5px' }}>
            <b>Tasa Asistencia:</b>
            <b className="text-success">{calcularAsistencia(data.solobano.asistieron, data.solobano.faltaron)}</b>
          </div>
        </div>

        {/* CAJA ABAJO DERECHA (1x1) - NORMALES */}
        <div className="summary-container">
          <h4 className="summary-h4" style={{ borderBottom: '2px solid #6d76c7', paddingBottom: '5px' }}>
            Citas: Peluquería Normal
          </h4>
          
          <div className="summary-div-flex" style={{ padding: '2px 0' }}>
            <span>Peluquería Bruto:</span>
            <span>${data.normales.peluqueriaBr.toLocaleString('es-CL')}</span>
          </div>

          <div className="summary-div-flex" style={{ padding: '2px 0' }}>
            <span>Monto Neto Líquido:</span>
            <span className="text-success" style={{ fontWeight: '600' }}>
              ${data.normales.peluqueriaNe.toLocaleString('es-CL')}
            </span>
          </div>

          <hr style={{ border: '0', borderTop: '1px dashed #6d76c7', margin: '10px 0' }} />

          <div className="summary-div-flex" style={{ fontSize: '0.9rem', color: '#555' }}>
            <span>Asistencia Fiel:</span>
            <span>{data.normales.asistieron} / {data.normales.asistieron + data.normales.faltaron}</span>
          </div>

          <div className="summary-div-flex" style={{ marginTop: '5px' }}>
            <b>Tasa Asistencia:</b>
            <b className="text-success">{calcularAsistencia(data.normales.asistieron, data.normales.faltaron)}</b>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SummaryMonth;