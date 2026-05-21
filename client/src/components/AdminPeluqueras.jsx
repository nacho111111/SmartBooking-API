import React, { useState } from 'react';

export default function AdminPeluqueras({ listPeluqueras,addPeluquera, deletePeluquera }) {
  const [nuevoNombre, setNuevoNombre] = useState('');

  return (
    <div className='left'>
        <h4 style={{fontSize: '1.1rem'}}>
            Administrar Peluqueras
        </h4>

        {/* Formulario para agregar */}
        <form onSubmit={(e) => {
            e.preventDefault();
            addPeluquera(nuevoNombre);
            setNuevoNombre('');
        }} 
        style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <input 
          type="text"
          className="form-control"
          placeholder="Nombre de la estilista..."
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          style={{ fontSize: '0.9rem' }}
        />
        <button type="submit" className="btn btn-primary btn-sm">Agregar</button>
      </form>

      {/* Lista visual de las peluqueras actuales con opción de borrar */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {listPeluqueras.map((nombre, idx) => (
          <li 
            key={idx} 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '8px 4px',
              borderBottom: '1px solid #f0f0f0',
              fontSize: '0.95rem',
            }}
          >
            <span>{nombre}</span>
            <button 
              onClick={() => deletePeluquera(nombre)}
              style={{
                background: 'none',
                border: 'none',
                color: '#dc3545',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 'bold'
              }}
              title="Eliminar peluquera"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}