export const notifyCatAlert = async (clientNumber, text) => {
    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const message = `🐱 *ALERTA DE GATO* 🐱\n\n` +
                    `*Número:* +${clientNumber}\n` +
                    `*Mensaje:* "${text}"\n\n` +
                    `⚠️ _Requiere atención manual para agendar._`;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });
    } catch (error) {
        console.error("Error notificando a Telegram:", error);
    }
};