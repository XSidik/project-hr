const express = require('express');
const router = express.Router();
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    restartOnAuthFail: true,
    authStrategy: new LocalAuth()
});

router.post('/send', async (req, res) => {
    const data = req.body;
    const phone = data.phone.substring(1) + "@c.us";
    const message = data.message;

    client.sendMessage(phone, message)
        .then(response => {
            res.status(200).json({
                error: false,
                data: {
                    message: 'Pesan terkirim',
                    meta: response,
                },
            });
        })
        .catch(error => {
            res.status(200).json({
                error: true,
                data: {
                    message: 'Error send message',
                    meta: error,
                },
            });
        });
});

module.exports = router;
