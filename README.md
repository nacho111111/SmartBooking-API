# SmartBooking API — Sistema Transaccional de Citas y Automatización de Mensajería

### Descripción del Proyecto

Este proyecto nace como una solución tecnológica a medida para la optimización y automatización de procesos operativos en el sector de servicios estéticos de mascotas (Peluquería Canina). El objetivo principal es eliminar la carga operativa de tareas repetitivas y críticas mediante el desarrollo de un ecosistema digital eficiente y conectado.

El sistema unifica tres pilares fundamentales del negocio en una sola API robusta:

* **Gestióny Persistencia de Datos:**  Procesamiento y consulta optimizada de bases de datos para el control de citas, historiales de mascotas y clientes de forma persistente y segura.

* **Conciliación Financiera:**  Automatización del flujo de caja diario, registrando de manera integrada las ventas de productos, cobros de servicios e información varia.

* **Comunicación Automatizada y Omnicanal:**  Integración avanzada de flujos de trabajo basados en eventos (Event-Driven Architecture) mediante el consumo de Webhooks de plataformas líderes como Cal.com y la API de WhatsApp Business (Meta).

Gracias a este motor de integraciones, el sistema gestiona recordatorios de asistencia automáticos, procesa respuestas del chatbot bidireccional y ofrece un panel de administración de mensajería en tiempo real. Como resultado directo, se reduce drásticamente la complejidad operativa y el tiempo de gestión diaria, permitiendo al negocio enfocarse en la calidad de su servicio técnico.

---

### Evolución del Sistema: De MVP (No-Code) a Arquitectura Propia

En su primera fase, el negocio operaba mediante un Producto Mínimo Viable (MVP) construido en Make.com (Integromat) y google sheets. Esta automatización inicial gestionaba de forma provisional los recordatorios de WhatsApp, el flujo de caja y el almacenamiento de datos en estructuras temporales.

#### ¿Por qué se migró a este desarrollo a medida?
A medida que el volumen de citas y transacciones de la peluquería canina creció, la solución No-Code comenzó a presentar limitaciones críticas: falta de transaccionalidad atómica en las finanzas, rigidez en las consultas de base de datos y un aumento exponencial en los costos operativos de la plataforma de automatización.

**Link de estructura del sistema MVP:** [Visita del sistema MVP](https://github.com/nacho111111/event-driven-appointment-automation)

#### Impacto de la actualización:
Se opto por Diseñar y programar una Application full satck en Node.js, Express, React y PostgreSQL para reemplazar por completo la infraestructura de Make.com. Al centralizar la lógica en código propio, se logró:

* **Consistencia Financiera:** Control absoluto sobre los datos mediante transacciones SQL (BEGIN/COMMIT), algo imposible de asegurar en flujos No-Code lineales.

* **Reducción de Costos:** Eliminación total del pago de suscripciones y cuotas de tareas de plataformas de automatización de terceros.

* **Flexibilidad y Control:** Capacidad de implementar consultas dinámicas avanzadas y comunicación bidireccional en tiempo real con WebSockets.


### Demostración en 5 Segundos

![Demostración de la App](https://github.com/nacho111111/SmartBooking-API/blob/main/demo.gif)

---

### El Reto Técnico y la Solución

* **El Problema:** Las herramientas actuales de gestión son lentas, colapsan con bases de datos grandes y no se adaptan correctamente a dispositivos móviles.
* **La Solución:** Diseñé una SPA (Single Page Application) optimizada con carga perezosa (*lazy loading*), paginación eficiente en el backend y una interfaz móvil-primero (*mobile-first*).
* **El Resultado:** La aplicación funciona de manera fluida en conexiones 3G lentas y obtuvo una puntuación de **95+/100 en rendimiento en Google Lighthouse**.

---

### Configuración Local 

variables de entorno
```bash
# data base
DB_USER
DB_HOST 
DB_PASSWORD 
DB_DATABASE 
DB_PORT 

# Requerimientos whatsapp business api
WHATSAPP_TOKEN 
PHONE_NUMBER_ID
WHATSAPP_VERIFY_TOKEN

# Dirección física y num telefono para recordatorios/mensajes
ADDRES
NUMPELU

# Telegram bot config
TELEGRAM_TOKEN
TELEGRAM_CHAT_ID

# Contraseña front to server y token para cookie de sesión única
PASS
AUTH_TOKEN_VALUE

# direccion URL del front y de cal.com
FRONTEND_URL
LINKAGENDA
```
