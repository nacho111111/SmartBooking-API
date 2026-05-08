import { saveMessage, getChatHistory, clearHistory} from '../models/ChatHistory.js';
import { sendWhatsAppMessage } from "../external/whatsAppClient.js"
import { handleMessage } from "../logic/questionSystem/index.js"
import { getBotActive, getUserByNum } from "../Services/dbService.js"
import { asyncHandler } from '../middlewares/asyncHandler.js';

export const whatsAppAnswers = asyncHandler(async (req, res) => {
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
    
    //console.log(`Mensaje de ${num}: ${text}`);
    
    // soket
    const size = req.io.sockets.sockets.size;
    if (size > 0){
        req.io.emit("nuevo_mensaje", {
            telefono: num,
            role: 'user',
            content: text,
            created_at: new Date()
        });
    }
    //  end soket

    await saveMessage(num, 'user', text);

    const active = await botActive(num,changes);

    if (!active) return // si no esta activo, crea usuario si no existe

    const hist = await getChatHistory(num);
    const resp = await handleMessage(text,hist,num);

    if (size > 0){
        req.io.emit("nuevo_mensaje", {
            telefono: num,
            role: 'model',
            content: resp,
            created_at: new Date()
        });
    }

    await saveMessage(num, 'model', resp);

    //console.log(resp)
    await sendWhatsAppMessage(num, resp);
});

const answers = async (number) => {
    const bodyResponse = "¡Hola! 👋 \nEste es un número automático solo para recordatorios. \nPara conversar conmigo, escríbeme aquí: \n👉 https://wa.me/-"
    sendWhatsAppMessage(number, bodyResponse)
};  

async function botActive(num,changes){
    const user = await getUserByNum(num);
    let id;
    if( !user ) {
        const name = changes.contact[0]?.profile?.name
        const newid = await setUser(num,name)
        id = newid;
    }
    else {
        id = user;
    }
    const active = await getBotActive(id)

    if(!active) return false // si esta inactivo 
    return true;
}
