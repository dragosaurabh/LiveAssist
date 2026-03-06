import { create } from 'zustand';

export interface Issue {
    id: string;
    title: string;
    description: string;
    severity: 'critical' | 'warning' | 'info';
    confidence: number;
    boundingBox?: {
        x: number;
        y: number;
        width: number;
        height: number;
        label: string;
        color: 'red' | 'yellow' | 'blue';
    };
    suggestedFix?: {
        file: string;
        patch: string;
        explanation: string;
        confidence: number;
    };
    status: 'detected' | 'previewing' | 'applied' | 'dismissed';
}

export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
    type: 'text' | 'voice' | 'image' | 'analysis';
    imageUrl?: string;
    issues?: Issue[];
}

interface SessionState {
    sessionId: string | null;
    messages: Message[];
    issues: Issue[];
    uploadedImage: string | null;
    isAnalyzing: boolean;
    isRecording: boolean;
    performanceScore: number;
    startSession: () => void;
    addMessage: (msg: Omit<Message, 'id' | 'timestamp'>) => void;
    setIssues: (issues: Issue[]) => void;
    setUploadedImage: (url: string | null) => void;
    setAnalyzing: (v: boolean) => void;
    setRecording: (v: boolean) => void;
    applyFix: (issueId: string) => void;
    undoFix: (issueId: string) => void;
    resetSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
    sessionId: null,
    messages: [],
    issues: [],
    uploadedImage: null,
    isAnalyzing: false,
    isRecording: false,
    performanceScore: 0,
    startSession: () =>
        set({
            sessionId: `sess_${Date.now()}`,
            messages: [],
            issues: [],
            uploadedImage: null,
            isAnalyzing: false,
            performanceScore: 0,
        }),
    addMessage: (msg) =>
        set((state) => ({
            messages: [
                ...state.messages,
                { ...msg, id: `msg_${Date.now()}`, timestamp: new Date().toISOString() },
            ],
        })),
    setIssues: (issues) => set({ issues }),
    setUploadedImage: (url) => set({ uploadedImage: url }),
    setAnalyzing: (v) => set({ isAnalyzing: v }),
    setRecording: (v) => set({ isRecording: v }),
    applyFix: (issueId) =>
        set((state) => ({
            issues: state.issues.map((i) =>
                i.id === issueId ? { ...i, status: 'applied' as const } : i
            ),
        })),
    undoFix: (issueId) =>
        set((state) => ({
            issues: state.issues.map((i) =>
                i.id === issueId ? { ...i, status: 'detected' as const } : i
            ),
        })),
    resetSession: () =>
        set({
            sessionId: null,
            messages: [],
            issues: [],
            uploadedImage: null,
            isAnalyzing: false,
            performanceScore: 0,
        }),
}));
