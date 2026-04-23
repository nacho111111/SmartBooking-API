import { headersConfig } from "./whatsAppHeaders.js"

export const whatsAppAnswers = async (req, res) => {
    const body = req.body;

    //  Verificación básica
    if (body.object !== 'whatsapp_business_account') {
        return res.sendStatus(404);
    }

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0]?.value;

    // es un mensaje nuevo del usuario ??
    // entry.changes.value.messages.text = exist?,

    if (changes?.messages && changes.messages.length > 0) {
        const message = changes.messages[0];

        if (message.type === 'text') {
            
            const texto = message.text?.body;
            const number = message.from; // Teléfono del usuario

            console.log(`Mensaje de ${number}: ${texto}`);

            answers(number);
        } else {
            console.log("Llegó algo que no es texto, tipo:", message.type);
        }
    }   
    res.status(200).send('EVENT_RECEIVED');
};

const answers = async (number) => {
    const  {config, url }= headersConfig();
    const body = {
        "messaging_product": "whatsapp",
        "to": number,
        "type": "text",
        "text": {
            "body": "¡Hola! 👋 \nEste es un número automático solo para recordatorios. \nPara conversar conmigo, escríbeme aquí: \n👉 https://wa.me/56963926122"
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
