import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Sessions
app.get('/api/sessions', (_req, res) => {
    res.json([
        { id: 'sess_1', name: 'Login Page Debug', date: '2026-03-05', type: 'screenshot', status: 'completed', issueCount: 3, fixedCount: 2, confidenceScore: 0.92 },
        { id: 'sess_2', name: 'Dashboard Layout Fix', date: '2026-03-05', type: 'voice', status: 'completed', issueCount: 2, fixedCount: 2, confidenceScore: 0.95 },
        { id: 'sess_3', name: 'Onboarding Flow Review', date: '2026-03-04', type: 'screen-share', status: 'active', issueCount: 5, fixedCount: 1, confidenceScore: 0.88 },
    ]);
});

// Analyze screenshot (mock)
app.post('/api/analyze', (_req, res) => {
    setTimeout(() => {
        res.json({
            issues: [
                { id: 'iss_1', title: 'Button Alignment Issue', severity: 'critical', confidence: 0.94, description: 'Parent flex container misalignment detected.' },
                { id: 'iss_2', title: 'Low Color Contrast', severity: 'warning', confidence: 0.88, description: 'Text contrast ratio below WCAG AA.' },
                { id: 'iss_3', title: 'Missing ARIA Label', severity: 'info', confidence: 0.82, description: 'Search input lacks aria-label.' },
            ],
        });
    }, 1000);
});

// Apply patch (mock)
app.post('/api/patches', (req, res) => {
    const { issueId, reason, approver } = req.body;
    res.json({
        success: true,
        actionId: `act_${Date.now()}`,
        issueId,
        reason,
        approver,
        timestamp: new Date().toISOString(),
    });
});

// WebSocket
wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.send(JSON.stringify({ type: 'connected', message: 'LiveAssist WebSocket connected' }));

    ws.on('message', (data) => {
        const msg = JSON.parse(data.toString());
        if (msg.type === 'chat') {
            ws.send(JSON.stringify({
                type: 'response',
                content: 'I can see the issue. Let me analyze and suggest a fix.',
                timestamp: new Date().toISOString(),
            }));
        }
    });

    ws.on('close', () => console.log('Client disconnected'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`LiveAssist backend running on port ${PORT}`);
});
