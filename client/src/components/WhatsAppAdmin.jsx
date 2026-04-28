import React, { useState, useEffect } from 'react';

const WhatsAppAdmin = ({contacts, handleMessages, messages, loading}) => {
  const [selectedContact, setSelectedContact] = useState(null);

  //Cargar mensajes cuando cambia el contacto seleccionado
  useEffect(() => {
    if (selectedContact) {
      handleMessages(selectedContact);
    }
  }, [selectedContact]);

const styles = {
    main1: {
        width: '125%',
        display: 'flex',
        justifyContent: 'center'
    },
    container: {
      display: 'flex',
      borderRadius: '8px',
      height: '84vh',
      width: '100vh',
      backgroundColor: '#f3f4f6',
      overflow: 'hidden',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    },
    sidebar: {
      width: '30%',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #d1d5db',
      display: 'flex',
      flexDirection: 'column'
    },
    sidebarHeader: {
      padding: '16px',
      backgroundColor: '#f9fafb',
      borderBottom: '1px solid #d1d5db',
      fontWeight: 'bold',
      fontSize: '20px',
      color: '#16a34a'
    },
    contactList: {
      flex: 1,
      overflowY: 'auto'
    },
    contactItem: (isSelected) => ({
      padding: '16px',
      cursor: 'pointer',
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: isSelected ? '#f0fdf4' : 'transparent',
      borderLeft: isSelected ? '4px solid #22c55e' : 'none',
      transition: 'background-color 0.2s'
    }),
    chatWindow: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#e5ddd5' // Fondo clásico de WhatsApp
    },
    chatHeader: {
      padding: '16px',
      backgroundColor: '#eeeeee',
      display: 'flex',
      alignItems: 'center',
      borderBottom: '1px solid #d1d5db'
    },
    avatar: {
      width: '40px',
      height: '40px',
      backgroundColor: '#9ca3af',
      borderRadius: '50%',
      marginRight: '12px'
    },
    messagesArea: {
      flex: 1,
      overflowY: 'auto',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    bubble: (isModel) => ({
      maxWidth: '70%',
      padding: '10px 14px',
      borderRadius: '8px',
      boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
      alignSelf: isModel ? 'flex-end' : 'flex-start',
      backgroundColor: isModel ? '#dcf8c6' : '#ffffff',
      color: '#1f2937',
      position: 'relative'
    }),
    time: {
      fontSize: '10px',
      color: '#6b7280',
      textAlign: 'right',
      marginTop: '4px'
    },
    noChat: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#6b7280',
      textAlign: 'center'
    }
  };

  return (
    <div style={styles.main1}>
    <div style={styles.container}>
      {/* LADO IZQUIERDO: Contactos */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>Chats SmartBooking</div>
        <div style={styles.contactList}>
          {contacts.map((contact) => (
            <div
              key={contact.whatsapp_number}
              onClick={() => setSelectedContact(contact.whatsapp_number)}
              style={styles.contactItem(selectedContact === contact.whatsapp_number)}
            >
              <p style={{ margin: 0, fontWeight: 600, color: "#272829" }}>+{contact.whatsapp_number}</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Ver conversación...
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* LADO DERECHO: Chat */}
      <div style={styles.chatWindow}>
        {selectedContact ? (
          <>
            <div style={styles.chatHeader}>
              <div style={styles.avatar}></div>
              <p style={{ margin: 0, fontWeight: 'bold' ,color: "#535b63"}}>+{selectedContact}</p>
            </div>

            <div style={styles.messagesArea}>
              {messages.map((msg, index) => {
                const isModel = msg.role === 'model';
                return (
                  <div key={index} style={styles.bubble(isModel)}>
                    <p style={{ margin: 0, fontSize: '14px' }}>{msg.content}</p>
                    <p style={styles.time}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                );
              })}
              {loading && <p style={{ textAlign: 'center', color: '#6b7280' }}>Cargando...</p>}
            </div>
          </>
        ) : (
          <div style={styles.noChat}>
            <div>
              <p style={{ fontSize: '20px', margin: 0 }}>Selecciona un chat para ver los mensajes</p>
              <p style={{ fontSize: '14px' }}>SmartBooking Admin Panel 🐾</p>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default WhatsAppAdmin;