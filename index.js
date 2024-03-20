const { Client } = require('whatsapp-web.js')
require('dotenv').config()
const qrcode = require('qrcode-terminal')

const client = new Client()

client.on('qr', qr => {
    qrcode.generate(qr,{small:true})
});

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
const API_KEY = "AIzaSyDbGnsHECJC63dcQB_SHz7mzJfg1-8kb7k";

client.on('message', async message => {
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
})


