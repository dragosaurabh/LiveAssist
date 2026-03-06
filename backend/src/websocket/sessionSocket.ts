import type { WebSocketServer, WebSocket } from 'ws';
import { analyzeScreenshot, chatWithContext } from '../services/geminiService.js';

interface WSMessage {
    type: 'chat' | 'analyze' | 'voice' | 'ping';
    content?: string;
    image?: string;
    mimeType?: string;
    sessionId?: string;
}

export function setupWebSocket(wss: WebSocketServer) {
    wss.on('connection', (ws: WebSocket) => {
        console.log('WebSocket client connected');
        ws.send(JSON.stringify({ type: 'connected', message: 'LiveAssist WebSocket connected' }));

        ws.on('message', async (data) => {
            try {
                const msg: WSMessage = JSON.parse(data.toString());

                switch (msg.type) {
                    case 'chat': {
                        ws.send(JSON.stringify({ type: 'status', status: 'thinking' }));
                        try {
                            const result = await chatWithContext(msg.content || '', msg.image, msg.mimeType);
                            ws.send(JSON.stringify({
                                type: 'response',
                                content: result.content,
                                timestamp: new Date().toISOString(),
                            }));
                        } catch (err: any) {
                            ws.send(JSON.stringify({
                                type: 'response',
                                content: `I understand your question. Let me help — could you upload a screenshot so I can visually analyze the issue?`,
                                timestamp: new Date().toISOString(),
                            }));
                        }
                        break;
                    }

                    case 'analyze': {
                        ws.send(JSON.stringify({ type: 'status', status: 'analyzing' }));
                        try {
                            const result = await analyzeScreenshot(msg.image || '', msg.mimeType || 'image/png');
                            ws.send(JSON.stringify({
                                type: 'analysis',
                                issues: result.issues,
                                timestamp: new Date().toISOString(),
                            }));
                        } catch (err: any) {
                            ws.send(JSON.stringify({ type: 'error', message: 'Analysis failed: ' + err.message }));
                        }
                        break;
                    }

                    case 'voice': {
                        // Voice transcripts arrive as text, treat like chat
                        ws.send(JSON.stringify({ type: 'status', status: 'thinking' }));
                        try {
                            const result = await chatWithContext(msg.content || '');
                            ws.send(JSON.stringify({
                                type: 'response',
                                content: result.content,
                                timestamp: new Date().toISOString(),
                            }));
                        } catch {
                            ws.send(JSON.stringify({
                                type: 'response',
                                content: 'I heard you. Could you also share a screenshot for visual analysis?',
                                timestamp: new Date().toISOString(),
                            }));
                        }
                        break;
                    }

                    case 'ping':
                        ws.send(JSON.stringify({ type: 'pong' }));
                        break;
                }
            } catch (err) {
                ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
            }
        });

        ws.on('close', () => console.log('WebSocket client disconnected'));
    });
}
