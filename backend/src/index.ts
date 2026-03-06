import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import analyzeRouter from './routes/analyze.js';
import sessionsRouter from './routes/sessions.js';
import { setupWebSocket } from './websocket/sessionSocket.js';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health check
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        geminiConfigured: !!process.env.GEMINI_API_KEY,
    });
});

// Routes
app.use('/api/analyze', analyzeRouter);
app.use('/api/sessions', sessionsRouter);

// WebSocket
setupWebSocket(wss);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`LiveAssist backend running on port ${PORT}`);
    console.log(`Gemini API: ${process.env.GEMINI_API_KEY ? '✓ configured' : '✗ not configured (using fallbacks)'}`);
});
