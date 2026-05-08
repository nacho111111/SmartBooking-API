import { GoogleGenAI } from '@google/genai';

// Inicializamos el cliente moderno
const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
export const getGeminiResponse = async (history = []) => {
  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-lite', 
      contents: [history],
      config: {
        systemInstruction: `
          Eres el asistente de Peluqueria canina & feline boutique. 

          Precios base:
          - Perro Pequeño: (Poodle, Yorkie): $15.000.
          - Perro Mediano: (Cocker, Beagle): $20.000.
          - Perro Grande: (Labrador, Golden): $30.000.
          - nudos: recargo de $5.000).
          
          Si el cliente quiere agendar una cita, 
          mencionale que puede precionar el boton de "Reservar hora" de arriba .`,
      },
    });

    return response.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error con la nueva SDK:", error);
    return "Ups, tuve un error técnico. ¿Podrías repetir?";
  }
};
