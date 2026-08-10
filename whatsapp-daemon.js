const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const http = require('http');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED. Scan this with your WhatsApp app:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp Client is ready!');
});

// A small HTTP server to listen for broadcast requests from Next.js
const server = http.createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/broadcast') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const { groupId, message, imageUrl } = JSON.parse(body);
                console.log(`Received broadcast request for group ${groupId}`);
                
                // Fetch the chat by ID to ensure it exists
                const chat = await client.getChatById(groupId);
                
                if (imageUrl) {
                    const { MessageMedia } = require('whatsapp-web.js');
                    const media = await MessageMedia.fromUrl(imageUrl);
                    await chat.sendMessage(media, { caption: message });
                } else {
                    await chat.sendMessage(message);
                }
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (error) {
                console.error('Error broadcasting:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
    } else {
        res.writeHead(404);
        res.end();
    }
});

client.initialize();
server.listen(3002, () => {
    console.log('WhatsApp internal broadcast listener running on port 3002');
});
