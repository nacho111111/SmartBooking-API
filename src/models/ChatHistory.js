import { setMensaje, getMensajesByNumber, clearHistoryByNumber } from "../Services/dbService.js";

export const saveMessage = async(whatsappNumber, role, content) => {
    await setMensaje(whatsappNumber, role, content);
}

  // Recupera los últimos mensajes para darle contexto a Gemini
export const getChatHistory = async(whatsappNumber, limit = 10) => {
    const rows = await getMensajesByNumber(whatsappNumber, limit);
    if (!rows || rows.length === 0) return [];

    return [...rows].reverse().map(msg => ({ // estructura gemini
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
}

export const clearHistory = async(whatsappNumber) => {
    await clearHistoryByNumber(whatsappNumber);
}

