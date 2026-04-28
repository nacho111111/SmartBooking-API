export const sendWhatsAppMessage = async(number,aiResponse) => {
    const  {headers, url, body}= responseWSConfig(number, aiResponse);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Error WhatsApp: ${data.error?.message || response.statusText}`);
        }

        return data;
    } catch (error) {
        console.error("Fallo al enviar WhatsApp:", error.message);
    }
};

const responseWSConfig = (number, dobyResponse) => {
    const token = process.env.WHATSAPP_TOKEN;
    const phone_id = process.env.PHONE_NUMBER_ID;

    const url = `https://graph.facebook.com/v21.0/${phone_id}/messages`;
    
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const body = {
        "messaging_product": "whatsapp",
        "to": number,
        "type": "text",
        "text": {
            "body": dobyResponse
        }
    };
    return  {headers, url, body}
}