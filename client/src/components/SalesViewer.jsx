import React, { useState, useMemo } from 'react';

const FacturasList = ({ data }) => {
  // 1. Estados de Filtros
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [peluqueraFiltro, setPeluqueraFiltro] = useState('');
  const [usuarioFiltro, setusuarioFiltro] = useState('');

  // 2. Estados de Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10; // Puedes cambiar esto a 15 o 20

    
  const handleSwapPage = (val) => {
    const proxima = paginaActual + val;
    if (proxima >= 1 && proxima <= totalPaginas) setPaginaActual(proxima);
  }
  // 3. Filtrado de datos
  const filteredFacturas = useMemo(() => {
    // Resetear a la página 1 cuando se filtra algo
    setPaginaActual(1); 
    
    return data.filter(f => {
      const matchesDate = !fechaFiltro || f.hora_atencion.includes(fechaFiltro);
      const matchesPeluquera = !peluqueraFiltro || 
        f.peluquera?.toLowerCase().includes(peluqueraFiltro.toLowerCase());
      const matchesusuario = !usuarioFiltro || 
        f.nombre_usuario?.toLowerCase().includes(usuarioFiltro.toLowerCase());

      return matchesDate && matchesPeluquera && matchesusuario;
    });
  }, [data, fechaFiltro, peluqueraFiltro, usuarioFiltro]);

  // 4. Lógica de Paginación (Corte de la lista)
  const totalPaginas = Math.ceil(filteredFacturas.length / itemsPorPagina);
  const indiceUltimoItem = paginaActual * itemsPorPagina;
  const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
  const itemsPaginados = filteredFacturas.slice(indicePrimerItem, indiceUltimoItem);

  return (
    <div className="container-fluid">
      <h4 className="mb-4">Historial de Facturación</h4>

      {/* --- FILTROS (Igual que antes) --- */}
      <div className="row mb-4">
        <div className="col-md-3">
          <label className="form-label">Fecha:</label>
          <input type="date" className="form-control" value={fechaFiltro} onChange={(e) => setFechaFiltro(e.target.value)} />
        </div>
        <div className="col-md-3">
          <label className="form-label">Peluquera:</label>
          <input type="text" className="form-control" placeholder="Buscar..." value={peluqueraFiltro} onChange={(e) => setPeluqueraFiltro(e.target.value)} />
        </div>
        <div className="col-md-3">
          <label className="form-label">Usuario:</label>
          <input type="text" className="form-control" placeholder="Buscar..." value={usuarioFiltro} onChange={(e) => setusuarioFiltro(e.target.value)} />
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
            {itemsPaginados.length > 0 ? (
              itemsPaginados.map((f, i) => (
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
              <tr><td colSpan="5" className="text-center text-muted p-4">No hay registros.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- CONTROLES DE PAGINACIÓN --- */}
      {totalPaginas > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="text-muted small">
            Mostrando {indicePrimerItem + 1} a {Math.min(indiceUltimoItem, filteredFacturas.length)} de {filteredFacturas.length} facturas
          </div>
          
          <nav>
            <ul className="pagination mb-0">
              <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handleSwapPage(- 1)}>
                  Anterior
                </button>
              </li>
              
              <li className="page-item disabled">
                <span className="page-link text-dark">
                  Página {paginaActual} de {totalPaginas}
                </span>
              </li>

              <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handleSwapPage( + 1)}>
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