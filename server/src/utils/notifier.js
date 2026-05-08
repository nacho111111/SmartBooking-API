export const notifyAlert = async (tipo ,clientNumber, text) => {
    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const message = `🐱 <b>ALERTA DE NOTIFICACION</b> 🐱\n\n` +
                `<b>Tipo:</b> ${tipo}\n` +
                `<b>Número:</b> +${clientNumber}\n` +
                `<b>Mensaje:</b> "${text}"\n\n` +
                `⚠️ <i>Requiere atención manual</i>`;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("Error de Telegram API:", result);
        } 
    } catch (error) {
        console.error("Error de red/fetch:", error);
    }
};