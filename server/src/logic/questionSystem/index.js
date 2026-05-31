import { getCached, saveCache } from "./cache.js";
import { getGeminiResponse } from '../../Services/gemini.service.js';
import { notifyAlert } from "../../utils/notifier.js"

export async function handleMessage(t,hist,num) {

    const lastMsg = hist.findLast(msg => msg.role === 'model')?.parts[0].text; // ultimo mensaje de model
    
    const text = t
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // mayus tildes

    const ans = await isAnswer(lastMsg,text,num)
    if(ans) return ans

    // intención
    const intent = detectIntent(text);

    // respuestas directas
    const direct = await handleIntent(intent);
    if (direct) return direct;

    // precio falta
    //const price = estimatePrice(text);
    //if (price) return price;

    // cache
    // const cached = getCached(text);
    // if (cached) return cached;
    //  IA (último recurso)
    // const aiResponse = await getGeminiResponse(hist);

    // saveCache(text, aiResponse);

    return RESPONSES.NOT_RES;
}

const RESPONSES = {
  CAT_RES:"Atendemos gatitos, pero tenemos que fijar horas especiales. Si gustas, te notifico a la brevedad cuándo podríamos agendar. ¿Estás de acuerdo?",
  REM_RES: "Recordatorio automatico",
  CAN_RES: "Entendi que quieres cancelar la cita, ¿es correcto? si me confirmas enviare una notificacion a la peluquera",
  NOT_RES: `No he podido entender tu solicitud,\n si gustas puedo comunicarte con una persona, confirmame si es asi`
}
const intents = {
  si: /(si|bueno|claro|ya|parece|bien|dale|adelante|acuerdo|confirm)/,
  no: /(no|perdon|equivoque|error)/
};

async function isAnswer(last,t,num){
  switch(last){
    case RESPONSES.CAT_RES:
      if (intents.si.test(t)) {
      await notifyAlert("gato",num,t); // telegram
      return "Muy bien, te notificaré para organizar una hora para tu/s gatito/s"
      }
      return "Entendí que no tomaremos una hora para tu gatito. Si tienes alguna otra consulta háblame cuando gustes"

    case RESPONSES.REM_RES:
      if(/(si|bueno|ya|confirmo|confirmar|voy|listo)/.test(t)) return "Te esperamos"
      if(/(reagendar|cancelar|no|cambio)/.test(t)) return RESPONSES.CAN_RES
      
    case RESPONSES.CAN_RES:
      if(/(cancelar|si|anula|cancela|anular|confirmo|confirmar)/.test(t)) {
        await notifyAlert("cancelar cita",num,t)
        return "Esta bien, enviare una notificacion gracias por avisarnos, ¡saludos!"
      }
      if(/(no|perdon|equivoque|error)/.test(t)) return "Oh, entonces te esperamos, ¡saludos!"
    case RESPONSES.NOT_RES:
      if(intents.si.test(t)) {
        await notifyAlert("una persona quiere ayuda",num,t)
        return `Esta bien, enviare una notificacion y te hablaran a la brevedad, tambien puedes dejar la pregunta a este numero https://wa.me/${process.env.NUMPELU}`
      }
      if(intents.no.test(t)) return "Esta bien, si puedo ayudarte en alguna otra cosa aqui estoy, ¡saludos!"
  }   
  return false;
}

function detectIntent(t) {

  if (/(gatito|gato|minino)/.test(t)) return "gato";
  if (/(precio|cuanto|vale|cuesta|monto)/.test(t)) return "price";
  if (/(hora|agenda|cita|reservar|atienden)/.test(t)) return "booking";
  if (/(direccion|donde)/.test(t)) return "addres";
  if (/(hola|buenas|hol|ola|hello)/.test(t)) return "greeting";
  if (/(contacto|hablar|persona|ejecutivo)/.test(t)) return "contact" ;

  return "unknown"; 
}

async function handleIntent(intent) {
  switch (intent) {
    case "gato":
      return RESPONSES.CAT_RES
    case "greeting":
      return `¡Hola! Bienvenid@ a Peluqueria Boutique 🐾. Soy el asistente virtual de la peluquería.\n` +
              `¿En qué puedo apoyarte hoy con tu perrito?`;

    case "booking":
      return `Puedes consultar horas displonible y agendar aquí: ${process.env.LINKAGENDA}\n` +
              `Si necesitas agendar para un gatito, avísame por acá`;

    case "price":
      return `
        Manejamos precios segun tamaño y tipo de pelo de los perros:\n`+
        `- Perro Pequeño: (Poodle, Yorkie): $15.000.\n`+
        `- Perro Mediano: (Cocker, Beagle): $20.000.\n`+
        `- Perro Grande: (Labrador, Golden): $30.000.\n`+
        `- nudos: recargo de $5.000).`;
    case "addres":
      return `Nuestra direccion es ${process.env.ADDRES}`
    case "contact":
      await notifyAlert("Quiere hablar con una persona",num,t)
      return `Si quieres hablar con una persona puedes comunicarte a este numero https://wa.me/${process.env.NUMPELU}\n`+
             `ademas notificare igualmente para que te hablen cuanto antes, Saludos`
    default:
      return null;
  }
}

function estimatePrice(t) { // falta
    let total = 0;

    // cantidad de perros
    const countMatch = t.match(/\d+/);
    const count = countMatch ? parseInt(countMatch[0]) : 1;

    // tamaño
    if (/(poodle|yorkie|peque)/.test(t)) total += 15000;
    if (/(cocker|beagle|mediano)/.test(t)) total += 20000;
    if (/(labrador|golden|grande)/.test(t)) total += 30000;

    // pelo largo / nudos
    if (/(largo|nudos)/.test(t)) total += 5000;

    if (total === 0) return null;

    return `El precio aproximado sería $${total * count} CLP 🐕 (puede variar según el estado del pelaje).`;
}


