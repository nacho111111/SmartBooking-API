import React, { useState, useEffect } from 'react';

const MascotasConsultor = ({ data, getMascotas, loading, onSelectMascota }) => {
  const [usuarioFiltro, setUsuarioFiltro] = useState('');
  const [mascotaFiltro, setMascotaFiltro] = useState('');

  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  const totalPaginas = Math.ceil(data.total / itemsPorPagina) || 1;
  const mascotas = data.mascotas;

  //Paginación o Filtros 
  useEffect(() => {
    // mínimo 3 letras, o vacío para resetear
    const queryUsuarioValida = usuarioFiltro.length === 0 || usuarioFiltro.length >= 3;
    const queryMascotaValida = mascotaFiltro.length === 0 || mascotaFiltro.length >= 3;

    if (queryUsuarioValida && queryMascotaValida) {
      // rangos numéricos "desde" y "hasta" 
      const desde = (paginaActual - 1) * itemsPorPagina + 1;
      const hasta = paginaActual * itemsPorPagina;

      // filtros req.query
      const filtros = {};
      if (usuarioFiltro.length >= 3) filtros.nombre_usuario = usuarioFiltro;
      if (mascotaFiltro.length >= 3) filtros.nombre_mascota = mascotaFiltro;

      //fetch
      getMascotas(desde, hasta, filtros);
    }
  }, [paginaActual, usuarioFiltro, mascotaFiltro]); 

  // Handler para cambiar de página
  const handleSwapPage = (val) => {
    const proxima = paginaActual + val;
    if (proxima >= 1 && proxima <= totalPaginas) {
      setPaginaActual(proxima);
    }
  };

  const handleUsuarioChange = (e) => {
    setUsuarioFiltro(e.target.value);
    setPaginaActual(1);
  };

  const handleMascotaChange = (e) => {
    setMascotaFiltro(e.target.value);
    setPaginaActual(1);
  };

  // Índices visuales para el texto "Mostrando X a Y"
  const indicePrimerItem = (paginaActual - 1) * itemsPorPagina;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <h3 className="mb-4">Consultor de Mascotas</h3>
      </div>

      {/* --- INPUTS DE FILTRADO --- */}
      <div style={{ gap: '0', justifyContent: 'space-around' }} className="row mb-4">
        <div className="column col-md-4">
          <label className="form-label">Dueño</label>
          <input
            type="text"
            className="form-control"
            placeholder="mín. 3 letras..."
            value={usuarioFiltro}
            onChange={handleUsuarioChange}
          />
        </div>
        <div className="column col-md-4">
          <label className="form-label">Mascota</label>
          <input
            type="text"
            className="form-control"
            placeholder="mín. 3 letras..."
            value={mascotaFiltro}
            onChange={handleMascotaChange}
          />
        </div>
      </div>

      {/* --- TABLA DE DATOS / LOADING --- */}
      <table className="table-list">
        <thead>
          <tr>
            <th>Dueño</th>
            <th>Teléfono</th>
            <th>Mascota</th>
            <th>Notas</th>
          </tr>
        </thead>
        <tbody style={{ position: 'relative' }}>
          {loading ? (
            /* Estado de carga */
            <tr>
              <td colSpan="4" className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando mascotas...</span>
                </div>
                <p className="text-muted mt-2 mb-0">Buscando en el servidor...</p>
              </td>
            </tr>
          ) : mascotas && mascotas.length > 0 ? (
            /* Render de datos reales que vienen del backend */
            mascotas.map((m, i) => (
              <tr
                key={m.id_mascota || i}
                onClick={() => onSelectMascota(m)}
                style={{ cursor: 'pointer' }}
              >
                <td>{m.nombre_usuario}</td>
                <td>{m.telefono}</td>
                <td>{m.nombre_mascota}</td>
                <td>{m.notas || 'Sin notas adicionales'}</td>
              </tr>
            ))
          ) : (
            /* Tabla vacía */
            <tr>
              <td colSpan="4" className="text-center text-muted p-4">
                No se encontraron mascotas con esos criterios.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* --- CONTROLES DE PAGINACIÓN --- */}
      {!loading && totalPaginas > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="text-muted small">
            Mostrando {indicePrimerItem + 1} a {indicePrimerItem + mascotas.length} de {data.total} mascotas
          </div>

          <nav>
            <ul className="pagination mb-0">
              <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handleSwapPage(-1)} disabled={paginaActual === 1}>
                  Anterior
                </button>
              </li>

              <li className="page-item disabled">
                <span className="page-link text-dark">
                  Página {paginaActual} de {totalPaginas}
                </span>
              </li>

              <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handleSwapPage(1)} disabled={paginaActual === totalPaginas}>
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

export default MascotasConsultor;