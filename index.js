const { Client } = require('whatsapp-web.js')
require('dotenv').config()
const qrcode = require('qrcode')
const express = require('express')
const app = express()
const client = new Client()
const PORT = process.env.PORT

client.on('qr', qr => {
    qrcode.toDataURL(qr, (err, qrOuput) => {
        if(err){
            console.log('Error', err)
        } else {
            app.get('/', async(req, res) => {
                res.send(`<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>WhatsApp QR Code Display</title>
                </head>
                <body>
                    <img id="qrCodeImage" src="${qrOuput}" alt="WhatsApp QR Code">
                </body>
                </html>
                `)
            })
        }
    })
    
});

// app.get('/', async(req, res) => {
//     client.on('qr', qr => {
//         qrcode.toDataURL(qr, (err, qrOuput) => {
//             if(err){
//                 console.log('Error', err)
//             } else {
//                 console.log(qrOuput)
//                 res.send(`<!DOCTYPE html>
//                 <html lang="en">
//                 <head>
//                     <meta charset="UTF-8">
//                     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                     <title>WhatsApp QR Code Display</title>
//                 </head>
//                 <body>
//                     <img id="qrCodeImage" src="${qrOuput}" alt="WhatsApp QR Code">
//                 </body>
//                 </html>
//                 `)
//             }
//         })
        
//     });
// })


client.on('ready', () => {
    console.log('Client is Ready')
});

client.initialize();

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
  
const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = process.env.GOOGLE_GEMINI;

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
        message.reply('Something went wrong, try resending your message again in few minutes time. I sincerely apolize to you on GABRIEL\'s behalf. Keep on loving GABRIEL 💖')
    }
})

app.listen(PORT, () => {
    console.log(`Server listening to http://localhost:${PORT}`);
})

