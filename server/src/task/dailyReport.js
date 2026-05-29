import cron from "node-cron";
import { getCitasPorDia, setBotsStatusByDate } from "../Services/dbService.js";
import { whatsAppReminder } from "../webhooks/whatsAppReminder.js";
import { saveMessage } from "../models/ChatHistory.js";

export const startDailyTasks = () => { // fix no solo las del dia 
    cron.schedule('0 22 * * 3-6', async () => {
        try {
            const hoy = new Date().toISOString().split('T')[0];
            const data = await setBotsStatusByDate(hoy,true)
            if (data && data.success) {
                console.log(`Se encontraron ${data.length} citas para hoy.`);
            } else {
                console.log('No hay citas programadas para hoy.');
            }
        }catch(error){
            console.error('Error en la tarea programada:', error);
        }
    }, {
        timezone: "America/Santiago"
        }
    )
  // 0 8 * * * = 8:00
    cron.schedule('0 8 * * 3-6', async () => { // miercoles a sabado
        try {
            console.log('--- Ejecutando Tarea Programada ---');
            const hoy = new Date().toISOString().split('T')[0];

            const data = await getCitasPorDia(hoy)

            if (data && data.length > 0) {
                console.log(`Se encontraron ${data.length} citas para hoy.`);
                await sendMenssages(data)
            } else {
                console.log('No hay citas programadas para hoy.');
            }
            
        }catch(error) {
            console.error('Error en la tarea programada:', error);
        }
    }, {
        timezone: "America/Santiago"
        }
    );
};

async function sendMenssages(data){
    for (const a of data) {
        await whatsAppReminder(a.telefono, a.nombre_usuario, a.hora_atencion);
        await saveMessage(a.telefono, "model", "Recordatorio automatico");
    }
}

