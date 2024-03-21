const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const express = require('express');
const app = express();
const client = new Client();
const PORT = process.env.PORT;

// Handle QR code generation
client.on('qr', qr => {
    qrcode.toDataURL(qr, (err, qrOutput) => {
        if (err) {
            console.error('QR Code generation error:', err);
        } else {
            console.log('QR Code generated successfully');
            app.get('/', async (req, res) => {
                res.send(`<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>WhatsApp QR Code Display</title>
                </head>
                <body>
                    <img id="qrCodeImage" src="${qrOutput}" alt="WhatsApp QR Code">
                </body>
                </html>
                `);
            });
        }
    });
});

// Handle client ready event
client.on('ready', () => {
    console.log('WhatsApp client is ready');
});

// Initialize WhatsApp client
client.initialize();

// Handle incoming messages
client.on('message', async message => {
    try {
        
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
        const generationConfig = {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
        };
    
        const safetySettings = [
            {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ];
    
        const chat = model.startChat({
            generationConfig,
            safetySettings,
            history: [
            ],
        });
    
        const result = await chat.sendMessage(message.body);
        const response = result.response;
        message.reply(response.text());
    } catch (error) {
        console.error('Message handling error:', error);
        message.reply('Something went wrong, try resending your message again in few minutes time. I sincerely apolize to you on GABRIEL\'s behalf. Keep on loving GABRIEL 💖')
    }
});

// Start the Express server
const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// Keep-alive mechanism: Log a message periodically to indicate that the server is alive
const keepAliveInterval = setInterval(() => {
    console.log('Server is alive');
}, 60000); // Log message every minute

// Log any unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Promise Rejection:', reason);
});

// Log any uncaught exceptions
process.on('uncaughtException', error => {
    console.error('Uncaught Exception:', error);
});

// Gracefully handle server shutdown
process.on('SIGINT', () => {
    console.log('Received SIGINT, shutting down server');
    clearInterval(keepAliveInterval); // Clear keep-alive interval
    server.close(() => {
        console.log('Server has been gracefully shut down');
        process.exit(0); // Exit the process
    });
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down server');
    clearInterval(keepAliveInterval); // Clear keep-alive interval
    server.close(() => {
        console.log('Server has been gracefully shut down');
        process.exit(0); // Exit the process
    });
});
