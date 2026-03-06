import { useState, useCallback } from 'react';

const API_BASE = '/api/analyze';

interface AnalyzeResult {
    issues: any[];
    _fallback?: boolean;
}

interface ChatResult {
    content: string;
    _fallback?: boolean;
}

export function useGemini() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyze = useCallback(async (imageBase64: string, mimeType: string = 'image/png'): Promise<AnalyzeResult> => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: imageBase64, mimeType }),
            });
            if (!res.ok) throw new Error(`Analysis failed: ${res.status}`);
            return await res.json();
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const chat = useCallback(async (message: string, imageBase64?: string, mimeType?: string): Promise<ChatResult> => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, image: imageBase64, mimeType }),
            });
            if (!res.ok) throw new Error(`Chat failed: ${res.status}`);
            return await res.json();
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { analyze, chat, isLoading, error };
}
