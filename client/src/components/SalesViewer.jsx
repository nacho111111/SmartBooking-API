import React, { useState, useEffect } from 'react';

const FacturasList = ({ data, getFacturas, loading}) => {
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [peluqueraFiltro, setPeluqueraFiltro] = useState('');
  const [usuarioFiltro, setusuarioFiltro] = useState('');

  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  const totalPaginas = Math.ceil(data.total / itemsPorPagina) || 1;
  const facturas = data.facturas;

  //Paginación o Filtros 
  useEffect(() => {
    // mínimo 3 letras, o vacío para resetear
    const queryFechaValida = fechaFiltro.length === 0 || fechaFiltro.length === 10;
    const queryPeluqueraValida = peluqueraFiltro.length === 0 || peluqueraFiltro.length >= 3;
    const queryUsuarioValida = usuarioFiltro.length === 0 || usuarioFiltro.length >= 3;

    if ( queryFechaValida && queryPeluqueraValida && queryUsuarioValida) {
      // rangos numéricos "desde" y "hasta" 
      const desde = (paginaActual - 1) * itemsPorPagina + 1;
      const hasta = paginaActual * itemsPorPagina;

      // filtros req.query
      const filtros = {};
      if (fechaFiltro.length === 10) filtros.hora_atencion = fechaFiltro;
      if (peluqueraFiltro.length >= 3) filtros.peluquera = peluqueraFiltro;
      if (usuarioFiltro.length >= 3) filtros.nombre_usuario = usuarioFiltro;

      //fetch
      getFacturas(desde, hasta, filtros);
    }
  }, [paginaActual, fechaFiltro, peluqueraFiltro, usuarioFiltro]); 

  const handleSwapPage = (val) => {
    const proxima = paginaActual + val;
    if (proxima >= 1 && proxima <= totalPaginas) {
      setPaginaActual(proxima);
    }
  };
 
  const handleFechaChange = (e) => {
    setFechaFiltro(e.target.value);
    setPaginaActual(1);
  };
  const handlePeluqueraChange = (e) => {
    setPeluqueraFiltro(e.target.value);
    setPaginaActual(1);
  };
  const handleUsuarioChange = (e) => {
    setUsuarioFiltro(e.target.value);
    setPaginaActual(1);
  };

  const indicePrimerItem = (paginaActual - 1) * itemsPorPagina;

  return (
    <div>
      <h4 className="mb-4">Historial de Facturación</h4>

      <div className="row mb-4">
        <div className="col-md-3">
          <label className="form-label">Fecha:</label>
          <input 
            type="date" 
            className="form-control" 
            value={fechaFiltro} 
            onChange={handleFechaChange} 
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Peluquera:</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Buscar..." 
            value={peluqueraFiltro} 
            onChange={handlePeluqueraChange} 
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Usuario:</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Buscar..." 
            value={usuarioFiltro} 
            onChange={handleUsuarioChange} 
          />
        </div>
      </div>

      {/* --- TABLA --- */}
      <div className="table-responsive">
        <table className="table-list table-hover">
          <thead className="table-light">
            <tr>
              <th>Fecha/Hora</th>
              <th>Usuario</th>
              <th>Mascota</th>
              <th>Asistió</th>
              <th>Peluquera</th>
              <th>Peluqueria</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Pago</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
            /* Estado de carga */
            <tr>
              <td colSpan="9" className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando mascotas...</span>
                </div>
                <p className="text-muted mt-2 mb-0">Buscando en el servidor...</p>
              </td>
            </tr>
          ) : facturas && facturas.length > 0 ? (
              facturas.map((f, i) => (
                <tr key={i}>
                  <td>{new Date(f.hora_atencion).toLocaleDateString('es-CL')}</td>
                  <td>{f.nombre_usuario}</td>
                  <td>{f.nombre_mascota}</td>
                  <td>
                    {f.asistio === true && <span className="badge bg-success">Sí</span>}
                    {f.asistio === false && <span className="badge bg-danger">No</span>}
                  </td>
                  <td>{f.peluquera}</td>
                  <td className="fw-bold">${f.total_peluqueria.toLocaleString('es-CL')}</td>
                  <td className="fw-bold">${f.total_productos.toLocaleString('es-CL')}</td>
                  <td className="fw-bold">${f.total_final.toLocaleString('es-CL')}</td>
                  <td><span className="badge bg-info text-dark">{f.tipo_pago}</span></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center text-muted p-4">
                  No se encontraron mascotas con esos criterios.
                </td>
            </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- CONTROLES DE PAGINACIÓN --- */}
      {totalPaginas > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="text-muted small">
            Mostrando {indicePrimerItem + 1} a {indicePrimerItem + facturas.length} de {data.total} facturas
          </div>
          
          <nav>
            <ul className="pagination mb-0">
              <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handleSwapPage(- 1)} disabled={paginaActual === 1}>
                  Anterior
                </button>
              </li>
              
              <li className="page-item disabled">
                <span className="page-link text-dark">
                  Página {paginaActual} de {totalPaginas}
                </span>
              </li>

              <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handleSwapPage(1) } disabled={paginaActual === totalPaginas}>
                  Siguiente
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default FacturasList;