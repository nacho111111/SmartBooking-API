# SmartBooking API — Sistema Transaccional de Citas y Automatización de Mensajería

### Tecnologías

- Node.js
- Express.js
- PostgreSQL
- React
- Socket.IO
- WhatsApp Business API
- Cal.com Webhooks

### Funcionalidades

- Gestión de citas sincronizadas con Cal.com
- Registro y conciliación diaria de caja
- Facturación y control de ventas
- Recordatorios automáticos por WhatsApp
- Chatbot bidireccional
- Actualización en tiempo real mediante WebSockets
- Persistencia transaccional en PostgreSQL

### Frontend

Aplicación React para:

- Gestión de citas
- Administración de ventas
- Seguimiento de mensajes
- Control diario de caja
- Actualización en tiempo real mediante Socket.IO

---

### Descripción del Proyecto

Este proyecto nace como una solución tecnológica a medida para la optimización y automatización de procesos operativos en el sector de servicios estéticos de mascotas (Peluquería Canina). El objetivo principal es eliminar la carga operativa de tareas repetitivas y críticas mediante el desarrollo de un ecosistema digital eficiente y conectado.

El sistema unifica tres pilares fundamentales del negocio en una sola API robusta:

* **Gestión y Persistencia de Datos:**  Procesamiento y consulta optimizada de bases de datos para el control de citas, historiales de mascotas y clientes de forma persistente y segura.

* **Conciliación Financiera:**  Automatización del flujo de caja diario, registrando de manera integrada las ventas de productos, cobros de servicios e información varia.

* **Integración con WhatsApp Business y Webhooks:**  Integración de flujos de trabajo basados en eventos (Event-Driven Architecture) mediante el consumo de Webhooks de plataformas como Cal.com y la API de WhatsApp Business (Meta).

Gracias a este motor de integraciones, el sistema gestiona recordatorios de asistencia automáticos, procesa respuestas del chatbot bidireccional y ofrece un panel de administración de mensajería en tiempo real. Como resultado directo, se reduce drásticamente la complejidad operativa y el tiempo de gestión diaria, permitiendo al negocio enfocarse en la calidad de su servicio técnico.


### Arquitectura

![Arquitectura](https://github.com/nacho111111/SmartBooking-API/blob/main/architecture.png)

---

### Demostración app

![Demostración de la App](https://github.com/nacho111111/SmartBooking-API/blob/main/demo.gif)

---

### Evolución del Sistema: De MVP (No-Code) a Arquitectura Propia

En su primera fase, el negocio operaba mediante un Producto Mínimo Viable (MVP) construido en Make.com (Integromat) y google sheets. Esta automatización inicial gestionaba de forma provisional los recordatorios de WhatsApp, el flujo de caja y el almacenamiento de datos en estructuras temporales.

#### ¿Por qué se migró a este desarrollo a medida?
A medida que el volumen de citas y transacciones de la peluquería canina creció, la solución No-Code comenzó a presentar limitaciones críticas: falta de transaccionalidad atómica en las finanzas, rigidez en las consultas de base de datos y un aumento exponencial en los costos operativos de la plataforma de automatización.

**Link de estructura del sistema MVP:** [Visita del sistema MVP](https://github.com/nacho111111/event-driven-appointment-automation)

#### Impacto de la actualización:
Se opto por Diseñar y programar una Application Full Stack en Node.js, Express, React y PostgreSQL para reemplazar por completo la infraestructura de Make.com. Al centralizar la lógica en código propio, se logró:

* **Consistencia Financiera:** Control absoluto sobre los datos mediante transacciones SQL (BEGIN/COMMIT), algo imposible de asegurar en flujos No-Code lineales.

* **Reducción de Costos:** Eliminación total del pago de suscripciones y cuotas de tareas de plataformas de automatización de terceros.

* **Flexibilidad y Control:** Capacidad de implementar consultas dinámicas avanzadas y comunicación bidireccional en tiempo real con WebSockets.


---

### Configuración Local 

Debido a que el sistema depende críticamente de Webhooks en producción (Meta/WhatsApp Business API y Cal.com), la ejecución local requiere herramientas de tunelización como Ngrok para exponer los puertos locales.

Clonar el repositorio:

```bash
git clone https://github.com/nacho111111/SmartBooking-API.git
cd SmartBooking-API

```
Instalar dependencias:
```bash
npm install
```
Configurar Variables de Entorno:
Crea un archivo .env en la raíz basado en el archivo de ejemplo adjunto .env.example.

---

###  Arquitectura y Seguridad
El backend está diseñado bajo principios de resiliencia, modularidad y seguridad informática exigidos en entornos de producción cloud:

* **Persistencia Transaccional (ACID):** Las operaciones financieras (flujo de caja diario) y de control de agendas se ejecutan dentro de bloques transaccionales (BEGIN/COMMIT/ROLLBACK). Si una inserción masiva falla, el sistema realiza un rollback completo evitando la corrupción de datos.

* **Políticas de CORS Dinámicas:** El acceso a la API está restringido mediante una lista blanca (whitelist) configurable por entorno, protegiendo los endpoints de llamadas no autorizadas, permitiendo al mismo tiempo las conexiones de integración necesarias (como cal.com).

* **Seguridad de Sesión (Mitigación XSS/CSRF):** La autenticación se maneja mediante tokens inyectados en cookies con directivas estrictas (httpOnly: true, secure: true, sameSite: 'none'). Además, el servidor está configurado para operar de forma segura detrás de los proxies inversos de la infraestructura de Railway (trust proxy).

* **Middlewares de Control:** Implementación de un manejador global de excepciones (errorHandler) que centraliza las respuestas de error de la API, evitando la fuga de trazas internas del servidor (stack traces) al cliente.
