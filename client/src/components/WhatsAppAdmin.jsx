import React, { useState, useEffect, useRef } from 'react';

const WhatsAppAdmin = ({contacts, handleGetMessages, msgsMore, loading, sendMsg, setSelectedContact, selectedContact, handleBotState}) => {
  
  const [newMessage, setNewMessage] = useState(""); // mensaje a enviar
  const messagesRef = useRef(null);

  // contacts = { whatsapp_number, numbre_usuario}
  // msgMore = {
  //  nombre_usuario, bot_active, telefono, 
  //  messages:[
  //      {role, content, create_at},{role, content, create_at},...
  //  ]
  //}
 
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    //console.log(`Enviando a ${selectedContact}: ${newMessage}`);
    sendMsg(selectedContact, newMessage);
    // Limpiar el input después de enviar
    setNewMessage("");
  };

  //Cargar mensajes cuando cambia el contacto seleccionado
  useEffect(() => {
    if (selectedContact) {
      handleGetMessages(selectedContact);
    }
  }, [selectedContact]);
  // useEffect(() => {
  //   console.log(msgsMore)
  // }, [msgsMore])

  useEffect(() => {
    const el = messagesRef.current;

    if (!el) return;

    const isNearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 100;

    if (isNearBottom || el.scrollTop == 0) {
      el.scrollTop = el.scrollHeight;
    }
  }, [msgsMore?.messages, loading]);

  // main min-height: 100vh position: relative
  // div position: absolute, top:50%, left:50%, transform traslate (-50%,-50%)

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
      height: '100%',
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
    },
    // ... tus estilos anteriores ...
    inputArea: {
      padding: '10px 16px',
      backgroundColor: '#f0f2f5',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      borderTop: '1px solid #d1d5db'
    },
    input: {
      flex: 1,
      padding: '10px 15px',
      borderRadius: '8px',
      border: 'none',
      outline: 'none',
      fontSize: '15px',
      color: '#334155',
      backgroundColor: '#ffffff'
    },
    sendButton: {
      backgroundColor: '#00a884', // Verde WhatsApp
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
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
              <p style={{ margin: 0, fontWeight: 600, color: '#6b7280'}}>{contact.nombre_usuario}</p>
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
              <p style={{ margin: 0, fontWeight: 'bold', color: "#535b63" }}>+{selectedContact}</p>
            </div>

            {/* Área de Mensajes */}
            <div ref={messagesRef} style={styles.messagesArea}>
              {msgsMore?.messages?.map((msg, index) => {
                const isModel = msg.role === 'model';
                return (
                  <div key={index} style={styles.bubble(isModel)}>
                    <p style={{ margin: 0, fontSize: '14px' }}>{msg.content}</p>
                    <p style={styles.time}>
                      {(() => {
                      
                        const dateStr = typeof msg.created_at === 'string' 
                          ? msg.created_at.replace(' ', 'T') 
                          : msg.created_at;
                        return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      })()
                      }
                    </p>
                  </div>
                );
              })}
              {loading && <p style={{ textAlign: 'center', color: '#6b7280' }}>Cargando...</p>}
            </div>

            {/* --- NUEVA ÁREA DE INPUT --- */}
            <div style={styles.inputArea}>
              {msgsMore.bot_active ? (
                /* ESTADO: TICKET CERRADO (BOT PRENDIDO) */
                <button 
                  onClick={() => handleBotState(false)} 
                  style={styles.startTicketButton}
                >
                  Ticket Cerrado - Iniciar Atención Humana
                </button>
              ) : (
                /* ESTADO: TICKET ABIERTO (BOT APAGADO) */
                <>
                  <button 
                    onClick={() => handleBotState(true)} 
                    style={styles.robotButton}
                    title="Cerrar ticket y reactivar Bot"
                  >
                    🤖
                  </button>
                  
                  <input
                    type="text"
                    placeholder="Escribe un mensaje..."
                    style={styles.input}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  
                  <button 
                    onClick={handleSendMessage}
                    style={styles.sendButton}
                  >
                    ➤
                  </button>
                </>
              )}
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
}

export default WhatsAppAdmin;