import { setMensaje, getMensajesByNumber, clearHistoryByNumber} from "../Services/dbService.js";

export const saveMessage = async(num, role, content) => {
    await setMensaje(num, role, content);
}

  // Recupera los últimos mensajes para darle contexto a Gemini
export const getChatHistory = async(num, limit = 10) => {
    const rows = await getMensajesByNumber(num, limit);
    if (!rows || rows.length === 0) return [];

    return [...rows].reverse().map(msg => ({ // estructura gemini
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
}

export const clearHistory = async(num) => {
    await clearHistoryByNumber(num);
}

//export const getLastAnswerModel = async(num) => {
//  await getLastAnswerModelByNum(num);
//}

