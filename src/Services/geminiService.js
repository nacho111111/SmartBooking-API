import { GoogleGenAI } from '@google/genai';

// Inicializamos el cliente moderno
const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
export const getGeminiResponse = async (userMessage, history = []) => {
  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-lite', 
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: `
        Eres el asistente de Peluqueria canina & feline boutique. 
        Si el cliente quiere agendar una cita, 
        proporciónale este enlace: https://cal.com/nacho-3oejwr/15min?overlayCalendar=true. 
        Dile que ahí podrá elegir la hora que más le acomode que seleccione un dia, una de las horas disponibles y tus datos.`,
      },
    });

    return response.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error con la nueva SDK:", error);
    return "Ups, tuve un error técnico. ¿Podrías repetir?";
  }
};
