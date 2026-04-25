import React from 'react';

const UserModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Ficha del Cliente</h3>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-content">
          <p><strong>Propietario:</strong> {user.nombre_usuario}</p>
          <p><strong>Teléfono:</strong> {user.telefono || 'No registrado'}</p>
          <p><strong>Email:</strong> {user.email || 'No registrado'}</p>
          <p><strong>Descripcion:</strong> {user.descripcion || 'No registrado'}</p>
          
          <span className="modal-hint">
            🐾 Mascota: {user.nombre_mascota || user.mascota}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserModal;