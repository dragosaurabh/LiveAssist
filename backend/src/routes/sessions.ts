import { Router } from 'express';

const router = Router();

interface Session {
    id: string;
    name: string;
    date: string;
    type: 'screenshot' | 'voice' | 'screen-share';
    status: 'active' | 'completed';
    issueCount: number;
    fixedCount: number;
    confidenceScore: number;
    patches: Patch[];
}

interface Patch {
    id: string;
    issueId: string;
    reason: string;
    approver: string;
    timestamp: string;
}

// In-memory session store for hackathon demo
const sessions: Session[] = [
    { id: 'sess_1', name: 'Login Page Debug', date: '2026-03-05', type: 'screenshot', status: 'completed', issueCount: 3, fixedCount: 2, confidenceScore: 0.92, patches: [] },
    { id: 'sess_2', name: 'Dashboard Layout Fix', date: '2026-03-05', type: 'voice', status: 'completed', issueCount: 2, fixedCount: 2, confidenceScore: 0.95, patches: [] },
    { id: 'sess_3', name: 'Onboarding Flow Review', date: '2026-03-04', type: 'screen-share', status: 'active', issueCount: 5, fixedCount: 1, confidenceScore: 0.88, patches: [] },
];

// GET /api/sessions
router.get('/', (_req, res) => {
    res.json(sessions.map(({ patches, ...s }) => s));
});

// POST /api/sessions — create a new session
router.post('/', (req, res) => {
    const { name, type } = req.body;
    const session: Session = {
        id: `sess_${Date.now().toString(36)}`,
        name: name || `Session ${sessions.length + 1}`,
        date: new Date().toISOString().split('T')[0],
        type: type || 'screenshot',
        status: 'active',
        issueCount: 0,
        fixedCount: 0,
        confidenceScore: 0,
        patches: [],
    };
    sessions.push(session);
    res.status(201).json(session);
});

// POST /api/patches — apply a patch
router.post('/patches', (req, res) => {
    const { sessionId, issueId, reason, approver } = req.body;
    const patch: Patch = {
        id: `act_${Date.now()}`,
        issueId,
        reason: reason || '',
        approver: approver || 'current_user',
        timestamp: new Date().toISOString(),
    };

    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
        session.patches.push(patch);
        session.fixedCount++;
    }

    res.json({ success: true, ...patch });
});

// GET /api/sessions/:id/report — generate session report
router.get('/:id/report', (req, res) => {
    const session = sessions.find((s) => s.id === req.params.id);
    if (!session) {
        res.status(404).json({ error: 'Session not found' });
        return;
    }

    const report = {
        session_id: session.id,
        name: session.name,
        date: session.date,
        type: session.type,
        status: session.status,
        issues_found: session.issueCount,
        fixes_applied: session.fixedCount,
        confidence: session.confidenceScore,
        patches: session.patches,
        generated_at: new Date().toISOString(),
    };

    res.json(report);
});

export default router;
