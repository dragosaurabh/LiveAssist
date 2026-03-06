import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const ANALYSIS_PROMPT = `You are a UI/UX expert and accessibility auditor. Analyze this UI screenshot and detect all visual, layout, and accessibility issues.

Return ONLY valid JSON in this exact format (no markdown, no code fences):

{
  "issues": [
    {
      "id": "iss_1",
      "title": "Short descriptive title",
      "description": "Detailed description of the issue",
      "severity": "critical|warning|info",
      "confidence": 0.95,
      "boundingBox": {
        "x": 100,
        "y": 50,
        "width": 200,
        "height": 40,
        "label": "Short label",
        "color": "red|yellow|blue"
      },
      "suggestedFix": {
        "file": "filename.ext",
        "patch": "code fix here",
        "explanation": "Why this fix works",
        "confidence": 0.95
      },
      "status": "detected"
    }
  ]
}

Rules:
- severity "critical" gets boundingBox color "red"
- severity "warning" gets boundingBox color "yellow"  
- severity "info" gets boundingBox color "blue"
- confidence is 0.0 to 1.0
- boundingBox coordinates are percentages (0-100) of image dimensions
- Return 3-8 issues, sorted by severity (critical first)
- Focus on: alignment, contrast, accessibility (ARIA), spacing, responsive issues, typography`;

function extractJSON(text: string): any {
    // Try direct parse
    try {
        return JSON.parse(text);
    } catch { }

    // Try extracting from code fences
    const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
        try {
            return JSON.parse(fenceMatch[1].trim());
        } catch { }
    }

    // Try finding JSON object
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        try {
            return JSON.parse(jsonMatch[0]);
        } catch { }
    }

    throw new Error('Could not parse JSON from Gemini response');
}

export async function analyzeScreenshot(imageBase64: string, mimeType: string = 'image/png') {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent([
        ANALYSIS_PROMPT,
        {
            inlineData: {
                mimeType,
                data: imageBase64,
            },
        },
    ]);

    const text = result.response.text();
    const parsed = extractJSON(text);

    // Normalize issues
    const issues = (parsed.issues || []).map((issue: any, i: number) => ({
        id: issue.id || `iss_${i + 1}`,
        title: issue.title || 'Unknown Issue',
        description: issue.description || '',
        severity: ['critical', 'warning', 'info'].includes(issue.severity) ? issue.severity : 'info',
        confidence: typeof issue.confidence === 'number' ? issue.confidence : 0.5,
        boundingBox: issue.boundingBox || null,
        suggestedFix: issue.suggestedFix || null,
        status: 'detected',
    }));

    return { issues };
}

export async function chatWithContext(message: string, imageBase64?: string, mimeType?: string) {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const parts: any[] = [
        `You are LiveAssist, an AI UI debugging assistant. You help developers and designers find and fix UI bugs, accessibility issues, and layout problems. Be concise, helpful, and technical. If an image is provided, analyze it in your response.\n\nUser message: ${message}`,
    ];

    if (imageBase64 && mimeType) {
        parts.push({
            inlineData: {
                mimeType,
                data: imageBase64,
            },
        });
    }

    const result = await model.generateContent(parts);
    return { content: result.response.text() };
}
