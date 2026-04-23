export const headersConfig = () => {
    const token = process.env.WHATSAPP_TOKEN;
    const phone_id = process.env.PHONE_NUMBER_ID;

    const url = `https://graph.facebook.com/v21.0/${phone_id}/messages`;
    
    const config = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
    return  {config, url}
}