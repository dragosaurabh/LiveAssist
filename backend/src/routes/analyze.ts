import { Router } from 'express';
import { analyzeScreenshot, chatWithContext } from '../services/geminiService.js';

const router = Router();

// POST /api/analyze — analyze a screenshot with Gemini
router.post('/', async (req, res) => {
    try {
        const { image, mimeType } = req.body;

        if (!image) {
            res.status(400).json({ error: 'Missing "image" field (base64 string)' });
            return;
        }

        if (!process.env.GEMINI_API_KEY) {
            // Fallback mock when no API key
            res.json({
                issues: [
                    {
                        id: 'iss_1', title: 'Button Alignment Issue', description: 'Parent flex container misalignment detected.',
                        severity: 'critical', confidence: 0.94,
                        boundingBox: { x: 20, y: 15, width: 30, height: 8, label: 'Misaligned Button', color: 'red' },
                        suggestedFix: { file: 'layout.css', patch: '.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}', explanation: 'Center-align the flex container', confidence: 0.94 },
                        status: 'detected',
                    },
                    {
                        id: 'iss_2', title: 'Low Color Contrast', description: 'Text contrast ratio below WCAG AA standard.',
                        severity: 'warning', confidence: 0.88,
                        boundingBox: { x: 50, y: 35, width: 25, height: 5, label: 'Low Contrast', color: 'yellow' },
                        suggestedFix: { file: 'theme.css', patch: '.text-muted {\n  color: #595959;\n}', explanation: 'Darken text for better contrast', confidence: 0.88 },
                        status: 'detected',
                    },
                    {
                        id: 'iss_3', title: 'Missing ARIA Label', description: 'Input field lacks aria-label for screen readers.',
                        severity: 'info', confidence: 0.82,
                        boundingBox: { x: 15, y: 55, width: 35, height: 6, label: 'Missing ARIA', color: 'blue' },
                        suggestedFix: { file: 'search.tsx', patch: '<input\n  type="search"\n  aria-label="Search"\n/>', explanation: 'Add aria-label attribute', confidence: 0.82 },
                        status: 'detected',
                    },
                ],
                _fallback: true,
            });
            return;
        }

        const result = await analyzeScreenshot(image, mimeType || 'image/png');
        res.json(result);
    } catch (err: any) {
        console.error('Analysis error:', err.message);
        res.status(500).json({ error: 'Analysis failed', detail: err.message });
    }
});

// POST /api/chat — chat with the AI agent
router.post('/chat', async (req, res) => {
    try {
        const { message, image, mimeType } = req.body;

        if (!message) {
            res.status(400).json({ error: 'Missing "message" field' });
            return;
        }

        if (!process.env.GEMINI_API_KEY) {
            res.json({
                content: `I understand you're asking about: "${message}". I can help analyze UI issues, suggest fixes, and explain accessibility problems. Upload a screenshot to get started with visual analysis.`,
                _fallback: true,
            });
            return;
        }

        const result = await chatWithContext(message, image, mimeType);
        res.json(result);
    } catch (err: any) {
        console.error('Chat error:', err.message);
        res.status(500).json({ error: 'Chat failed', detail: err.message });
    }
});

export default router;
