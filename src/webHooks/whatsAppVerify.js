export const whatsAppVerify = async (req, res) => {
    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('¡Webhook verificado por Meta!');
        return res.status(200).send(challenge);
    }
    res.sendStatus(403);
};