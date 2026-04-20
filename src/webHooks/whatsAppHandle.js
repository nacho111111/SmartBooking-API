
export const sendWhatsApp = async (telefono, nombre, fechaISO) => {
    //console.log(telefono + " " +  nombre)

    const fechaHora = new Date(fechaISO);

    const hora = fechaHora.toLocaleTimeString('es-CL', { // transforma  hora legible
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    const fecha = fechaHora.toLocaleDateString('es-CL', { // transforma fecha legible 
        day: 'numeric',
        month: 'long'
    });

    const token = process.env.WHATSAPP_TOKEN;
    const phone_id = process.env.PHONE_NUMBER_ID;

    const url = `https://graph.facebook.com/v21.0/${phone_id}/messages`;
    
    const config = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const body = 
    {
        "messaging_product": "whatsapp",
        "to": `${telefono}`,
        "type": "template",
        "template": {
            "name": "recordatorio_cita_2",
            "language": {
            "code": "es_CL"
            },
            "components": [
            {
                "type": "header",
                "parameters": [
                {
                    "type": "image",
                    "image": {
                    "link": "https://i.imgur.com/MDvYNZm.jpeg"
                    }
                }
                ]
            },
            {
                "type": "body",
                "parameters": [
                {
                    "type": "text",
                    "text": `${nombre}`
                },
                {
                    "type": "text",
                    "text": `${fecha}`
                },
                {
                    "type": "text",
                    "text": `${hora}`
                }
                ]
            }
            ]
        }

    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: config,
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Error WhatsApp: ${data.error?.message || response.statusText}`);
        }

        return data;
    } catch (error) {
        console.error("Fallo al enviar WhatsApp:", error.message);
    }
};

