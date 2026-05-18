import React, { useState, useEffect } from 'react';

const MascotaModal = ({ mascota, onClose, onUpdateNotes }) => {
  const [tempNotas, setTempNotas] = useState('');
  const [guardado, setGuardado] = useState(false);

  // Sincronizar el estado local cuando cambia el usuario seleccionado
  useEffect(() => {
    if (mascota) {
      setTempNotas(mascota.notas || '');
    }
  }, [mascota]);

  if (!mascota) return null;

  const handleSave = () => {
    onUpdateNotes(mascota.id_mascota, tempNotas);

    setGuardado(true);
    setTimeout(() => {setGuardado(false) ,onClose()}, 3000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div style={{paddingBottom: '0'}} className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Ficha de Mascota</h3> 
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-content">
          <div className="mb-3">
            <p><strong>Nombre:</strong> {mascota.nombre_mascota}</p>
            <p><strong>Propietario:</strong> {mascota.nombre_usuario}</p>
            <p>
              <strong>Teléfono:</strong> {mascota.telefono || 'No registrado'}
            </p>
          </div>

          <span className="modal-hint">
            <label><strong style={{paddingLeft: '10px'}}>Notas de la Mascota:</strong></label>
            <textarea 
              className="form-control" 
              rows="4"
              value={tempNotas}
              onChange={(e) => setTempNotas(e.target.value)}
              placeholder="Alergias, comportamiento, cortes preferidos..."
            />
          </span>

          <div style={{display: 'flex', justifyContent: 'center'}}>
            <button 
              style={{
                margin: '40px',
                backgroundColor: guardado ? '#28a745' : '', // Verde si está guardado
                color: guardado ? 'white' : '',
                transition: 'all 0.3s ease' // Suaviza el cambio de color
              }} 
              onClick={handleSave}
              disabled={guardado}
            >
              {guardado ? '✓ Guardado' : 'Guardar Notas'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MascotaModal;