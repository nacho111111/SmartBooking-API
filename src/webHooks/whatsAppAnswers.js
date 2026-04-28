import { saveMessage, getChatHistory, clearHistory } from '../models/ChatHistory.js';
import { sendWhatsAppMessage } from "../external/whatsAppClient.js"
import { getGeminiResponse } from '../services/geminiService.js';

export const whatsAppAnswers = async (req, res) => {
    const body = req.body;

    //  Verificación básica
    if (body.object !== 'whatsapp_business_account') {
        return res.sendStatus(404);
    }
    res.status(200).send('EVENT_RECEIVED');
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0]?.value;

    if (!(changes?.messages && changes.messages.length > 0)) return // si no hay mensaje se ignora

    const message = changes.messages[0];

    if (!(message.type === 'text')) return // si no hay texto lo ignora
    
    const text = message.text?.body;
    const num = message.from; // Teléfono del usuario

    console.log(`Mensaje de ${num}: ${texto}`);

    const contexto = `
        Precios base:
        Perro Pequeño (Poodle, Yorkie): $15.000.
        Perro Mediano (Cocker, Beagle): $20.000.
        Perro Grande (Labrador, Golden): $30.000.
        Nota: El precio final depende del estado del pelaje (nudos tienen recargo de $5.000).
        `;

    const context = `CONTEXTO: ${contexto}\n\nMENSAJE USUARIO: ${text}`;
    const hist = await getChatHistory(num);
    const resp = await getGeminiResponse(context, hist);

    await saveMessage(num, 'user', text);
    await saveMessage(num, 'model', resp);

    console.log(resp)

    await sendWhatsAppMessage(num, resp);
};

const answers = async (number) => {
    const bodyResponse = "¡Hola! 👋 \nEste es un número automático solo para recordatorios. \nPara conversar conmigo, escríbeme aquí: \n👉 https://wa.me/56963926122"
    sendWhatsAppMessage(number, bodyResponse)
};  

