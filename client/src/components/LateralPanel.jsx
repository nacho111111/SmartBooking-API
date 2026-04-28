import React, { useState } from 'react';
//import FacturasList from './FacturasList'; // El componente que creamos antes

const FacturacionDashboard = ({ options , activeTab}) => {

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const selectOption = (tab) => {
        options(tab)
        setIsSidebarOpen(false);
    };
    // --- ESTILOS EN LÍNEA (CSS-in-JS) ---
  const styles = {
    dashboard: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f4f7f6',
      position: 'relative',
      overflowX: 'hidden',
    },
    menuBtn: {
      position: 'fixed',
      left: '20px',
      top: '20px',
      zIndex: 1200,
      width: '50px',
      height: '50px',
      borderRadius: '12px',
      border: 'none',
      backgroundColor: '#2c3e50',
      color: 'white',
      fontSize: '20px',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
    },
    sidebar: {
      position: 'fixed',
      left: isSidebarOpen ? '0' : '-310px',
      top: 0,
      width: '280px',
      height: '100%',
      backgroundColor: '#1a252f', // Azul oscuro profesional
      color: 'white',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      zIndex: 1100,
      padding: '80px 15px 20px 15px', // Espaciado interno
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    sidebarBtn: (isActive) => ({
      width: '100%', // Usa todo el espacio lateral
      padding: '12px 20px',
      borderRadius: '8px',
      border: 'none',
      backgroundColor: isActive ? '#3498db' : 'transparent',
      color: 'white',
      textAlign: 'left',
      fontSize: '16px',
      fontWeight: isActive ? '600' : '400',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      transition: 'all 0.2s ease',
      outline: 'none',
    }),
    main: {
      flexGrow: 1,
      padding: '40px',
      marginLeft: isSidebarOpen && window.innerWidth > 992 ? '280px' : '0',
      marginTop: '60px',
      transition: 'margin-left 0.4s ease',
      display: 'flex',
      justifyContent: 'center',
    },
    contentCard: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '30px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
      width: '100%',
      maxWidth: '1200px',
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(3px)',
      zIndex: 1000,
      display: isSidebarOpen ? 'block' : 'none',
    }
  };
  

  return (
    <div style={styles.dashboard}>
      {/* Botón Hamburguesa */}
      <button 
        style={{
          ...styles.menuBtn,
          backgroundColor: isSidebarOpen ? '#e74c3c' : '#2c3e50'
        }} 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? '✕' : '☰'}
      </button>

      {/* Overlay para móviles */}
      <div style={styles.overlay} onClick={() => setIsSidebarOpen(false)} />

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h5 style={{ padding: '0 20px 20px', borderBottom: '1px solid #34495e', marginBottom: '10px', color: '#bdc3c7' }}>
          MENÚ PRINCIPAL
        </h5>
        
        <button 
          style={styles.sidebarBtn(activeTab === 'factura')}
          onClick={() => selectOption('factura')}
          onMouseEnter={(e) => !activeTab.includes('factura') && (e.target.style.backgroundColor = '#2c3e50')}
          onMouseLeave={(e) => !activeTab.includes('factura') && (e.target.style.backgroundColor = 'transparent')}
        >
          <span style={{ fontSize: '20px' }}>📊</span> Panel Facturación
        </button>

        <button 
          style={styles.sidebarBtn(activeTab === 'filtros')}
          onClick={() => selectOption('filtros')}
          onMouseEnter={(e) => activeTab !== 'filtros' && (e.target.style.backgroundColor = '#2c3e50')}
          onMouseLeave={(e) => activeTab !== 'filtros' && (e.target.style.backgroundColor = 'transparent')}
        >
          <span style={{ fontSize: '20px' }}>🔍</span> Búsqueda Avanzada
        </button>

        <button 
          style={styles.sidebarBtn(activeTab === 'whatsApp')}
          onClick={() => selectOption('whatsApp')}
          onMouseEnter={(e) => activeTab !== 'whatsApp' && (e.target.style.backgroundColor = '#2c3e50')}
          onMouseLeave={(e) => activeTab !== 'whatsApp' && (e.target.style.backgroundColor = 'transparent')}
        >
          <span style={{ fontSize: '20px' }}>✅</span> WhatsApp
        </button>
      </div>

      {/* Overlay para cerrar el menú haciendo clic fuera (opcional) */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 1000
          }}
        />
      )}
    </div>
  );
};

export default FacturacionDashboard;