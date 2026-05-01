import { getCached,saveCache } from "./cache.js";
import { getGeminiResponse } from '../../services/geminiService.js';
import { notifyCatAlert } from "../../utils/notifier.js"

export async function handleMessage(t,hist,num) {

    const lastMsg = hist.findLast(msg => msg.role === 'model')?.parts[0].text; // ultimo mensaje de model
    

    const text = t
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // mayus tildes

    const ans = await isAnswer(lastMsg,text,num)
    if(ans) return ans

    // cache
    const cached = getCached(text);
    if (cached) return cached;

    // intención
    const intent = detectIntent(text);

    // respuestas directas
    const direct = handleIntent(intent);
    if (direct) return direct;

    // precio falta
    //const price = estimatePrice(text);
    //if (price) return price;

    // IA (último recurso)
    const aiResponse = await getGeminiResponse(hist);

    saveCache(text, aiResponse);

    return aiResponse;
}

async function isAnswer(last,t,num){
  const answerGatos = "Atendemos gatitos, pero tenemos que fijar horas especiales. Si gustas, te notifico a la brevedad cuándo podríamos agendar. ¿Estás de acuerdo?"
  if (last == answerGatos){
    if (/(si|bueno|claro|ya|parece|bien|dale|adelante|acuerdo)/.test(t)) {
      await notifyCatAlert(num,t); // notifica por grupo de telegram al telefono
      return "Muy bien, te notificaré para organizar una hora para tu/s gatito/s"
    }
    return "Entendí que no tomaremos una hora para tu gatito. Si tienes alguna otra consulta háblame cuando gustes"
  }
  return false;
}

function detectIntent(t) {

  if (/(gatito|gato|minino)/.test(t)) return "gato";
  if (/(precio|cuanto|vale|cuesta|monto)/.test(t)) return "price";
  if (/(hora|agenda|cita|reservar|atienden)/.test(t)) return "booking";
  if (/(hola|buenas)/.test(t)) return "greeting";
  if (/(direccion|donde)/.test(t)) return "addres";

  return "unknown"; 
}

function handleIntent(intent) {
  switch (intent) {
    case "gato":
      return "Atendemos gatitos, pero tenemos que fijar horas especiales. Si gustas, te notifico a la brevedad cuándo podríamos agendar. ¿Estás de acuerdo?"
    case "greeting":
      return `¡Hola! Bienvenid@ a Peluqueria Boutique 🐾. Soy el asistente virtual de la peluquería.
              Puedo ayudarte a agendar una cita, consultar precios o enviarte nuestra ubicación. ¿En qué puedo apoyarte hoy con tu perrito?`;

    case "booking":
      return `Puedes consultar horas displonible y agendar aquí: https://cal.com/nacho-3oejwr/15min 
              Si necesitas agendar para un gatito, avísame por acá`;

    case "price":
      return `
        Manejamos precios segun tamaño y tipo de pelo de los perros:
        - Perro Pequeño: (Poodle, Yorkie): $15.000.
        - Perro Mediano: (Cocker, Beagle): $20.000.
        - Perro Grande: (Labrador, Golden): $30.000.
        - nudos: recargo de $5.000).
        `;
    case "addres":
      return `Nuestra direccion es ${process.env.ADDRES}`
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


